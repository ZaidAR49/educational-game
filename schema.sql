-- ============================================================================
-- DECISION HERO GAME — DATABASE SCHEMA (Supabase / Postgres)
-- ============================================================================
-- Design notes (read before running):
--
-- 1) AUTH TABLES (users / accounts / sessions / verification_token) follow the
--    official Auth.js ("NextAuth") Adapter contract: same table names and the
--    same camelCase column names the Adapter interface expects
--    ("userId", "sessionToken", "providerAccountId", "emailVerified").
--    This is the "lowest common denominator" schema that raw Postgres-based
--    adapters (@auth/pg-adapter, custom Drizzle/Prisma adapters) read/write to.
--    If you end up using an ORM's official adapter package (e.g. the Drizzle
--    adapter), it usually ships its own schema generator — compare its output
--    against this file and adjust column names if it diverges. The shape
--    (4 tables, these fields) will not change.
--
-- 2) IDs use uuid (gen_random_uuid()) instead of serial ints, to match Supabase
--    convention and avoid enumerable IDs in public share links.
--
-- 3) STUDENTS / PLAYERS ARE NOT A USERS ROW. A student never signs in, so they
--    get no auth identity at all. Each playthrough is one row in
--    `game_sessions` (player_name + score). This keeps the "real user" table
--    reserved for teachers/admins (the two roles that actually need accounts),
--    while still letting a teacher query all attempts for one of their games
--    to build the results dashboard.
--
-- 4) SCALABILITY HOOKS included now but harmless if unused today:
--      users.is_locked, users.is_subscribed, users.subscription_plan/_expires_at
--      games.settings (jsonb), games.access_code, games.is_public
--      game_sessions.metadata (jsonb), game_sessions.answers (jsonb)
--    These let you add subscription billing, per-game access control, or
--    richer analytics later without a migration that touches existing rows.
--
-- 5) RLS: enabled on every table for defense-in-depth, but since auth is
--    handled by NextAuth (not Supabase Auth), there is no Supabase-issued JWT
--    for `auth.uid()` to read. Your Next.js server should talk to Postgres
--    with a role that bypasses RLS (the `service_role` key, or a dedicated
--    Postgres role) and enforce authorization in your API/server-action layer
--    instead. If you later adopt Supabase Auth or expose PostgREST directly to
--    the browser, swap in the commented-out policy examples at the bottom.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS
-- ----------------------------------------------------------------------------
create extension if not exists pgcrypto; -- gen_random_uuid()


-- ----------------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------------
create type user_role as enum ('user', 'admin');
create type game_status as enum ('draft', 'published', 'archived');
create type session_status as enum ('in_progress', 'completed', 'abandoned');


-- ----------------------------------------------------------------------------
-- 2. AUTH.JS / NEXTAUTH ADAPTER TABLES (+ app-specific columns on users)
-- ----------------------------------------------------------------------------

create table users (
  id                        uuid primary key default gen_random_uuid(),

  -- --- required by the Adapter contract ---
  name                      text,
  email                     text unique,
  "emailVerified"           timestamptz,
  image                     text,

  -- --- app-specific columns ---
  password_hash             text,                          -- only if you add a Credentials provider
  role                      user_role not null default 'user',
  is_locked                 boolean not null default false, -- admin can freeze an account
  is_subscribed             boolean not null default false, -- future paid plans
  subscription_plan         text,                            -- e.g. 'free' | 'pro' | 'team' (kept as text, not enum, so pricing can change freely)
  subscription_expires_at   timestamptz,
  locale                    text not null default 'ar',
  last_login_at             timestamptz,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  deleted_at                timestamptz                      -- soft delete
);

create table accounts (
  id                        uuid primary key default gen_random_uuid(),
  "userId"                  uuid not null references users(id) on delete cascade,
  type                      text not null,
  provider                  text not null,
  "providerAccountId"       text not null,
  refresh_token             text,
  access_token              text,
  expires_at                bigint,
  token_type                text,
  scope                     text,
  id_token                  text,
  session_state             text,

  unique (provider, "providerAccountId")
);

create table sessions (
  id                        uuid primary key default gen_random_uuid(),
  "sessionToken"            text not null unique,
  "userId"                  uuid not null references users(id) on delete cascade,
  expires                   timestamptz not null
);

create table verification_token (
  identifier                text not null,
  token                     text not null,
  expires                   timestamptz not null,

  primary key (identifier, token)
);


-- ----------------------------------------------------------------------------
-- 3. GAMES (a "game" = one shareable set of scenarios a teacher builds)
-- ----------------------------------------------------------------------------

create table games (
  id                        uuid primary key default gen_random_uuid(),
  owner_id                  uuid not null references users(id) on delete cascade,

  title                     text not null,
  description               text,
  
  -- Intro and Outro info
  organization_name         text,
  welcome_message           text,
  completion_message        text,
  logo_path                 text,
  
  slug                      text not null unique,           -- used in the public play URL
  icon                      text,
  status                    game_status not null default 'draft',
  language                  text not null default 'ar',

  is_public                 boolean not null default true,
  access_code               text,                            -- optional PIN to gate entry (future)

  settings                  jsonb not null default '{}'::jsonb, -- e.g. { "shuffle": true, "timeLimitSeconds": 30 }

  max_points                integer not null default 0,      -- denormalized: sum of best choice per scenario
  play_count                integer not null default 0,      -- denormalized: total sessions started

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  deleted_at                timestamptz
);

create table scenarios (
  id                        uuid primary key default gen_random_uuid(),
  game_id                   uuid not null references games(id) on delete cascade,

  order_index               integer not null default 0,
  icon                      text,
  title                     text not null,
  description               text not null,

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create table choices (
  id                        uuid primary key default gen_random_uuid(),
  scenario_id               uuid not null references scenarios(id) on delete cascade,

  order_index               integer not null default 0,
  text                      text not null,
  icon                      text,
  is_correct                boolean not null default false,

  feedback_title            text,
  feedback_message          text,
  feedback_tip              text,

  points                    integer not null default 0,

  created_at                timestamptz not null default now()
);


-- ----------------------------------------------------------------------------
-- 4. GAME SESSIONS (the "student" — one row per playthrough, no account)
-- ----------------------------------------------------------------------------

create table game_sessions (
  id                        uuid primary key default gen_random_uuid(),
  game_id                   uuid not null references games(id) on delete cascade,

  player_name               text not null,
  total_score               integer not null default 0,
  max_possible_score         integer,                        -- snapshot of games.max_points at play time

  status                    session_status not null default 'in_progress',

  -- lightweight per-question log, kept as jsonb so you get answer-level detail
  -- for the "basic analysis" dashboard without a 5th table today.
  -- shape: [{ "scenarioId": "...", "choiceId": "...", "isCorrect": true, "points": 10 }, ...]
  answers                   jsonb not null default '[]'::jsonb,

  started_at                timestamptz not null default now(),
  completed_at              timestamptz,
  duration_seconds          integer,

  metadata                  jsonb not null default '{}'::jsonb -- future: device, referrer, ip hash, etc.
);


-- ----------------------------------------------------------------------------
-- 5. INDEXES
-- ----------------------------------------------------------------------------

create index idx_accounts_user_id            on accounts ("userId");
create index idx_sessions_user_id            on sessions ("userId");

create index idx_games_owner_id              on games (owner_id) where deleted_at is null;
create index idx_games_status                on games (status);

create index idx_scenarios_game_order        on scenarios (game_id, order_index);
create index idx_choices_scenario_order      on choices (scenario_id, order_index);
create index idx_choices_correct             on choices (scenario_id) where is_correct = true;

create index idx_game_sessions_game_id       on game_sessions (game_id);
create index idx_game_sessions_game_status   on game_sessions (game_id, status);
create index idx_game_sessions_completed_at  on game_sessions (game_id, completed_at desc);


-- ----------------------------------------------------------------------------
-- 6. TRIGGERS
-- ----------------------------------------------------------------------------

-- keep updated_at fresh
create or replace function trigger_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_users
  before update on users
  for each row execute function trigger_set_updated_at();

create trigger set_updated_at_games
  before update on games
  for each row execute function trigger_set_updated_at();

create trigger set_updated_at_scenarios
  before update on scenarios
  for each row execute function trigger_set_updated_at();


-- auto-increment games.play_count whenever a new attempt starts
create or replace function increment_game_play_count()
returns trigger as $$
begin
  update games set play_count = play_count + 1 where id = new.game_id;
  return new;
end;
$$ language plpgsql;

create trigger on_game_session_created
  after insert on game_sessions
  for each row execute function increment_game_play_count();


-- ----------------------------------------------------------------------------
-- 7. ANALYTICS HELPER — powers the teacher's results dashboard
-- ----------------------------------------------------------------------------

create or replace function get_game_stats(p_game_id uuid)
returns table (
  total_plays        bigint,
  completed_plays    bigint,
  completion_rate    numeric,
  avg_score          numeric,
  avg_duration_secs  numeric
) as $$
  select
    count(*)                                                     as total_plays,
    count(*) filter (where status = 'completed')                 as completed_plays,
    round(
      100.0 * count(*) filter (where status = 'completed')
      / nullif(count(*), 0), 1
    )                                                             as completion_rate,
    round(avg(total_score) filter (where status = 'completed'), 1) as avg_score,
    round(avg(duration_seconds) filter (where status = 'completed'), 1) as avg_duration_secs
  from game_sessions
  where game_id = p_game_id;
$$ language sql stable;

-- usage: select * from get_game_stats('<game-uuid>');


-- ----------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
-- Enabled everywhere. No policies are added by default, which means: nobody
-- using the `anon` or `authenticated` Postgres roles can read/write anything.
-- Your Next.js server should connect using a role that bypasses RLS
-- (Supabase's `service_role`, or a dedicated superuser-ish app role on a
-- direct connection string) — that's normal for a NextAuth setup where
-- Supabase is "just Postgres" and your API layer is the real gatekeeper.

alter table users              enable row level security;
alter table accounts           enable row level security;
alter table sessions           enable row level security;
alter table verification_token enable row level security;
alter table games              enable row level security;
alter table scenarios          enable row level security;
alter table choices            enable row level security;
alter table game_sessions      enable row level security;

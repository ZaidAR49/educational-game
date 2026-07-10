-- =====================================================================
-- EduPlay — Full Database Schema
-- Generated for portability across Postgres providers (Supabase, RDS, etc.)
-- =====================================================================

-- =====================================================================
-- EXTENSIONS
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()

-- =====================================================================
-- ENUM TYPES
-- =====================================================================
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE game_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE play_status AS ENUM ('draft', 'live', 'closed');

-- =====================================================================
-- users
-- =====================================================================
CREATE TABLE users (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                     text,
  email                    text UNIQUE,
  "emailVerified"          timestamptz,
  password_hash            text,
  role                     user_role NOT NULL DEFAULT 'user',
  is_locked                boolean NOT NULL DEFAULT false,
  is_subscribed            boolean NOT NULL DEFAULT false,
  subscription_plan        text,
  subscription_expires_at  timestamptz,
  locale                   text NOT NULL DEFAULT 'ar',
  last_login_at            timestamptz,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now(),
  deleted_at               timestamptz
);
-- NOTE: deliberately NO "image"/avatar column — avatar comes from the
-- OAuth provider session (e.g. Google) at runtime, never stored here.

-- =====================================================================
-- Auth.js (NextAuth) standard tables
-- =====================================================================
CREATE TABLE accounts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"            uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                text NOT NULL,
  provider            text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token       text,
  access_token        text,
  expires_at          bigint,
  token_type          text,
  scope               text,
  id_token            text,
  session_state       text,
  UNIQUE (provider, "providerAccountId")
);

CREATE TABLE sessions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionToken" text NOT NULL UNIQUE,
  "userId"       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires        timestamptz NOT NULL
);
-- NOTE: this is the AUTH session table (login sessions), unrelated to
-- gameplay. Do not confuse with classroom_plays/players below.

CREATE TABLE verification_token (
  identifier text NOT NULL,
  token      text NOT NULL,
  expires    timestamptz NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- =====================================================================
-- organizations
-- Reusable branding + intro/result screen content, shared across games.
-- =====================================================================
CREATE TABLE organizations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid REFERENCES users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  logo_path     text,

  introduction  jsonb NOT NULL DEFAULT '{
    "title": "اختبر معلوماتك",
    "subtitle": "لعبة تفاعلية تعليمية للجميع",
    "welcome_box": {
      "description": "مرحباً بك! 👋 ستواجه في هذا الاختبار مجموعة من الأسئلة المتنوعة. اختر الإجابة الصحيحة في كل سؤال واجمع أكبر عدد من النقاط!",
      "closing_question": "هل أنت مستعد لاختبار معلوماتك؟"
    },
    "button_text": "ابدأ الاختبار 🚀",
    "decorative_emojis": ["✨", "☀️", "⭐"],
    "back_link_text": "العودة للرئيسية"
  }'::jsonb,

  result_screen jsonb NOT NULL DEFAULT '{
    "title": "لا بأس، استمر!",
    "small_description": "كل محاولة تعلّم جديد!",
    "message": "لا تيأس! كل سؤال أخطأت فيه هو معلومة جديدة تعلمتها. جرب مرة أخرى!"
  }'::jsonb,

  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  deleted_at    timestamptz
);

-- =====================================================================
-- games
-- =====================================================================
CREATE TABLE games (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id  uuid REFERENCES organizations(id) ON DELETE SET NULL,
  title            text NOT NULL,
  description      text,
  slug             text NOT NULL UNIQUE,
  icon             text,
  status           game_status NOT NULL DEFAULT 'draft',
  language         text NOT NULL DEFAULT 'ar',
  is_public        boolean NOT NULL DEFAULT true,
  access_code      text,
  settings         jsonb NOT NULL DEFAULT '{}'::jsonb,
  max_points       integer NOT NULL DEFAULT 0,
  play_count       integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  deleted_at       timestamptz
);

-- =====================================================================
-- scenarios (questions belonging to a game)
-- =====================================================================
CREATE TABLE scenarios (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id      uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  order_index  integer NOT NULL DEFAULT 0,
  icon         text,
  title        text NOT NULL,
  description  text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- =====================================================================
-- choices (answer options belonging to a scenario/question)
-- =====================================================================
CREATE TABLE choices (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id       uuid NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  order_index       integer NOT NULL DEFAULT 0,
  text              text NOT NULL,
  icon              text,
  is_correct        boolean NOT NULL DEFAULT false,
  feedback_title    text,
  feedback_message  text,
  feedback_tip      text,
  points            integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- =====================================================================
-- classroom_plays
-- One play session of a game, run by a teacher. Lifecycle: draft -> live -> closed.
-- Only one 'live' play per game is allowed at a time (enforced by partial
-- unique index below). This solves the "public game accumulates sessions
-- forever" problem: teachers explicitly open/close play sessions.
-- =====================================================================
CREATE TABLE classroom_plays (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id          uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  teacher_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status           play_status NOT NULL DEFAULT 'draft',
  started_at       timestamptz,   -- set when status moves draft -> live
  ended_at         timestamptz,   -- set when status moves live -> closed
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- =====================================================================
-- players
-- A single student's play within a classroom_play. No account, no login.
-- Transient data: intended to be purged after a retention window
-- (proposed ~30-60 days) via a scheduled job. No answer history is
-- stored — only the final score and completion state.
-- =====================================================================
CREATE TABLE players (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_play_id    uuid NOT NULL REFERENCES classroom_plays(id) ON DELETE CASCADE,
  name                 text NOT NULL,
  total_score          integer NOT NULL DEFAULT 0,
  is_finished          boolean NOT NULL DEFAULT false,
  started_at           timestamptz NOT NULL DEFAULT now(),
  completed_at         timestamptz,
  duration_seconds     integer GENERATED ALWAYS AS (CAST(EXTRACT(EPOCH FROM (completed_at - started_at)) AS integer)) STORED,
  created_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (classroom_play_id, name)  -- player name unique per play, not globally
);

-- =====================================================================
-- INDEXES (beyond PK/UNIQUE)
-- =====================================================================
CREATE INDEX idx_accounts_user_id            ON accounts ("userId");
CREATE INDEX idx_sessions_user_id            ON sessions ("userId");
CREATE INDEX idx_organizations_owner_id      ON organizations (owner_id);
CREATE INDEX idx_games_owner_id              ON games (owner_id) WHERE (deleted_at IS NULL);
CREATE INDEX idx_games_organization_id       ON games (organization_id);
CREATE INDEX idx_games_status                ON games (status);
CREATE INDEX idx_scenarios_game_order        ON scenarios (game_id, order_index);
CREATE INDEX idx_choices_scenario_order      ON choices (scenario_id, order_index);
CREATE INDEX idx_choices_correct             ON choices (scenario_id) WHERE (is_correct = true);

CREATE INDEX idx_classroom_plays_game_id     ON classroom_plays(game_id);
CREATE INDEX idx_classroom_plays_teacher_id  ON classroom_plays(teacher_id);
CREATE INDEX idx_classroom_plays_status      ON classroom_plays(status);

-- Enforces "only one live play per game" at the DB level — no app logic needed
CREATE UNIQUE INDEX idx_one_live_play_per_game
  ON classroom_plays(game_id) WHERE (status = 'live');

CREATE INDEX idx_players_classroom_play_id   ON players(classroom_play_id);
CREATE INDEX idx_players_is_finished         ON players(classroom_play_id, is_finished);

-- =====================================================================
-- FUNCTIONS
-- =====================================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Aggregate stats for a single game (plays, completion rate, avg score/duration)
-- Reads from players joined to classroom_plays.
CREATE OR REPLACE FUNCTION get_game_stats(p_game_id uuid)
RETURNS TABLE(
  total_plays        bigint,
  completed_plays     bigint,
  completion_rate     numeric,
  avg_score           numeric,
  avg_duration_secs   numeric
)
LANGUAGE sql STABLE SET search_path = public AS $$
  select
    count(*)                                              as total_plays,
    count(*) filter (where p.is_finished = true)          as completed_plays,
    round(100.0 * count(*) filter (where p.is_finished = true)
      / nullif(count(*), 0), 1)                            as completion_rate,
    round(avg(p.total_score) filter (where p.is_finished = true), 1) as avg_score,
    round(avg(p.duration_seconds) filter (where p.is_finished = true), 1) as avg_duration_secs
  from players p
  join classroom_plays cp on cp.id = p.classroom_play_id
  where cp.game_id = p_game_id;
$$;

-- Only allow a player to join a play that is currently 'live'
CREATE OR REPLACE FUNCTION check_play_is_live()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
begin
  if not exists (
    select 1 from classroom_plays
    where id = new.classroom_play_id and status = 'live'
  ) then
    raise exception 'Cannot join or modify: this play is not live';
  end if;
  return new;
end;
$$;

-- Increments games.play_count when a player joins a classroom_play
CREATE OR REPLACE FUNCTION increment_game_play_count_on_player()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
begin
  update games set play_count = play_count + 1
  where id = (select game_id from classroom_plays where id = new.classroom_play_id);
  return new;
end;
$$;

-- =====================================================================
-- TRIGGERS
-- =====================================================================
CREATE TRIGGER set_updated_at_games      BEFORE UPDATE ON games      FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_scenarios  BEFORE UPDATE ON scenarios  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at_users      BEFORE UPDATE ON users      FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_classroom_plays
  BEFORE UPDATE ON classroom_plays
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER enforce_play_live BEFORE INSERT OR UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION check_play_is_live();

CREATE TRIGGER on_player_created
  AFTER INSERT ON players
  FOR EACH ROW EXECUTE FUNCTION increment_game_play_count_on_player();

-- KNOWN GAP: organizations has an updated_at column but no matching trigger yet.

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
-- RLS is ENABLED on every table below, but NO POLICIES are defined yet —
-- meaning only the Postgres/Supabase service role can currently read/write
-- data. Policies matching the real auth model still need to be written.
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_token  ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE games               ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios           ENABLE ROW LEVEL SECURITY;
ALTER TABLE choices             ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_plays     ENABLE ROW LEVEL SECURITY;
ALTER TABLE players             ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- REALTIME (Supabase-specific — remove this block on non-Supabase providers)
-- =====================================================================
-- classroom_plays + players power the live teacher dashboard: which
-- students are currently playing, pass/fail, and live scores.
ALTER PUBLICATION supabase_realtime ADD TABLE classroom_plays;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
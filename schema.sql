-- =========================================================================
-- FULL DATABASE SCHEMA SNAPSHOT
-- Project: main (uakvpneohrxcrrijfnbr)  |  Postgres 17  |  schema: public
-- Generated: 2026-07-17
-- Auth model: custom public.users table (NextAuth/Auth.js style — email +
--   password_hash + OAuth "accounts"/"sessions" tables), NOT Supabase Auth.
--   A couple of legacy RLS policies below still reference auth.uid();
--   those only matter if requests hit PostgREST with a Supabase Auth JWT.
--   Anything written through your Next.js server should use the service
--   role key, which bypasses RLS entirely.
-- This file is a snapshot for reference / onboarding, not a re-runnable
-- migration (extensions are already enabled, objects already exist).
-- =========================================================================


-- =========================================================================
-- 1. EXTENSIONS IN USE
-- =========================================================================
-- pgcrypto     -> gen_random_uuid()
-- uuid-ossp    -> legacy uuid helpers
-- pg_graphql   -> Supabase auto GraphQL
-- pg_stat_statements -> query stats
-- supabase_vault


-- =========================================================================
-- 2. ENUM TYPES
-- =========================================================================

CREATE TYPE public.game_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.play_status AS ENUM ('draft', 'live', 'closed');
CREATE TYPE public.usage_activity AS ENUM ('ai_generation', 'game_play');
CREATE TYPE public.user_role AS ENUM ('user', 'admin', 'viewer', 'super_admin');


-- =========================================================================
-- 3. SHARED FUNCTIONS (utility / trigger targets)
-- =========================================================================

-- Generic "touch updated_at on every UPDATE" trigger function.
-- Reused by: users, games, scenarios, classroom_plays, system_announcements
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

-- Blocks inserting/updating a player row unless the parent classroom_play
-- is currently 'live'.
CREATE OR REPLACE FUNCTION public.check_play_is_live()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  if not exists (
    select 1 from classroom_plays
    where id = new.classroom_play_id and status = 'live'
  ) then
    raise exception 'Cannot join or modify: this play is not live';
  end if;
  return new;
end;
$function$;

-- Bumps games.play_count whenever a new player joins a play session.
CREATE OR REPLACE FUNCTION public.increment_game_play_count_on_player()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  update games set play_count = play_count + 1
  where id = (select game_id from classroom_plays where id = new.classroom_play_id);
  return new;
end;
$function$;

-- Rolls usage_events up into per-user running counters (AI tokens/requests,
-- game plays) used for plan/quota enforcement.
CREATE OR REPLACE FUNCTION public.increment_user_usage_counters()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.activity = 'ai_generation' THEN
    UPDATE users
    SET ai_tokens_used_current_period = ai_tokens_used_current_period + COALESCE(NEW.tokens_used, 0),
        ai_requests_current_period = ai_requests_current_period + 1
    WHERE id = NEW.user_id;
  ELSIF NEW.activity = 'game_play' THEN
    UPDATE users
    SET game_plays_current_period = game_plays_current_period + 1
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$function$;

-- Aggregate stats for a single game (used by an analytics/dashboard view).
CREATE OR REPLACE FUNCTION public.get_game_stats(p_game_id uuid)
 RETURNS TABLE(total_plays bigint, completed_plays bigint, completion_rate numeric, avg_score numeric, avg_duration_secs numeric)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
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
$function$;


-- =========================================================================
-- 4. TABLES
-- =========================================================================

-- -------------------------------------------------------------------------
-- 4.1 users  — application user record (NextAuth-style, not auth.users)
-- -------------------------------------------------------------------------
CREATE TABLE public.users (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                            text,
  email                           text UNIQUE,
  "emailVerified"                 timestamptz,
  password_hash                   text,
  role                            user_role NOT NULL DEFAULT 'user',
  is_locked                       boolean NOT NULL DEFAULT false,
  is_subscribed                   boolean NOT NULL DEFAULT false,
  subscription_plan               text,
  subscription_expires_at         timestamptz,
  locale                          text NOT NULL DEFAULT 'ar',
  last_login_at                   timestamptz,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now(),
  deleted_at                      timestamptz,
  image                           text,
  ai_tokens_used_current_period   integer DEFAULT 0,
  ai_requests_current_period      integer DEFAULT 0,
  game_plays_current_period       integer DEFAULT 0,
  usage_period_started_at         timestamptz DEFAULT now()
);

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- Indexes: users_pkey (id), users_email_key (email, unique)


-- -------------------------------------------------------------------------
-- 4.2 accounts  — OAuth provider links (Auth.js "accounts" table)
-- -------------------------------------------------------------------------
CREATE TABLE public.accounts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId"            uuid NOT NULL REFERENCES public.users(id),
  type                text NOT NULL,
  provider            text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token       text,
  access_token        text,
  expires_at          integer,
  token_type          text,
  scope               text,
  id_token            text,
  session_state       text,
  UNIQUE (provider, "providerAccountId")
);

-- Indexes: accounts_pkey (id), idx_accounts_user_id (userId)


-- -------------------------------------------------------------------------
-- 4.3 sessions  — Auth.js session tokens
-- -------------------------------------------------------------------------
CREATE TABLE public.sessions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionToken" text NOT NULL UNIQUE,
  "userId"       uuid NOT NULL REFERENCES public.users(id),
  expires        timestamptz NOT NULL
);

-- Indexes: sessions_pkey (sessionToken), idx_sessions_user_id (userId)


-- -------------------------------------------------------------------------
-- 4.4 verification_token  — Auth.js email verification tokens
-- -------------------------------------------------------------------------
CREATE TABLE public.verification_token (
  identifier text NOT NULL,
  token      text NOT NULL,
  expires    timestamptz NOT NULL,
  PRIMARY KEY (identifier, token)
);


-- -------------------------------------------------------------------------
-- 4.5 organizations
-- -------------------------------------------------------------------------
CREATE TABLE public.organizations (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id       uuid REFERENCES public.users(id),
  name           text NOT NULL,
  logo_path      text,
  introduction   jsonb NOT NULL DEFAULT '{...}'::jsonb,   -- default localized copy
  result_screen  jsonb NOT NULL DEFAULT '{...}'::jsonb,   -- default localized copy
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now(),
  deleted_at     timestamptz
);

-- Indexes: organizations_pkey (id), idx_organizations_owner_id (owner_id)


-- -------------------------------------------------------------------------
-- 4.6 games
-- -------------------------------------------------------------------------
CREATE TABLE public.games (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id         uuid NOT NULL REFERENCES public.users(id),
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
  deleted_at       timestamptz,
  organization_id  uuid REFERENCES public.organizations(id),
  is_demo          boolean NOT NULL DEFAULT false
);

CREATE TRIGGER set_updated_at_games
  BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- Indexes:
--   games_pkey (id)
--   games_slug_key (slug, unique)
--   idx_games_organization_id (organization_id)
--   idx_games_owner_id (owner_id) WHERE deleted_at IS NULL   -- partial: only "live" games
--   idx_games_status (status)


-- -------------------------------------------------------------------------
-- 4.7 scenarios  — question/scene units belonging to a game
-- -------------------------------------------------------------------------
CREATE TABLE public.scenarios (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id      uuid NOT NULL REFERENCES public.games(id),
  order_index  integer NOT NULL DEFAULT 0,
  icon         text,
  title        text NOT NULL,
  description  text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_scenarios
  BEFORE UPDATE ON public.scenarios
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- Indexes: scenarios_pkey (id), idx_scenarios_game_order (game_id, order_index)


-- -------------------------------------------------------------------------
-- 4.8 choices  — answer options belonging to a scenario
-- -------------------------------------------------------------------------
CREATE TABLE public.choices (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id       uuid NOT NULL REFERENCES public.scenarios(id),
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

-- Indexes:
--   choices_pkey (id)
--   idx_choices_scenario_order (scenario_id, order_index)
--   idx_choices_correct (scenario_id) WHERE is_correct = true   -- partial: fast "correct answer" lookups


-- -------------------------------------------------------------------------
-- 4.9 classroom_plays  — a live/hosted session of a game
-- -------------------------------------------------------------------------
CREATE TABLE public.classroom_plays (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id      uuid NOT NULL REFERENCES public.games(id),
  teacher_id   uuid NOT NULL REFERENCES public.users(id),
  status       play_status NOT NULL DEFAULT 'draft',
  started_at   timestamptz,
  ended_at     timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at_classroom_plays
  BEFORE UPDATE ON public.classroom_plays
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- Indexes:
--   classroom_plays_pkey (id)
--   idx_classroom_plays_game_id (game_id)
--   idx_classroom_plays_teacher_id (teacher_id)
--   idx_classroom_plays_status (status)
--   idx_one_live_play_per_game (game_id) UNIQUE WHERE status = 'live'
--     -> business rule enforced at the index level: a game can only have
--        ONE live session at a time.


-- -------------------------------------------------------------------------
-- 4.10 players  — a participant inside a classroom_play
-- -------------------------------------------------------------------------
CREATE TABLE public.players (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_play_id      uuid NOT NULL REFERENCES public.classroom_plays(id),
  name                   text NOT NULL,
  total_score            integer NOT NULL DEFAULT 0,
  is_finished            boolean NOT NULL DEFAULT false,
  started_at             timestamptz NOT NULL DEFAULT now(),
  completed_at           timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  duration_seconds       integer GENERATED ALWAYS AS (EXTRACT(epoch FROM (completed_at - started_at))::integer) STORED,
  total_correct_answers  integer NOT NULL DEFAULT 0,
  total_wrong_answers    integer NOT NULL DEFAULT 0,
  UNIQUE (classroom_play_id, name)
);

CREATE TRIGGER enforce_play_live
  BEFORE INSERT OR UPDATE ON public.players
  FOR EACH ROW EXECUTE FUNCTION public.check_play_is_live();

CREATE TRIGGER on_player_created
  AFTER INSERT ON public.players
  FOR EACH ROW EXECUTE FUNCTION public.increment_game_play_count_on_player();

-- Indexes:
--   players_pkey (id)
--   players_classroom_play_id_name_key (classroom_play_id, name, unique)
--   idx_players_classroom_play_id (classroom_play_id)
--   idx_players_is_finished (classroom_play_id, is_finished)

-- RLS: enabled. Policy "Enable read access for realtime" — SELECT, roles
-- {public}, qual = true (needed for Supabase Realtime leaderboard updates).


-- -------------------------------------------------------------------------
-- 4.11 usage_events  — raw log of billable/quota-relevant user actions
-- -------------------------------------------------------------------------
CREATE TABLE public.usage_events (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES public.users(id),
  activity         usage_activity NOT NULL,
  tokens_used      integer DEFAULT 0,
  game_id          uuid REFERENCES public.games(id),
  metadata         jsonb DEFAULT '{}'::jsonb,
  created_at       timestamptz DEFAULT now(),
  organization_id  uuid REFERENCES public.organizations(id)
);

CREATE TRIGGER trg_increment_user_usage_counters
  AFTER INSERT ON public.usage_events
  FOR EACH ROW EXECUTE FUNCTION public.increment_user_usage_counters();

-- Indexes:
--   usage_events_pkey (id)
--   idx_usage_events_user_id (user_id)
--   idx_usage_events_organization_id (organization_id)
--   idx_usage_events_created_at (created_at)

-- RLS: enabled.
--   "users can insert their own usage events"  INSERT  WITH CHECK (user_id = auth.uid())
--   "users can read their own usage events"    SELECT  USING (user_id = auth.uid())
--   "staff can read all usage events"          SELECT  USING (users.role IN
--       ('admin','super_admin','viewer') for users.id = auth.uid())
--   NOTE: these rely on auth.uid(), which only resolves under a Supabase
--   Auth JWT — confirm whether this path is actually used, or whether all
--   access goes through the service role from your API layer.


-- -------------------------------------------------------------------------
-- 4.12 system_announcements  *** NEW ***
-- Broadcast system messages: product updates, maintenance notices,
-- general messages, and changelog / "last updated" entries.
-- -------------------------------------------------------------------------
CREATE TABLE public.system_announcements (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type         text NOT NULL CHECK (type IN ('update', 'maintenance', 'message', 'changelog')),
  title        text NOT NULL,
  body         text,
  severity     text NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  is_active    boolean NOT NULL DEFAULT true,
  starts_at    timestamptz NOT NULL DEFAULT now(),
  ends_at      timestamptz,
  created_by   uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT system_announcements_valid_window CHECK (ends_at IS NULL OR ends_at > starts_at)
);

COMMENT ON TABLE public.system_announcements IS
  'Broadcast system messages: product updates, maintenance notices, general messages, and changelog entries. One row is shown to all users (not per-user).';
COMMENT ON COLUMN public.system_announcements.type IS
  'update = feature/product update notice, maintenance = downtime/maintenance banner, message = general system message, changelog = platform "last updated" release entry';
COMMENT ON COLUMN public.system_announcements.is_active IS
  'Soft toggle to hide an announcement without deleting it';

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.system_announcements
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- Indexes:
CREATE INDEX idx_system_announcements_active_window
  ON public.system_announcements (starts_at DESC)
  INCLUDE (ends_at, type, severity)
  WHERE is_active = true;
  -- Primary read path: "get currently active announcements to show a user".
  -- Partial index keeps it tiny; INCLUDE avoids a heap fetch for the columns
  -- the app needs to render a banner.

CREATE INDEX idx_system_announcements_changelog_latest
  ON public.system_announcements (created_at DESC)
  WHERE type = 'changelog' AND is_active = true;
  -- "What's the last platform update?" -> LIMIT 1 on this index, no seq scan.

CREATE INDEX idx_system_announcements_type
  ON public.system_announcements (type);
  -- Admin dashboard filtering by type.

CREATE INDEX idx_system_announcements_created_by
  ON public.system_announcements (created_by, created_at DESC)
  WHERE created_by IS NOT NULL;
  -- Admin dashboard: "announcements created by staff member X".

-- RLS: enabled.
ALTER TABLE public.system_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active announcements"
  ON public.system_announcements
  FOR SELECT
  TO anon, authenticated
  USING (
    is_active = true
    AND starts_at <= now()
    AND (ends_at IS NULL OR ends_at > now())
  );
-- No INSERT/UPDATE/DELETE policies -> writes must go through the service
-- role key from your backend/admin panel.


-- -------------------------------------------------------------------------
-- 4.13 system_announcement_reads  *** NEW ***
-- Per-user read/dismiss tracking. Kept separate from system_announcements
-- because announcements are broadcast (one row for everyone) while
-- "has user X seen/dismissed it" is inherently per-user.
-- -------------------------------------------------------------------------
CREATE TABLE public.system_announcement_reads (
  user_id          uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  announcement_id  uuid NOT NULL REFERENCES public.system_announcements(id) ON DELETE CASCADE,
  read_at          timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, announcement_id)
);

COMMENT ON TABLE public.system_announcement_reads IS
  'Tracks which users have read/dismissed which system_announcements. Composite PK (user_id, announcement_id) already indexes lookups by user_id first.';

-- Indexes:
--   system_announcement_reads_pkey (user_id, announcement_id)  -- covers "has user X read Y" and "all reads by user X"
CREATE INDEX idx_system_announcement_reads_announcement_id
  ON public.system_announcement_reads (announcement_id);
  -- Reverse lookup: "how many users have read/dismissed announcement Y"
  -- (PK alone doesn't help here since announcement_id is the 2nd column).

-- RLS: enabled, no policies -> only accessible via service role.
ALTER TABLE public.system_announcement_reads ENABLE ROW LEVEL SECURITY;


-- -------------------------------------------------------------------------
-- 4.14 user_notifications  *** NEW ***
-- Direct, 1-to-1 notifications for a specific user.
-- -------------------------------------------------------------------------
CREATE TABLE public.user_notifications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type         text NOT NULL,
  title        text NOT NULL,
  body         text,
  link         text,
  is_read      boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.user_notifications IS
  'High-volume direct notifications targeted at a specific user (e.g., account alerts, gameplay achievements).';

CREATE TRIGGER set_updated_at_user_notifications
  BEFORE UPDATE ON public.user_notifications
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

CREATE INDEX idx_user_notifications_user_id
  ON public.user_notifications (user_id, created_at DESC);
  
CREATE INDEX idx_user_notifications_unread
  ON public.user_notifications (user_id)
  WHERE is_read = false;

ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own notifications"
  ON public.user_notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
  
CREATE POLICY "Users can update their own notifications (mark read)"
  ON public.user_notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());


-- =========================================================================
-- 5. EXAMPLE APPLICATION QUERIES (for reference, not part of the schema)
-- =========================================================================

-- Active announcements to show the current user, excluding ones they've
-- already dismissed:
-- SELECT a.*
-- FROM system_announcements a
-- WHERE a.is_active = true
--   AND a.starts_at <= now()
--   AND (a.ends_at IS NULL OR a.ends_at > now())
--   AND NOT EXISTS (
--     SELECT 1 FROM system_announcement_reads r
--     WHERE r.announcement_id = a.id AND r.user_id = $1
--   )
-- ORDER BY a.starts_at DESC;

-- "Last updated" footer badge:
-- SELECT title, created_at
-- FROM system_announcements
-- WHERE type = 'changelog' AND is_active = true
-- ORDER BY created_at DESC
-- LIMIT 1;

-- Mark an announcement as read/dismissed:
-- INSERT INTO system_announcement_reads (user_id, announcement_id)
-- VALUES ($1, $2)
-- ON CONFLICT (user_id, announcement_id) DO NOTHING;
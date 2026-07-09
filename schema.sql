-- =====================================================================
-- FULL DATABASE SCHEMA DUMP
-- Project: Educational Mini-Games Platform
-- Generated: 2026-07-09
-- Compatible with: PostgreSQL 13+ (tested on Supabase, Postgres 17)
-- =====================================================================
-- This file recreates the entire public schema: extensions, enum types,
-- tables (with constraints), indexes, functions, and triggers.
-- Run this against an empty database / empty public schema.
-- =====================================================================


-- =====================================================================
-- 1. EXTENSIONS
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- provides gen_random_uuid()


-- =====================================================================
-- 2. ENUM TYPES
-- =====================================================================
CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TYPE game_status AS ENUM ('draft', 'published', 'archived');

CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'abandoned');


-- =====================================================================
-- 3. TABLES
-- =====================================================================

-- ---------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------
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
-- NOTE: no "image" column by design — avatar is sourced from the
-- OAuth provider session (e.g. Google) at runtime, never stored here.

-- ---------------------------------------------------------------------
-- accounts (OAuth provider linkage — NextAuth-style)
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- sessions (auth sessions — NextAuth-style)
-- ---------------------------------------------------------------------
CREATE TABLE sessions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionToken" text NOT NULL UNIQUE,
  "userId"       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires        timestamptz NOT NULL
);

-- ---------------------------------------------------------------------
-- verification_token (auth email verification — NextAuth-style)
-- ---------------------------------------------------------------------
CREATE TABLE verification_token (
  identifier text NOT NULL,
  token      text NOT NULL,
  expires    timestamptz NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ---------------------------------------------------------------------
-- organizations
-- Single source of truth for branding + intro/result screen content,
-- reused across every game so teachers never re-enter it per game.
-- ---------------------------------------------------------------------
CREATE TABLE organizations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid REFERENCES users(id),
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

-- ---------------------------------------------------------------------
-- games
-- ---------------------------------------------------------------------
CREATE TABLE games (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id  uuid REFERENCES organizations(id),
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

-- ---------------------------------------------------------------------
-- scenarios (questions belonging to a game)
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- choices (answer options belonging to a scenario/question)
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- game_sessions (one row per play-through; realtime-enabled for the
-- live teacher dashboard)
-- ---------------------------------------------------------------------
CREATE TABLE game_sessions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id             uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_name         text NOT NULL,
  total_score         integer NOT NULL DEFAULT 0,
  max_possible_score  integer,
  status              session_status NOT NULL DEFAULT 'in_progress',
  answers             jsonb NOT NULL DEFAULT '[]'::jsonb,
  started_at          timestamptz NOT NULL DEFAULT now(),
  completed_at        timestamptz,
  duration_seconds    integer,
  metadata            jsonb NOT NULL DEFAULT '{}'::jsonb
);


-- =====================================================================
-- 4. INDEXES (beyond those auto-created by PRIMARY KEY / UNIQUE)
-- =====================================================================
CREATE INDEX idx_accounts_user_id            ON accounts ("userId");
CREATE INDEX idx_sessions_user_id            ON sessions ("userId");

CREATE INDEX idx_games_owner_id              ON games (owner_id) WHERE (deleted_at IS NULL);
CREATE INDEX idx_games_status                ON games (status);

CREATE INDEX idx_scenarios_game_order        ON scenarios (game_id, order_index);

CREATE INDEX idx_choices_scenario_order      ON choices (scenario_id, order_index);
CREATE INDEX idx_choices_correct             ON choices (scenario_id) WHERE (is_correct = true);

CREATE INDEX idx_game_sessions_game_id       ON game_sessions (game_id);
CREATE INDEX idx_game_sessions_game_status   ON game_sessions (game_id, status);
CREATE INDEX idx_game_sessions_completed_at  ON game_sessions (game_id, completed_at DESC);


-- =====================================================================
-- 5. FUNCTIONS
-- =====================================================================

-- Generic "touch updated_at" trigger function
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

-- Increments games.play_count whenever a new game_session is created
CREATE OR REPLACE FUNCTION increment_game_play_count()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
begin
  update games set play_count = play_count + 1 where id = new.game_id;
  return new;
end;
$function$;

-- Returns aggregate stats (plays, completion rate, avg score/duration) for a game
CREATE OR REPLACE FUNCTION get_game_stats(p_game_id uuid)
RETURNS TABLE(
  total_plays        bigint,
  completed_plays     bigint,
  completion_rate     numeric,
  avg_score           numeric,
  avg_duration_secs   numeric
)
LANGUAGE sql
STABLE
AS $function$
  select
    count(*)                                                      as total_plays,
    count(*) filter (where status = 'completed')                  as completed_plays,
    round(
      100.0 * count(*) filter (where status = 'completed')
      / nullif(count(*), 0), 1
    )                                                              as completion_rate,
    round(avg(total_score) filter (where status = 'completed'), 1) as avg_score,
    round(avg(duration_seconds) filter (where status = 'completed'), 1) as avg_duration_secs
  from game_sessions
  where game_id = p_game_id;
$function$;


-- =====================================================================
-- 6. TRIGGERS
-- =====================================================================
CREATE TRIGGER set_updated_at_games
  BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_scenarios
  BEFORE UPDATE ON scenarios
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER on_game_session_created
  AFTER INSERT ON game_sessions
  FOR EACH ROW EXECUTE FUNCTION increment_game_play_count();

-- NOTE: organizations table currently has no "set_updated_at" trigger,
-- even though it has an updated_at column. Consider adding, for
-- consistency with games/scenarios/users:
-- CREATE TRIGGER set_updated_at_organizations
--   BEFORE UPDATE ON organizations
--   FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();


-- =====================================================================
-- 7. ROW LEVEL SECURITY
-- =====================================================================
-- RLS is enabled on every table below. No policies have been defined
-- yet in the source project (meaning only the service role can access
-- data right now) — you will need to add policies appropriate to your
-- auth model on the target database.
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_token  ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE games               ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios           ENABLE ROW LEVEL SECURITY;
ALTER TABLE choices             ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions        ENABLE ROW LEVEL SECURITY;


-- =====================================================================
-- 8. REALTIME (Supabase-specific)
-- =====================================================================
-- Only game_sessions is broadcast in realtime — powers the live
-- teacher dashboard (student pass/fail/score updating as they play).
-- Skip this section if importing into a non-Supabase Postgres provider,
-- since the "supabase_realtime" publication won't exist there.
-- ALTER PUBLICATION supabase_realtime ADD TABLE game_sessions;

-- =====================================================================
-- END OF SCHEMA
-- =====================================================================
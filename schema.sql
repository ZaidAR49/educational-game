-- =========================================================
-- FULL SCHEMA EXPORT
-- Project: main (uakvpneohrxcrrijfnbr)
-- Generated: 2026-07-12
-- =========================================================

-- =========================================================
-- ENUM TYPES
-- =========================================================
CREATE TYPE user_role AS ENUM ('user', 'admin', 'viewer', 'super_admin');
CREATE TYPE game_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE play_status AS ENUM ('draft', 'live', 'closed');
CREATE TYPE usage_activity AS ENUM ('ai_generation', 'game_play');

-- =========================================================
-- AUTH TABLES (NextAuth-style)
-- =========================================================
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text UNIQUE,
  "emailVerified" timestamptz,
  password_hash text,
  role user_role NOT NULL DEFAULT 'user',
  is_locked boolean NOT NULL DEFAULT false,
  is_subscribed boolean NOT NULL DEFAULT false,
  subscription_plan text,
  subscription_expires_at timestamptz,
  locale text NOT NULL DEFAULT 'ar',
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  image text,
  -- usage tracking (cached running totals)
  ai_tokens_used_current_period integer DEFAULT 0,
  ai_requests_current_period integer DEFAULT 0,
  game_plays_current_period integer DEFAULT 0,
  usage_period_started_at timestamptz DEFAULT now()
);

CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES users(id),
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  UNIQUE (provider, "providerAccountId")
);

CREATE TABLE sessions (
  "sessionToken" text PRIMARY KEY,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES users(id),
  expires timestamptz NOT NULL,
  UNIQUE ("sessionToken")
);

CREATE TABLE verification_token (
  identifier text NOT NULL,
  token text NOT NULL,
  expires timestamptz NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- =========================================================
-- ORGANIZATIONS
-- =========================================================
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES users(id),
  name text NOT NULL,
  logo_path text,
  introduction jsonb NOT NULL DEFAULT '{
    "title": "اختبر معلوماتك",
    "subtitle": "لعبة تفاعلية تعليمية للجميع",
    "button_text": "ابدأ الاختبار 🚀",
    "welcome_box": {
      "description": "مرحباً بك! 👋 ستواجه في هذا الاختبار مجموعة من الأسئلة المتنوعة. اختر الإجابة الصحيحة في كل سؤال واجمع أكبر عدد من النقاط!",
      "closing_question": "هل أنت مستعد لاختبار معلوماتك؟"
    },
    "back_link_text": "العودة للرئيسية",
    "decorative_emojis": ["✨", "☀️", "⭐"]
  }'::jsonb,
  result_screen jsonb NOT NULL DEFAULT '{
    "title": "لا بأس، استمر!",
    "message": "لا تيأس! كل سؤال أخطأت فيه هو معلومة جديدة تعلمتها. جرب مرة أخرى!",
    "small_description": "كل محاولة تعلّم جديد!"
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- =========================================================
-- GAMES, SCENARIOS, CHOICES
-- =========================================================
CREATE TABLE games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  title text NOT NULL,
  description text,
  slug text NOT NULL UNIQUE,
  icon text,
  status game_status NOT NULL DEFAULT 'draft',
  language text NOT NULL DEFAULT 'ar',
  is_public boolean NOT NULL DEFAULT true,
  access_code text,
  settings jsonb NOT NULL DEFAULT '{}',
  max_points integer NOT NULL DEFAULT 0,
  play_count integer NOT NULL DEFAULT 0,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id),
  order_index integer NOT NULL DEFAULT 0,
  icon text,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid NOT NULL REFERENCES scenarios(id),
  order_index integer NOT NULL DEFAULT 0,
  text text NOT NULL,
  icon text,
  is_correct boolean NOT NULL DEFAULT false,
  feedback_title text,
  feedback_message text,
  feedback_tip text,
  points integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================================================
-- CLASSROOM PLAY & SCORING
-- =========================================================
CREATE TABLE classroom_plays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id),
  teacher_id uuid NOT NULL REFERENCES users(id),
  status play_status NOT NULL DEFAULT 'draft',
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_play_id uuid NOT NULL REFERENCES classroom_plays(id),
  name text NOT NULL,
  total_score integer NOT NULL DEFAULT 0,
  is_finished boolean NOT NULL DEFAULT false,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  duration_seconds integer GENERATED ALWAYS AS (
    EXTRACT(epoch FROM (completed_at - started_at))
  ) STORED,
  total_correct_answers integer NOT NULL DEFAULT 0,
  total_wrong_answers integer NOT NULL DEFAULT 0,
  UNIQUE (classroom_play_id, name)
);

-- =========================================================
-- USAGE TRACKING (general-purpose event log)
-- =========================================================
CREATE TABLE usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  activity usage_activity NOT NULL,
  tokens_used integer DEFAULT 0,
  game_id uuid REFERENCES games(id),
  organization_id uuid REFERENCES organizations(id),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_usage_events_user_id ON usage_events(user_id);
CREATE INDEX idx_usage_events_created_at ON usage_events(created_at);
CREATE INDEX idx_usage_events_organization_id ON usage_events(organization_id);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_token ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;

-- Policies currently defined (usage_events only — an immutable, append-only log)
CREATE POLICY "users can insert their own usage events"
ON usage_events FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users can read their own usage events"
ON usage_events FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "staff can read all usage events"
ON usage_events FOR SELECT
USING (
  (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'super_admin', 'viewer')
);

-- NOTE: all other tables have RLS ENABLED but NO POLICIES defined yet.
-- This means they are fully locked to anon/authenticated roles right now
-- (only accessible via the service_role key). Add policies before relying
-- on client-side Supabase access for these tables.

-- =========================================================
-- FUNCTIONS & TRIGGERS
-- =========================================================

-- Auto-increments users.*_current_period counters whenever a usage_events row is inserted
CREATE OR REPLACE FUNCTION increment_user_usage_counters()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE TRIGGER trg_increment_user_usage_counters
AFTER INSERT ON usage_events
FOR EACH ROW
EXECUTE FUNCTION increment_user_usage_counters();

-- =========================================================
-- CLEANUP FUNCTION (scheduled via pg_cron)
-- Deletes stale records older than 30 days.
-- Schedule: daily at 03:00 UTC via pg_cron.
-- =========================================================

CREATE OR REPLACE FUNCTION cleanup_old_records()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cutoff         timestamptz := now() - interval '30 days';
  deleted_plays  integer;
  deleted_tokens integer;
BEGIN
  -- Delete closed classroom_plays older than 30 days
  -- players rows deleted automatically via ON DELETE CASCADE
  DELETE FROM classroom_plays
  WHERE status = 'closed'
    AND created_at < cutoff;
  GET DIAGNOSTICS deleted_plays = ROW_COUNT;

  -- Delete expired verification tokens
  DELETE FROM verification_token
  WHERE expires < now();
  GET DIAGNOSTICS deleted_tokens = ROW_COUNT;

  RETURN jsonb_build_object(
    'ran_at',         now(),
    'cutoff',         cutoff,
    'deleted_plays',  deleted_plays,
    'deleted_tokens', deleted_tokens
  );
END;
$$;

-- pg_cron schedule (run once in Supabase SQL Editor):
-- SELECT cron.schedule('cleanup_old_records', '0 3 * * *', $$SELECT cleanup_old_records()$$);
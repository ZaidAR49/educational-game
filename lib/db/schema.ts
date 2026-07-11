import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  bigint,
  primaryKey,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const gameStatusEnum = pgEnum("game_status", ["draft", "published", "archived"]);
export const playStatusEnum = pgEnum("play_status", ["draft", "live", "closed"]);

// users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date", withTimezone: true }),
  passwordHash: text("password_hash"),
  role: userRoleEnum("role").notNull().default("user"),
  isLocked: boolean("is_locked").notNull().default(false),
  isSubscribed: boolean("is_subscribed").notNull().default(false),
  subscriptionPlan: text("subscription_plan"),
  subscriptionExpiresAt: timestamp("subscription_expires_at", { mode: "date", withTimezone: true }),
  locale: text("locale").notNull().default("ar"),
  lastLoginAt: timestamp("last_login_at", { mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  organizations: many(organizations),
  games: many(games),
  classroomPlays: many(classroomPlays),
}));

// accounts table (Auth.js)
export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: bigint("expires_at", { mode: "number" }),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [unique().on(table.provider, table.providerAccountId)]
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// sessions table (Auth.js)
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// verification_token table (Auth.js)
export const verificationToken = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
);

// organizations table
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  logoPath: text("logo_path"),
  introduction: jsonb("introduction").notNull().default({
    title: "اختبر معلوماتك",
    subtitle: "لعبة تفاعلية تعليمية للجميع",
    welcome_box: {
      description: "مرحباً بك! 👋 ستواجه في هذا الاختبار مجموعة من الأسئلة المتنوعة. اختر الإجابة الصحيحة في كل سؤال واجمع أكبر عدد من النقاط!",
      closing_question: "هل أنت مستعد لاختبار معلوماتك?"
    },
    button_text: "ابدأ الاختبار 🚀",
    decorative_emojis: ["✨", "☀️", "⭐"],
    back_link_text: "العودة للرئيسية"
  }),
  resultScreen: jsonb("result_screen").notNull().default({
    title: "لا بأس، استمر!",
    small_description: "كل محاولة تعلّم جديد!",
    message: "لا تيأس! كل سؤال أخطأت فيه هو معلومة جديدة تعلمتها. جرب مرة أخرى!"
  }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
});

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  owner: one(users, {
    fields: [organizations.ownerId],
    references: [users.id],
  }),
  games: many(games),
}));

// games table
export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  status: gameStatusEnum("status").notNull().default("draft"),
  language: text("language").notNull().default("ar"),
  isPublic: boolean("is_public").notNull().default(true),
  accessCode: text("access_code"),
  settings: jsonb("settings").notNull().default({}),
  maxPoints: integer("max_points").notNull().default(0),
  playCount: integer("play_count").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { mode: "date", withTimezone: true }),
});

export const gamesRelations = relations(games, ({ one, many }) => ({
  owner: one(users, {
    fields: [games.ownerId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [games.organizationId],
    references: [organizations.id],
  }),
  scenarios: many(scenarios),
  classroomPlays: many(classroomPlays),
}));

// scenarios table
export const scenarios = pgTable("scenarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  orderIndex: integer("order_index").notNull().default(0),
  icon: text("icon"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

export const scenariosRelations = relations(scenarios, ({ one, many }) => ({
  game: one(games, {
    fields: [scenarios.gameId],
    references: [games.id],
  }),
  choices: many(choices),
}));

// choices table
export const choices = pgTable("choices", {
  id: uuid("id").primaryKey().defaultRandom(),
  scenarioId: uuid("scenario_id")
    .notNull()
    .references(() => scenarios.id, { onDelete: "cascade" }),
  orderIndex: integer("order_index").notNull().default(0),
  text: text("text").notNull(),
  icon: text("icon"),
  isCorrect: boolean("is_correct").notNull().default(false),
  feedbackTitle: text("feedback_title"),
  feedbackMessage: text("feedback_message"),
  feedbackTip: text("feedback_tip"),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

export const choicesRelations = relations(choices, ({ one }) => ({
  scenario: one(scenarios, {
    fields: [choices.scenarioId],
    references: [scenarios.id],
  }),
}));

// classroom_plays table
export const classroomPlays = pgTable("classroom_plays", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  teacherId: uuid("teacher_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: playStatusEnum("status").notNull().default("draft"),
  startedAt: timestamp("started_at", { mode: "date", withTimezone: true }),
  endedAt: timestamp("ended_at", { mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

export const classroomPlaysRelations = relations(classroomPlays, ({ one, many }) => ({
  game: one(games, {
    fields: [classroomPlays.gameId],
    references: [games.id],
  }),
  teacher: one(users, {
    fields: [classroomPlays.teacherId],
    references: [users.id],
  }),
  players: many(players),
}));

// players table
export const players = pgTable(
  "players",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    classroomPlayId: uuid("classroom_play_id")
      .notNull()
      .references(() => classroomPlays.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    totalScore: integer("total_score").notNull().default(0),
    totalCorrectAnswers: integer("total_correct_answers").notNull().default(0),
    totalWrongAnswers: integer("total_wrong_answers").notNull().default(0),
    isFinished: boolean("is_finished").notNull().default(false),
    startedAt: timestamp("started_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { mode: "date", withTimezone: true }),
    // duration_seconds is generated in SQL, so we don't insert it. We define it here to read it.
    durationSeconds: integer("duration_seconds"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.classroomPlayId, table.name)]
);

export const playersRelations = relations(players, ({ one }) => ({
  classroomPlay: one(classroomPlays, {
    fields: [players.classroomPlayId],
    references: [classroomPlays.id],
  }),
}));

// Export Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;

export type Scenario = typeof scenarios.$inferSelect;
export type NewScenario = typeof scenarios.$inferInsert;

export type Choice = typeof choices.$inferSelect;
export type NewChoice = typeof choices.$inferInsert;

export type ClassroomPlay = typeof classroomPlays.$inferSelect;
export type NewClassroomPlay = typeof classroomPlays.$inferInsert;

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;

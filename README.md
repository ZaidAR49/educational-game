# EduPlay 🎯

**EduPlay** (also known as Decision Hero) is a premium, highly interactive, gamified learning platform built for teachers, schools, and educational organizations. It empowers educators to design engaging interactive quizzes with detailed pedagogical feedback, host live classroom gameplay sessions, and track student comprehension in real time.

---

## 🚀 Key Features

### 1. 🌐 Full Multi-Language & Bidirectional (RTL / LTR) Support
- **Dual Language Parity**: 100% native localization in both **Arabic (العربية)** and **English** across all screens—including landing page, student gameplay, teacher dashboard, host live session, super admin analytics, settings, and modal dialogues.
- **Dynamic Directionality (RTL & LTR)**: Automatic layout adaptation with `<html dir="..." lang="...">` document synchronization and CSS logical alignment for seamless right-to-left and left-to-right experiences.
- **Instant Language Switcher**: Fast, client-side toggle accessible via header dropdowns and account settings with zero full-page reload delays.
- **4-Tier Locale Persistence**:
  1. User explicit selection stored in `localStorage`.
  2. HTTP cookie (`eduplay_locale`) synchronization for SSR hydration consistency.
  3. Server-side persistence linked directly to user profile in PostgreSQL.
  4. Automatic browser language detection (`navigator.languages`) fallback.
- **Localized Content & Generation**: Includes localized interactive demo games, bilingual student nickname generators (`data/nicknames.json`), and dynamic locale-aware AI prompt templates.

### 2. 🪄 AI-Powered Game Creation & Resilience
- **Auto AI Generator**: Powered by **Google GenAI / Vertex AI**, simply enter any lesson topic (e.g., "The Solar System", "Photosynthesis", or "World History") and the assistant crafts complete, multi-scenario educational games in your active language.
- **AI JSON Self-Repair (`safeParseAiGameJson`)**: Built-in resilient parser that automatically catches, repairs, and salvages incomplete or malformed JSON responses from LLMs without crashing the generator.
- **Configurable AI Models**: Dynamically configure text and game generation models via environment variables (e.g. `gemini-2.5-flash`, `gemini-3.8-flash`, etc.).
- **BYO Prompt Blueprints 🤖**: Pre-engineered prompt blueprints optimized for external LLMs (ChatGPT, Claude, Gemini); educators can copy the prompt blueprint, generate quizzes, and paste the JSON directly into the builder.
- **Advanced Manual Builder**: Intuitive step-by-step editor featuring **drag-and-drop** scenario reordering (via `@hello-pangea/dnd`), custom scoring, timer configurations, and pedagogical feedback curation.

### 3. 🧠 Pedagogical Feedback & Learning Tips
- **Immediate Explanatory Feedback**: Every multiple-choice answer provides rich explanations detailing *why* an answer is correct or why a distractor is misleading, converting assessment into an active learning experience.
- **Contextual Tips & Fun Facts**: Dynamic memory aids and educational facts appear after each question to reinforce comprehension.

### 4. ⚡ Zero-Friction Student Access
- **Instant Join**: Students join live classroom sessions in under 2 seconds by scanning a dynamic **QR code** (via `qrcode.react`) or entering a short game PIN. No account registration, email, or passwords required.
- **Privacy-First & Fun Avatars**: Generates safe, culturally appropriate random nicknames in both Arabic and English or permits custom nicknames with complete student privacy compliance.

### 5. 🏆 Live Classroom Gameplay & Celebratory Podium
- **Real-Time Host Dashboard**: Teachers monitor student joins, live question progression, answer distributions, and class accuracy in real time.
- **Interactive Celebration Podium**: High-energy end-of-game celebration with confetti particle effects, top-3 animated podium rankings, sound controls, and full-screen presentation mode.
- **Automatic Session Expiry & Auto-Pruning**: Built-in TTL lifecycle management closes stale/abandoned live sessions automatically via background cron and on-access validation, resetting games to draft state.

### 6. 📊 Real-Time Analytics & Dashboards
- **Live Metrics Tracking**: Real-time response statistics, score distributions, and completion rates powered by `recharts`.
- **Historic Session Reports**: Access past session scores, export student performance, and pinpoint recurring knowledge gaps.
- **Admin & Teacher Dashboards**: Role-based views for teachers to manage classrooms and for super-admins to inspect platform health, user traffic, and telemetry.

### 7. 🏫 Multi-Tenant School & Custom Branding
- **Organizations Support**: Group games, teachers, and analytics under distinct **Organizations** (schools, academies, tutoring centers).
- **Client-Side Image Optimization**: High-performance image processing using Web Workers (`browser-image-compression`). Custom school logos are automatically resized (max 500x500px), compressed (max 500KB), and converted to WebP before direct upload to AWS S3.
- **Branded Student Experience**: School logos dynamically appear on student devices during gameplay, accompanied by customizable "Pass" and "Fail" result screens.

### 8. 🛡️ Enterprise Architecture & Data Retention
- **Fully Typed Database**: Built on PostgreSQL (Supabase / Postgres.js) with **Drizzle ORM** for end-to-end type safety.
- **Role-Based Access Control (RBAC)**: Secure authentication powered by **Auth.js (NextAuth v5)** with granular roles (`user`, `admin`, `viewer`, `super_admin`).
- **Automated Data Lifecycle**: Scheduled daily cleanup jobs that warm database connections, auto-close stale sessions, and purge student records older than 30 days.

---

## 🛠️ Technology Stack

*   **Core Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
*   **Language & Runtime**: TypeScript 5.7 & Node.js
*   **Database & ORM**: PostgreSQL (Supabase) + [Drizzle ORM](https://orm.drizzle.team/)
*   **Internationalization (i18n)**: Custom zero-overhead static message catalogs (`messages/ar.json`, `messages/en.json`) with RTL/LTR directional synchronization
*   **AI Engine**: Google GenAI SDK (`@google/genai`) with Vertex AI integration & JSON self-repair pipeline
*   **Styling & UI**: Tailwind CSS v4, [Framer Motion](https://www.framer.com/motion/), Lucide React, Sonner (Toast notifications)
*   **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/) with RBAC
*   **Telemetry & Analytics**: [PostHog](https://posthog.com/) (Client & Node SDKs) + Vercel Analytics & Speed Insights
*   **Storage & Compression**: AWS S3 Client (`@aws-sdk/client-s3`) & `browser-image-compression`
*   **Data Visualization**: Recharts
*   **Email Services**: Nodemailer with localized email templates

---

## 📂 Project Structure

```text
├── app/
│   ├── (auth)/                # Authentication views (login, error, blocked)
│   ├── (pages)/
│   │   ├── admin/             # Super admin dashboard & analytics
│   │   ├── dashboard/         # Teacher game management & organizations
│   │   ├── game/[id]/         # Student live gameplay screens
│   │   └── contact/           # Localized contact page
│   ├── api/
│   │   ├── cron/              # Background cron tasks (session cleanup)
│   │   ├── generate/          # GenAI game generation endpoint
│   │   └── keep-alive/        # Database ping & student record pruner
│   ├── layout.tsx             # Root layout with locale & theme providers
│   └── page.tsx               # Redesigned landing page
├── components/
│   ├── admin/                 # Admin data tables, charts & user management
│   ├── dashboard/             # Host dashboard, game list & analytics
│   ├── game/                  # Student screens (Join, Gameplay, Results)
│   ├── games/                 # Game builder, Auto AI & BYO AI wizards
│   ├── organizations/         # School branding & logo compression
│   └── shared/                # LanguageDropdown, Navbar, Footer, Modals
├── lib/
│   ├── actions/               # Server Actions (games, sessions, users, ai)
│   ├── ai/                    # GenAI client, prompt configs & json-repair
│   ├── db/                    # Drizzle ORM schema and database client
│   ├── i18n/                  # LanguageContext, locale detection & types
│   ├── image-compression.ts   # WebP worker compression utility
│   └── posthog-server.ts      # Server-side telemetry client
├── messages/
│   ├── ar.json                # Complete Arabic translation catalog
│   └── en.json                # Complete English translation catalog
└── data/                      # Localized demo games & nicknames list
```

---

## ⚙️ Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory and configure the necessary variables:

```env
# Database (PostgreSQL / Supabase)
DATABASE_URL="postgresql://postgres:password@host:port/dbname"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="ey..."

# Object Storage (AWS S3 or Supabase Storage)
SUPABASE_S3_BUCKET="logos"
SUPABASE_S3_ENDPOINT="https://your-project.supabase.co/storage/v1/s3"
SUPABASE_S3_REGION="us-east-1"
SUPABASE_S3_ACCESS_KEY_ID="your-access-key-id"
SUPABASE_S3_SECRET_ACCESS_KEY="your-secret-access-key"

# Authentication (Auth.js v5)
AUTH_SECRET="your-auth-secret-min-32-chars"
AUTH_TRUST_HOST="true"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# Google Vertex AI & GenAI
VERTEX_AI_PROJECT_ID="your-gcp-project-id"
VERTEX_AI_LOCATION="global"
VERTEX_AI_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
VERTEX_AI_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Configurable Gemini Models (Optional - defaults to gemini-2.5-flash)
GEMINI_GAME_MODEL="gemini-2.5-flash"
GEMINI_TEXT_MODEL="gemini-2.5-flash"

# Telemetry & Monitoring (PostHog & Vercel)
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
POSTHOG_PROJECT_ID="your-posthog-project-id"
POSTHOG_PERSONAL_API_KEY="phx_..."

# Application & Maintenance
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CRON_SECRET="your-secure-cron-secret-token"

# Contact & Email (Optional - Nodemailer)
EMAIL="notifications@yourdomain.com"
PASSWORD="smtp-application-password"
```

### 3. Run Development Server
Start the local hot-reloaded development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🚀 Deployment & Scheduled Tasks (Vercel)

The platform is configured for production deployments on Vercel with automated maintenance:

- **Database Warming & Student Data Retention**: A scheduled cron job (`0 3 * * *`) sends an authorized request to `/api/keep-alive`:
  - Pings the database to prevent serverless database cold starts or pause states.
  - Automatically purges anonymous student player records older than 30 days for privacy and database hygiene.
- **Live Session TTL Cleanup**: `/api/cron/cleanup-sessions` automatically detects live classroom sessions that have exceeded their maximum duration (2 hours), marks them as closed, and restores games to draft mode.
- **Fail-Closed Security**: Cron endpoints are secured via the `Authorization: Bearer <CRON_SECRET>` header.


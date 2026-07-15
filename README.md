# EduPlay 🎯

**EduPlay** (also known as Decision Hero) is a premium, highly interactive, gamified learning platform built for teachers, schools, and educational organizations. It empowers educators to design engaging interactive quizzes with detailed pedagogical feedback, host live gameplay sessions, and track student comprehension in real time.

---

## 🚀 Key Features

### 1. 🪄 AI-Powered Game Creation
- **Auto AI Generator**: Powered by **Google GenAI**, simply enter any lesson topic (e.g., "The Solar System" or "Photosynthesis") and the built-in AI assistant automatically generates comprehensive scenarios, questions, correct/incorrect choices, and educational feedback.
- **BYO Prompt Blueprints 🤖**: Prefer a different AI? Copy our highly optimized prompting blueprints, run them in models like ChatGPT or Claude, and paste the generated JSON back to import your game instantly.
- **Advanced Manual Builder**: A robust, step-by-step editor featuring **drag-and-drop** reordering (via `@hello-pangea/dnd`) to build custom scenarios, adjust points, and refine questions with absolute precision.

### 2. 🧠 Pedagogical Feedback & Learning Tips
- **Immediate Explanatory Feedback**: Every choice is attached to an explanation showing the student *why* that specific answer is correct or incorrect, transforming standard quizzes into active learning tools.
- **Contextual Tips**: Short, fun facts and educational hints are dynamically displayed to strengthen student comprehension after every response.

### 3. ⚡ Zero-Friction Student Access
- **Zero Accounts Required**: Students join live classroom sessions in under 2 seconds by scanning a **QR code** or following a direct link. No login, registration, or password retrieval required.
- **Privacy-First**: Students enter using generated or custom nicknames, ensuring complete data privacy and compliance.

### 4. 📊 Real-Time Dashboard Analytics
- **Live Metrics Tracking**: Monitor student completion rates, class accuracy, and score distributions in real time as gameplay happens.
- **Historic Session Reports**: Access past session scores and analytics inside the Sessions list to easily export grades and identify recurring knowledge gaps.
- **Admin & Teacher Dashboards**: Dedicated interfaces for teachers to manage classrooms and for admins to manage platform-wide analytics and accounts.

### 5. 🏫 Multi-Tenant School & Brand Management
- **Organizations Support**: Group games, teachers, and analytics under distinct **Organizations** (schools, classrooms, or coaching centers).
- **Custom Branding**: Upload custom logos (via AWS S3 integration) that appear on student screens during gameplay to represent your school's unique brand.
- **Customizable Result Screens**: Tailor the "Pass" and "Fail" result screens per organization.

### 6. 💎 Premium, Responsive UI
- **Modern Animations**: Silky smooth transitions and micro-interactions powered by **Framer Motion** and Tailwind CSS animations.
- **Responsive Design**: Flawless experience across desktop, tablet, and mobile devices.
- **Localization Support**: Built with internationalization in mind (currently heavily optimized for Arabic/RTL out of the box).

### 7. 🛡️ Enterprise-Grade Architecture & Safeguards
- **Fully Typed Database**: Built on PostgreSQL (Supabase) with **Drizzle ORM** for end-to-end type safety.
- **Role-Based Access Control**: Granular roles (`user`, `admin`, `viewer`, `super_admin`) and secure authentication powered by **Auth.js (NextAuth v5)**.
- **Usage Tracking & Subscriptions**: Built-in logic for tracking AI tokens, game plays, and managing subscription tiers.
- **Keep-Alive Ping Endpoint**: A dedicated `/api/keep-alive` path that queries the database to keep the connection pool warm and prevent free-tier database suspension.
- **Automated Data Retention**: Scheduled database cleanup via `pg_cron` that preserves detailed student response logs for 30 days, keeping the database footprint optimized.

---

## 🛠️ Technology Stack

*   **Core Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & React 19
*   **Database & ORM**: PostgreSQL (Supabase / Postgres.js driver) + [Drizzle ORM](https://orm.drizzle.team/)
*   **Styling & Animation**: Tailwind CSS v4, [Framer Motion](https://www.framer.com/motion/), & Lucide React
*   **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
*   **Telemetry & Analytics**: [PostHog](https://posthog.com/) (Web & Server integration)
*   **AI Integration**: Google GenAI SDK
*   **File Storage**: AWS SDK S3 Client

---

## 📂 Project Structure

*   `app/`: Main router layouts, views, and API routes.
    *   `app/api/keep-alive/`: Database keep-alive API.
    *   `app/dashboard/`: Teacher/Organization dashboard.
    *   `app/admin/`: Super admin dashboard for platform management.
*   `components/`: Modular React components.
    *   `components/home/`: Redesigned premium landing page sections.
    *   `components/dashboard/` & `components/admin/`: Dashboard layouts and navigation sidebars.
    *   `components/games/`: AI wizards, prompt engines, and question editors.
*   `lib/`: Core helpers, server actions, services, database schemas, and AI configuration.
*   `data/`: Localization strings and general static text contents.

---

## ⚙️ Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory and define the following environment variables:
```env
# Database connection string
DATABASE_URL="postgresql://..."

# Auth.js config
AUTH_SECRET="your-auth-secret"
AUTH_TRUST_HOST="true"

# Google GenAI API Key (for Auto AI Game Generation)
GOOGLE_GENAI_API_KEY="AIzaSy..."

# Telemetry (PostHog)
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
```

### 3. Run Development Server
Start the local hot-reloaded development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the platform in action!

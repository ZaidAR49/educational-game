# EduPlay 🎯

**EduPlay** is a premium, interactive, gamified learning platform built for teachers, schools, and educational organizations. It allows teachers to design engaging interactive quizzes with detailed pedagogical feedback, host live gameplay sessions, and track student comprehension in real time.

---

## 🚀 Key Features

### 1. AI-Powered Game Creation
*   **Auto AI Generator (🪄)**: Enter any lesson topic (e.g., "The Solar System" or "Photosynthesis"), and the built-in AI assistant (powered by Google Gemini) automatically generates scenarios, questions, correct/incorrect choices, and educational feedback.
*   **BYO Prompt blueprints (🤖)**: Copy our highly optimized prompting blueprints, run them in external models like ChatGPT or Claude, and paste the generated JSON back to import your game instantly.
*   **Manual Builder**: A step-by-step editor to build custom scenarios, adjust points, and refine questions with absolute precision.

### 2. Pedagogical Feedback & Learning Tips
*   **Immediate Explanatory Feedback**: Every choice is attached to an explanation showing the student *why* that specific answer is correct or incorrect, turning quizzes into active learning tools.
*   **Contextual Tips**: Short, fun facts and educational hints are displayed to strengthen student comprehension after every response.

### 3. Zero-Friction Student Access
*   **Zero Accounts Required**: Students join sessions in under 2 seconds by scanning a QR code or following a direct link. No login, registration, or password retrieval required.
*   **Privacy-Friendly**: Students enter using nicknames, maintaining complete data privacy.

### 4. Real-Time Dashboard Analytics
*   **Live Metrics Tracking**: Monitor student completion rate, class accuracy, and score distributions as the gameplay is active.
*   **Historic Session Reports**: Access past session scores and analytics inside the **Sessions (الجلسات)** list to easily export grades and identify recurring knowledge gaps.

### 5. Multi-Tenant School & Brand Management
*   Group games and analytics under **Organizations** (schools, classrooms, or coaching centers).
*   Upload custom logos that appear on student screens during gameplay to represent your school's brand.

### 6. Technical Safeguards
*   **Keep-Alive Ping Endpoint**: A dedicated `/api/keep-alive` path that queries the database (`SELECT 1`) to keep the pool connection warm and prevent free-tier database suspension (e.g., on Supabase).
*   **30-Day Session Data Retention**: An automated database retention limit that preserves detailed student response logs for 30 days, keeping the database footprint clean and optimized.

---

## 🛠️ Technology Stack

*   **Core Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & React 19
*   **Database & ORM**: PostgreSQL (Supabase / Postgres.js driver) + [Drizzle ORM](https://orm.drizzle.team/)
*   **Styling & Animation**: Tailwind CSS v4 & [Framer Motion](https://www.framer.com/motion/)
*   **Telemetry & Analytics**: [PostHog](https://posthog.com/) (Web & Server integration)
*   **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)

---

## 📂 Project Structure

*   `app/`: Main router layouts, views, and API routes.
    *   `app/api/keep-alive/`: Database keep-alive API.
    *   `app/dashboard/help/`: In-app teacher "How to Use" tutorial guide.
    *   `app/policies/`: Terms of Service and Privacy Policies.
*   `components/`: Modular React components.
    *   `components/home/`: Redesigned premium landing page sections (Hero, Features, Timeline, CTA).
    *   `components/dashboard/`: Dashboard layout and navigation sidebar.
    *   `components/games/`: AI wizards, prompt engines, and question editors.
*   `lib/`: Core helpers, actions, services, database schemas, and AI config.
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
Propose running local hot-reloaded development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the redesigned landing page!

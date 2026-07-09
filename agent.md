# Project Name 
"EduPlay"

# Decision Hero — AI Agent Rules

> These rules govern all AI-assisted development on this project.
> Violations are treated as bugs. Read everything before writing a single line of code.

---

## 1. Project Overview

**Decision Hero** is an educational game platform where teachers create scenario-based games and students play them without accounts. The project is a **Next.js 16** app using **TypeScript**, **Supabase/Postgres** for the database, and **Auth.js (NextAuth)** for authentication.

**Current mission:** Convert this static platform into a **dynamic, professional-grade** platform.

---

## 2. UI/UX Library — Hard Constraints

### 2.1 Only shadcn/ui

- The **only** UI component library allowed is **shadcn/ui** (`@shadcn/ui`).
- **Do NOT** install or use any other UI framework or component library (e.g., Material UI, Chakra, Ant Design, Mantine, Radix primitives directly, Headless UI, DaisyUI, etc.).
- shadcn/ui components live in `components/ui/` and are added via the shadcn CLI (`npx shadcn@latest add <component>`).
- If a UI pattern is not covered by shadcn, build a **custom component** using only shadcn primitives, Radix (since shadcn uses it internally), and vanilla CSS/Tailwind.

### 2.2 Icons — react-icons & lucide-react Only

- For **all icons** (buttons, navigation, status indicators, decorative, etc.), use one of:
  - `react-icons` — preferred when you need icon packs beyond Lucide (e.g., FontAwesome, Heroicons, Material icons).
  - `lucide-react` — already bundled with shadcn/ui, preferred for consistency within shadcn components.
- **Do NOT** use any other icon library (e.g., `@heroicons/react` standalone, `phosphor-react`, `tabler-icons`, inline SVGs for standard icons).
- Always import icons explicitly (tree-shake): `import { FiHome } from "react-icons/fi"` not `import * as Icons from "react-icons"`.

### 2.3 Styling

- Use **Tailwind CSS** (already installed) for utility styling — this is the standard with shadcn/ui.
- Use the shadcn theming system (`globals.css` CSS variables) for colors, radii, and spacing tokens.
- Do NOT introduce a separate CSS-in-JS solution (styled-components, emotion, etc.).

---

## 3. Package Management — Check Before You Install

Before installing **any** new npm package:

1. **Check `package.json`** — does an existing dependency already solve this?
2. **Check shadcn/ui** — does shadcn already provide this component or utility?
3. **Check built-in Next.js features** — does Next.js already handle this (e.g., `next/image`, `next/font`, `next/link`, API routes, server actions)?
4. **Check native browser/Web APIs** — can this be done without a package at all?

Only install a new package if **none of the above** apply. When you do install, justify it in a comment or commit message.

---

## 4. Project Architecture — Standard Structure

### 4.1 Directory Layout

Follow this canonical structure. Create directories as needed:

```
app/                          # Next.js App Router pages & layouts
├── (auth)/                   # Auth-related routes (login, register, etc.)
├── (dashboard)/              # Teacher/admin dashboard routes
├── game/                     # Public game-playing routes
├── api/                      # API route handlers
│   └── [resource]/
│       └── route.ts
├── layout.tsx
├── page.tsx
└── globals.css

components/                   # Reusable React components
├── ui/                       # shadcn/ui components (auto-generated)
├── shared/                   # App-wide shared components (Navbar, Footer, etc.)
├── game/                     # Game-specific components
├── dashboard/                # Dashboard-specific components
└── forms/                    # Reusable form components

lib/                          # Core utilities & configuration
├── config.ts                 # App configuration
├── utils.ts                  # General utility/helper functions
├── constants.ts              # App-wide constants
└── validators.ts             # Zod schemas / validation logic

services/                     # Business logic layer (one file per DB table/domain)
├── game.service.ts           # CRUD & business logic for `games` table
├── scenario.service.ts       # CRUD for `scenarios` table
├── choice.service.ts         # CRUD for `choices` table
├── session.service.ts        # CRUD for `game_sessions` table
├── user.service.ts           # CRUD for `users` table
└── analytics.service.ts      # Stats, aggregations, dashboard data

actions/                      # Next.js Server Actions (thin wrappers)
├── game.actions.ts
├── scenario.actions.ts
├── session.actions.ts
└── auth.actions.ts

types/                        # TypeScript type definitions
├── database.ts               # DB row types (mirroring schema.sql)
├── api.ts                    # API request/response types
└── game.ts                   # Game domain types

hooks/                        # Custom React hooks
├── use-game.ts
├── use-debounce.ts
└── ...

helpers/                      # Pure utility functions used across layers
├── format.ts                 # Date, number, string formatting
├── score.ts                  # Score calculation helpers
└── slug.ts                   # Slug generation
```

### 4.2 Data Flow — The Service Pattern

```
Component → Server Action (or API Route) → Service → Database (Supabase)
```

- **Components** call **Server Actions** or fetch from **API Routes**. They never talk to the database directly.
- **Server Actions / API Routes** are thin — they validate input, call the appropriate **Service**, and return the result.
- **Services** contain all business logic and database queries. One service per database table or logical domain.
- **Services** are the **only** layer that imports the Supabase client and runs queries.

**Why:** Single source of truth for data access. If the query changes, you fix it in one place.

### 4.3 DRY — Utilities & Helpers

- If a function is used **more than once** across different files, extract it into `helpers/` or `lib/utils.ts`.
- If a React pattern repeats (e.g., loading states, error boundaries), create a **custom hook** in `hooks/` or a **shared component** in `components/shared/`.
- Never copy-paste logic between files. Factor it out immediately.

---

## 5. UX Philosophy — "The User is Lazy and Stupid"

> This is a **design assumption**, not a judgment. We design for the worst case so every user has the best experience.

### 5.1 Core Principles

| Principle | Implementation |
|---|---|
| **Zero cognitive load** | Labels, placeholders, and tooltips explain everything. No jargon. |
| **Forgiving inputs** | Auto-trim, auto-format, generous validation. Show inline errors instantly, not after submit. |
| **Safe defaults** | Pre-fill sensible defaults. Never let a blank form confuse the user. |
| **Undo over confirm** | Prefer "Undo" toasts over "Are you sure?" dialogs whenever possible. |
| **Progressive disclosure** | Show only what's needed now. Advanced options are collapsed/hidden by default. |
| **Instant feedback** | Every click/action produces immediate visual feedback (loading spinners, skeleton states, optimistic UI). |
| **No dead ends** | Every error state has a clear recovery action ("Try again", "Go back", "Contact support"). |
| **Guide, don't assume** | Use empty states with clear CTAs ("Create your first game →") instead of blank pages. |

### 5.2 Loading & Error States

- **Every** data-fetching component must have:
  - A **loading/skeleton** state (use shadcn `Skeleton` component).
  - An **error** state with a human-readable message and a retry action.
  - An **empty** state with a helpful CTA.
- Never show a blank screen. Ever.

### 5.3 Forms

- Use `react-hook-form` + `zod` for all forms (both are shadcn-compatible).
- Show validation errors **inline** next to the field, in real-time.
- Disable the submit button while submitting; show a spinner.
- On success, show a toast (shadcn `Sonner` or `Toast`); on error, show an inline alert.

### 5.4 Accessibility

- All interactive elements must be keyboard-navigable.
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<section>`, not `<div onClick>`).
- All images/icons must have `alt` text or `aria-label`.
- Color contrast must meet WCAG AA standards.

---

## 6. Responsive Design — All Screens

**Every screen must be fully responsive across all breakpoints:**

| Breakpoint | Target | Tailwind Prefix |
|---|---|---|
| < 640px | Mobile phones | (default / `sm:`) |
| 640px – 1024px | Tablets | `md:` |
| 1024px – 1280px | Laptops / Desktops | `lg:` |
| 1280px – 1536px | Large monitors | `xl:` |
| > 1536px | TV / Data show / Projectors | `2xl:` |

### 6.1 Rules

- **Mobile-first**: Write styles for mobile by default, then layer on `sm:`, `md:`, `lg:`, `xl:`, `2xl:` overrides.
- **No horizontal scrolling** on any screen size.
- **Touch targets**: Minimum 44×44px for all interactive elements on mobile.
- **Navigation**: Use a collapsible sidebar or hamburger menu on mobile; full sidebar on desktop.
- **Tables**: Use horizontal scroll wrappers or card-based layouts on mobile — never let tables overflow the viewport.
- **Typography**: Scale font sizes appropriately. Body text min 16px on mobile, headings scale up on larger screens.
- **Test every page** at all five breakpoints before considering it done.

---

## 7. Code Quality Standards

### 7.1 TypeScript

- **Strict mode** — no `any` types. Ever. Use `unknown` + type guards if the type is truly unknown.
- Define all types in the `types/` directory, not inline.
- Use `interface` for object shapes that might be extended; `type` for unions, intersections, and aliases.

### 7.2 Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files (components) | PascalCase | `GameCard.tsx` |
| Files (utilities) | kebab-case | `format-date.ts` |
| Files (services) | kebab-case with `.service` | `game.service.ts` |
| Files (actions) | kebab-case with `.actions` | `game.actions.ts` |
| Functions | camelCase | `calculateScore()` |
| React Components | PascalCase | `GameCard` |
| Types / Interfaces | PascalCase | `GameSession` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_SCENARIOS` |
| CSS variables | kebab-case | `--primary-color` |
| Database columns | snake_case | `player_name` |

### 7.3 Error Handling

- Wrap all async operations in try/catch.
- Services return typed result objects: `{ data, error }` — never throw to the caller.
- Log errors with context (which service, which operation, which ID).
- User-facing error messages must be human-friendly, never raw error strings.

### 7.4 Comments & Documentation

- **Do NOT** remove existing comments or docstrings unless they are factually wrong.
- Add JSDoc comments to all exported functions and components.
- Complex business logic should have inline comments explaining **why**, not **what**.

---

## 8. Database & Backend Rules

- The database is **Supabase (Postgres)**. Schema is defined in `schema.sql`.
- Use the **Supabase JS client** for all queries (not raw SQL from the app).
- All database access goes through the **service layer** (see §4.2).
- Use **Server Actions** for mutations (create, update, delete).
- Use **API Routes** only when a Server Action is not appropriate (e.g., webhook handlers, external integrations).
- Validate all input with **Zod** before it hits the database.
- Use **parameterized queries** — never concatenate user input into query strings.

---

## 9. Performance

- Use `next/image` for all images (automatic optimization, lazy loading).
- Use `next/font` for font loading (no layout shift).
- Use `React.lazy` / `dynamic()` for heavy components not needed at initial load.
- Minimize client-side JavaScript — prefer Server Components unless interactivity is required.
- Cache frequently-read data with Next.js caching / `unstable_cache` where appropriate.

---

## 10. Quick Reference — What NOT to Do

| ❌ Don't | ✅ Do Instead |
|---|---|
| Install a new UI library | Use shadcn/ui components |
| Use random icon packages | Use `react-icons` or `lucide-react` |
| Query the DB from a component | Call a Server Action → Service |
| Copy-paste logic between files | Extract to `helpers/` or `hooks/` |
| Use `any` type | Define proper types in `types/` |
| Leave a page without loading state | Add Skeleton / Spinner / Error / Empty states |
| Build desktop-only layouts | Mobile-first, test all breakpoints |
| Show raw error messages to users | Catch errors, display friendly messages |
| Install packages without checking | Verify existing deps & built-in alternatives first |
| Use `<div onClick>` for buttons | Use `<button>` or shadcn `Button` |

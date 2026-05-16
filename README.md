# Career Pilot 🚀

An AI-powered job search management platform built with React, TypeScript, and Supabase. Career Pilot centralizes the entire job hunting workflow — from tracking applications on a visual Kanban board to tailoring resumes with AI-powered suggestions.

**[Live Demo](https://career-pilot-six.vercel.app/)**

---

## Features

### 📌 Job Application Tracker
Visual Kanban board with drag-and-drop support across five pipeline stages: Saved, Applied, Interviewing, Offer, and Rejected. Each job card supports inline editing, notes, application dates, and linked resume versions.

### 🧠 AI Job Description Analyzer
Paste any job description to receive a structured breakdown powered by the Groq API (Llama 3.3 70B). Extracts required skills, key responsibilities, ATS keywords, and potential resume gaps.

### ✍️ AI Resume Tailor
Select a saved resume and a job posting to receive AI-generated bullet point improvements, missing keyword suggestions, and role-specific recommendations optimized for ATS matching.

### 🗂 Resume Management
Create and manage multiple resume versions with custom labels and tags. Associate resume versions with specific job applications for organized, targeted applications.

### 📊 Analytics Dashboard
At-a-glance metrics including total applications, interview rate, offer rate, status breakdown with progress bars, and application activity over time — all powered by Recharts.

---

## Tech Stack

**Frontend**
- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router v7](https://reactrouter.com/) — client-side routing
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) — global state management
- [TanStack Query](https://tanstack.com/query) — server state and caching
- [dnd-kit](https://dndkit.com/) — accessible drag-and-drop
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Recharts](https://recharts.org/) — data visualization

**Backend / BaaS**
- [Supabase](https://supabase.com/) — PostgreSQL, authentication, and REST API
- Row Level Security (RLS) policies for per-user data isolation

**AI**
- [Groq API](https://console.groq.com/) (Llama 3.3 70B) — job description analysis and resume tailoring

**Hosting**
- [Vercel](https://vercel.com/) — frontend deployment with CI/CD via GitHub

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com/) account
- A [Groq](https://console.groq.com/) API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/c-saylor/career-pilot.git
   cd career-pilot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
   VITE_GROQ_API_KEY=your_groq_api_key
   ```

4. Set up the Supabase database by creating two tables:

   **job_applications**
   | Column | Type |
   |--------|------|
   | id | uuid (PK) |
   | created_at | timestamptz |
   | user_id | uuid |
   | company | text |
   | role | text |
   | url | text |
   | status | text |
   | notes | text |
   | date_applied | date |
   | job_description | text |
   | resume_id | uuid |

   **resumes**
   | Column | Type |
   |--------|------|
   | id | uuid (PK) |
   | created_at | timestamptz |
   | user_id | uuid |
   | title | text |
   | content | text |
   | tags | text |

5. Enable Row Level Security on both tables with authenticated user policies.

6. Start the development server:
   ```bash
   npm run dev
   ```

---

## Project Structure

```
src/
├── components/
│   ├── ai/               # AI analyzer and resume tailor components
│   ├── kanban/           # Kanban board, columns, job cards, and modal
│   ├── resumes/          # Resume card and modal components
│   └── ProtectedRoute.tsx
│   └── Layout.tsx
├── hooks/
│   ├── useJobs.ts        # React Query hooks for job CRUD
│   └── useResumes.ts     # React Query hooks for resume CRUD
├── lib/
│   ├── supabase.ts       # Supabase client
│   ├── auth.ts           # Auth helpers
│   └── groq.ts           # Groq API integration
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── ResumesPage.tsx
│   ├── AIPage.tsx
│   └── AnalyticsPage.tsx
├── stores/
│   └── useAppStore.ts    # Zustand global store
└── types/
    └── index.ts          # Shared TypeScript interfaces
```

---

## Deployment

This project is deployed on Vercel with automatic deployments triggered by pushes to `main`.

To deploy your own instance:
1. Fork this repository
2. Import the project into [Vercel](https://vercel.com/)
3. Add the three environment variables in the Vercel project settings
4. Deploy

---

## Roadmap

- [ ] Cover letter generation via AI
- [ ] Export applications to CSV
- [ ] Email reminders for follow-ups
- [ ] Resume PDF upload support
- [ ] Dark/light mode toggle

---

## License

MIT

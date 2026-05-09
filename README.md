# Department Research Publications Dashboard

React + Vite dashboard for managing English Department research publications.

## Local Development

```bash
npm install
npm run dev
```

## Supabase Environment Variables

Create `.env.local` locally, and add the same variables in Vercel:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

The app reads and writes publication data from the `research_publications` table.

## Build

```bash
npm run build
```

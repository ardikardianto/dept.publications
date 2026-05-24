# English Department Publications Dashboard

A React dashboard for presenting, browsing, and managing English Department research publication data. The app was built for the Universitas Terbuka English Department, but the structure is intentionally simple enough to adapt for another department, faculty, or research unit.

The dashboard has two main modes:

- Public mode for visitors who only need to view publication summaries, charts, and article details.
- Admin mode for authenticated users who need to add, edit, delete, import, and export publication records.

It also includes a safe demo account for presentations. Demo mode uses local dummy data only and does not alter Supabase data.

## Features

- Public landing page with department publication overview.
- Overview dashboard with publication metrics, author count, five-year trend, field chart, and journal index bubble chart.
- Publications table with search, filters, sorting, and article detail pop-up.
- Admin dashboard with add, edit, delete, XLSX import, and XLSX export.
- Public article submission form with applicant name and publication details.
- Admin submission review page for approving or rejecting pending records before publication.
- Supabase integration using the `research_publications` table.
- Safe demo mode for presentations.
- Responsive desktop and mobile layout.
- Browser title and favicon customized for English Department Publications.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Recharts
- Framer Motion
- Supabase REST API
- `read-excel-file` for XLSX import
- `write-excel-file` for XLSX export

## Project Structure

```text
.
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── ResearchDashboard.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── README.md
```

Most of the application logic is currently in `src/ResearchDashboard.jsx`. If you want to expand this into a larger project, that file is the best place to start splitting components into separate files.

## Requirements

- Node.js 18 or newer
- npm
- A Supabase project, if you want persistent database storage
- A Vercel account, if you want to deploy using Vercel

## Quick Start

Clone the repository:

```bash
git clone https://github.com/ardikardianto/dept.publications.git
cd dept.publications
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Demo Account

The app includes a presentation-safe demo account:

```text
Email: demo@ut.ac.id
Password: demo123
```

You can also click the `Use demo account` button on the login page.

Demo mode loads local dummy publications and pending submissions. It allows local add, edit, delete, import, export, approve, and reject behavior. These changes stay in the browser session and do not write to Supabase.

## Environment Variables

Create `.env.local` for local development:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
```

The same values must be added to your deployment platform, such as Vercel.

Do not commit `.env.local`.

## Supabase Setup

Create a Supabase table named:

```text
research_publications
```

Recommended SQL:

```sql
create table if not exists public.research_publications (
  id uuid primary key default gen_random_uuid(),
  authors text not null default '',
  title text not null,
  journal text not null,
  field text not null default 'Linguistics',
  year integer not null,
  publication_index text not null default 'Non-Sinta',
  url text default '',
  created_at timestamptz not null default now()
);
```

Create a second table for public submissions:

```text
publication_submissions
```

Recommended SQL:

```sql
create table if not exists public.publication_submissions (
  id uuid primary key default gen_random_uuid(),
  applicant_name text not null,
  authors text not null default '',
  title text not null,
  journal text not null,
  field text not null default 'Linguistics',
  year integer not null,
  publication_index text not null default 'Non-Sinta',
  url text default '',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz
);
```

The app maps Supabase columns into UI fields like this:

```text
authors             -> Authors
title               -> Title
journal             -> Journal
field               -> Field
year                -> Year
publication_index   -> Index
url                 -> Article Link
```

The submission table uses the same publication fields, plus:

```text
applicant_name      -> Applicant name for admin review
status              -> pending, approved, or rejected
submitted_at        -> Submission timestamp
reviewed_at         -> Approval/rejection timestamp
```

## Row Level Security

Enable Row Level Security for the table:

```sql
alter table public.research_publications enable row level security;
alter table public.publication_submissions enable row level security;
```

Allow public read access:

```sql
create policy "Allow public read access"
on public.research_publications
for select
using (true);
```

Allow authenticated users to insert, update, and delete:

```sql
create policy "Allow authenticated insert"
on public.research_publications
for insert
to authenticated
with check (true);

create policy "Allow authenticated update"
on public.research_publications
for update
to authenticated
using (true)
with check (true);

create policy "Allow authenticated delete"
on public.research_publications
for delete
to authenticated
using (true);
```

Allow public visitors to submit publication records for review:

```sql
drop policy if exists "Allow public submission insert"
on public.publication_submissions;

create policy "Allow public submission insert"
on public.publication_submissions
for insert
to anon, authenticated
with check (status = 'pending');

grant insert on public.publication_submissions to anon, authenticated;
```

Allow authenticated admins to read and review submissions:

```sql
create policy "Allow authenticated submission read"
on public.publication_submissions
for select
to authenticated
using (true);

create policy "Allow authenticated submission update"
on public.publication_submissions
for update
to authenticated
using (true)
with check (true);
```

For stricter production use, replace the broad authenticated policies with role-based policies tied to specific admin users.

## Supabase Authentication

Admin mode uses Supabase email/password authentication.

In Supabase:

1. Open Authentication.
2. Create a user for the administrator.
3. Confirm the user if email confirmation is enabled.
4. Use that email and password in the app login page.

After login, the admin can manage data through the dashboard.

## XLSX Import Format

The import feature expects an `.xlsx` file with a header row.

Recommended columns:

```text
Authors
Title
Journal
Field
Year
Index
URL
```

Accepted alternatives:

```text
Author
Article Title
Publication Title
Venue
Publication Journal
Theme
Research Field
Publication Year
Indexer
Indexing
Article URL
Link
```

Supported index values:

```text
Scopus
EBSCO
Copernicus
DOAJ
ProQuest
Sinta 2
Sinta 3
Sinta 4
Sinta 5
Sinta 6
Non-Sinta
International Proceedings
National Proceedings
```

Supported fields in the input form:

```text
Linguistics
Literature
Translation
```

## Development Commands

Run the local dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Deploy to Vercel

1. Push the repository to GitHub.
2. Open Vercel and create a new project.
3. Import the GitHub repository.
4. Set the framework preset to Vite if it is not detected automatically.
5. Add environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

6. Deploy.

After deployment, test public pages first, then test admin login, add article, edit article, delete article, import XLSX, and export XLSX.

## Adapting This Project

To develop your own version:

1. Fork or clone the repository.
2. Rename the project in `package.json`.
3. Update the browser title in `index.html`.
4. Replace `public/favicon.svg` with your own icon.
5. Edit the copy, labels, and department name in `src/ResearchDashboard.jsx`.
6. Adjust fields and index categories near the top of `src/ResearchDashboard.jsx`.
7. Create your own Supabase table and update the table name if needed.
8. Add your Supabase environment variables.
9. Deploy to Vercel or another static hosting platform.

The current app uses a single Supabase table for publication records. If your project needs more data types, such as authors, departments, grants, or research groups, consider creating separate tables and moving the data access code into dedicated modules.

## Data Safety Notes

- Public mode only reads data.
- Admin mode writes to Supabase only after a real Supabase login.
- Demo mode never writes to Supabase.
- XLSX import appends rows; it does not replace the existing Supabase table.
- `.env.local` should remain private and is not meant to be committed.

## License

This project is currently maintained for departmental use. Add a license file if you plan to distribute it publicly.

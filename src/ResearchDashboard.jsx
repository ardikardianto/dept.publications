import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { readSheet } from "read-excel-file/browser";
import writeXlsxFile from "write-excel-file/browser";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function IconBase({ children, className = "h-5 w-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

const Icons = {
  award: (p) => <IconBase {...p}><circle cx="12" cy="8" r="6" /><path d="M8.2 13.5 7 22l5-3 5 3-1.2-8.5" /></IconBase>,
  book: (p) => <IconBase {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" /></IconBase>,
  chart: (p) => <IconBase {...p}><path d="M3 3v18h18" /><path d="m7 15 4-4 3 3 5-7" /></IconBase>,
  check: (p) => <IconBase {...p}><path d="m20 6-11 11-5-5" /></IconBase>,
  chevronDown: (p) => <IconBase {...p}><path d="m6 9 6 6 6-6" /></IconBase>,
  edit: (p) => <IconBase {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></IconBase>,
  file: (p) => <IconBase {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h8" /></IconBase>,
  filter: (p) => <IconBase {...p}><path d="M3 5h18M6 12h12M10 19h4" /></IconBase>,
  grant: (p) => <IconBase {...p}><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" /></IconBase>,
  graduation: (p) => <IconBase {...p}><path d="m22 10-10-5-10 5 10 5 10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /><path d="M22 10v6" /></IconBase>,
  home: (p) => <IconBase {...p}><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></IconBase>,
  eye: (p) => <IconBase {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></IconBase>,
  download: (p) => <IconBase {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></IconBase>,
  logOut: (p) => <IconBase {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></IconBase>,
  plus: (p) => <IconBase {...p}><path d="M12 5v14M5 12h14" /></IconBase>,
  search: (p) => <IconBase {...p}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></IconBase>,
  spark: (p) => <IconBase {...p}><path d="M13 2 3 14h8l-1 8 11-14h-8l1-6Z" /></IconBase>,
  trash: (p) => <IconBase {...p}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m19 6-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /></IconBase>,
  upload: (p) => <IconBase {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5" /><path d="M12 3v12" /></IconBase>,
  users: (p) => <IconBase {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></IconBase>,
  x: (p) => <IconBase {...p}><path d="M18 6 6 18M6 6l12 12" /></IconBase>,
};

const themes = ["Linguistics", "Literature", "Translation"];
const articleThemeOptions = themes;
const years = ["2026", "2025", "2024"];
const palette = ["#005baa", "#ffd23f", "#8fb4d8", "#102f52", "#cbb26a", "#aebfd2"];

const initialPublications = [
  { authors: "Mira Suryani; Rafi Mahendra", title: "Automated feedback and learner revision quality", venue: "Journal of Online Language Learning", year: "2026", type: "Scopus", theme: "Linguistics", status: "Accepted", url: "https://scholar.google.com/scholar?q=Automated+feedback+and+learner+revision+quality" },
  { authors: "Ardi Prakoso; Sinta Wulandari", title: "Terminology consistency in translated ODL modules", venue: "Indonesian Translation Review", year: "2026", type: "Sinta 2", theme: "Translation", status: "In press", url: "https://scholar.google.com/scholar?q=Terminology+consistency+in+translated+ODL+modules" },
  { authors: "Dina Kartika; Mira Suryani", title: "Assessment loops in asynchronous tutorials", venue: "Asian EFL Journal", year: "2025", type: "EBSCO", theme: "Linguistics", status: "Published", url: "https://www.asian-efl-journal.com/" },
  { authors: "Rafi Mahendra; Ardi Prakoso", title: "Building a learner essay corpus for distance education", venue: "Digital Humanities Quarterly", year: "2025", type: "DOAJ", theme: "Linguistics", status: "Under review", url: "https://www.digitalhumanities.org/dhq/" },
  { authors: "Sinta Wulandari", title: "Local texts and reading engagement", venue: "Journal of English Education", year: "2024", type: "Sinta 3", theme: "Literature", status: "Published", url: "https://scholar.google.com/scholar?q=Local+texts+and+reading+engagement+Journal+of+English+Education" },
  { authors: "Mira Suryani; Dina Kartika", title: "Tutor talk and student retention signals", venue: "Open Learning Studies", year: "2024", type: "International Proceedings", theme: "Linguistics", status: "Published", url: "https://scholar.google.com/scholar?q=Tutor+talk+and+student+retention+signals+Open+Learning+Studies" },
];

const demoPublications = [
  { authors: "Nadia Putri; Galang Saputra", title: "Digital reading habits in open university English classrooms", venue: "Journal of Distance English Studies", year: "2026", type: "Scopus", theme: "Literature", status: "Published", url: "https://scholar.google.com/scholar?q=Digital+reading+habits+in+open+university+English+classrooms" },
  { authors: "Bima Hartono; Retno Puspita", title: "Machine translation post-editing in academic course materials", venue: "Indonesian Journal of Translation Pedagogy", year: "2026", type: "Sinta 2", theme: "Translation", status: "Published", url: "https://scholar.google.com/scholar?q=Machine+translation+post-editing+in+academic+course+materials" },
  { authors: "Laras Wening; Fajar Aditama", title: "Pronunciation feedback patterns in synchronous tutorials", venue: "Asian Journal of Applied Linguistics", year: "2025", type: "EBSCO", theme: "Linguistics", status: "Published", url: "https://scholar.google.com/scholar?q=Pronunciation+feedback+patterns+in+synchronous+tutorials" },
  { authors: "Maya Saraswati", title: "Women writers and local identity in online literature modules", venue: "Literary Education Review", year: "2025", type: "DOAJ", theme: "Literature", status: "Published", url: "https://scholar.google.com/scholar?q=Women+writers+and+local+identity+in+online+literature+modules" },
  { authors: "Rendra Wijaya; Kania Maheswari", title: "Student corpus errors in argument essay introductions", venue: "Jurnal Linguistik Terapan Indonesia", year: "2024", type: "Sinta 3", theme: "Linguistics", status: "Published", url: "https://scholar.google.com/scholar?q=Student+corpus+errors+in+argument+essay+introductions" },
  { authors: "Dewi Anggraini; Salma Yuliani", title: "Subtitling strategies for cultural references in classroom videos", venue: "Translation and Media Proceedings", year: "2024", type: "International Proceedings", theme: "Translation", status: "Published", url: "https://scholar.google.com/scholar?q=Subtitling+strategies+for+cultural+references+in+classroom+videos" },
  { authors: "Yoga Pratama", title: "Vocabulary growth through mobile-supported extensive reading", venue: "Open Learning Language Journal", year: "2023", type: "ProQuest", theme: "Linguistics", status: "Published", url: "https://scholar.google.com/scholar?q=Vocabulary+growth+through+mobile-supported+extensive+reading" },
  { authors: "Intan Maharani; Putu Wira", title: "Reader response journals in distance literature learning", venue: "Jurnal Pendidikan Bahasa dan Sastra", year: "2023", type: "Sinta 4", theme: "Literature", status: "Published", url: "https://scholar.google.com/scholar?q=Reader+response+journals+in+distance+literature+learning" },
  { authors: "Ari Nugroho; Melati Rahma", title: "Terminology banks for bilingual academic administration", venue: "National Seminar on Applied Translation", year: "2022", type: "National Proceedings", theme: "Translation", status: "Published", url: "https://scholar.google.com/scholar?q=Terminology+banks+for+bilingual+academic+administration" },
];

const demoSubmissions = [
  { id: "demo-submission-1", applicantName: "Citra Lestari", authors: "Citra Lestari; Raka Pradana", title: "AI-assisted peer review in online writing tutorials", venue: "Journal of Open English Pedagogy", year: "2026", type: "Sinta 2", theme: "Linguistics", status: "pending", url: "https://scholar.google.com/scholar?q=AI-assisted+peer+review+in+online+writing+tutorials", submittedAt: "2026-05-18T08:00:00.000Z" },
  { id: "demo-submission-2", applicantName: "Bagas Maulana", authors: "Bagas Maulana", title: "Translating cultural humor in student subtitle projects", venue: "Translation Classroom Review", year: "2025", type: "DOAJ", theme: "Translation", status: "pending", url: "https://scholar.google.com/scholar?q=Translating+cultural+humor+in+student+subtitle+projects", submittedAt: "2026-05-20T08:00:00.000Z" },
];

const nav = [
  { id: "dashboard", label: "Dashboard", icon: Icons.chart },
  { id: "publications", label: "Publications", icon: Icons.book },
  { id: "submissions", label: "Submissions", icon: Icons.file },
];

const publicationIndexes = ["Scopus", "EBSCO", "Copernicus", "DOAJ", "ProQuest", "Sinta 2", "Sinta 3", "Sinta 4", "Sinta 5", "Sinta 6", "Non-Sinta", "International Proceedings", "National Proceedings"];
const internationalJournalIndexes = ["Scopus", "EBSCO", "Copernicus", "DOAJ", "ProQuest"];
const nationalJournalIndexes = ["Sinta 2", "Sinta 3", "Sinta 4", "Sinta 5", "Sinta 6"];
const publicationColumns = ["Authors", "Title", "Journal", "Field", "Year", "Index", "URL"];
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const SUPABASE_TOKEN_KEY = "ut_research_supabase_access_token";
const SUPABASE_USER_KEY = "ut_research_user_email";
const DEMO_SESSION_KEY = "ut_research_demo_session";
const DEMO_EMAIL = "demo@ut.ac.id";
const DEMO_PASSWORD = "demo123";
const RESEARCH_PUBLICATIONS_TABLE = "research_publications";
const PUBLICATION_SUBMISSIONS_TABLE = "publication_submissions";

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function includes(value, query) {
  return String(value || "").toLowerCase().includes(String(query || "").toLowerCase());
}

function splitAuthors(authors) {
  const text = String(authors || "").trim();
  if (!text) return [];
  const primaryParts = text.split(/\s*(?:;|\|)\s*/).filter(Boolean);
  const parts = primaryParts.length > 1 ? primaryParts : text.split(/\s+(?:and|&)\s+/i).filter(Boolean);
  const finalParts = parts.length > 1 ? parts : text.split(/\s*,\s*/).filter(Boolean);
  return finalParts.map((name) => name.trim()).filter(Boolean);
}

function uniqueAuthorCount(items) {
  return new Set(items.flatMap((item) => splitAuthors(item.authors)).map((name) => name.toLowerCase())).size;
}

function countIndexes(items, indexNames) {
  return indexNames.map((name) => ({
    name,
    value: items.filter((item) => item.type === name).length,
  }));
}

function publicationTrendData(items) {
  const yearCounts = items.reduce((counts, item) => {
    const year = Number(item.year);
    if (Number.isFinite(year)) counts.set(year, (counts.get(year) || 0) + 1);
    return counts;
  }, new Map());
  const currentYear = new Date().getFullYear();
  const dataYears = [...yearCounts.keys()];
  const endYear = dataYears.length ? Math.max(currentYear, ...dataYears) : currentYear;
  const startYear = endYear - 4;
  return Array.from({ length: 5 }, (_, index) => {
    const year = startYear + index;
    return { year: String(year), publications: yearCounts.get(year) || 0 };
  });
}

function createPublicationId() {
  return globalThis.crypto?.randomUUID?.() || `publication-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ensurePublicationId(item) {
  return { ...item, id: item.id || createPublicationId() };
}

function publicationIdentity(item) {
  return item.id || `${item.authors || ""}__${item.title || ""}__${item.venue || ""}__${item.year || ""}`;
}

function publicationUrl(item) {
  if (item.url) return item.url;
  const query = encodeURIComponent(`"${item.title}" "${item.venue}"`);
  return `https://scholar.google.com/scholar?q=${query}`;
}

function getAccessToken() {
  return localStorage.getItem(SUPABASE_TOKEN_KEY) || "";
}

function supabaseHeaders({ preferReturn = false } = {}) {
  const token = getAccessToken() || SUPABASE_ANON_KEY;
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(preferReturn ? { Prefer: "return=representation" } : {}),
  };
}

async function supabaseRequest(path, options = {}) {
  if (!USE_SUPABASE) throw new Error("Supabase is not configured.");
  const response = await fetch(`${SUPABASE_URL}${path}`, options);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.message || data?.msg || data?.error_description || "Supabase request failed.");
    error.status = response.status;
    throw error;
  }
  return data;
}

function dbToPublication(row) {
  return ensurePublicationId({
    id: row.id,
    authors: row.authors || "",
    title: row.title || "",
    venue: row.journal || "",
    theme: row.field || themes[0],
    year: String(row.year || ""),
    type: row.publication_index || publicationIndexes[0],
    status: "Published",
    url: row.url || "",
  });
}

function publicationToDb(item) {
  return {
    authors: item.authors || "",
    title: item.title || "",
    journal: item.venue || "",
    field: item.theme || themes[0],
    year: Number(item.year) || new Date().getFullYear(),
    publication_index: item.type || publicationIndexes[0],
    url: item.url || "",
  };
}

async function fetchResearchPublications() {
  const rows = await supabaseRequest(`/rest/v1/${RESEARCH_PUBLICATIONS_TABLE}?select=*&order=year.desc,title.asc`, {
    method: "GET",
    headers: supabaseHeaders(),
  });
  return Array.isArray(rows) ? rows.map(dbToPublication) : [];
}

async function insertResearchPublication(article) {
  const rows = await supabaseRequest(`/rest/v1/${RESEARCH_PUBLICATIONS_TABLE}`, {
    method: "POST",
    headers: supabaseHeaders({ preferReturn: true }),
    body: JSON.stringify(publicationToDb(article)),
  });
  return dbToPublication(rows[0]);
}

async function updateResearchPublication(id, article) {
  const rows = await supabaseRequest(`/rest/v1/${RESEARCH_PUBLICATIONS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: supabaseHeaders({ preferReturn: true }),
    body: JSON.stringify(publicationToDb(article)),
  });
  return dbToPublication(rows[0]);
}

async function deleteResearchPublication(id) {
  await supabaseRequest(`/rest/v1/${RESEARCH_PUBLICATIONS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: supabaseHeaders(),
  });
}

async function appendResearchPublications(articles) {
  if (!articles.length) return [];
  const rows = await supabaseRequest(`/rest/v1/${RESEARCH_PUBLICATIONS_TABLE}`, {
    method: "POST",
    headers: supabaseHeaders({ preferReturn: true }),
    body: JSON.stringify(articles.map(publicationToDb)),
  });
  return Array.isArray(rows) ? rows.map(dbToPublication) : [];
}

function dbToSubmission(row) {
  return {
    id: row.id,
    applicantName: row.applicant_name || "",
    authors: row.authors || "",
    title: row.title || "",
    venue: row.journal || "",
    theme: row.field || themes[0],
    year: String(row.year || ""),
    type: row.publication_index || publicationIndexes[0],
    status: row.status || "pending",
    url: row.url || "",
    submittedAt: row.submitted_at || "",
    reviewedAt: row.reviewed_at || "",
  };
}

function submissionToDb(item, status = "pending") {
  return {
    applicant_name: item.applicantName || "",
    authors: item.authors || "",
    title: item.title || "",
    journal: item.venue || "",
    field: item.theme || themes[0],
    year: Number(item.year) || new Date().getFullYear(),
    publication_index: item.type || publicationIndexes[0],
    url: item.url || "",
    status,
  };
}

async function fetchPublicationSubmissions() {
  const rows = await supabaseRequest(`/rest/v1/${PUBLICATION_SUBMISSIONS_TABLE}?select=*&order=submitted_at.desc,title.asc`, {
    method: "GET",
    headers: supabaseHeaders(),
  });
  return Array.isArray(rows) ? rows.map(dbToSubmission) : [];
}

async function insertPublicationSubmission(submission) {
  await supabaseRequest(`/rest/v1/${PUBLICATION_SUBMISSIONS_TABLE}`, {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify(submissionToDb(submission)),
  });
  return {
    ...submission,
    id: createPublicationId(),
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
}

async function updatePublicationSubmissionStatus(id, status) {
  const rows = await supabaseRequest(`/rest/v1/${PUBLICATION_SUBMISSIONS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: supabaseHeaders({ preferReturn: true }),
    body: JSON.stringify({ status, reviewed_at: new Date().toISOString() }),
  });
  return dbToSubmission(rows[0]);
}

async function signIn(email, password) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.msg || "Login failed.");
  localStorage.setItem(SUPABASE_TOKEN_KEY, data.access_token);
  localStorage.setItem(SUPABASE_USER_KEY, data.user?.email || email);
  return data.user?.email || email;
}

function signOut() {
  localStorage.removeItem(SUPABASE_TOKEN_KEY);
  localStorage.removeItem(SUPABASE_USER_KEY);
  localStorage.removeItem(DEMO_SESSION_KEY);
}

function getStoredUserEmail() {
  if (localStorage.getItem(DEMO_SESSION_KEY) === "true") return DEMO_EMAIL;
  return USE_SUPABASE && getAccessToken() ? localStorage.getItem(SUPABASE_USER_KEY) || "" : "";
}

function indexTone(index) {
  const value = String(index || "").toLowerCase();
  if (value === "scopus" || value === "doaj") return "green";
  if (value === "ebsco" || value === "proquest") return "blue";
  if (value === "copernicus" || value.includes("proceedings")) return "amber";
  if (value.includes("sinta")) return value.includes("non") ? "red" : "slate";
  return "blue";
}

function isNationalJournalIndex(index) {
  return ["Sinta 2", "Sinta 3", "Sinta 4", "Sinta 5", "Sinta 6"].includes(index);
}

function isInternationalJournalIndex(index) {
  return ["Scopus", "EBSCO", "Copernicus", "DOAJ", "ProQuest"].includes(index);
}

function canonicalIndex(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return publicationIndexes[0];
  const exact = publicationIndexes.find((item) => item.toLowerCase() === normalized);
  if (exact) return exact;
  if (normalized.includes("scopus")) return "Scopus";
  if (normalized.includes("ebsco")) return "EBSCO";
  if (normalized.includes("copernicus")) return "Copernicus";
  if (normalized.includes("doaj")) return "DOAJ";
  if (normalized.includes("proquest") || normalized.includes("pro quest")) return "ProQuest";
  if (normalized.includes("international") && normalized.includes("proceed")) return "International Proceedings";
  if (normalized.includes("national") && normalized.includes("proceed")) return "National Proceedings";
  if (normalized.includes("non") && normalized.includes("sinta")) return "Non-Sinta";
  const sintaMatch = normalized.match(/sinta\s*([2-6])/);
  if (sintaMatch) return `Sinta ${sintaMatch[1]}`;
  return "Non-Sinta";
}

function publicationToRow(item) {
  return {
    Authors: item.authors || "",
    Title: item.title || "",
    Journal: item.venue || "",
    Field: item.theme || "",
    Year: item.year || "",
    Index: item.type || "",
    URL: item.url || "",
  };
}

function rowValue(row, keys) {
  const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [String(key).trim().toLowerCase(), value]));
  const found = keys.find((key) => normalized[key.toLowerCase()] !== undefined);
  return found ? String(normalized[found.toLowerCase()] || "").trim() : "";
}

function rowToPublication(row) {
  const title = rowValue(row, ["Title", "Article Title", "Publication Title"]);
  const venue = rowValue(row, ["Journal", "Venue", "Publication Journal"]);
  if (!title || !venue) return null;
  return {
    authors: rowValue(row, ["Authors", "Author"]),
    title,
    venue,
    theme: rowValue(row, ["Theme", "Field", "Research Field"]) || themes[0],
    year: rowValue(row, ["Year", "Publication Year"]) || String(new Date().getFullYear()),
    type: canonicalIndex(rowValue(row, ["Index", "Indexer", "Indexing"])),
    status: "Published",
    url: rowValue(row, ["URL", "Url", "Link", "Article URL"]),
  };
}

async function exportPublicationsToXLSX(items) {
  const rows = [
    publicationColumns,
    ...items.map((item) => {
      const row = publicationToRow(item);
      return publicationColumns.map((column) => row[column] || "");
    }),
  ];
  await writeXlsxFile(rows).toFile(`UT_English_Publications_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

function Card({ children, className = "", variant = "default" }) {
  // One restrained surface for everything; the loud pastel deck is gone.
  const variants = {
    default: "border-[var(--border)] bg-[var(--surface)]",
    sky: "border-[var(--border)] bg-[var(--surface)]",
    mint: "border-[var(--border)] bg-[var(--surface)]",
    lemon: "border-[var(--border)] bg-[var(--surface)]",
    peach: "border-[var(--border)] bg-[var(--surface)]",
    lavender: "border-[var(--border)] bg-[var(--surface)]",
    rose: "border-[var(--border)] bg-[var(--surface)]",
    lightBlue: "border-[var(--border)] bg-[var(--surface-soft)]",
    neutral: "border-[var(--border)] bg-[var(--surface)]",
  };
  return <div className={`rounded-2xl border shadow-[0_1px_2px_rgba(16,47,82,0.04)] ${variants[variant] || variants.default} ${className}`}>{children}</div>;
}

function Badge({ children, tone = "blue" }) {
  const tones = {
    amber: "bg-[var(--gold-soft)] text-[#7a5a12]",
    blue: "bg-[var(--accent-soft)] text-[var(--accent)]",
    green: "bg-[#e7f0e9] text-[#356048]",
    red: "bg-[#f5e6e3] text-[#9a4338]",
    slate: "bg-[#ece9e2] text-[var(--ink-soft)]",
  };
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tones[tone] || tones.blue}`}>{children}</span>;
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
    secondary: "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--surface-soft)]",
    ghost: "bg-transparent text-[var(--ink-soft)] hover:bg-[var(--accent-soft)]",
  };
  return <button className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props}>{children}</button>;
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="space-y-1.5">
      <span className="eyebrow">{label}</span>
      <div className="relative">
        <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full appearance-none rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 pr-9 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--accent)]">
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <Icons.chevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[var(--ink-muted)]" />
      </div>
    </label>
  );
}

function TextSearch({ value, onChange, placeholder }) {
  return (
    <label className="flex h-11 items-center gap-3 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 transition-colors focus-within:border-[var(--accent)]">
      <Icons.search className="h-4 w-4 text-[var(--ink-muted)]" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]" />
    </label>
  );
}

function Stat({ label, value, note, icon: Icon, tone = "blue" }) {
  const iconStyles = {
    amber: "bg-[var(--gold-soft)] text-[#7a5a12]",
    blue: "bg-[var(--accent-soft)] text-[var(--accent)]",
    green: "bg-[#e7f0e9] text-[#356048]",
    red: "bg-[#f5e6e3] text-[#9a4338]",
    slate: "bg-[#ece9e2] text-[var(--ink-soft)]",
  };
  return (
    <Card className="p-5">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconStyles[tone] || iconStyles.blue}`}>
        <Icon className="h-[1.05rem] w-[1.05rem]" />
      </span>
      <p className="display mt-4 text-[2.5rem] leading-none text-[var(--ink)]">{value}</p>
      <p className="mt-2 text-sm font-medium text-[var(--ink)]">{label}</p>
      {note && <p className="mt-0.5 text-xs leading-5 text-[var(--ink-muted)]">{note}</p>}
    </Card>
  );
}

function BubbleLabel({ x, y, title, value, radius, light = false, kind = "child" }) {
  const keepOneLine = /^Sinta\s+\d$/i.test(title) || title.length <= 11;
  const words = title.split(" ");
  const lines = keepOneLine || words.length === 1 ? [title] : [words[0], words.slice(1).join(" ")];
  const labelSize = Math.max(10.5, Math.min(kind === "anchor" ? 16 : 14, radius * 0.24));
  const valueSize = kind === "anchor"
    ? Math.max(7, Math.min(12, radius * 0.14))
    : Math.max(9, Math.min(11.5, radius * 0.2));
  const firstDy = lines.length > 1 ? -(labelSize * 0.72) : -(labelSize * 0.42);
  const fill = light ? "#ffffff" : "#102f52";
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={fill} fontFamily="Inter, ui-sans-serif, system-ui">
      {lines.map((line, index) => (
        <tspan key={line} x={x} dy={index === 0 ? firstDy : labelSize * 1.12} fontSize={labelSize} fontWeight="800">
          {line}
        </tspan>
      ))}
      <tspan x={x} dy={labelSize * 1.45} fontSize={valueSize} fontWeight="700">{value}</tspan>
    </text>
  );
}

function JournalBubbleChart({ publications }) {
  const internationalItems = countIndexes(publications, internationalJournalIndexes).filter((item) => item.value);
  const nationalItems = countIndexes(publications, nationalJournalIndexes).filter((item) => item.value);
  const internationalTotal = internationalItems.reduce((sum, item) => sum + item.value, 0);
  const nationalTotal = nationalItems.reduce((sum, item) => sum + item.value, 0);
  const indexedTotal = internationalTotal + nationalTotal;
  const internationalPositions = [
    { x: 688, y: 292 }, { x: 724, y: 176 }, { x: 560, y: 322 }, { x: 538, y: 72 }, { x: 672, y: 58 },
  ];
  const nationalPositions = [
    { x: 110, y: 100 }, { x: 104, y: 256 }, { x: 302, y: 112 }, { x: 312, y: 354 }, { x: 164, y: 372 },
  ];
  const childColors = ["#dbe6f1", "#f3e7c2", "#cdd9e6", "#e4ebf2", "#eef1f5"];
  const childRadius = (value) => Math.min(48, 31 + value * 2.4);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-soft)]">
      <svg viewBox="0 0 820 430" className="h-full min-h-[22rem] w-full" role="img" aria-label={`Bubble chart with ${internationalTotal} international journals and ${nationalTotal} national journals`}>
        <title>Journal index bubble chart</title>
        <defs>
          <marker id="bubble-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#315577" />
          </marker>
        </defs>

        <path d="M474 176 C506 142 520 134 534 130" fill="none" stroke="#315577" strokeWidth="2.4" strokeLinecap="round" markerEnd="url(#bubble-arrow)" />
        <path d="M346 252 C324 276 306 287 294 292" fill="none" stroke="#315577" strokeWidth="2.4" strokeLinecap="round" markerEnd="url(#bubble-arrow)" />

        {internationalItems.map((item, index) => {
          const point = internationalPositions[index % internationalPositions.length];
          return (
            <g key={item.name}>
              <line x1="610" y1="126" x2={point.x} y2={point.y} stroke="#8da7bf" strokeWidth="1.8" strokeDasharray="4 5" opacity="0.8" />
              <circle cx={point.x} cy={point.y} r={childRadius(item.value)} fill={childColors[index % childColors.length]} opacity="0.94" />
              <BubbleLabel x={point.x} y={point.y} title={item.name} value={item.value} radius={childRadius(item.value)} />
            </g>
          );
        })}

        {nationalItems.map((item, index) => {
          const point = nationalPositions[index % nationalPositions.length];
          return (
            <g key={item.name}>
              <line x1="218" y1="300" x2={point.x} y2={point.y} stroke="#8da7bf" strokeWidth="1.8" strokeDasharray="4 5" opacity="0.8" />
              <circle cx={point.x} cy={point.y} r={childRadius(item.value)} fill={childColors[(index + 2) % childColors.length]} opacity="0.94" />
              <BubbleLabel x={point.x} y={point.y} title={item.name} value={item.value} radius={childRadius(item.value)} />
            </g>
          );
        })}

        <circle cx="410" cy="212" r="82" fill="#102f52" />
        <text x="410" y="201" textAnchor="middle" fill="#ffffff" fontFamily="Inter, ui-sans-serif, system-ui" fontSize="15" fontWeight="800" letterSpacing="0.8">
          <tspan x="410">JOURNAL</tspan>
          <tspan x="410" dy="1.25em">INDEXES</tspan>
          <tspan x="410" dy="1.45em" fontSize="24">{indexedTotal}</tspan>
        </text>

        <circle cx="610" cy="126" r="78" fill="#e4c873" opacity="0.98" />
        <BubbleLabel x={610} y={126} title="International Journals" value={internationalTotal} radius={78} kind="anchor" />

        <circle cx="218" cy="300" r="76" fill="#8fb4d8" opacity="0.98" />
        <BubbleLabel x={218} y={300} title="National Journals" value={nationalTotal} radius={76} kind="anchor" />

        {!indexedTotal && (
          <text x="410" y="404" textAnchor="middle" fill="#4f6478" fontSize="16" fontWeight="700">
            No national or international journal indexes in the current filter.
          </text>
        )}
      </svg>
    </div>
  );
}

function Filters({ year, setYear, theme, setTheme, query, setQuery, yearOptions = years, themeOptions = themes }) {
  return (
    <Card variant="lightBlue" className="p-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_180px_220px] lg:items-end">
        <TextSearch value={query} onChange={setQuery} placeholder="Search authors, titles, journals, fields, or indexes..." />
        <Select label="Year" value={year} onChange={setYear} options={["All years", ...yearOptions]} />
        <Select label="Field" value={theme} onChange={setTheme} options={["All fields", ...themeOptions]} />
      </div>
    </Card>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#102f52]/25 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onClick={onClose}>
      <motion.div
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="mobile-modal__panel max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_rgba(16,47,82,0.18)] sm:rounded-2xl"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="display text-2xl text-[var(--ink)]">{title}</h2>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--ink-soft)] transition-colors hover:bg-[var(--surface-soft)]" aria-label="Close">
            <Icons.x className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="space-y-1.5">
      <span className="block text-xs font-medium text-[var(--ink-soft)]">{label}</span>
      {children}
    </label>
  );
}

function ArticleForm({ initialArticle, onSave, onClose, submitLabel = "Add article" }) {
  const [form, setForm] = useState({
    id: initialArticle?.id,
    authors: "",
    title: "",
    venue: "",
    theme: articleThemeOptions[0],
    year: String(new Date().getFullYear()),
    type: publicationIndexes[0],
    url: "",
    status: "Published",
    ...initialArticle,
  });
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const inputClass = "w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--accent)]";
  const save = () => {
    onSave({
      ...form,
      authors: form.authors.trim(),
      title: form.title.trim(),
      venue: form.venue.trim(),
      year: String(form.year || "").trim(),
      type: canonicalIndex(form.type),
      url: form.url.trim(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Authors">
          <input value={form.authors} onChange={(event) => update("authors", event.target.value)} className={inputClass} placeholder="Author one; Author two" />
        </Field>
        <Field label="Year">
          <input value={form.year} onChange={(event) => update("year", event.target.value)} className={inputClass} placeholder="2026" />
        </Field>
      </div>
      <Field label="Title">
        <input value={form.title} onChange={(event) => update("title", event.target.value)} className={inputClass} placeholder="Article title" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Journal">
          <input value={form.venue} onChange={(event) => update("venue", event.target.value)} className={inputClass} placeholder="Journal name" />
        </Field>
        <Field label="Field">
          <select value={form.theme} onChange={(event) => update("theme", event.target.value)} className={inputClass}>
            {articleThemeOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Index">
          <select value={form.type} onChange={(event) => update("type", event.target.value)} className={inputClass}>
            {publicationIndexes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Article URL">
          <input value={form.url} onChange={(event) => update("url", event.target.value)} className={inputClass} placeholder="https://journal.example/article" />
        </Field>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button onClick={save} disabled={!form.title.trim() || !form.venue.trim()}>{submitLabel}</Button>
      </div>
    </div>
  );
}

function SubmissionForm({ onSubmit, message }) {
  const [form, setForm] = useState({
    applicantName: "",
    authors: "",
    title: "",
    venue: "",
    theme: articleThemeOptions[0],
    year: String(new Date().getFullYear()),
    type: publicationIndexes[0],
    url: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const inputClass = "w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--accent)]";
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const submitted = await onSubmit({
        ...form,
        applicantName: form.applicantName.trim(),
        authors: form.authors.trim(),
        title: form.title.trim(),
        venue: form.venue.trim(),
        year: String(form.year || "").trim(),
        type: canonicalIndex(form.type),
        url: form.url.trim(),
      });
      if (submitted === false) return;
      setForm({
        applicantName: "",
        authors: "",
        title: "",
        venue: "",
        theme: articleThemeOptions[0],
        year: String(new Date().getFullYear()),
        type: publicationIndexes[0],
        url: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Applicant name">
          <input value={form.applicantName} onChange={(event) => update("applicantName", event.target.value)} className={inputClass} placeholder="Your full name" />
        </Field>
        <Field label="Year">
          <input value={form.year} onChange={(event) => update("year", event.target.value)} className={inputClass} placeholder="2026" />
        </Field>
      </div>
      <Field label="Authors">
        <input value={form.authors} onChange={(event) => update("authors", event.target.value)} className={inputClass} placeholder="Author one; Author two" />
      </Field>
      <Field label="Title">
        <input value={form.title} onChange={(event) => update("title", event.target.value)} className={inputClass} placeholder="Article title" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Journal">
          <input value={form.venue} onChange={(event) => update("venue", event.target.value)} className={inputClass} placeholder="Journal name" />
        </Field>
        <Field label="Field">
          <select value={form.theme} onChange={(event) => update("theme", event.target.value)} className={inputClass}>
            {articleThemeOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Index">
          <select value={form.type} onChange={(event) => update("type", event.target.value)} className={inputClass}>
            {publicationIndexes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Article URL">
          <input value={form.url} onChange={(event) => update("url", event.target.value)} className={inputClass} placeholder="https://journal.example/article" />
        </Field>
      </div>
      {message && <p className={`rounded-lg px-4 py-3 text-sm font-medium ${message.startsWith("Submission received") ? "bg-[#e7f0e9] text-[#356048]" : "bg-[#f5e6e3] text-[#9a4338]"}`}>{message}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={submitting || !form.applicantName.trim() || !form.title.trim() || !form.venue.trim()}>
          {submitting ? "Submitting..." : "Submit for review"}
        </Button>
      </div>
    </form>
  );
}

function ArticleDetails({ article, onClose }) {
  const url = publicationUrl(article);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[var(--ink-soft)]">{article.year}</p>
            <h3 className="display mt-2 text-2xl leading-tight text-[var(--ink)]">{article.title}</h3>
          </div>
          <Badge tone={indexTone(article.type)}>{article.type}</Badge>
        </div>
        <div className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
          {article.applicantName && (
            <div>
              <p className="eyebrow">Applicant</p>
              <p className="mt-1.5 text-[var(--ink)]">{article.applicantName}</p>
            </div>
          )}
          <div>
            <p className="eyebrow">Authors</p>
            <p className="mt-1.5 text-[var(--ink)]">{article.authors || "-"}</p>
          </div>
          <div>
            <p className="eyebrow">Journal</p>
            <p className="mt-1.5 text-[var(--ink)]">{article.venue}</p>
          </div>
          <div>
            <p className="eyebrow">Field</p>
            <p className="mt-1.5 text-[var(--ink)]">{article.theme}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="eyebrow">Article Link</p>
            <a href={url} target="_blank" rel="noreferrer" className="mt-1.5 inline-flex max-w-full items-center gap-2 break-all font-medium text-[var(--accent)] hover:underline">
              <Icons.eye className="h-4 w-4 shrink-0" />
              {url}
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

function DashboardTools({ publications, importMessage, canManage, onAddArticle, onExport, onImport, onRequireLogin }) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">Publication data</p>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">{canManage ? "Import, export, or add article records in Supabase." : "Sign in first to import, add, edit, or delete records."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label onClick={(event) => !canManage && (event.preventDefault(), onRequireLogin?.())} className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors ${canManage ? "cursor-pointer hover:bg-[var(--surface-soft)]" : "cursor-not-allowed opacity-55"}`}>
            <Icons.upload className="h-4 w-4" />
            Import XLSX
            <input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" onChange={onImport} disabled={!canManage} />
          </label>
          <Button variant="secondary" onClick={onExport} disabled={!publications.length}><Icons.download className="h-4 w-4" />Export XLSX</Button>
          <Button onClick={canManage ? onAddArticle : onRequireLogin} disabled={!canManage}><Icons.plus className="h-4 w-4" />Add new article</Button>
        </div>
      </div>
      {importMessage && <p className={`mt-4 rounded-lg px-3 py-2 text-sm font-medium ${["Imported", "Added", "Exported", "Updated", "Deleted"].some((word) => importMessage.startsWith(word)) ? "bg-[#e7f0e9] text-[#356048]" : "bg-[#f5e6e3] text-[#9a4338]"}`}>{importMessage}</p>}
    </Card>
  );
}

function SubmissionReview({ submissions, onApprove, onReject, onSee }) {
  const pending = submissions.filter((item) => item.status === "pending");

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] p-6">
        <div>
          <p className="eyebrow">Submission review</p>
          <h2 className="display mt-1.5 text-2xl text-[var(--ink)]">Pending publication submissions</h2>
          <p className="mt-1.5 text-sm text-[var(--ink-soft)]">Review applicant submissions before they appear in public publication data.</p>
        </div>
        <Badge tone={pending.length ? "amber" : "green"}>{pending.length} pending</Badge>
      </div>
      <div className="space-y-3 p-6">
        {pending.map((item) => (
          <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="eyebrow">Applicant</p>
                <p className="mt-1 font-medium text-[var(--ink)]">{item.applicantName || "-"}</p>
                <h3 className="display mt-3 text-lg leading-snug text-[var(--ink)]">{item.title}</h3>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">{item.authors || "-"} · {item.venue || "-"} · {item.year}</p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Badge tone={indexTone(item.type)}>{item.type}</Badge>
                <Badge tone="blue">{item.theme}</Badge>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <Button variant="secondary" onClick={() => onSee(item)}><Icons.eye className="h-4 w-4" />See</Button>
              <Button variant="secondary" onClick={() => onReject(item)}><Icons.x className="h-4 w-4" />Reject</Button>
              <Button onClick={() => onApprove(item)}><Icons.check className="h-4 w-4" />Approve</Button>
            </div>
          </div>
        ))}
        {!pending.length && <p className="rounded-xl bg-[var(--surface-soft)] p-6 text-center text-sm text-[var(--ink-soft)]">No pending submissions.</p>}
      </div>
    </Card>
  );
}

function Header({ active }) {
  const titles = {
    dashboard: ["Research Overview", "Department Dashboard", "Live infographics of publication volume, authors, journal indexes, and research fields."],
    publications: ["Publication Records", "Publications", "Search, filter, sort, and review department journal outputs."],
    submissions: ["Submission Review", "Publication Submissions", "Approve or reject applicant submissions before public display."],
  };
  const [eyebrow, title, desc] = titles[active] || titles.dashboard;

  return (
    <div className="mb-8">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display mt-2 text-3xl text-[var(--ink)] md:text-4xl">{title}</h1>
      <p className="mt-2.5 max-w-3xl text-sm leading-6 text-[var(--ink-soft)]">{desc}</p>
    </div>
  );
}

function FloatingBottomNav({ active, setActive, onLogout, logoutLabel = "Logout" }) {
  return (
    <nav className="mobile-bottom-nav fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 sm:bottom-6 sm:px-6">
      <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-1.5 shadow-[0_8px_28px_rgba(16,47,82,0.12)] backdrop-blur-xl">
        {nav.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button key={item.id} title={item.label} type="button" onClick={() => setActive(item.id)} className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors sm:px-4 ${selected ? "bg-[var(--ink)] text-white" : "text-[var(--ink-soft)] hover:bg-[var(--surface-soft)]"}`}>
              <Icon className="h-[1.05rem] w-[1.05rem]" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button type="button" onClick={onLogout} className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-[var(--ink-soft)] transition-colors hover:bg-[var(--surface-soft)] sm:px-4">
          <Icons.logOut className="h-[1.05rem] w-[1.05rem]" />
          <span>{logoutLabel}</span>
        </button>
      </div>
    </nav>
  );
}


function Footer() {
  return (
    <footer className="px-4 pb-10 pt-6 sm:px-7 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 border-t border-[var(--border)] pt-6 text-center text-sm text-[var(--ink-soft)] sm:flex-row sm:justify-center sm:gap-2">
        <span>© 2026 Universitas Terbuka — English Department</span>
        <span className="hidden sm:inline" aria-hidden="true">·</span>
        <span>
          Developed by{" "}
          <a href="https://ardikardianto.github.io/resume" target="_blank" rel="noreferrer" className="font-medium text-[var(--accent)] hover:underline">Ardik Ardianto</a>
        </span>
      </div>
    </footer>
  );
}

function PublicShell({ mode, setMode, children }) {
  const links = [
    { id: "landing", label: "Home" },
    { id: "overview", label: "Overview" },
    { id: "publications", label: "Publications" },
    { id: "login", label: "Login" },
  ];
  return (
    <div className="flex min-h-screen flex-col text-[var(--ink)]">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="fixed inset-x-0 top-0 z-20 w-full border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] px-[clamp(1rem,4vw,3rem)] backdrop-blur-[8px]"
      >
        <div className="mx-auto flex min-h-16 w-full max-w-[1120px] flex-col items-center justify-between gap-2 py-2.5 sm:flex-row sm:gap-3">
          <button type="button" onClick={() => setMode("landing")} aria-label="Universitas Terbuka home" className="flex min-w-0 items-center gap-2.5">
            <img src="/logo.png" alt="Universitas Terbuka logo" className="h-[2.6rem] w-[2.6rem] shrink-0 rounded-[11px] object-contain" />
            <span className="grid gap-[0.12rem] text-left">
              <strong className="display text-[1.3rem] font-semibold leading-none text-[var(--ink)] sm:text-[1.45rem]">Universitas Terbuka</strong>
              <span className="text-[0.64rem] font-medium uppercase tracking-[0.18em] text-[var(--ink-muted)]">English Department</span>
            </span>
          </button>
          <nav aria-label="Primary navigation" className="w-full sm:w-auto">
            <ul className="flex items-center justify-center gap-0.5 sm:gap-1">
              {links.map((link) => {
                const active = mode === link.id;
                return (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => setMode(link.id)}
                      aria-current={active ? "page" : undefined}
                      className={`relative inline-flex min-h-[2.4rem] items-center justify-center rounded-lg px-2.5 text-[0.92rem] transition-colors sm:px-3.5 ${active ? "font-semibold text-[var(--ink)]" : "font-medium text-[var(--ink-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--ink)]"}`}
                    >
                      {link.label}
                      {active && <span className="absolute inset-x-2.5 bottom-1.5 h-0.5 rounded-full bg-[var(--gold)] sm:inset-x-3.5" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </motion.header>
      <div className="flex-1 px-4 sm:px-7 lg:px-10">
        <main className="mx-auto max-w-6xl pb-10 pt-[7.5rem] sm:pt-24">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

function LandingPage({ setMode, publications }) {
  const fieldData = themes.map((theme) => ({ name: theme, value: publications.filter((publication) => publication.theme === theme).length })).filter((item) => item.value);
  const trendData = publicationTrendData(publications);

  return (
    <div className="grid items-center gap-8 py-3 lg:grid-cols-[0.9fr_1.1fr] lg:py-4">
      <motion.section
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl"
      >
        <p className="eyebrow">Research Publications</p>
        <h1 className="display mt-6 text-5xl leading-[1.02] text-[var(--ink)] sm:text-6xl">Department Research Publications</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">A focused dashboard for journal publications, authors, indexes, and research fields across the English Department.</p>
        <div className="mt-9 flex flex-col items-start gap-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setMode("overview")} className="whitespace-nowrap !gap-1.5 !px-3 !py-1.5 text-sm"><Icons.chart className="h-4 w-4 shrink-0" />View Overview</Button>
            <Button variant="secondary" onClick={() => setMode("publications")} className="whitespace-nowrap !gap-1.5 !px-3 !py-1.5 text-sm"><Icons.book className="h-4 w-4 shrink-0" />Publications</Button>
          </div>
          <Button onClick={() => setMode("submit")} className="whitespace-nowrap !gap-1.5 !px-3 !py-1.5 text-sm"><Icons.file className="h-4 w-4 shrink-0" />Submit Article</Button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-3"
      >
        <Card className="p-5">
          <h2 className="display text-lg text-[var(--ink)]">Five-year output trend</h2>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">Publications recorded each year</p>
          <div className="mt-3 h-44">
            <ResponsiveContainer>
              <AreaChart data={trendData} margin={{ top: 34, right: 18, left: 18, bottom: 4 }}>
                <defs>
                  <linearGradient id="landingTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#005baa" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#005baa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "var(--ink-soft)", fontSize: 13 }} dy={10} />
                <YAxis hide domain={[0, "dataMax + 2"]} />
                <Tooltip />
                <Area type="monotone" dataKey="publications" stroke="#005baa" strokeWidth={2.5} fill="url(#landingTrendFill)" dot={false} activeDot={{ r: 4, fill: "#005baa" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="display mb-3 text-lg text-[var(--ink)]">Publications by field</h2>
          <div className="h-44">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={fieldData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={2} stroke="var(--surface)" strokeWidth={2}>
                  {fieldData.map((_, index) => <Cell key={index} fill={palette[index % palette.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}

function LoginPage({ setMode, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (loginError) {
      setError(loginError.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto grid min-h-[calc(100vh-12rem)] w-full max-w-6xl items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
      <motion.section
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">Restricted Access</p>
        <h1 className="display mt-6 max-w-2xl text-5xl leading-[1.02] text-[var(--ink)] sm:text-6xl">Research Dashboard</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">Sign in to manage publication records, journal indexes, author data, and department research reporting.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => setMode("landing")} aria-label="Home" title="Home" className="!h-11 !w-11 !px-0 !py-0"><Icons.home className="h-5 w-5" /></Button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-2xl lg:mx-0"
      >
        <Card className="relative z-10 ml-auto w-full p-6 sm:p-8 lg:max-w-md">
          <p className="eyebrow">Restricted access</p>
          <h2 className="display mt-2 text-3xl text-[var(--ink)]">Sign in</h2>
          <p className="mt-2 text-base leading-7 text-[var(--ink-soft)]">Welcome back. Please sign in to your account.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--ink)]">Email</span>
              <div className="flex h-12 items-center gap-3 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 transition-colors focus-within:border-[var(--accent)]">
                <Icons.users className="h-4 w-4 text-[var(--ink-muted)]" />
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email address" className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]" />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--ink)]">Password</span>
              <div className="flex h-12 items-center gap-3 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 transition-colors focus-within:border-[var(--accent)]">
                <Icons.check className="h-4 w-4 text-[var(--ink-muted)]" />
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-muted)]" />
              </div>
            </label>
            <button type="button" onClick={() => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); setError(""); }} className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--accent-soft)]">
              Use demo account
            </button>
            {error && <p className="rounded-lg bg-[#f5e6e3] px-3 py-2 text-sm font-medium text-[#9a4338]">{error}</p>}
            <Button type="submit" className="w-full py-3 text-base" disabled={!email || !password || loading}>{loading ? "Signing in..." : "Sign in"}</Button>
            <p className="rounded-lg bg-[var(--surface-soft)] px-4 py-3 text-xs leading-5 text-[var(--ink-soft)]">
              Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}. Demo changes stay in this browser session and do not alter Supabase data.
            </p>
          </form>
        </Card>
      </motion.section>
    </div>
  );
}


function OverviewPage({ filteredPublications, setActive }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Research Overview</p>
        <h1 className="display mt-2 text-4xl text-[var(--ink)] sm:text-5xl">Department Research Publications</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-soft)]">A quick view of publication volume, authors, journal indexes, and research fields.</p>
      </div>
      <Dashboard filteredPublications={filteredPublications} setActive={setActive} actionLabel="View publications" />
    </div>
  );
}

function Dashboard({ filteredPublications, setActive, actionLabel = "View publications" }) {
  const authorCount = uniqueAuthorCount(filteredPublications);
  const nationalJournals = filteredPublications.filter((item) => isNationalJournalIndex(item.type)).length;
  const internationalJournals = filteredPublications.filter((item) => isInternationalJournalIndex(item.type)).length;
  const themeData = themes.map((theme) => ({ name: theme, value: filteredPublications.filter((publication) => publication.theme === theme).length })).filter((item) => item.value);
  const trendData = publicationTrendData(filteredPublications);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Publications" value={filteredPublications.length} icon={Icons.book} note="Filtered output count" tone="red" />
        <Stat label="Authors" value={authorCount} icon={Icons.users} note="Unique authors in publications" tone="green" />
        <Stat label="National Journals" value={nationalJournals} icon={Icons.file} note="Sinta 2-6 outputs" tone="slate" />
        <Stat label="International Journals" value={internationalJournals} icon={Icons.award} note="Scopus, EBSCO, Copernicus, DOAJ, ProQuest" tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-7">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="display text-xl text-[var(--ink)]">Five-year output trend</h2>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">Publications recorded each year</p>
            </div>
            <Button variant="secondary" onClick={() => setActive("publications")} className="shrink-0">{actionLabel}</Button>
          </div>
          <div className="h-80">
            <ResponsiveContainer>
              <AreaChart data={trendData} margin={{ top: 42, right: 28, left: 28, bottom: 10 }}>
                <defs>
                  <linearGradient id="overviewTrendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#005baa" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#005baa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "var(--ink-soft)", fontSize: 14 }} dy={12} />
                <YAxis hide domain={[0, "dataMax + 2"]} />
                <Tooltip />
                <Area type="monotone" dataKey="publications" name="Publications" stroke="#005baa" strokeWidth={2.5} fill="url(#overviewTrendFill)" dot={false} activeDot={{ r: 4, fill: "#005baa" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-7">
          <h2 className="display mb-4 text-xl text-[var(--ink)]">Publications by field</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={themeData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={2} stroke="var(--surface)" strokeWidth={2}>
                  {themeData.map((_, index) => <Cell key={index} fill={palette[index % palette.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-7">
        <h2 className="display text-xl text-[var(--ink)]">Journal index bubbles</h2>
        <p className="mb-4 mt-1 text-sm text-[var(--ink-soft)]">National and international journals are the main anchors, with indexed categories clustered around each one.</p>
        <JournalBubbleChart publications={filteredPublications} />
      </Card>
    </div>
  );
}

function Publications({ items, canManage = false, onEdit, onDelete, onSee }) {
  const [sortKey, setSortKey] = useState("year");
  const [sortDirection, setSortDirection] = useState("desc");
  const sortedItems = useMemo(() => {
    const valueFor = (item) => ({ authors: item.authors, title: item.title, journal: item.venue, theme: item.theme, year: item.year, index: item.type })[sortKey] || "";
    return [...items].sort((a, b) => {
      const result = String(valueFor(a)).localeCompare(String(valueFor(b)), undefined, { numeric: true, sensitivity: "base" });
      return sortDirection === "asc" ? result : -result;
    });
  }, [items, sortDirection, sortKey]);
  const sortBy = (key) => {
    setSortDirection((current) => sortKey === key ? current === "asc" ? "desc" : "asc" : key === "year" ? "desc" : "asc");
    setSortKey(key);
  };
  const sortHeader = (label, key) => (
    <button type="button" onClick={() => sortBy(key)} className="inline-flex items-center gap-1 font-medium uppercase tracking-[0.08em] text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]">
      {label}{sortKey === key && <span aria-hidden="true">{sortDirection === "asc" ? "↑" : "↓"}</span>}
    </button>
  );

  return (
    <Card className="mobile-card-table overflow-hidden">
      <div className="border-b border-[var(--border)] p-6">
        <h1 className="display text-xl text-[var(--ink)]">Publication pipeline</h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">Track journal outputs and indexing level.</p>
      </div>
      <div className="px-2 pb-3 sm:px-3 lg:px-4">
        <div className="publication-table-shell overflow-x-auto">
          <table className="w-full table-fixed text-left text-sm">
            <colgroup>
              <col style={{ width: canManage ? "16%" : "20%" }} />
              <col style={{ width: canManage ? "25%" : "28%" }} />
              <col style={{ width: canManage ? "17%" : "20%" }} />
              <col style={{ width: canManage ? "10%" : "10%" }} />
              <col style={{ width: canManage ? "7%" : "7%" }} />
              <col style={{ width: canManage ? "10%" : "9%" }} />
              <col style={{ width: canManage ? "15%" : "6%" }} />
            </colgroup>
            <thead className="text-[11px] uppercase tracking-[0.08em] text-[var(--ink-muted)]">
              <tr className="border-b border-[var(--border)]">
                <th className="px-3 py-3.5">{sortHeader("Authors", "authors")}</th>
                <th className="px-3 py-3.5">{sortHeader("Title", "title")}</th>
                <th className="px-3 py-3.5">{sortHeader("Journal", "journal")}</th>
                <th className="px-3 py-3.5">{sortHeader("Field", "theme")}</th>
                <th className="px-3 py-3.5">{sortHeader("Year", "year")}</th>
                <th className="px-3 py-3.5">{sortHeader("Index", "index")}</th>
                <th className="px-3 py-3.5 text-center font-medium uppercase tracking-[0.08em] text-[var(--ink-muted)]">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr key={publicationIdentity(item)} className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[var(--surface-soft)]">
                  <td className="break-words px-3 py-4 text-[var(--ink-soft)]">{item.authors}</td>
                  <td className="break-words px-3 py-4 font-medium text-[var(--ink)]">{item.title}</td>
                  <td className="break-words px-3 py-4 text-[var(--ink-soft)]">{item.venue}</td>
                  <td className="px-3 py-4"><Badge tone="blue">{item.theme}</Badge></td>
                  <td className="px-3 py-4 text-[var(--ink-soft)]">{item.year}</td>
                  <td className="px-3 py-4"><Badge tone={indexTone(item.type)}>{item.type}</Badge></td>
                  <td className="px-3 py-4 text-right">
                    <div className="flex flex-nowrap justify-end gap-2">
                      {canManage && (
                        <>
                          <button type="button" onClick={() => onEdit?.(item)} title="Edit" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]" aria-label={`Edit publication: ${item.title}`}>
                            <Icons.edit className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => onDelete?.(item)} title="Delete" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e4cfca] bg-[var(--surface)] text-[#9a4338] transition-colors hover:bg-[#f5e6e3]" aria-label={`Delete publication: ${item.title}`}>
                            <Icons.trash className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button type="button" onClick={() => onSee?.(item)} title="See" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]" aria-label={`See publication: ${item.title}`}>
                        <Icons.eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {!items.length && <p className="p-6 text-center text-sm text-[var(--ink-soft)]">No publications match the current filters.</p>}
    </Card>
  );
}


function PublicPublicationsPage({ items, onSee }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Publication Records</p>
        <h1 className="display mt-2 text-4xl text-[var(--ink)] sm:text-5xl">Publications</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-soft)]">Browse department journal outputs by authors, title, journal, field, year, and index.</p>
      </div>
      <Publications items={items} onSee={onSee} />
    </div>
  );
}

function PublicSubmissionPage({ onSubmit, message }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="eyebrow">Article Submission</p>
        <h1 className="display mt-2 text-4xl text-[var(--ink)] sm:text-5xl">Submit a publication</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-soft)]">Submitted records are reviewed by the admin before they appear in the public overview and publication data.</p>
      </div>
      <Card className="p-6">
        <SubmissionForm onSubmit={onSubmit} message={message} />
      </Card>
    </div>
  );
}

export default function ResearchDashboard() {
  const [mode, setMode] = useState("landing");
  const [active, setActive] = useState("dashboard");
  const [userEmail, setUserEmail] = useState(() => getStoredUserEmail() || "Preview mode");
  const [publications, setPublications] = useState(() => initialPublications.map(ensurePublicationId));
  const [submissions, setSubmissions] = useState([]);
  const [articleModal, setArticleModal] = useState(null);
  const [viewArticle, setViewArticle] = useState(null);
  const [confirmReview, setConfirmReview] = useState(null);
  const [importMessage, setImportMessage] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [databaseMessage, setDatabaseMessage] = useState("Loading publications...");
  const [year, setYear] = useState("All years");
  const [theme, setTheme] = useState("All fields");
  const [query, setQuery] = useState("");

  const filteredPublications = useMemo(() => publications.filter((item) => (year === "All years" || item.year === year) && (theme === "All fields" || item.theme === theme) && [item.authors, item.title, item.venue, item.theme, item.status, item.type].some((value) => includes(value, query))), [publications, year, theme, query]);
  const yearOptions = useMemo(() => uniq([...years, ...publications.map((item) => item.year)]).sort((a, b) => String(b).localeCompare(String(a), undefined, { numeric: true })), [publications]);
  const themeOptions = useMemo(() => uniq([...themes, ...publications.map((item) => item.theme)]), [publications]);
  const isDemoMode = userEmail === DEMO_EMAIL;
  const canManagePublications = isDemoMode || Boolean(userEmail && userEmail !== "Preview mode" && getAccessToken());

  useEffect(() => {
    let alive = true;
    const loadPublications = async () => {
      if (localStorage.getItem(DEMO_SESSION_KEY) === "true") {
        setPublications(demoPublications.map(ensurePublicationId));
        setSubmissions(demoSubmissions);
        setDatabaseMessage("Demo mode: showing local dummy data. Supabase data is unchanged.");
        return;
      }
      if (!USE_SUPABASE) {
        setDatabaseMessage("Supabase is not configured. Showing sample data.");
        return;
      }
      try {
        const rows = await fetchResearchPublications();
        if (!alive) return;
        setPublications(rows);
        setDatabaseMessage(rows.length ? "" : "No database publications yet. Import XLSX or add a new article.");
        if (getAccessToken()) {
          try {
            const submissionRows = await fetchPublicationSubmissions();
            if (alive) setSubmissions(submissionRows);
          } catch {
            if (alive) setSubmissions([]);
          }
        }
      } catch (error) {
        if (!alive) return;
        setDatabaseMessage(error.message || "Could not load publications from Supabase.");
      }
    };
    loadPublications();
    return () => {
      alive = false;
    };
  }, []);

  const handleLogin = async (email, password) => {
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.removeItem(SUPABASE_TOKEN_KEY);
      localStorage.removeItem(SUPABASE_USER_KEY);
      localStorage.setItem(DEMO_SESSION_KEY, "true");
      setUserEmail(DEMO_EMAIL);
      setPublications(demoPublications.map(ensurePublicationId));
      setSubmissions(demoSubmissions);
      setDatabaseMessage("Demo mode: using local dummy data only. Supabase data is unchanged.");
      setImportMessage("");
      setYear("All years");
      setTheme("All fields");
      setQuery("");
      setActive("dashboard");
      setMode("admin");
      return;
    }
    localStorage.removeItem(DEMO_SESSION_KEY);
    const signedInEmail = await signIn(email, password);
    try {
      const submissionRows = await fetchPublicationSubmissions();
      setSubmissions(submissionRows);
      setImportMessage("");
    } catch {
      setSubmissions([]);
      setImportMessage("Submission review is unavailable until the publication_submissions table is created in Supabase.");
    }
    setUserEmail(signedInEmail);
    setActive("dashboard");
    setMode("admin");
  };

  const handleLogout = () => {
    signOut();
    setUserEmail("Preview mode");
    setSubmissions([]);
    setMode("landing");
  };

  const addArticle = async (article) => {
    try {
      if (!canManagePublications) throw new Error("Please sign in before adding an article.");
      if (isDemoMode) {
        const saved = ensurePublicationId(article);
        setPublications((current) => [saved, ...current]);
        setArticleModal(null);
        setImportMessage("Demo mode: added 1 local article. Supabase data is unchanged.");
        setDatabaseMessage("Demo mode: showing local dummy data. Supabase data is unchanged.");
        return;
      }
      const saved = await insertResearchPublication(article);
      setPublications((current) => [saved, ...current]);
      setArticleModal(null);
      setImportMessage("Added 1 new article.");
      setDatabaseMessage("");
    } catch (error) {
      setImportMessage(error.message || "Could not add this article. Please sign in first.");
    }
  };

  const editArticle = async (original, article) => {
    try {
      if (!canManagePublications) throw new Error("Please sign in before editing an article.");
      if (isDemoMode) {
        const saved = ensurePublicationId({ ...article, id: original.id });
        const identity = publicationIdentity(original);
        setPublications((current) => current.map((item) => publicationIdentity(item) === identity ? saved : item));
        setArticleModal(null);
        setImportMessage("Demo mode: updated 1 local article. Supabase data is unchanged.");
        return;
      }
      const saved = await updateResearchPublication(original.id, article);
      const identity = publicationIdentity(original);
      setPublications((current) => current.map((item) => publicationIdentity(item) === identity ? saved : item));
      setArticleModal(null);
      setImportMessage("Updated 1 article.");
    } catch (error) {
      setImportMessage(error.message || "Could not update this article. Please sign in first.");
    }
  };

  const deleteArticle = async (article) => {
    if (!canManagePublications) {
      setImportMessage("Please sign in before deleting an article.");
      return;
    }
    const confirmed = window.confirm(`Delete "${article.title}"?`);
    if (!confirmed) return;
    try {
      if (isDemoMode) {
        const identity = publicationIdentity(article);
        setPublications((current) => current.filter((item) => publicationIdentity(item) !== identity));
        setImportMessage("Demo mode: deleted 1 local article. Supabase data is unchanged.");
        return;
      }
      await deleteResearchPublication(article.id);
      const identity = publicationIdentity(article);
      setPublications((current) => current.filter((item) => publicationIdentity(item) !== identity));
      setImportMessage("Deleted 1 article.");
    } catch (error) {
      setImportMessage(error.message || "Could not delete this article. Please sign in first.");
    }
  };

  const submitPublication = async (submission) => {
    try {
      setSubmissionMessage("");
      if (localStorage.getItem(DEMO_SESSION_KEY) === "true") {
        const saved = { ...submission, id: createPublicationId(), status: "pending", submittedAt: new Date().toISOString() };
        setSubmissions((current) => [saved, ...current]);
        setSubmissionMessage("Submission received for demo review. Supabase data is unchanged.");
        return true;
      }
      const saved = await insertPublicationSubmission(submission);
      setSubmissions((current) => [saved, ...current]);
      setSubmissionMessage("Submission received. The admin will review it before public display.");
      return true;
    } catch (error) {
      setSubmissionMessage(error.message || "Could not submit this publication.");
      return false;
    }
  };

  const approveSubmission = async (submission) => {
    try {
      if (!canManagePublications) throw new Error("Please sign in before approving submissions.");
      const article = {
        authors: submission.authors,
        title: submission.title,
        venue: submission.venue,
        theme: submission.theme,
        year: submission.year,
        type: submission.type,
        url: submission.url,
        status: "Published",
      };
      if (isDemoMode) {
        const saved = ensurePublicationId(article);
        setPublications((current) => [saved, ...current]);
        setSubmissions((current) => current.map((item) => item.id === submission.id ? { ...item, status: "approved", reviewedAt: new Date().toISOString() } : item));
        setImportMessage("Demo mode: approved 1 local submission. Supabase data is unchanged.");
        return;
      }
      const saved = await insertResearchPublication(article);
      const reviewed = await updatePublicationSubmissionStatus(submission.id, "approved");
      setPublications((current) => [saved, ...current]);
      setSubmissions((current) => current.map((item) => item.id === submission.id ? reviewed : item));
      setImportMessage("Approved 1 submission and published it.");
    } catch (error) {
      setImportMessage(error.message || "Could not approve this submission.");
    }
  };

  const rejectSubmission = async (submission) => {
    try {
      if (!canManagePublications) throw new Error("Please sign in before rejecting submissions.");
      if (isDemoMode) {
        setSubmissions((current) => current.map((item) => item.id === submission.id ? { ...item, status: "rejected", reviewedAt: new Date().toISOString() } : item));
        setImportMessage("Demo mode: rejected 1 local submission. Supabase data is unchanged.");
        return;
      }
      const reviewed = await updatePublicationSubmissionStatus(submission.id, "rejected");
      setSubmissions((current) => current.map((item) => item.id === submission.id ? reviewed : item));
      setImportMessage("Rejected 1 submission.");
    } catch (error) {
      setImportMessage(error.message || "Could not reject this submission.");
    }
  };

  const handleConfirmReview = async () => {
    if (!confirmReview) return;
    const { type, submission } = confirmReview;
    setConfirmReview(null);
    if (type === "approve") await approveSubmission(submission);
    else await rejectSubmission(submission);
  };

  const pages = {
    dashboard: <Dashboard filteredPublications={filteredPublications} setActive={setActive} />,
    publications: <Publications items={filteredPublications} canManage={canManagePublications} onEdit={(item) => setArticleModal({ mode: "edit", item })} onDelete={deleteArticle} onSee={setViewArticle} />,
    submissions: <SubmissionReview submissions={submissions} onApprove={(item) => setConfirmReview({ type: "approve", submission: item })} onReject={(item) => setConfirmReview({ type: "reject", submission: item })} onSee={setViewArticle} />,
  };

  const exportPublications = async () => {
    try {
      await exportPublicationsToXLSX(publications);
      setImportMessage("Exported publications to XLSX.");
    } catch (error) {
      setImportMessage(error.message || "Could not export this XLSX file.");
    }
  };

  const importPublications = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      if (!canManagePublications) throw new Error("Please sign in before importing XLSX data.");
      const sheetRows = await readSheet(file);
      const [headerRow, ...dataRows] = sheetRows;
      const headers = (headerRow || []).map((value) => String(value || "").trim());
      const rows = dataRows.map((dataRow) => Object.fromEntries(headers.map((header, index) => [header, dataRow[index] ?? ""])));
      const imported = rows.map(rowToPublication).filter(Boolean);
      if (!imported.length) throw new Error("No valid rows found. Use Authors, Title, Journal, Field, Year, Index, and URL columns.");
      if (isDemoMode) {
        const saved = imported.map(ensurePublicationId);
        setPublications((current) => [...saved, ...current]);
        setYear("All years");
        setTheme("All fields");
        setQuery("");
        setImportMessage(`Demo mode: imported ${saved.length} local publication${saved.length === 1 ? "" : "s"}. Supabase data is unchanged.`);
        setDatabaseMessage("Demo mode: showing local dummy data. Supabase data is unchanged.");
        return;
      }
      const saved = await appendResearchPublications(imported);
      setPublications((current) => [...saved, ...current]);
      setYear("All years");
      setTheme("All fields");
      setQuery("");
      setImportMessage(`Imported ${saved.length} publication${saved.length === 1 ? "" : "s"}.`);
      setDatabaseMessage("");
    } catch (error) {
      setImportMessage(error.message || "Could not import this XLSX file.");
    }
  };

  if (mode !== "admin") {
    const publicContent = mode === "login"
      ? <LoginPage setMode={setMode} onLogin={handleLogin} />
      : mode === "overview"
        ? (
          <div className="space-y-6">
            <Filters year={year} setYear={setYear} theme={theme} setTheme={setTheme} query={query} setQuery={setQuery} yearOptions={yearOptions} themeOptions={themeOptions} />
            <OverviewPage filteredPublications={filteredPublications} setActive={() => setMode("publications")} />
          </div>
        )
        : mode === "publications"
          ? (
            <div className="space-y-6">
              <Filters year={year} setYear={setYear} theme={theme} setTheme={setTheme} query={query} setQuery={setQuery} yearOptions={yearOptions} themeOptions={themeOptions} />
              <PublicPublicationsPage items={filteredPublications} onSee={setViewArticle} />
            </div>
          )
          : mode === "submit"
            ? <PublicSubmissionPage onSubmit={submitPublication} message={submissionMessage} />
          : <LandingPage setMode={setMode} publications={publications} />;

    return (
      <PublicShell mode={mode} setMode={setMode}>
        {publicContent}
        {viewArticle && <Modal title="Article details" onClose={() => setViewArticle(null)}><ArticleDetails article={viewArticle} onClose={() => setViewArticle(null)} /></Modal>}
      </PublicShell>
    );
  }

  return (
    <div className="min-h-screen pb-48 text-[var(--ink)] sm:pb-32">
      <main className="min-w-0 p-3 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
            <Badge tone="slate">{userEmail || "Preview mode"}</Badge>
            <Button variant="secondary" onClick={handleLogout}>{!userEmail || userEmail === "Preview mode" ? "Exit preview" : "Sign out"}</Button>
          </div>
          <Header active={active} />
          <div className="space-y-6">
            {databaseMessage && <Card className="p-4"><p className="text-sm text-[var(--ink-soft)]">{databaseMessage}</p></Card>}
            {active === "publications" && <DashboardTools publications={publications} importMessage={importMessage} canManage={canManagePublications} onAddArticle={() => setArticleModal({ mode: "add" })} onExport={exportPublications} onImport={importPublications} onRequireLogin={() => setImportMessage("Please sign in before changing publication data.")} />}
            <Filters year={year} setYear={setYear} theme={theme} setTheme={setTheme} query={query} setQuery={setQuery} yearOptions={yearOptions} themeOptions={themeOptions} />
            <motion.div key={`${active}-${year}-${theme}-${query}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {pages[active] || pages.dashboard}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingBottomNav active={active} setActive={setActive} onLogout={handleLogout} logoutLabel={!userEmail || userEmail === "Preview mode" ? "Exit preview" : "Logout"} />
      {articleModal?.mode === "add" && <Modal title="Add new article" onClose={() => setArticleModal(null)}><ArticleForm onSave={addArticle} onClose={() => setArticleModal(null)} /></Modal>}
      {articleModal?.mode === "edit" && <Modal title="Edit article" onClose={() => setArticleModal(null)}><ArticleForm initialArticle={articleModal.item} onSave={(article) => editArticle(articleModal.item, article)} onClose={() => setArticleModal(null)} submitLabel="Save changes" /></Modal>}
      {viewArticle && <Modal title="Article details" onClose={() => setViewArticle(null)}><ArticleDetails article={viewArticle} onClose={() => setViewArticle(null)} /></Modal>}
      {confirmReview && (
        <Modal title={confirmReview.type === "approve" ? "Approve submission" : "Reject submission"} onClose={() => setConfirmReview(null)}>
          <div className="space-y-5">
            <p className="text-sm leading-6 text-[var(--ink-soft)]">
              {confirmReview.type === "approve"
                ? "This will publish the submission and add it to the public publication data. Are you sure you want to approve it?"
                : "This will reject the submission and it will not appear in the public publication data. Are you sure you want to reject it?"}
            </p>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="font-medium text-[var(--ink)]">{confirmReview.submission.title}</p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{confirmReview.submission.applicantName || "-"} · {confirmReview.submission.venue || "-"} · {confirmReview.submission.year}</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmReview(null)}>Cancel</Button>
              {confirmReview.type === "approve"
                ? <Button onClick={handleConfirmReview}><Icons.check className="h-4 w-4" />Approve</Button>
                : <Button onClick={handleConfirmReview}><Icons.x className="h-4 w-4" />Reject</Button>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

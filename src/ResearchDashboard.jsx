import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { readSheet } from "read-excel-file/browser";
import writeXlsxFile from "write-excel-file/browser";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
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
const palette = ["#91b7df", "#f4d77f", "#8fc8a9", "#e8a993", "#b6a8df", "#9cc8d8"];

const researchers = [
  { id: "R-01", name: "Dr. Mira Suryani", role: "Research Lead", theme: "Linguistics", projects: 4, publications: 8, hIndex: 7 },
  { id: "R-02", name: "Dr. Ardi Prakoso", role: "Publication Coordinator", theme: "Translation", projects: 3, publications: 11, hIndex: 9 },
  { id: "R-03", name: "Dina Kartika, M.A.", role: "Grant Officer", theme: "Linguistics", projects: 5, publications: 6, hIndex: 5 },
  { id: "R-04", name: "Rafi Mahendra, Ph.D.", role: "Methods Advisor", theme: "Linguistics", projects: 3, publications: 10, hIndex: 8 },
  { id: "R-05", name: "Sinta Wulandari, M.Ed.", role: "Community Research", theme: "Literature", projects: 2, publications: 5, hIndex: 4 },
];

const projects = [
  { id: "P-2026-01", title: "AI-supported feedback for online academic writing", theme: "Linguistics", lead: "Dr. Mira Suryani", status: "Active", year: "2026", budget: 180, progress: 72, outputs: 4, deadline: "Aug 2026" },
  { id: "P-2026-02", title: "Translation quality in open distance learning materials", theme: "Translation", lead: "Dr. Ardi Prakoso", status: "Active", year: "2026", budget: 120, progress: 58, outputs: 3, deadline: "Oct 2026" },
  { id: "P-2025-03", title: "Formative assessment patterns in blended tutorials", theme: "Linguistics", lead: "Dina Kartika, M.A.", status: "Review", year: "2025", budget: 95, progress: 88, outputs: 5, deadline: "Jun 2026" },
  { id: "P-2025-04", title: "Corpus mapping of Indonesian EFL learner essays", theme: "Linguistics", lead: "Rafi Mahendra, Ph.D.", status: "Active", year: "2025", budget: 150, progress: 64, outputs: 6, deadline: "Dec 2026" },
  { id: "P-2024-05", title: "Local literature modules for distance classrooms", theme: "Literature", lead: "Sinta Wulandari, M.Ed.", status: "Completed", year: "2024", budget: 70, progress: 100, outputs: 7, deadline: "Completed" },
  { id: "P-2024-06", title: "Tutor discourse and student persistence", theme: "Linguistics", lead: "Dr. Mira Suryani", status: "Completed", year: "2024", budget: 85, progress: 100, outputs: 4, deadline: "Completed" },
];

const initialPublications = [
  { authors: "Mira Suryani; Rafi Mahendra", title: "Automated feedback and learner revision quality", venue: "Journal of Online Language Learning", year: "2026", type: "Scopus", theme: "Linguistics", status: "Accepted", url: "https://scholar.google.com/scholar?q=Automated+feedback+and+learner+revision+quality" },
  { authors: "Ardi Prakoso; Sinta Wulandari", title: "Terminology consistency in translated ODL modules", venue: "Indonesian Translation Review", year: "2026", type: "Sinta 2", theme: "Translation", status: "In press", url: "https://scholar.google.com/scholar?q=Terminology+consistency+in+translated+ODL+modules" },
  { authors: "Dina Kartika; Mira Suryani", title: "Assessment loops in asynchronous tutorials", venue: "Asian EFL Journal", year: "2025", type: "EBSCO", theme: "Linguistics", status: "Published", url: "https://www.asian-efl-journal.com/" },
  { authors: "Rafi Mahendra; Ardi Prakoso", title: "Building a learner essay corpus for distance education", venue: "Digital Humanities Quarterly", year: "2025", type: "DOAJ", theme: "Linguistics", status: "Under review", url: "https://www.digitalhumanities.org/dhq/" },
  { authors: "Sinta Wulandari", title: "Local texts and reading engagement", venue: "Journal of English Education", year: "2024", type: "Sinta 3", theme: "Literature", status: "Published", url: "https://scholar.google.com/scholar?q=Local+texts+and+reading+engagement+Journal+of+English+Education" },
  { authors: "Mira Suryani; Dina Kartika", title: "Tutor talk and student retention signals", venue: "Open Learning Studies", year: "2024", type: "International Proceedings", theme: "Linguistics", status: "Published", url: "https://scholar.google.com/scholar?q=Tutor+talk+and+student+retention+signals+Open+Learning+Studies" },
];

const grants = [
  { funder: "UT Internal Research Grant", title: "AI Feedback Pilot", amount: 180, year: "2026", status: "Funded" },
  { funder: "BRIN Collaboration", title: "Learner Corpus Infrastructure", amount: 260, year: "2026", status: "Submitted" },
  { funder: "Community Partnership", title: "Local Literature Modules", amount: 70, year: "2024", status: "Closed" },
  { funder: "Teaching Innovation Fund", title: "Assessment Analytics", amount: 95, year: "2025", status: "Funded" },
];

const nav = [
  { id: "dashboard", label: "Dashboard", icon: Icons.chart },
  { id: "publications", label: "Publications", icon: Icons.book },
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
const RESEARCH_PUBLICATIONS_TABLE = "research_publications";

function money(value) {
  return `Rp ${value.toLocaleString("id-ID")}M`;
}

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
}

function getStoredUserEmail() {
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
  const variants = {
    default: "border-[#d9e7fb] bg-gradient-to-br from-[#fff8dc] via-[#eef8ff] to-[#f7efff] shadow-[0_16px_42px_rgba(91,132,177,0.12)]",
    sky: "border-[#cfe3fb] bg-gradient-to-br from-[#eef8ff] via-white to-[#eaf4ff] shadow-[0_16px_42px_rgba(91,132,177,0.13)]",
    mint: "border-[#cfe9dc] bg-gradient-to-br from-[#effbf5] via-white to-[#e8f7ef] shadow-[0_16px_42px_rgba(111,164,132,0.13)]",
    lemon: "border-[#f3dfa2] bg-gradient-to-br from-[#fff9dc] via-white to-[#fff1b8] shadow-[0_16px_42px_rgba(214,177,73,0.15)]",
    peach: "border-[#f1d1c5] bg-gradient-to-br from-[#fff3ec] via-white to-[#ffe9df] shadow-[0_16px_42px_rgba(203,139,111,0.13)]",
    lavender: "border-[#ddd4f5] bg-gradient-to-br from-[#f7f2ff] via-white to-[#eee8ff] shadow-[0_16px_42px_rgba(145,124,192,0.13)]",
    rose: "border-[#f2ced8] bg-gradient-to-br from-[#fff1f5] via-white to-[#ffe8ef] shadow-[0_16px_42px_rgba(199,116,141,0.12)]",
    neutral: "border-[#d7e6f7] bg-white shadow-[0_14px_34px_rgba(16,47,82,0.08)]",
  };
  return <div className={`rounded-2xl border ${variants[variant] || variants.default} ${className}`}>{children}</div>;
}

function Badge({ children, tone = "blue" }) {
  const tones = {
    amber: "border-[#f3dda2] bg-[#fff0c2] text-[#71540f]",
    blue: "border-[#c7dbf2] bg-[#dcecff] text-[#315577]",
    green: "border-[#c6e3d1] bg-[#dff3e6] text-[#315f45]",
    red: "border-[#f3caca] bg-[#fde2e2] text-[#8a3a3a]",
    slate: "border-[#dce9e6] bg-[#eef3f2] text-[#4d5d66]",
  };
  return <span className={`inline-flex items-center rounded-lg border px-2 py-1 text-xs font-medium ${tones[tone] || tones.blue}`}>{children}</span>;
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const styles = {
    primary: "bg-[#005baa] text-white hover:bg-[#004984]",
    secondary: "border border-[#d7e6f7] bg-white text-[#102f52] hover:bg-[#f4f9ff]",
    ghost: "bg-transparent text-[#315577] hover:bg-[#eef5ff]",
  };
  return <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`} {...props}>{children}</button>;
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="space-y-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#315577]">{label}</span>
      <div className="relative">
        <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full appearance-none rounded-xl border border-[#d7e6f7] bg-white px-3 pr-9 text-sm text-[#102f52] outline-none focus:border-[#005baa]">
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <Icons.chevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[#6f90af]" />
      </div>
    </label>
  );
}

function TextSearch({ value, onChange, placeholder }) {
  return (
    <label className="flex h-11 items-center gap-3 rounded-xl border border-[#d7e6f7] bg-white px-3">
      <Icons.search className="h-4 w-4 text-[#6f90af]" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm text-[#102f52] outline-none placeholder:text-[#8aa0b6]" />
    </label>
  );
}

function Stat({ label, value, note, icon: Icon, tone = "blue" }) {
  const variants = {
    amber: "lemon",
    blue: "sky",
    green: "mint",
    red: "rose",
    slate: "lavender",
  };
  const iconStyles = {
    amber: "bg-[#ffe287] text-[#71540f]",
    blue: "bg-[#d8ecff] text-[#005baa]",
    green: "bg-[#dff4e9] text-[#315f45]",
    red: "bg-[#ffe1e7] text-[#8a3a3a]",
    slate: "bg-[#ece7ff] text-[#4d4f78]",
  };
  return (
    <Card variant={variants[tone] || "sky"} className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#315577]">{label}</p>
          <p className="mt-3 text-4xl font-light text-[#102f52]">{value}</p>
          {note && <p className="mt-1 text-xs text-[#4f6478]">{note}</p>}
        </div>
        <span className={`rounded-xl p-3 ${iconStyles[tone] || iconStyles.blue}`}>
          <Icon />
        </span>
      </div>
    </Card>
  );
}

function BubbleLabel({ x, y, title, value, radius, light = false, kind = "child" }) {
  const words = title.split(" ");
  const lines = words.length > 1 ? [words[0], words.slice(1).join(" ")] : [title];
  const labelSize = Math.max(9, Math.min(kind === "anchor" ? 15 : 12, radius * 0.2));
  const valueSize = Math.max(7, Math.min(kind === "anchor" ? 12 : 9.5, radius * 0.14));
  const firstDy = lines.length > 1 ? -(labelSize * 0.58) : -(labelSize * 0.24);
  const fill = light ? "#ffffff" : "#102f52";
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={fill} fontFamily="Inter, ui-sans-serif, system-ui">
      {lines.map((line, index) => (
        <tspan key={line} x={x} dy={index === 0 ? firstDy : labelSize * 1.12} fontSize={labelSize} fontWeight="800">
          {line}
        </tspan>
      ))}
      <tspan x={x} dy={labelSize * 1.15} fontSize={valueSize} fontWeight="700">{value}</tspan>
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
  const childColors = ["#c6dfef", "#f6d9c8", "#d9cdef", "#c8e6d6", "#f8e49b"];
  const childRadius = (value) => Math.min(48, 31 + value * 2.4);

  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-[#fbfcff]">
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
              <line x1="610" y1="126" x2={point.x} y2={point.y} stroke="#c3cfdb" strokeWidth="1.3" strokeDasharray="3 7" opacity="0.55" />
              <circle cx={point.x} cy={point.y} r={childRadius(item.value)} fill={childColors[index % childColors.length]} opacity="0.94" />
              <BubbleLabel x={point.x} y={point.y} title={item.name} value={item.value} radius={childRadius(item.value)} />
            </g>
          );
        })}

        {nationalItems.map((item, index) => {
          const point = nationalPositions[index % nationalPositions.length];
          return (
            <g key={item.name}>
              <line x1="218" y1="300" x2={point.x} y2={point.y} stroke="#c3cfdb" strokeWidth="1.3" strokeDasharray="3 7" opacity="0.55" />
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

        <circle cx="610" cy="126" r="78" fill="#f4d77f" opacity="0.98" />
        <BubbleLabel x={610} y={126} title="International Journals" value={internationalTotal} radius={78} kind="anchor" />

        <circle cx="218" cy="300" r="76" fill="#91b7df" opacity="0.98" />
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
    <Card variant="mint" className="p-4">
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#102f52]/30 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <motion.div
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[1.75rem] border border-[#ddd4f5] bg-gradient-to-br from-[#fff8dc] via-white to-[#f7efff] p-5 shadow-2xl sm:rounded-[1.75rem]"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-[#102f52]">{title}</h2>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5ff] text-[#315577] hover:bg-[#dcecff]" aria-label="Close">
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
      <span className="text-xs font-bold text-[#315577]">{label}</span>
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
  const inputClass = "w-full rounded-xl border border-[#d7e6f7] bg-white px-3 py-2.5 text-sm text-[#102f52] outline-none focus:border-[#005baa]";
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

function ArticleDetails({ article, onClose }) {
  const url = publicationUrl(article);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#cfe3fb] bg-gradient-to-br from-[#eef8ff] via-white to-[#f7efff] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#005baa]">{article.year}</p>
            <h3 className="mt-2 text-2xl font-black leading-tight text-[#102f52]">{article.title}</h3>
          </div>
          <Badge tone={indexTone(article.type)}>{article.type}</Badge>
        </div>
        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#315577]">Authors</p>
            <p className="mt-1 text-[#102f52]">{article.authors || "-"}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#315577]">Journal</p>
            <p className="mt-1 text-[#102f52]">{article.venue}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#315577]">Field</p>
            <p className="mt-1 text-[#102f52]">{article.theme}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#315577]">Article Link</p>
            <a href={url} target="_blank" rel="noreferrer" className="mt-1 inline-flex max-w-full items-center gap-2 break-all font-black text-[#005baa] hover:underline">
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
    <Card variant="lemon" className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#005baa]">Publication Data</p>
          <p className="mt-1 text-sm text-[#4f6478]">{canManage ? "Import, export, or add article records in Supabase." : "Sign in first to import, add, edit, or delete records."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label onClick={(event) => !canManage && (event.preventDefault(), onRequireLogin?.())} className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[#d7e6f7] bg-white px-4 py-2.5 text-sm font-semibold text-[#102f52] transition ${canManage ? "cursor-pointer hover:bg-[#f4f9ff]" : "cursor-not-allowed opacity-55"}`}>
            <Icons.upload className="h-4 w-4" />
            Import XLSX
            <input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" onChange={onImport} disabled={!canManage} />
          </label>
          <Button variant="secondary" onClick={onExport} disabled={!publications.length}><Icons.download className="h-4 w-4" />Export XLSX</Button>
          <Button onClick={canManage ? onAddArticle : onRequireLogin} disabled={!canManage}><Icons.plus className="h-4 w-4" />Add new article</Button>
        </div>
      </div>
      {importMessage && <p className={`mt-3 rounded-xl px-3 py-2 text-sm font-semibold ${["Imported", "Added", "Exported", "Updated", "Deleted"].some((word) => importMessage.startsWith(word)) ? "bg-[#dff3e6] text-[#315f45]" : "bg-[#fde2e2] text-[#8a3a3a]"}`}>{importMessage}</p>}
    </Card>
  );
}

function Header({ active }) {
  const titles = {
    dashboard: ["Research Overview", "Department Dashboard", "Live infographics of publication volume, authors, journal indexes, and research fields."],
    publications: ["Publication Records", "Publications", "Search, filter, sort, and review department journal outputs."],
  };
  const [eyebrow, title, desc] = titles[active] || titles.dashboard;

  return (
    <div className="mb-6">
      <p className="text-xs font-black uppercase tracking-[0.35em] text-[#005baa]">{eyebrow}</p>
      <h1 className="mt-1 text-3xl font-black tracking-tight text-[#102f52] md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4f6478]">{desc}</p>
    </div>
  );
}

function FloatingBottomNav({ active, setActive, onLogout, logoutLabel = "Logout" }) {
  return (
    <nav className="mobile-bottom-nav fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 sm:bottom-6 sm:px-6">
      <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-[#d7e6f7] bg-white/95 p-1.5 shadow-[0_18px_48px_rgba(0,91,170,0.14)] backdrop-blur-xl">
        {nav.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button key={item.id} title={item.label} type="button" onClick={() => setActive(item.id)} className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-3 text-xs font-black transition sm:px-4 sm:text-sm ${selected ? "bg-[#ffd23f] text-[#102f52] shadow-sm" : "text-[#315577] hover:bg-[#eef5ff] hover:text-[#005baa]"}`}>
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button type="button" onClick={onLogout} className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-3 text-xs font-black text-[#315577] transition hover:bg-[#eef5ff] hover:text-[#005baa] sm:px-4 sm:text-sm">
          <Icons.logOut className="h-5 w-5" />
          <span>{logoutLabel}</span>
        </button>
      </div>
    </nav>
  );
}


function PublicShell({ mode, setMode, children }) {
  return (
    <div className="min-h-screen bg-white px-4 py-4 text-[#102f52] sm:px-7 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto flex min-h-20 w-full max-w-6xl flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-[#d7e6f7] bg-white px-5 py-4 shadow-[0_22px_70px_rgba(0,91,170,0.10)] sm:px-7 lg:px-9"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#005baa] text-[#ffd23f] shadow-[0_10px_24px_rgba(0,91,170,0.16)] sm:h-14 sm:w-14">
              <Icons.graduation className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <div>
              <p className="text-2xl font-black leading-none tracking-tight text-[#102f52] sm:text-[2rem]">Universitas Terbuka</p>
              <p className="mt-1 text-[9px] font-black uppercase tracking-[0.34em] text-[#005baa] sm:text-[0.68rem]">English Department</p>
            </div>
          </div>
          <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-[#eef5ff] p-1 text-sm font-black">
            <button type="button" onClick={() => setMode("landing")} aria-label="Home" title="Home" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${mode === "landing" ? "bg-[#ffd23f] text-[#102f52] shadow-sm" : "text-[#315577] hover:bg-white"}`}>
              <Icons.home className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setMode("overview")} className={`shrink-0 rounded-full px-4 py-2 transition sm:px-5 ${mode === "overview" ? "bg-[#ffd23f] text-[#102f52] shadow-sm" : "text-[#315577] hover:bg-white"}`}>
              Overview
            </button>
            <button type="button" onClick={() => setMode("publications")} className={`shrink-0 rounded-full px-4 py-2 transition sm:px-5 ${mode === "publications" ? "bg-[#ffd23f] text-[#102f52] shadow-sm" : "text-[#315577] hover:bg-white"}`}>
              Publications
            </button>
            <button type="button" onClick={() => setMode("login")} className={`shrink-0 rounded-full px-4 py-2 transition sm:px-5 ${mode === "login" ? "bg-[#ffd23f] text-[#102f52] shadow-sm" : "text-[#315577] hover:bg-white"}`}>
              Login Mode
            </button>
          </div>
        </motion.nav>
        <main className="mx-auto max-w-6xl py-10">{children}</main>
      </div>
    </div>
  );
}

function LandingPage({ setMode, publications }) {
  const fieldData = themes.map((theme) => ({ name: theme, value: publications.filter((publication) => publication.theme === theme).length })).filter((item) => item.value);
  const trendData = publicationTrendData(publications);

  return (
    <div className="grid min-h-[calc(100vh-12rem)] items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
      <motion.section
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl"
      >
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#005baa]">Research Publications</p>
        <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-[#102f52] sm:text-6xl lg:text-7xl">Department Research Publications</h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-[#4f6478]">A focused dashboard for journal publications, authors, indexes, and research fields across the English Department.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button variant="secondary" onClick={() => setMode("overview")} className="!rounded-2xl px-6 py-3 text-base"><Icons.chart className="h-5 w-5" />View Overview</Button>
          <Button variant="secondary" onClick={() => setMode("publications")} className="!rounded-2xl px-6 py-3 text-base"><Icons.book className="h-5 w-5" />Publications</Button>
          <a href="https://sl.ut.ac.id/publikasi_sasing" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ffd23f] px-6 py-3 text-base font-black text-[#102f52] shadow-sm transition hover:bg-[#f3c72f]">
            <Icons.file className="h-5 w-5" />
            Submit Article
          </a>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[2rem] border border-[#d9e7fb] bg-gradient-to-br from-[#eef8ff] via-[#fff8dc] to-[#f7efff] p-5 shadow-[0_28px_90px_rgba(91,132,177,0.14)] sm:p-7"
      >
        <div className="grid gap-4">
          <Card variant="sky" className="p-5">
            <h2 className="mb-3 font-black text-[#102f52]">Five-year output trend</h2>
            <div className="h-56">
              <ResponsiveContainer>
                <LineChart data={trendData}>
                  <CartesianGrid stroke="#d7e6f7" strokeDasharray="3 3" />
                  <XAxis dataKey="year" tick={{ fill: "#315577", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#315577", fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="publications" stroke="#005baa" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card variant="mint" className="p-5">
            <h2 className="mb-3 font-black text-[#102f52]">Publications by field</h2>
            <div className="h-56">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={fieldData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78}>
                    {fieldData.map((_, index) => <Cell key={index} fill={palette[index % palette.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
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
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#005baa]">Restricted Access</p>
        <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[0.95] tracking-tight text-[#102f52] sm:text-6xl lg:text-7xl">Research Admin Dashboard</h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-[#4f6478]">Sign in to manage publication records, journal indexes, author data, and department research reporting.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => setMode("landing")} aria-label="Home" title="Home" className="!h-12 !w-12 !rounded-2xl !px-0 !py-0"><Icons.home className="h-5 w-5" /></Button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-full max-w-2xl lg:mx-0"
      >
        <div className="absolute -left-8 top-8 hidden rounded-2xl border border-[#d7e6f7] bg-white px-5 py-4 shadow-[0_18px_50px_rgba(0,91,170,0.10)] lg:block">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#c99800]">Admin only</p>
          <p className="mt-1 text-lg font-black text-[#102f52]">Publication data</p>
        </div>
        <Card variant="lavender" className="relative z-10 ml-auto w-full rounded-[2rem] p-5 shadow-[0_28px_90px_rgba(145,124,192,0.16)] sm:p-7 lg:max-w-md lg:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#005baa]">Restricted access</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#102f52] sm:text-4xl">Sign in</h2>
          <p className="mt-3 text-base leading-7 text-[#4f6478]">Welcome back! Please sign in to your account.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-[#102f52]">Email</span>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-[#d7e6f7] bg-white px-3">
                <Icons.users className="h-4 w-4 text-[#6f90af]" />
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email address" className="w-full bg-transparent text-sm text-[#102f52] outline-none placeholder:text-[#8aa0b6]" />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-black text-[#102f52]">Password</span>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-[#d7e6f7] bg-white px-3">
                <Icons.check className="h-4 w-4 text-[#6f90af]" />
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" className="w-full bg-transparent text-sm text-[#102f52] outline-none placeholder:text-[#8aa0b6]" />
              </div>
            </label>
            {error && <p className="rounded-xl bg-[#fde2e2] px-3 py-2 text-sm font-semibold text-[#8a3a3a]">{error}</p>}
            <Button type="submit" className="w-full !rounded-2xl py-3 text-base" disabled={!email || !password || loading}>{loading ? "Signing in..." : "Sign in"}</Button>
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
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#005baa]">Research Overview</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102f52] sm:text-5xl">Department Research Publications</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4f6478]">A quick view of publication volume, authors, journal indexes, and research fields.</p>
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
        <Stat label="Publications" value={filteredPublications.length} icon={Icons.book} note="Filtered output count" />
        <Stat label="Authors" value={authorCount} icon={Icons.users} note="Unique authors in publications" />
        <Stat label="National Journals" value={nationalJournals} icon={Icons.file} note="Sinta 2-6 outputs" />
        <Stat label="International Journals" value={internationalJournals} icon={Icons.award} note="Scopus, EBSCO, Copernicus, DOAJ, ProQuest" tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card variant="sky" className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-black text-[#102f52]">Five-year output trend</h2>
            <Button variant="ghost" onClick={() => setActive("publications")}>{actionLabel}</Button>
          </div>
          <div className="h-80">
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid stroke="#d7e6f7" strokeDasharray="3 3" />
                <XAxis dataKey="year" tick={{ fill: "#315577", fontSize: 12 }} />
                <YAxis tick={{ fill: "#315577", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="publications" stroke="#005baa" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card variant="mint" className="p-5">
          <h2 className="mb-4 font-black text-[#102f52]">Publications by field</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={themeData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100}>
                  {themeData.map((_, index) => <Cell key={index} fill={palette[index % palette.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card variant="lavender" className="p-5">
        <h2 className="mb-2 font-black text-[#102f52]">Journal index bubbles</h2>
        <p className="mb-4 text-sm text-[#4f6478]">National and international journals are the main anchors, with indexed categories clustered around each one.</p>
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
    <button type="button" onClick={() => sortBy(key)} className="inline-flex items-center gap-1 font-black uppercase tracking-[0.16em] text-[#315577] hover:text-[#005baa]">
      {label}{sortKey === key && <span aria-hidden="true">{sortDirection === "asc" ? "↑" : "↓"}</span>}
    </button>
  );

  return (
    <Card variant="neutral" className="mobile-card-table overflow-hidden">
      <div className="border-b border-[#d7e6f7] p-5">
        <h1 className="text-2xl font-black text-[#102f52]">Publication pipeline</h1>
        <p className="mt-1 text-sm text-[#4f6478]">Track journal outputs and indexing level.</p>
      </div>
      <div className="p-5 pt-0">
        <div className="publication-table-shell overflow-x-auto rounded-2xl border border-[#d7e6f7]">
          <table className="w-full table-fixed text-left text-sm">
            <colgroup>
              <col className="w-[17%]" />
              <col className="w-[26%]" />
              <col className="w-[17%]" />
              <col className="w-[11%]" />
              <col className="w-[8%]" />
              <col className="w-[11%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead className="bg-[#f7fbff] text-[10px] uppercase tracking-[0.16em] text-[#315577]">
              <tr>
                <th className="px-3 py-4">{sortHeader("Authors", "authors")}</th>
                <th className="px-3 py-4">{sortHeader("Title", "title")}</th>
                <th className="px-3 py-4">{sortHeader("Journal", "journal")}</th>
                <th className="px-3 py-4">{sortHeader("Field", "theme")}</th>
                <th className="px-3 py-4">{sortHeader("Year", "year")}</th>
                <th className="px-3 py-4">{sortHeader("Index", "index")}</th>
                <th className="px-3 py-4 font-black uppercase tracking-[0.16em] text-[#315577]">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr key={publicationIdentity(item)} className="border-t border-[#edf3f1]">
                  <td className="break-words px-3 py-4 text-[#4f6478]">{item.authors}</td>
                  <td className="break-words px-3 py-4 font-normal text-[#102f52]">{item.title}</td>
                  <td className="break-words px-3 py-4 text-[#4f6478]">{item.venue}</td>
                  <td className="px-3 py-4"><Badge tone="blue">{item.theme}</Badge></td>
                  <td className="px-3 py-4">{item.year}</td>
                  <td className="px-3 py-4"><Badge tone={indexTone(item.type)}>{item.type}</Badge></td>
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-2">
                      {canManage && (
                        <>
                          <button type="button" onClick={() => onEdit?.(item)} title="Edit" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d7e6f7] bg-white text-[#005baa] transition hover:bg-[#eef5ff]" aria-label={`Edit publication: ${item.title}`}>
                            <Icons.edit className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => onDelete?.(item)} title="Delete" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#f3caca] bg-white text-[#8a3a3a] transition hover:bg-[#fde2e2]" aria-label={`Delete publication: ${item.title}`}>
                            <Icons.trash className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button type="button" onClick={() => onSee?.(item)} title="See" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d7e6f7] bg-white text-[#005baa] transition hover:bg-[#eef5ff]" aria-label={`See publication: ${item.title}`}>
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
      {!items.length && <p className="p-6 text-center text-sm text-[#4f6478]">No publications match the current filters.</p>}
    </Card>
  );
}


function PublicPublicationsPage({ items, onSee }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#005baa]">Publication Records</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-[#102f52] sm:text-5xl">Publications</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4f6478]">Browse department journal outputs by authors, title, journal, field, year, and index.</p>
      </div>
      <Publications items={items} onSee={onSee} />
    </div>
  );
}

export default function ResearchDashboard() {
  const [mode, setMode] = useState("landing");
  const [active, setActive] = useState("dashboard");
  const [userEmail, setUserEmail] = useState(() => getStoredUserEmail() || "Preview mode");
  const [publications, setPublications] = useState(() => initialPublications.map(ensurePublicationId));
  const [articleModal, setArticleModal] = useState(null);
  const [viewArticle, setViewArticle] = useState(null);
  const [importMessage, setImportMessage] = useState("");
  const [databaseMessage, setDatabaseMessage] = useState("Loading publications...");
  const [year, setYear] = useState("All years");
  const [theme, setTheme] = useState("All fields");
  const [query, setQuery] = useState("");

  const filteredPublications = useMemo(() => publications.filter((item) => (year === "All years" || item.year === year) && (theme === "All fields" || item.theme === theme) && [item.authors, item.title, item.venue, item.theme, item.status, item.type].some((value) => includes(value, query))), [publications, year, theme, query]);
  const yearOptions = useMemo(() => uniq([...years, ...publications.map((item) => item.year)]).sort((a, b) => String(b).localeCompare(String(a), undefined, { numeric: true })), [publications]);
  const themeOptions = useMemo(() => uniq([...themes, ...publications.map((item) => item.theme)]), [publications]);
  const canManagePublications = Boolean(userEmail && userEmail !== "Preview mode" && getAccessToken());

  useEffect(() => {
    let alive = true;
    const loadPublications = async () => {
      if (!USE_SUPABASE) {
        setDatabaseMessage("Supabase is not configured. Showing sample data.");
        return;
      }
      try {
        const rows = await fetchResearchPublications();
        if (!alive) return;
        setPublications(rows);
        setDatabaseMessage(rows.length ? "" : "No database publications yet. Import XLSX or add a new article.");
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
    const signedInEmail = await signIn(email, password);
    setUserEmail(signedInEmail);
    setActive("dashboard");
    setMode("admin");
  };

  const handleLogout = () => {
    signOut();
    setUserEmail("Preview mode");
    setMode("landing");
  };

  const addArticle = async (article) => {
    try {
      if (!canManagePublications) throw new Error("Please sign in before adding an article.");
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
      await deleteResearchPublication(article.id);
      const identity = publicationIdentity(article);
      setPublications((current) => current.filter((item) => publicationIdentity(item) !== identity));
      setImportMessage("Deleted 1 article.");
    } catch (error) {
      setImportMessage(error.message || "Could not delete this article. Please sign in first.");
    }
  };

  const pages = {
    dashboard: <Dashboard filteredPublications={filteredPublications} setActive={setActive} />,
    publications: <Publications items={filteredPublications} canManage={canManagePublications} onEdit={(item) => setArticleModal({ mode: "edit", item })} onDelete={deleteArticle} onSee={setViewArticle} />,
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
          : <LandingPage setMode={setMode} publications={publications} />;

    return (
      <PublicShell mode={mode} setMode={setMode}>
        {publicContent}
        {viewArticle && <Modal title="Article details" onClose={() => setViewArticle(null)}><ArticleDetails article={viewArticle} onClose={() => setViewArticle(null)} /></Modal>}
      </PublicShell>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-48 text-[#102f52] sm:pb-32">
      <main className="min-w-0 p-3 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
            <Badge tone="slate">{userEmail || "Preview mode"}</Badge>
            <Button variant="secondary" onClick={handleLogout}>{!userEmail || userEmail === "Preview mode" ? "Exit preview" : "Sign out"}</Button>
          </div>
          <Header active={active} />
          <div className="space-y-6">
            {databaseMessage && <Card variant="sky" className="p-4"><p className="text-sm font-semibold text-[#315577]">{databaseMessage}</p></Card>}
            {active === "publications" && <DashboardTools publications={publications} importMessage={importMessage} canManage={canManagePublications} onAddArticle={() => setArticleModal({ mode: "add" })} onExport={exportPublications} onImport={importPublications} onRequireLogin={() => setImportMessage("Please sign in before changing publication data.")} />}
            <Filters year={year} setYear={setYear} theme={theme} setTheme={setTheme} query={query} setQuery={setQuery} yearOptions={yearOptions} themeOptions={themeOptions} />
            <motion.div key={`${active}-${year}-${theme}-${query}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {pages[active] || pages.dashboard}
            </motion.div>
          </div>
        </div>
      </main>
      <FloatingBottomNav active={active} setActive={setActive} onLogout={handleLogout} logoutLabel={!userEmail || userEmail === "Preview mode" ? "Exit preview" : "Logout"} />
      {articleModal?.mode === "add" && <Modal title="Add new article" onClose={() => setArticleModal(null)}><ArticleForm onSave={addArticle} onClose={() => setArticleModal(null)} /></Modal>}
      {articleModal?.mode === "edit" && <Modal title="Edit article" onClose={() => setArticleModal(null)}><ArticleForm initialArticle={articleModal.item} onSave={(article) => editArticle(articleModal.item, article)} onClose={() => setArticleModal(null)} submitLabel="Save changes" /></Modal>}
      {viewArticle && <Modal title="Article details" onClose={() => setViewArticle(null)}><ArticleDetails article={viewArticle} onClose={() => setViewArticle(null)} /></Modal>}
    </div>
  );
}

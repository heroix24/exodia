"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarClock,
  ChevronDown,
  ExternalLink,
  FileSpreadsheet,
  Home,
} from "lucide-react";

// User data
const user = {
  id: "536bc8fc-8d4c-4690-aac5-d36a5224cf8e",
  fullName: "Mak Kaw",
  email: "makkaw@gmail.com",
};

// Theme swatches similar to project cards
const themeOptions = [
  {
    name: "Indigo Night",
    className: "from-indigo-950 via-indigo-900 to-slate-900 text-white",
  },
  {
    name: "Emerald Glow",
    className: "from-emerald-600 via-emerald-500 to-teal-500 text-white",
  },
  {
    name: "Sunset",
    className: "from-orange-600 via-pink-500 to-rose-500 text-white",
  },
  {
    name: "Neutral",
    className: "from-slate-800 via-slate-700 to-slate-600 text-white",
  },
];

type CreatedExcel = {
  title: string;
  description: string;
  fileName: string;
  excelId: string;
  repoName: string;
  repoUrl: string;
  siteUrl: string;
  createdAt: string;
  status: string;
  theme: string;
};

// Deterministic date formatter to avoid hydration mismatches (UTC)
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

// Example Excel apps the user created/posted
const createdExcels: CreatedExcel[] = [
  {
    title: "Sales Dashboard",
    description: "Netlify app generated from sales-data.xlsx",
    fileName: "sales-data.xlsx",
    excelId: "51f5377a-2cce-4f4d-9573-06643e225912",
    repoName: "my-sales-dashboard",
    repoUrl: "https://github.com/nikzr16/my-sales-dashboard",
    siteUrl: "https://my-sales-dashboard-a00a2440.netlify.app/",
    createdAt: "2025-12-06T19:30:31.683Z",
    status: "Deployed",
    theme: themeOptions[0].className,
  },
  {
    title: "Customer Health Tracker",
    description: "Turns customer-health.csv into a live dashboard",
    fileName: "customer-health.csv",
    excelId: "c492a1d3-5f2a-4a37-9d6c-1f9d92f68b81",
    repoName: "customer-health-tracker",
    repoUrl: "https://github.com/example/customer-health-tracker",
    siteUrl: "https://customer-health-tracker.netlify.app/",
    createdAt: "2025-11-22T16:05:00.000Z",
    status: "Live",
    theme: themeOptions[1].className,
  },
];

// Profile cover with avatar
function ProfileCover() {
  return (
    <div className="relative">
      {/* Cover banner */}
      <div className="h-40 bg-[#9B8B7A]" />

      {/* Avatar overlapping cover */}
      <div className="absolute -bottom-12 left-6">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#A8E6CF] via-[#88D8B0] to-[#6BC5A0] border-4 border-white shadow-lg flex items-center justify-center">
          <span className="text-white text-3xl font-semibold">
            {user.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
      </div>
    </div>
  );
}

// Profile info section
function ProfileInfo() {
  // Truncate ID for display
  const truncatedId = `${user.id.slice(0, 8)}...${user.id.slice(-4)}`;

  return (
    <div className="pt-16 px-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {user.fullName}
          </h1>
          <div className="flex items-center gap-2 mt-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-4 rounded-full border-gray-300 text-gray-700 font-normal text-sm"
                >
                  {truncatedId}
                  <ChevronDown className="size-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(user.id)}
                >
                  Copy ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className="h-9 px-4 rounded-full border-gray-300 text-gray-900 font-medium text-sm"
            >
              Edit profile
            </Button>
          </div>
          <p className="mt-4 text-gray-600 text-sm">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

// Tab navigation
function ProfileTabs({ createdCount }: { createdCount: number }) {
  return (
    <div className="border-b border-gray-200 mt-8">
      <div className="px-6 flex items-center gap-1">
        {/* Home icon tab */}
        <button className="h-12 px-4 flex items-center text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
          <Home className="size-5" />
        </button>

        {/* Created tab */}
        <button className="h-12 px-4 flex items-center gap-2 text-gray-900 font-medium border-b-2 border-gray-900">
          Created
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
            {createdCount}
          </span>
        </button>

        {/* Collections tab */}
        <button className="h-12 px-4 flex items-center gap-2 text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300">
          Collections
          <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">
            1
          </span>
        </button>
      </div>
    </div>
  );
}

// Excel documents created by the user
function ExcelDocumentList() {
  const [docs, setDocs] = useState<CreatedExcel[]>(createdExcels);

  const handleThemeChange = (excelId: string, theme: string) => {
    setDocs((prev) =>
      prev.map((doc) => (doc.excelId === excelId ? { ...doc, theme } : doc))
    );
  };

  const docsByDate = useMemo(
    () =>
      [...docs].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [docs]
  );

  return (
    <div className="px-6 py-8">
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {docsByDate.map((doc) => (
          <div
            key={doc.excelId}
            className={`relative overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br ${doc.theme} shadow-sm transition-transform hover:scale-[1.01]`}
          >
            <div className="aspect-[16/10] w-full bg-black/10" />
            <div className="flex flex-col gap-2.5 px-3.5 py-3 text-white">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase text-white/70">
                    {doc.fileName}
                  </p>
                  <h3 className="text-base font-semibold leading-tight">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-white/80">{doc.description}</p>
                </div>
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold">
                  {doc.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
                <span className="flex items-center gap-1">
                  <CalendarClock className="size-4" />
                  {dateFormatter.format(new Date(doc.createdAt))}
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(doc.excelId)}
                  className="rounded-full border border-white/30 px-2 py-0.5 text-[11px] font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
                >
                  Copy Excel ID
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5 text-sm font-semibold">
                {doc.repoUrl && (
                  <a
                    href={doc.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-white hover:text-white/80"
                  >
                    Repo
                    <ExternalLink className="size-4" />
                  </a>
                )}
                {doc.siteUrl && (
                  <a
                    href={doc.siteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-white hover:text-white/80"
                  >
                    Live app
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-white/70">
                  Theme:
                </span>
                {themeOptions.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => handleThemeChange(doc.excelId, option.className)}
                    className={`h-6 rounded-full border px-2.5 text-[10px] font-semibold transition ${
                      doc.theme === option.className
                        ? "border-white bg-white/20 text-white"
                        : "border-white/30 bg-white/10 text-white/80 hover:border-white/50"
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex-1 bg-white overflow-auto">
      <ProfileCover />
      <ProfileInfo />
      <ProfileTabs createdCount={createdExcels.length} />
      <ExcelDocumentList />
    </div>
  );
}

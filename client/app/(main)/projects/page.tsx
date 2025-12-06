"use client";

import { Button } from "@/components/ui/button";
import {
  AudioLines,
  ChevronDown,
  FileInput,
  ImageIcon,
  Upload,
} from "lucide-react";

const quickActions = [
  { label: "Clone a Screenshot", icon: ImageIcon },
  { label: "Import from Figma", icon: FileInput },
  { label: "Upload a Project", icon: Upload },
  { label: "Landing Page" },
  { label: "Sign Up Form" },
];

const communityCards = [
  {
    title: "Cyberpunk dashboard design",
    author: "E",
    forks: "3K Forks",
    theme: "from-gray-900 via-slate-800 to-gray-700 text-white",
  },
  {
    title: "Marketing Website",
    author: "J",
    forks: "2K Forks",
    theme: "from-indigo-950 via-indigo-900 to-slate-900 text-white",
  },
  {
    title: "v0.me",
    author: "Hayden Bleasel",
    forks: "279 Forks",
    theme: "from-white via-slate-100 to-slate-50 text-slate-900 border",
  },
];

export default function DashboardPage() {
  return (
    <main className="flex-1 flex flex-col overflow-auto px-4 pb-10">
      <section className="flex-1">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 pt-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">What can I help you build?</h1>

            <div className="w-full">
              <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <AudioLines className="h-5 w-5 text-emerald-600" />
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
                  v0-1.5-md
                  <ChevronDown className="h-4 w-4" />
                </div>
                <Button size="icon" variant="ghost" className="text-slate-500">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="rounded-lg border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  {action.icon && (
                    <action.icon className="mr-2 h-4 w-4 text-slate-500" />
                  )}
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
              <span>From the Community</span>
              <a className="text-slate-500 hover:text-slate-700" href="#">
                Browse All
              </a>
            </div>

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
              {communityCards.map((card, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br ${card.theme}`}
                >
                  <div className="aspect-[4/3] w-full bg-black/20" />
                  <div className="flex items-center justify-between px-3 py-3 text-sm">
                    <div>
                      <p className="font-semibold">{card.title}</p>
                      <p className="text-xs opacity-70">{card.forks}</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 shadow">
                      {card.author}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

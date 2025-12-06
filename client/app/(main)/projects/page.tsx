"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import {
  Plus,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/api/v1";

interface CreatedApp {
  repoName: string;
  repoUrl: string;
  netlifySiteUrl?: string;
}

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
    author: "HB",
    forks: "279 Forks",
    theme: "from-white via-slate-100 to-slate-50 text-slate-900 border",
  },
  {
    title: "E-commerce Store",
    author: "MK",
    forks: "1.5K Forks",
    theme: "from-emerald-900 via-teal-800 to-cyan-900 text-white",
  },
];

export default function DashboardPage() {
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appName, setAppName] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [netlifyKey, setNetlifyKey] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdApp, setCreatedApp] = useState<CreatedApp | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];
      if (
        validTypes.includes(selectedFile.type) ||
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".csv")
      ) {
        setFile(selectedFile);
      } else {
        alert("Please upload only .xlsx or .csv files");
        e.target.value = "";
      }
    }
  };

  const resetForm = () => {
    setAppName("");
    setGithubToken("");
    setNetlifyKey("");
    setFile(null);
    setError("");
    setCreatedApp(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleCreateApp = async () => {
    if (!file || !token) return;

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("appName", appName.trim());
      formData.append("githubToken", githubToken.trim());
      formData.append("netlifyKey", netlifyKey.trim());

      const response = await fetch(`${API_BASE}/repos/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await response.json();

      if (!response.ok || json.status !== "success") {
        throw new Error(json?.message || "Failed to create app");
      }

      // Show success state
      setCreatedApp({
        repoName: json.data.repo.repoName,
        repoUrl: json.data.repo.repoUrl,
        netlifySiteUrl: json.data.repo.netlifySiteUrl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    appName.trim() && githubToken.trim() && netlifyKey.trim() && file;

  return (
    <main className="flex-1 flex flex-col overflow-auto px-4 pb-10">
      <section className="flex-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 pt-8">
          {/* Header with Create Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              My Projects
            </h2>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New App
            </Button>
          </div>

          {/* Cards Grid */}
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {communityCards.map((card, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br ${card.theme} cursor-pointer transition-transform hover:scale-[1.02]`}
              >
                <div className="aspect-[4/3] w-full bg-black/20" />
                <div className="flex items-center justify-between px-3 py-3 text-sm">
                  <div className="text-left">
                    <p className="font-semibold">{card.title}</p>
                    <p className="text-xs opacity-70">{card.forks}</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 shadow text-xs font-medium">
                    {card.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Create New App Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-lg">
          {createdApp ? (
            // Success State
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  App Created Successfully!
                </DialogTitle>
                <DialogDescription>
                  Your app has been deployed. Here are the links:
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      GitHub Repository
                    </p>
                    <a
                      href={createdApp.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {createdApp.repoUrl}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  {createdApp.netlifySiteUrl && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Netlify Site
                      </p>
                      <a
                        href={createdApp.netlifySiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {createdApp.netlifySiteUrl}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCloseModal}>Done</Button>
              </DialogFooter>
            </>
          ) : (
            // Form State
            <>
              <DialogHeader>
                <DialogTitle>Create New App</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create your new app.
                </DialogDescription>
              </DialogHeader>

              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid gap-4 py-4">
                {/* App Name */}
                <div className="grid gap-2">
                  <Label htmlFor="app-name">App Name</Label>
                  <Input
                    id="app-name"
                    placeholder="my-awesome-app"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-slate-500">
                    Used for GitHub repo name and Netlify site
                  </p>
                </div>

                {/* GitHub PAT Token */}
                <div className="grid gap-2">
                  <Label htmlFor="github-token">GitHub PAT Token</Label>
                  <Input
                    id="github-token"
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-slate-500">
                    Needs repo permissions to create repositories
                  </p>
                </div>

                {/* Netlify API Key */}
                <div className="grid gap-2">
                  <Label htmlFor="netlify-key">Netlify API Key</Label>
                  <Input
                    id="netlify-key"
                    type="password"
                    placeholder="Enter your Netlify API key"
                    value={netlifyKey}
                    onChange={(e) => setNetlifyKey(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-slate-500">
                    Found in Netlify User Settings → Applications → Personal
                    access tokens
                  </p>
                </div>

                {/* File Upload */}
                <div className="grid gap-2">
                  <Label htmlFor="file-upload">
                    Upload File (.xlsx or .csv)
                  </Label>
                  {!file ? (
                    <label
                      htmlFor="file-upload"
                      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-4 transition-colors hover:border-slate-400 hover:bg-slate-100 ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
                    >
                      <Upload className="mb-2 h-8 w-8 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">
                        Click to upload
                      </span>
                      <span className="text-xs text-slate-500">
                        XLSX or CSV files only
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                          <Upload className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateApp}
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create App"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

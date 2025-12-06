"use client";

import { useEffect, useState } from "react";
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
import { Plus, Upload, X } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const communityCards = [
  {
    title: "Cyberpunk dashboard design",
    author: "E",
    forks: "3K Forks",
  },
  {
    title: "Marketing Website",
    author: "J",
    forks: "2K Forks",
  },
  {
    title: "v0.me",
    author: "HB",
    forks: "279 Forks",
  },
  {
    title: "E-commerce Store",
    author: "MK",
    forks: "1.5K Forks",
  },
];

const defaultCardTheme =
  "from-indigo-950 via-indigo-900 to-slate-900 text-white";

const deploymentResult = {
  status: "success",
  message: "App created and deployed successfully",
  data: {
    repo: {
      id: "567d2857-ea1b-490f-b9a1-044f8bdea36c",
      userId: "262c43e5-99a9-49e6-9c95-2f048f5886bd",
      excelId: "51f5377a-2cce-4f4d-9573-06643e225912",
      repoName: "my-sales-dashboard",
      repoUrl: "https://github.com/nikzr16/my-sales-dashboard",
      branch: "main",
      theme: "light",
      netlifySiteUrl: "https://my-sales-dashboard-a00a2440.netlify.app/",
      createdAt: "2025-12-06T19:30:31.683Z",
      updatedAt: "2025-12-06T19:30:31.683Z",
      netlify: {
        siteId: "96cd2a54-1fde-43a1-bbfe-1e530a7d0754",
        siteName: "my-sales-dashboard-a00a2440",
        siteUrl: "https://my-sales-dashboard-a00a2440.netlify.app/",
        adminUrl: "https://app.netlify.com/sites/my-sales-dashboard-a00a2440",
        linked: true,
      },
    },
    excelId: "51f5377a-2cce-4f4d-9573-06643e225912",
    generator: "claude",
  },
} as const;

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCard, setSelectedCard] =
    useState<(typeof communityCards)[number] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appName, setAppName] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [netlifyKey, setNetlifyKey] = useState("");
  const [file, setFile] = useState<File | null>(null);

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

  const handleCreateApp = () => {
    // Handle app creation logic here
    console.log("Creating app:", {
      appName,
      githubToken,
      netlifyKey,
      file: file?.name,
    });
    setAppName("");
    setGithubToken("");
    setNetlifyKey("");
    setFile(null);
    setIsModalOpen(false);
  };

  const handleCardClick = (card: (typeof communityCards)[number]) => {
    setSelectedCard(card);
    setIsDetailsOpen(true);
  };

  const isFormValid =
    appName.trim() && githubToken.trim() && netlifyKey.trim() && file;

  useEffect(() => {
    const handler = () => setIsSearchOpen(true);
    window.addEventListener("open-project-search", handler);
    return () => window.removeEventListener("open-project-search", handler);
  }, []);

  const filteredCards = communityCards.filter((card) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return (
      card.title.toLowerCase().includes(query) ||
      card.author.toLowerCase().includes(query) ||
      card.forks.toLowerCase().includes(query)
    );
  });

  return (
    <main className="flex-1 flex flex-col overflow-auto px-4 pb-10">
      <section className="flex-1">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 pt-8">
          {/* Header with Create Button */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-slate-900">My Projects</h2>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gap-2 w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Create New App
            </Button>
          </div>

          {/* Cards Grid */}
          {filteredCards.length ? (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredCards.map((card, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardClick(card)}
                  className={`relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br ${defaultCardTheme} cursor-pointer transition-transform hover:scale-[1.02]`}
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
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              No projects match “{searchTerm}”.
            </div>
          )}
        </div>
      </section>

      {/* Search popup (command dialog) */}
      <CommandDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        className="w-[520px] max-w-[90vw] sm:max-w-lg min-h-[360px]"
      >
        <CommandInput
          value={searchTerm}
          onValueChange={setSearchTerm}
          placeholder="Search projects by name, author, or forks"
        />
        <CommandList className="h-72 overflow-y-auto">
          <CommandEmpty>No projects found.</CommandEmpty>
          <CommandGroup heading="Projects">
            {filteredCards.map((card, idx) => (
              <CommandItem
                key={`${card.title}-${idx}`}
                value={`${card.title} ${card.author} ${card.forks}`}
                onSelect={() => {
                  handleCardClick(card);
                  setIsSearchOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{card.title}</span>
                  <span className="text-xs text-muted-foreground">
                    Author: {card.author} · {card.forks}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Deployment details dialog */}
      <Dialog
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) setSelectedCard(null);
        }}
      >
        <DialogContent
          className={`w-[min(92vw,820px)] sm:max-w-2xl bg-gradient-to-br ${defaultCardTheme}`}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedCard ? `${selectedCard.title} · Deployment` : "Deployment"}
            </DialogTitle>
            <DialogDescription>
              Parameters returned after creating and deploying the app.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur">
              <div>
                <p className="text-xs uppercase text-white/70">Repo</p>
                <a
                  href={deploymentResult.data.repo.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium break-words text-white hover:underline"
                >
                  {deploymentResult.data.repo.repoName}
                </a>
                <p className="break-words text-xs text-white/70">
                  {deploymentResult.data.repo.repoUrl}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-white/70">Branch</p>
                <p className="font-medium text-white">
                  {deploymentResult.data.repo.branch}
                </p>
                <p className="text-xs text-white/70">
                  Theme: {deploymentResult.data.repo.theme}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-white/70">Netlify Site</p>
                <a
                  href={deploymentResult.data.repo.netlify.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium break-words text-white hover:underline"
                >
                  {deploymentResult.data.repo.netlify.siteName}
                </a>
                <p className="break-words text-xs text-emerald-200">
                  {deploymentResult.data.repo.netlify.siteUrl}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create New App Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New App</DialogTitle>
            <DialogDescription>
              Fill in the details below to create your new app.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* App Name */}
            <div className="grid gap-2">
              <Label htmlFor="app-name">App Name</Label>
              <Input
                id="app-name"
                placeholder="My Awesome App"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />
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
              />
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
              />
            </div>

            {/* File Upload */}
            <div className="grid gap-2">
              <Label htmlFor="file-upload">Upload File (.xlsx or .csv)</Label>
              {!file ? (
                <label
                  htmlFor="file-upload"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-4 transition-colors hover:border-slate-400 hover:bg-slate-100"
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
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateApp} disabled={!isFormValid}>
              Create App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

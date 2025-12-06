import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Layout, Search } from "lucide-react";

const primaryNav = [
  { label: "Search", icon: Search },
  { label: "Projects", icon: Layout, href: "/projects" },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 px-5 py-6 gap-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <div className="h-9 w-9 rounded-lg bg-black text-white flex items-center justify-center text-xs font-bold">
            v0
          </div>
          <span>Personal</span>
        </div>

        <Button
          variant="outline"
          className="w-full justify-start rounded-lg border border-slate-200 text-slate-700"
        >
          <span className="mr-2">+</span> New Sheets
        </Button>

        <nav className="space-y-6 text-sm">
          <div className="space-y-1">
            {primaryNav.map((item) => (
              <a
                key={item.label}
                className="flex items-center gap-3 rounded-md px-2 py-2 text-slate-700 hover:bg-slate-100"
                href={item.href}
              >
                <item.icon className="h-4 w-4 text-slate-500" />
                {item.label}
              </a>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 px-3 py-4 text-center text-xs text-slate-500">
            You haven&apos;t created any chats yet.
          </div>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-end gap-3 border-b border-slate-100 px-6 py-4">
          <Button variant="outline" className="rounded-lg border-slate-200">
            Upgrade
          </Button>
          <Button variant="outline" className="rounded-lg border-slate-200">
            Feedback
          </Button>
          <ProfileDropdown />
        </header>

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}

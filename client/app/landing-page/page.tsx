"use client";

import Link from "next/link";
import { ArrowRight, FileSpreadsheet, AlertTriangle, Code2, Clock, Eye, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const problems = [
  {
    title: "File Duplicate Chaos",
    description: "Excel files multiplied, renamed, and fragmented across teams.",
    icon: FileSpreadsheet,
  },
  {
    title: "Formula Breakage Fear",
    description: "Afraid to share or edit files due to formula destruction.",
    icon: AlertTriangle,
  },
  {
    title: "No Developer Access",
    description: "Can't afford or access developers to build proper tools.",
    icon: Code2,
  },
  {
    title: "Manual Time Waste",
    description: "Hours spent on manual data entry and updates.",
    icon: Clock,
  },
  {
    title: "No Real-Time Visibility",
    description: "Stale files without modern interface or dashboards.",
    icon: Eye,
  },
  {
    title: "Broken Workflows",
    description: "Teams can't collaborate without breaking everything.",
    icon: Users,
  },
];

const steps = [
  {
    title: "File Duplicate Chaos",
    description: "Excel files multiplied, renamed, and fragmented across teams.",
  },
  {
    title: "Formula Breakage Fear",
    description: "Afraid to share or edit files due to formula destruction.",
  },
  {
    title: "No Developer Access",
    description: "Can't afford or access developers to build proper tools.",
  },
  {
    title: "Manual Time Waste",
    description: "Hours spent on manual data entry and updates.",
  },
  {
    title: "File Duplicate Chaos",
    description: "Excel files multiplied, renamed, and fragmented across teams.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "Early Access",
    description: "Perfect for individuals testing the waters.",
    features: [
      "1 Excel to Web App conversion",
      "Basic components",
      "500 row limit",
      "Email support",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    description: "For small teams and frequent users.",
    features: [
      "Unlimited conversions",
      "Priority generation",
      "Export React/Next.js options",
      "Faster build speed",
      "Early access to new features",
      "Chat support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$10",
    period: "/user",
    description: "Perfect for collaborative teams that scale.",
    features: [
      "Everything in Pro",
      "Team collaboration features",
      "API access",
      "Private Slack channel",
      "Enhanced performance",
      "Dedicated onboarding",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a3d2e]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1a5f3c]/10 bg-[#faf9f6]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[#1a5f3c]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1a5f3c]">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-[#1a5f3c]">EXODIA</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="#" className="text-[#1a3d2e]/70 transition-colors hover:text-[#1a5f3c]">
              Home
            </Link>
            <Link href="#" className="text-[#1a3d2e]/70 transition-colors hover:text-[#1a5f3c]">
              Product
            </Link>
            <Link href="#" className="text-[#1a3d2e]/70 transition-colors hover:text-[#1a5f3c]">
              Features
            </Link>
            <Link href="#" className="text-[#1a3d2e]/70 transition-colors hover:text-[#1a5f3c]">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="#" className="hidden text-sm text-[#1a3d2e]/70 transition-colors hover:text-[#1a5f3c] md:inline">
              Sign In
            </Link>
            <Button className="rounded-full bg-[#1a5f3c] px-5 text-sm font-medium text-white hover:bg-[#154a2f]">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#faf9f6] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-[#1a3d2e] md:text-5xl lg:text-6xl">
                Excel to Real Web App{" "}
                <span className="italic text-[#1a5f3c]">in One Click</span>
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-[#1a3d2e]/70">
                Turn the spreadsheet you already trust into clean, functional web applications — without code, setup, or complexity.
              </p>
              <Button className="rounded-full bg-[#1a5f3c] px-8 py-6 text-base font-medium text-white hover:bg-[#154a2f]">
                Start Generate Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-[#1a3d2e]/10 bg-[#0d1117] shadow-2xl">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#27ca40]" />
                </div>
                <div className="p-6 font-mono text-sm text-[#7ee787]">
                  <p className="text-[#8b949e]"># Converting spreadsheet...</p>
                  <p className="mt-2">$ exodia generate --input data.xlsx</p>
                  <p className="mt-4 text-[#58a6ff]">✓ Analyzing columns...</p>
                  <p className="text-[#58a6ff]">✓ Generating components...</p>
                  <p className="text-[#58a6ff]">✓ Building web app...</p>
                  <p className="mt-4 text-[#7ee787]">🎉 Success! Your app is ready.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Green Wave Divider */}
      <div className="h-24 bg-gradient-to-b from-[#faf9f6] to-[#1a5f3c]" />

      {/* Problem Section */}
      <section className="bg-[#faf9f6] py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[#1a5f3c]">
              THE PROBLEM
            </p>
            <h2 className="font-serif text-3xl font-medium italic text-[#1a5f3c] md:text-4xl">
              Stop Fighting Spreadsheets.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#1a3d2e]/70">
              Most technical & Excel users face a fundamental gap between their data and the web applications they need.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem, index) => (
              <Card
                key={index}
                className="group overflow-hidden rounded-2xl border-0 bg-[#1a5f3c] shadow-lg transition-all hover:shadow-xl"
              >
                <CardHeader className="pb-2">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                    <problem.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-white">
                    {problem.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-white/80">
                    {problem.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transform Section */}
      <section className="bg-[#faf9f6] py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-medium leading-tight text-[#1a3d2e] md:text-4xl">
                Transform Your Excel into{" "}
                <span className="italic text-[#1a5f3c]">Demand Generation</span>
              </h2>
              <div className="space-y-4 text-[#1a3d2e]/70">
                <p className="flex items-start gap-2">
                  <span className="font-medium text-[#1a5f3c]">→</span>
                  Customizable and User
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-medium text-[#1a5f3c]">→</span>
                  Build for Enterprises, Not Builders
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-medium text-[#1a5f3c]">→</span>
                  Rapid Excel-based Tooling
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-[#f5f3ef] p-8">
              <p className="text-lg leading-relaxed text-[#1a3d2e]/80">
                "We've cut down by using a framework, intuitive, web processes, and cleanliness over complex flows that clutter Excel workflows."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#faf9f6] py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[#1a5f3c]">
              HOW IT WORKS
            </p>
            <h2 className="font-serif text-3xl font-medium text-[#1a3d2e] md:text-4xl">
              Five Steps to Your Web App
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#1a3d2e]/70">
              From spreadsheet to live application in minutes, not months.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {steps.slice(0, 4).map((step, index) => (
              <Card
                key={index}
                className="overflow-hidden rounded-2xl border-0 bg-[#1a5f3c] shadow-lg"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-white">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-white/80">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Card className="w-full max-w-md overflow-hidden rounded-2xl border-0 bg-[#1a5f3c] shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-white">
                  {steps[4].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-white/80">
                  {steps[4].description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-[#faf9f6] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <blockquote className="font-serif text-2xl font-medium italic leading-relaxed text-[#1a3d2e] md:text-3xl">
            "Working with this team changed the way we think about pricing and growth. We saw clarity, speed and real revenue movement within weeks."
          </blockquote>
          <div className="mt-8">
            <p className="font-semibold text-[#1a3d2e]">Sarah Chen</p>
            <p className="text-sm text-[#1a3d2e]/60">Operations Lead, TechCorp</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-[#f5f3ef] py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[#1a5f3c]">
              PRICING
            </p>
            <h2 className="font-serif text-3xl font-medium text-[#1a3d2e] md:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#1a3d2e]/70">
              Choose the plan that fits your needs. Start Free, upgrade when you're ready.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden rounded-2xl border ${
                  plan.highlighted
                    ? "border-[#1a5f3c] shadow-xl"
                    : "border-[#1a3d2e]/10 shadow-lg"
                } bg-white`}
              >
                {plan.highlighted && (
                  <div className="absolute right-4 top-4">
                    <Badge className="rounded-full bg-[#1a5f3c] text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <p className="text-sm font-medium text-[#1a5f3c]">{plan.name}</p>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#1a3d2e]">
                      {plan.price}
                    </span>
                    <span className="text-[#1a3d2e]/60">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#1a3d2e]/70">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#1a5f3c]" />
                        <span className="text-[#1a3d2e]/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full rounded-full ${
                      plan.highlighted
                        ? "bg-[#1a5f3c] text-white hover:bg-[#154a2f]"
                        : "border border-[#1a5f3c] bg-transparent text-[#1a5f3c] hover:bg-[#1a5f3c]/5"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a5f3c] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="font-serif text-3xl font-medium text-white md:text-4xl">
            Ready to Transform Your Excel?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Join hundreds of businesses already building web apps from their spreadsheets. It takes just a few clicks to see it in action.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button className="rounded-full bg-white px-8 py-6 text-base font-medium text-[#1a5f3c] hover:bg-white/90">
              Claim Early Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/30 bg-transparent px-8 py-6 text-base font-medium text-white hover:bg-white/10"
            >
              See Demo
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/60">
            No credit card required • Free for sandbox forever
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#faf9f6] py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-6">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1a5f3c]">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-lg font-semibold text-[#1a5f3c]">EXODIA</span>
              </div>
              <p className="mt-4 text-sm text-[#1a3d2e]/60">
                Transform spreadsheets into powerful web applications without code.
              </p>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold text-[#1a3d2e]">Product</p>
              <ul className="space-y-2 text-sm text-[#1a3d2e]/60">
                <li><Link href="#" className="hover:text-[#1a5f3c]">Features</Link></li>
                <li><Link href="#" className="hover:text-[#1a5f3c]">Pricing</Link></li>
                <li><Link href="#" className="hover:text-[#1a5f3c]">Changelog</Link></li>
                <li><Link href="#" className="hover:text-[#1a5f3c]">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold text-[#1a3d2e]">Resources</p>
              <ul className="space-y-2 text-sm text-[#1a3d2e]/60">
                <li><Link href="#" className="hover:text-[#1a5f3c]">Documentation</Link></li>
                <li><Link href="#" className="hover:text-[#1a5f3c]">Tutorials</Link></li>
                <li><Link href="#" className="hover:text-[#1a5f3c]">Blog</Link></li>
                <li><Link href="#" className="hover:text-[#1a5f3c]">Community</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold text-[#1a3d2e]">Company</p>
              <ul className="space-y-2 text-sm text-[#1a3d2e]/60">
                <li><Link href="#" className="hover:text-[#1a5f3c]">About</Link></li>
                <li><Link href="#" className="hover:text-[#1a5f3c]">Careers</Link></li>
                <li><Link href="#" className="hover:text-[#1a5f3c]">Press</Link></li>
                <li><Link href="#" className="hover:text-[#1a5f3c]">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold text-[#1a3d2e]">Legal</p>
              <ul className="space-y-2 text-sm text-[#1a3d2e]/60">
                <li><Link href="#" className="hover:text-[#1a5f3c]">Privacy</Link></li>
                <li><Link href="#" className="hover:text-[#1a5f3c]">Terms</Link></li>
                <li><Link href="#" className="hover:text-[#1a5f3c]">Security</Link></li>
              </ul>
            </div>
          </div>

          {/* Large EXODIA text */}
          <div className="mt-16 overflow-hidden">
            <h2 className="text-center font-serif text-[8rem] font-bold leading-none tracking-tight text-[#1a5f3c]/10 md:text-[12rem]">
              EXODIA
            </h2>
          </div>
        </div>
      </footer>
    </div>
  );
}

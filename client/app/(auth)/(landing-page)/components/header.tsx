"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Logo } from "./logo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#fff6ed]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1000px] items-center justify-between px-4 py-4 md:px-5 md:py-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link
            href="#"
            className="text-[#424242]/70 transition-colors hover:text-[#0d7239]"
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-[#424242]/70 transition-colors hover:text-[#0d7239]"
          >
            Product
          </Link>
          <Link
            href="#"
            className="text-[#424242]/70 transition-colors hover:text-[#0d7239]"
          >
            Features
          </Link>
          <Link
            href="#"
            className="text-[#424242]/70 transition-colors hover:text-[#0d7239]"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href="#"
            className="hidden text-sm text-[#424242]/70 transition-colors hover:text-[#0d7239] md:inline"
          >
            Sign In
          </Link>
          <Button className="hidden bg-[#0d7239] px-4 py-2 text-sm font-semibold text-[#fff6ed] hover:bg-[#0a5c2d] md:inline-flex">
            Get Started
          </Button>
          <button
            className="md:hidden p-2 text-[#0d7239]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#fff6ed] border-t border-[#0d7239]/20 px-4 py-4">
          <nav className="flex flex-col gap-4">
            <Link
              href="#"
              className="text-[#424242]/70 transition-colors hover:text-[#0d7239] py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-[#424242]/70 transition-colors hover:text-[#0d7239] py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Product
            </Link>
            <Link
              href="#"
              className="text-[#424242]/70 transition-colors hover:text-[#0d7239] py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#"
              className="text-[#424242]/70 transition-colors hover:text-[#0d7239] py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-[#424242]/70 transition-colors hover:text-[#0d7239] py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Button className="w-full bg-[#0d7239] px-4 py-2 text-sm font-semibold text-[#fff6ed] hover:bg-[#0a5c2d]">
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}


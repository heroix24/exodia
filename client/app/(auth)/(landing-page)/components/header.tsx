"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Logo } from "./logo";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { href: "#top", label: "Home" },
  { href: "#how-it-works", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 bg-[#fff6ed]/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-[1000px] items-center justify-between px-4 py-4 md:px-5 md:py-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Logo />
        </motion.div>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
            >
              <Link
                href={item.href}
                className="text-[#424242]/70 transition-colors hover:text-[#0d7239]"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex items-center gap-3 md:gap-4"
        >
          <Link
            href="/login-page"
            className="hidden text-sm text-[#424242]/70 transition-colors hover:text-[#0d7239] md:inline"
          >
            Sign In
          </Link>
          <Link href="/register-page">
            <Button className="hidden bg-[#0d7239] px-4 py-2 text-sm font-semibold text-[#fff6ed] hover:bg-[#0a5c2d] md:inline-flex">
              Get Started
            </Button>
          </Link>
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
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-[#fff6ed] border-t border-[#0d7239]/20 overflow-hidden"
          >
            <nav className="flex flex-col gap-4 px-4 py-4">
              {[...navItems, { href: "/login-page", label: "Sign In" }].map(
                (item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className="text-[#424242]/70 transition-colors hover:text-[#0d7239] py-2 block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <Link href="/register-page">
                  <Button className="w-full bg-[#0d7239] px-4 py-2 text-sm font-semibold text-[#fff6ed] hover:bg-[#0a5c2d]">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

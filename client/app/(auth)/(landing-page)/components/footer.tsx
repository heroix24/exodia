"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { motion } from "motion/react";

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Changelog", "Roadmap"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Tutorials", "Blog", "Community"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security"],
  },
];

export function Footer() {
  return (
    <motion.footer
      className="mx-auto max-w-[1000px] px-4 md:px-14 py-8 md:py-12"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0">
        <motion.div
          className="max-w-full md:max-w-[280px]"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="mb-4">
            <Logo />
          </div>
          <p className="text-sm text-[#424242]/60 leading-relaxed">
            Transform Excel files into web apps instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-12 lg:gap-24">
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + sectionIndex * 0.1, duration: 0.4 }}
            >
              <p className="mb-3 md:mb-4 text-sm font-semibold text-[#424242]">
                {section.title}
              </p>
              <ul className="space-y-2 text-sm text-[#424242]/60">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.4 + sectionIndex * 0.1 + linkIndex * 0.05,
                      duration: 0.3,
                    }}
                  >
                    <Link
                      href="#"
                      className="hover:text-[#0d7239] transition-colors"
                    >
                      {link}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}

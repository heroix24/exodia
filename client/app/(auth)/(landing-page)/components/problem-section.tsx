"use client";

import { FeatureCard } from "./feature-card";
import { motion } from "motion/react";

const problems = [
  {
    title: "File Duplicate Chaos",
    description: "Excel files multiplied, renamed, and fragmented across teams",
  },
  {
    title: "Formula Breakage Fear",
    description: "Afraid to share or edit files due to formula destruction",
  },
  {
    title: "No Developer Access",
    description: "Can't afford or access developers to build proper tools",
  },
  {
    title: "Manual Time Waste",
    description: "Hours spent on manual data entry and updates",
  },
  {
    title: "No Real-Time Visibility",
    description: "Static files without modern interface or collaboration",
  },
  {
    title: "Broken Workflows",
    description: "Teams can't collaborate without breaking everything",
  },
];

export function ProblemSection() {
  return (
    <section className="mx-4 md:mx-auto max-w-[1000px] overflow-hidden px-4 md:px-5 py-6 md:py-8">
      <div className="flex flex-col gap-4 md:gap-5 items-center">
        <motion.p
          className="text-[#0d7239] text-base md:text-lg font-medium uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          The Problem
        </motion.p>
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-center"
          style={{ fontFamily: "'Edu TAS Beginner', cursive" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Stop Fighting <span className="text-[#0d7239]">Spreadsheets.</span>
        </motion.h2>
        <motion.p
          className="text-[#424242]/70 text-sm md:text-base text-center max-w-2xl px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Non-technical Excel users face a fundamental gap between their data
          and the web applications they need.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-4">
          {problems.map((problem, index) => (
            <FeatureCard
              key={index}
              title={problem.title}
              description={problem.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

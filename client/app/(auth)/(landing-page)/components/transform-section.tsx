"use client";

import { Safari } from "@/components/ui/safari";
import { motion } from "motion/react";

const features = [
  "Customizable and User-Friendly",
  "Build for Enterprises, Not Builders",
  "Rapid Excel-based Tooling",
];

export function TransformSection() {
  return (
    <section className="mx-4 md:mx-auto max-w-[1000px] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <motion.div
          className="px-4 md:px-14 py-8 md:py-12"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold leading-tight mb-6 md:mb-8"
            style={{ fontFamily: "'Edu TAS Beginner', cursive" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Transform Your Excel into{" "}
            <span className="text-[#0d7239]">Demand Generation</span>
          </motion.h2>
          <div className="flex flex-col gap-4 md:gap-5 text-[#0d7239]">
            {features.map((feature, index) => (
              <motion.p
                key={index}
                className="flex items-start gap-2 text-sm md:text-base"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <motion.span
                  className="font-medium"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    delay: 0.4 + index * 0.1,
                  }}
                >
                  →
                </motion.span>
                {feature}
              </motion.p>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="px-4 md:px-14 py-8 md:py-12 flex flex-col justify-center gap-6"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <motion.p
            className="text-[#424242]/80 text-sm md:text-base leading-relaxed"
            style={{ fontFamily: "'Edu TAS Beginner', cursive" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            &quot;Non-technical users can turn spreadsheets into usable, scalable
            web applications, and customer-facing products. This lets them move
            faster, cut costs, and own their product workflows.&quot;
          </motion.p>
          <motion.div
            className="relative w-full max-w-[320px] mx-auto"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <Safari url="exodia.app" className="w-full shadow-lg" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

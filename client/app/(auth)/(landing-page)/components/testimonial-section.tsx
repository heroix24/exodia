"use client";

import { motion } from "motion/react";

interface TestimonialSectionProps {
  quote: string;
  author: string;
  role: string;
}

export function TestimonialSection({
  quote,
  author,
  role,
}: TestimonialSectionProps) {
  return (
    <section className="mx-4 md:mx-auto max-w-[1000px] overflow-hidden px-4 md:px-14 py-8 md:py-12">
      <motion.blockquote
        className="text-lg md:text-2xl font-bold italic leading-relaxed"
        style={{ fontFamily: "'Edu TAS Beginner', cursive" }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          &quot;{quote}&quot;
        </motion.span>
      </motion.blockquote>
      <motion.div
        className="mt-6 md:mt-8"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.p
          className="font-semibold text-[#0d7239]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {author}
        </motion.p>
        <motion.p
          className="text-sm text-[#424242]/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          {role}
        </motion.p>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";

interface FeatureCardProps {
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({ title, description, index = 0 }: FeatureCardProps) {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="h-[160px] sm:h-[200px] md:h-[260px] w-full bg-[#0d7239] rounded-t-2xl" />
      <div className="px-5 md:px-6 py-5 md:py-7 bg-gradient-to-b from-[#a8c5a8] to-[#e8ede4] rounded-b-2xl min-h-[120px] md:min-h-[140px]">
        <h3 className="text-lg md:text-xl font-semibold text-[#424242] mb-2">
          {title}
        </h3>
        <p className="text-sm md:text-base font-medium text-[#424242]">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

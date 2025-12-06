"use client";

import { motion } from "motion/react";

export function WaveDivider() {
  return (
    <div className="relative h-[80px] md:h-[150px] overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 150"
        preserveAspectRatio="none"
      >
        {[...Array(8)].map((_, i) => (
          <motion.path
            key={i}
            d={`M0 ${75 + i * 5} Q480 ${60 + i * 8} 960 ${75 + i * 5} T1920 ${
              75 + i * 5
            }`}
            fill="none"
            stroke="#0d7239"
            strokeWidth="1"
            strokeOpacity={0.15 + i * 0.02}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
              pathLength: { duration: 1.2, delay: i * 0.08, ease: "easeOut" },
              opacity: { duration: 0.3, delay: i * 0.08 },
            }}
          />
        ))}
      </svg>
    </div>
  );
}

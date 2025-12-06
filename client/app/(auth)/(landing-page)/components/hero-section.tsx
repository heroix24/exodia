"use client";

import { Button } from "@/components/ui/button";
import { Safari } from "@/components/ui/safari";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="mx-4 md:mx-auto max-w-[1000px] overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 px-4 md:px-5 py-8 md:py-10">
        <motion.div
          className="flex flex-col gap-6 md:gap-8 max-w-full lg:max-w-[387px] text-center lg:text-left"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.3 },
            },
          }}
        >
          <motion.h1
            className="font-bold text-3xl md:text-4xl leading-tight"
            style={{ fontFamily: "var(--font-edu-tas-beginner), cursive" }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <span className="text-[#0d7239]">Excel</span> to{" "}
            <span className="text-[#0d7239]">Real Web App</span>
            <br />
            in One Click
          </motion.h1>
          <motion.p
            className="text-[#0d7239] text-sm md:text-base font-medium leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut" },
              },
            }}
          >
            Turn the spreadsheets you already trust into living, interactive
            applications — without code, setup, or developers.
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.5, ease: "easeOut" },
              },
            }}
          >
            <Button className="w-full sm:w-fit mx-auto lg:mx-0 bg-[#0d7239] px-4 py-4 text-sm md:text-base font-semibold text-[#fff6ed] hover:bg-[#0a5c2d]">
              Start Convert Sheets
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="relative w-full lg:w-auto"
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Progressive blur circle - multiple layers for smooth falloff */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Outer soft glow */}
            <motion.div
              className="absolute w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(180,210,180,0.3)_0%,rgba(180,210,180,0)_70%)] blur-[60px]"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Mid layer */}
            <motion.div
              className="absolute w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(169,199,169,0.4)_0%,rgba(169,199,169,0)_60%)] blur-[40px]"
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            {/* Inner concentrated glow */}
            <motion.div
              className="absolute w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(158,189,158,0.5)_0%,rgba(158,189,158,0)_50%)] blur-[25px]"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            {/* Core subtle tint */}
            <motion.div
              className="absolute w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(148,179,148,0.35)_0%,rgba(148,179,148,0)_70%)] blur-[15px]"
              animate={{
                scale: [1, 1.12, 1],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            />
          </div>
          <motion.div
            className="relative w-full max-w-[480px] mx-auto aspect-square lg:w-[480px] lg:h-[450px] flex items-center justify-center p-4 md:p-0"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Safari
              url="exodia.app"
              youtubeSrc="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="w-full max-w-[480px] shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { Flower } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  index?: number;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  highlighted = false,
  index = 0,
}: PricingCardProps) {
  return (
    <motion.div
      className={`relative flex flex-col justify-between rounded-lg h-full ${
        highlighted
          ? "border-2 border-[#0d7239]"
          : "border border-[#c8c8c8]"
      } bg-[#fff6ed] px-4 md:px-5 py-6 md:py-8 w-full max-w-[320px]`}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        boxShadow: "0 20px 40px rgba(13, 114, 57, 0.15)",
        transition: { duration: 0.3 },
      }}
    >
      {highlighted && (
        <motion.div
          className="absolute -top-5 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.15, duration: 0.4, type: "spring" }}
        >
          <div className="bg-[#0d7239] rounded-full px-4 md:px-8 py-2 flex items-center gap-2 whitespace-nowrap">
            <Flower className="w-5 h-5 md:w-6 md:h-6 text-[#fff6ed]" />
            <span className="text-sm md:text-base font-semibold text-[#fff6ed]">
              Most Popular
            </span>
          </div>
        </motion.div>
      )}
      <div className="flex flex-col gap-4 md:gap-5 flex-1">
        <motion.p
          className="text-base font-medium text-[#0d7239]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.15 }}
        >
          {name}
        </motion.p>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 + index * 0.15 }}
        >
          <span
            className="text-[28px] md:text-[32px] font-bold text-[#0d7239]"
            style={{ fontFamily: "'Edu TAS Beginner', cursive" }}
          >
            {price}
          </span>
          <span className="text-sm md:text-base font-medium text-[#0d7239]">
            {period}
          </span>
        </motion.div>
        <motion.p
          className="text-sm md:text-base font-medium text-[#0d7239]/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.15 }}
        >
          {description}
        </motion.p>
        <div className="flex flex-col gap-3 md:gap-5 flex-1">
          {features.map((feature, featureIndex) => (
            <motion.p
              key={featureIndex}
              className="text-sm font-medium text-[#0d7239]"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 + index * 0.15 + featureIndex * 0.05 }}
            >
              {feature}
            </motion.p>
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 + index * 0.15 }}
      >
        <Button
          className={`w-full py-4 rounded-lg font-semibold text-sm md:text-base mt-6 ${
            highlighted
              ? "bg-[#0d7239] text-[#fff6ed] hover:bg-[#0a5c2d]"
              : "bg-[#f2f2f2] text-[#0d7239] hover:bg-[#e5e5e5]"
          }`}
        >
          {cta}
        </Button>
      </motion.div>
    </motion.div>
  );
}

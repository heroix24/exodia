"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export function CTASection() {
  return (
    <section className="mx-4 md:mx-auto max-w-[1000px] overflow-hidden">
      <motion.div
        className="bg-[#0d7239] px-4 md:px-14 py-10 md:py-16 rounded-2xl mx-4 my-6 md:my-8"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center">
          <motion.h2
            className="text-2xl md:text-4xl font-bold mb-4 text-[#fff6ed]"
            style={{ fontFamily: "'Edu TAS Beginner', cursive" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Ready to Transform Your Excel?
          </motion.h2>
          <motion.p
            className="text-[#fff6ed]/80 text-sm md:text-base max-w-2xl mx-auto mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Join hundreds of businesses already building web apps from their
            spreadsheets. Limited early access spots available.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button className="w-full sm:w-auto bg-[#fff6ed] px-6 md:px-8 py-4 md:py-6 text-sm md:text-base font-semibold text-[#0d7239] hover:bg-[#fff6ed]/90 flex items-center justify-center gap-2">
                Claim Early Access
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                </motion.span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="w-full sm:w-auto border border-[#fff6ed] bg-transparent px-6 md:px-8 py-4 md:py-6 text-sm md:text-base font-semibold text-[#fff6ed] hover:bg-[#fff6ed]/10"
              >
                See Demo
              </Button>
            </motion.div>
          </motion.div>
          <motion.p
            className="mt-6 md:mt-8 text-sm md:text-base text-[#fff6ed]/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            No credit card required • Free tier available forever
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

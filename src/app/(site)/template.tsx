"use client";

import { MotionConfig, motion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

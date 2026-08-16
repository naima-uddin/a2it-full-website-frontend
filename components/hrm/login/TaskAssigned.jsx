"use client";

import { motion } from "framer-motion";

export default function TaskAssigned() {
  return (
    <motion.div
      className="task-badge"
      initial={{ opacity: 0, y: 15, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.9 }}
      transition={{ duration: 0.45, ease: [0.22, 0.8, 0.2, 1] }}
    >
      <span className="dot" />
      Task Assigned

      <style jsx>{`
        :global(.task-badge) {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          background: #ffffff;
          color: #113f67;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          box-shadow: 0 10px 26px -8px rgba(17, 63, 103, 0.35), 0 0 0 1px rgba(17, 63, 103, 0.08);
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2f9e6e;
          box-shadow: 0 0 0 3px rgba(47, 158, 110, 0.18);
        }
      `}</style>
    </motion.div>
  );
}

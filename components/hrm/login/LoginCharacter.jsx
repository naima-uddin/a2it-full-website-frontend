"use client";

import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * Character visual: a real, professionally illustrated Lottie animation
 * (person working at a laptop — /public/animations/boy-laptop.lottie, the
 * asset already used in this app before this rework) rather than a hand-built
 * rig. LoginScene drives the same five-stage pose machine it always has;
 * this component maps each pose to a container-level reaction — a float
 * while working, a startle when the card bursts in, and a settled lean once
 * the scene resolves — using the same transform recipe the original login
 * page shipped with, just orchestrated through Framer Motion variants now.
 */

const containerVariants = {
  walking: { x: 0, y: [0, -8, 0], rotate: 0, scale: 1, transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut" } },
  idle: { x: 0, y: [0, -8, 0], rotate: 0, scale: 1, transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut" } },
  point: {
    x: 0,
    y: [0, -22, 0],
    rotate: [0, -2, 0],
    scale: [1, 1.06, 1],
    transition: { duration: 0.65, ease: [0.2, 0.9, 0.3, 1.2] },
  },
  lean: {
    x: 22,
    y: 0,
    rotate: 4,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 0.8, 0.2, 1] },
  },
  leanIdle: {
    x: 22,
    y: [0, -6, 0],
    rotate: 4,
    scale: 1,
    transition: { duration: 3.6, repeat: Infinity, ease: "easeInOut" },
  },
};

/**
 * @param {"walking"|"idle"|"point"|"lean"|"leanIdle"} pose
 */
export default function LoginCharacter({ pose = "idle", className }) {
  return (
    <motion.div className={className} animate={pose} variants={containerVariants}>
      <DotLottieReact
        src="/animations/boy-laptop.lottie"
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </motion.div>
  );
}

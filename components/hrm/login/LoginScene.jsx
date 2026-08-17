"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import LoginCharacter from "./LoginCharacter";
import LoginForm from "./LoginForm";
import { useLoginTimeline } from "./animation/animationTimeline";

/** Hard cap on how long the intro waits for the character artwork. */
const ASSET_WAIT_MS = 1500;

/**
 * Per-pose transform for the character, applied on top of the walk-in slide
 * and the idle breathing. Pivot is the feet (bottom-centre), so a positive
 * rotation tips the top toward the card on the right (a lean-in), and a
 * negative rotation tips it away (a startled recoil). The character faces
 * right, toward the card.
 */
const POSE = {
  walk: {
    target: { x: 0, y: 0, rotate: 0, scale: 1 },
    transition: { duration: 0.2, ease: "easeOut" },
  },
  arrive: {
    target: { x: 0, y: 0, rotate: 0, scale: 1 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  // Startle: a clear double-take — jump back and away from the card, drop,
  // bounce again, then hold the shocked pose so the "!" spark reads.
  surprise: {
    target: {
      x: [0, -70, -40, -58, -46],
      y: [0, -46, -6, -22, -8],
      rotate: [0, -16, -8, -13, -10],
      scale: [1, 1.16, 1.05, 1.1, 1.07],
    },
    transition: { duration: 1.05, ease: [0.28, 0.9, 0.3, 1], times: [0, 0.22, 0.48, 0.72, 1] },
  },
  // Relax against the card: shoulder clearly shifts in and the body tips
  // toward it, resting on the card's left edge.
  lean: {
    target: { x: 40, y: 0, rotate: 13, scale: 1 },
    transition: { type: "spring", stiffness: 110, damping: 16, mass: 1 },
  },
};

/**
 * The login stage: indigo card with the character walking in from the left
 * and settling against it. Framer Motion drives the walk-in; LoginCharacter
 * drives the walk cycle itself. (The character carries its own briefcase, so
 * the scene doesn't add one.)
 */
export default function LoginScene(formProps) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  // Never let a slow or missing asset hold the form hostage.
  useEffect(() => {
    const t = setTimeout(markReady, ASSET_WAIT_MS);
    return () => clearTimeout(t);
  }, [markReady]);

  const { pose, cardVisible, fieldsVisible } = useLoginTimeline(reducedMotion, ready);

  const walking = pose === "walk";
  const leaning = pose === "lean";
  const startled = pose === "surprise";
  const { target: poseTarget, transition: poseTransition } = POSE[pose] ?? POSE.arrive;

  return (
    <div className="stage">
      <div className="stage-inner">
        <motion.div
          className="card"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.82, y: 18 }}
          animate={cardVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.82, y: 18 }}
          transition={{ duration: 0.62, ease: [0.22, 1.1, 0.28, 1] }}
        >
          <LoginForm fieldsVisible={fieldsVisible} reducedMotion={reducedMotion} {...formProps} />
        </motion.div>

        <motion.div
          className="actor"
          initial={reducedMotion ? false : { x: -460, opacity: 0 }}
          animate={ready || reducedMotion ? { x: 0, opacity: 1 } : { x: -460, opacity: 0 }}
          transition={{ duration: 1.33, ease: [0.36, 0.02, 0.16, 1] }}
        >
          {/* Pose layer: startled recoil, then the lean-in against the card.
              Sits between the walk-in slide and the idle breathing so none of
              the three transforms fight each other. */}
          <motion.div
            className="actor-pose"
            animate={reducedMotion ? POSE.lean.target : poseTarget}
            transition={reducedMotion ? { duration: 0 } : poseTransition}
          >
            {/* The walk cycle carries its own bounce, so once the character
                settles we only add a slow breathing loop to keep it alive. */}
            <motion.div
              className="actor-bob"
              animate={leaning && !reducedMotion ? { y: [0, -2.5, 0], scaleY: [1, 1.006, 1] } : { y: 0, scaleY: 1 }}
              transition={
                leaning && !reducedMotion
                  ? { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.3, ease: "easeOut" }
              }
            >
              <LoginCharacter walking={walking} onReady={markReady} />
            </motion.div>
          </motion.div>

          {/* Little "!" spark that pops above the character's head as it
              startles, then fades out before it leans in. */}
          <motion.div
            className="spark"
            initial={{ opacity: 0, scale: 0.3, y: 6 }}
            animate={startled ? { opacity: [0, 1, 1, 0], scale: [0.3, 1.2, 1, 0.9], y: [6, -6, -8, -12] } : { opacity: 0, scale: 0.3, y: 6 }}
            transition={startled ? { duration: 0.9, ease: "easeOut", times: [0, 0.25, 0.7, 1] } : { duration: 0.2 }}
            aria-hidden="true"
          >
            !
          </motion.div>
        </motion.div>

      </div>

      <style jsx>{`
        .stage {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          background:
            radial-gradient(1100px 620px at 18% 12%, #2b3570 0%, transparent 60%),
            radial-gradient(900px 560px at 84% 86%, #3a2f74 0%, transparent 62%),
            linear-gradient(160deg, #12183a 0%, #1b1f4b 55%, #131736 100%);
          overflow: hidden;
        }
        .stage-inner {
          position: relative;
          width: 100%;
          max-width: 760px;
        }
        :global(.card) {
          position: relative;
          margin-left: auto;
          width: 100%;
          max-width: 640px;
          border-radius: 18px;
          padding: 30px 34px 26px;
          background: linear-gradient(150deg, #6167f7 0%, #5a5ff2 46%, #5257ee 100%);
          box-shadow:
            0 42px 80px -28px rgba(20, 22, 70, 0.9),
            0 0 0 1px rgba(255, 255, 255, 0.09) inset;
          overflow: visible;
        }
        /* The artwork is a 1:1 canvas, so the slot is square — a taller box
           would just letterbox it. Measured against this asset: the figure
           spans 11%-82% of the canvas vertically and sits at 49% across, so
           the box runs tall and the negative bottom offset drops the empty
           strip below the card, seating the feet on its bottom edge. */
        :global(.actor) {
          position: absolute;
          left: -55px;
          bottom: -80px;
          width: 450px;
          height: 450px;
          z-index: 3;
          pointer-events: none;
          transform-origin: 50% 100%;
        }
        :global(.actor-pose) {
          width: 100%;
          height: 100%;
          transform-origin: 50% 100%;
        }
        :global(.actor-bob) {
          width: 100%;
          height: 100%;
          transform-origin: 50% 100%;
        }
        /* Startle spark above the character's head. Sits in the actor box's
           upper-right, roughly over the head, and is purely decorative. */
        :global(.spark) {
          position: absolute;
          top: 46px;
          left: 62%;
          z-index: 4;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 900;
          color: #ffd23f;
          background: rgba(255, 255, 255, 0.14);
          border: 2px solid #ffd23f;
          border-radius: 50%;
          text-shadow: 0 1px 4px rgba(120, 80, 0, 0.6);
          box-shadow: 0 4px 16px -4px rgba(255, 210, 63, 0.7);
          pointer-events: none;
        }
        :global(.char-art) {
          width: 100%;
          height: 100%;
          display: block;
          filter: drop-shadow(0 26px 24px rgba(10, 12, 45, 0.42));
        }
        @media (max-width: 860px) {
          :global(.card) {
            max-width: 520px;
            margin: 0 auto;
            padding: 28px 24px 24px;
          }
          :global(.actor) {
            left: -48px;
            bottom: -62px;
            width: 350px;
            height: 350px;
          }
        }
        @media (max-width: 620px) {
          .stage {
            padding: 28px 16px;
          }
          :global(.actor) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import LoginCharacter from "./LoginCharacter";
import LoginForm from "./LoginForm";
import { useLoginTimeline } from "./animation/animationTimeline";

/** Hard cap on how long the intro waits for the character artwork. */
const ASSET_WAIT_MS = 1500;

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

  const { stage, cardVisible, fieldsVisible } = useLoginTimeline(reducedMotion, ready);

  const walking = stage === "walk";

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
          {/* The walk cycle carries its own bounce, so once the character
              stops we only add a slow breathing loop to keep it alive. */}
          <motion.div
            className="actor-bob"
            animate={reducedMotion || walking ? { y: 0, scaleY: 1 } : { y: [0, -2.5, 0], scaleY: [1, 1.006, 1] }}
            transition={
              walking || reducedMotion
                ? { duration: 0.3, ease: "easeOut" }
                : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <LoginCharacter walking={walking} onReady={markReady} />
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
        :global(.actor-bob) {
          width: 100%;
          height: 100%;
          transform-origin: 50% 100%;
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

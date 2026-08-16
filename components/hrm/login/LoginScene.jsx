"use client";

import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import LoginCharacter from "./LoginCharacter";
import LoginForm from "./LoginForm";
import TaskAssigned from "./TaskAssigned";
import { useLoginTimeline } from "./animation/animationTimeline";

/**
 * Orchestrates the login cinematic: the character is working, the card
 * bursts into view with a "Task Assigned" badge, the character startles/
 * reacts, then settles into a permanent lean toward the card. Framer Motion
 * drives every transform here; LoginCharacter only maps the current pose to
 * a reaction on its Lottie container.
 */
export default function LoginScene(formProps) {
  const reducedMotion = useReducedMotion();
  const { stage, pose, formVisible, badgeVisible } = useLoginTimeline(reducedMotion);

  const walkX = reducedMotion ? 0 : stage === "walk" ? -40 : 0;
  const walkTransition =
    stage === "walk"
      ? { duration: 1.2, ease: [0.33, 0.0, 0.2, 1] }
      : { duration: 1.0, ease: [0.22, 0.8, 0.2, 1] };

  return (
    <div className="scene-root">
      <div className="scene-inner">
        <div className="stage-row">
          <div className="form-slot">
            <LoginForm visible={formVisible} reducedMotion={reducedMotion} {...formProps} />
          </div>

          <motion.div
            className="character-slot"
            initial={reducedMotion ? false : { x: -520, opacity: 0 }}
            animate={{ x: walkX, opacity: 1 }}
            transition={walkTransition}
          >
            <div className="badge-slot">
              <AnimatePresence>{badgeVisible && <TaskAssigned />}</AnimatePresence>
            </div>
            <LoginCharacter pose={pose} className="character-svg" />
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .scene-root {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 30% 20%, #eef4fa 0%, #ffffff 55%);
          padding: 48px 24px;
        }
        .scene-inner {
          position: relative;
          width: 100%;
          max-width: 980px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stage-row {
          position: relative;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .form-slot {
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }
        :global(.character-slot) {
          position: relative;
          z-index: 3;
          width: 300px;
          height: 300px;
          margin-left: -76px;
          margin-bottom: -8px;
          pointer-events: none;
        }
        .badge-slot {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: max-content;
          z-index: 4;
        }
        :global(.character-svg) {
          width: 100%;
          height: 100%;
          display: block;
          filter: drop-shadow(0 18px 20px rgba(17, 63, 103, 0.18));
        }

        @media (max-width: 900px) {
          .stage-row {
            flex-direction: column-reverse;
            align-items: center;
          }
          :global(.character-slot) {
            width: 230px;
            height: 230px;
            margin-left: 0;
            margin-bottom: -12px;
          }
        }
        @media (max-width: 520px) {
          .scene-root {
            padding: 28px 16px;
          }
          :global(.character-slot) {
            width: 190px;
            height: 190px;
            margin-bottom: -8px;
          }
        }
      `}</style>
    </div>
  );
}

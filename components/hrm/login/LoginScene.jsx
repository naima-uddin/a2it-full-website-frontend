"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import LoginForm from "./LoginForm";

// Rive pulls in WebAssembly, so it must only run on the client.
const LoginCharacterRive = dynamic(() => import("./LoginCharacterRive"), { ssr: false });

/** Hard cap on how long the intro waits for the character artwork. */
const ASSET_WAIT_MS = 1500;

/**
 * The login stage: the Rive "Teddy" character sits above the card and reacts
 * to the form — it follows the email as you type, covers its eyes for the
 * password, and celebrates or slumps on the result.
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

  const { email = "", isFocused = {}, authStatus = null } = formProps;

  // Translate the form's state into the character's inputs.
  const handsUp = !!isFocused.password; // covering eyes for the password
  const checking = !!isFocused.email && !handsUp; // peeking at the email
  const look = Math.max(0, Math.min(100, Math.round((email.length / 24) * 100)));

  return (
    <div className="stage">
      <div className="stage-inner">
        <motion.div
          className="teddy-wrap"
          initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.9 }}
          animate={ready ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.6, ease: [0.22, 1.1, 0.28, 1] }}
        >
          <LoginCharacterRive
            checking={checking}
            handsUp={handsUp}
            look={look}
            authStatus={authStatus}
            onReady={markReady}
          />
        </motion.div>

        <motion.div
          className="card"
          initial={reducedMotion ? false : { opacity: 0, y: 26, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1.1, 0.28, 1] }}
        >
          <LoginForm fieldsVisible reducedMotion={reducedMotion} {...formProps} />
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
          padding: 40px 24px;
          background:
            radial-gradient(1100px 620px at 18% 12%, #2b3570 0%, transparent 60%),
            radial-gradient(900px 560px at 84% 86%, #3a2f74 0%, transparent 62%),
            linear-gradient(160deg, #12183a 0%, #1b1f4b 55%, #131736 100%);
          overflow: hidden;
        }
        .stage-inner {
          position: relative;
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        /* The teddy sits on top of the card and overlaps its upper edge so it
           reads as peeking over the form. */
        .teddy-wrap {
          position: relative;
          z-index: 3;
          width: 260px;
          height: 260px;
          margin-bottom: -54px;
          pointer-events: none;
        }
        :global(.teddy-art) {
          width: 100%;
          height: 100%;
          display: block;
          filter: drop-shadow(0 20px 26px rgba(10, 12, 45, 0.4));
        }
        :global(.card) {
          position: relative;
          z-index: 2;
          width: 100%;
          border-radius: 18px;
          padding: 62px 34px 28px;
          background: linear-gradient(150deg, #6167f7 0%, #5a5ff2 46%, #5257ee 100%);
          box-shadow:
            0 42px 80px -28px rgba(20, 22, 70, 0.9),
            0 0 0 1px rgba(255, 255, 255, 0.09) inset;
          overflow: visible;
        }
        @media (max-width: 620px) {
          .stage {
            padding: 28px 16px;
          }
          .teddy-wrap {
            width: 210px;
            height: 210px;
            margin-bottom: -44px;
          }
          :global(.card) {
            padding: 52px 22px 24px;
          }
        }
      `}</style>
    </div>
  );
}

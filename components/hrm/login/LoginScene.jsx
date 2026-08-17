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
 * The login stage: the Rive "Teddy" character sits at the top of a light card
 * (the character's own artwork carries a matching light panel, so the card and
 * the character blend into one surface) and reacts to the form — it follows
 * the email as you type, covers its eyes for the password, and celebrates or
 * slumps on the result.
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
      <motion.div
        className="card"
        initial={reducedMotion ? false : { opacity: 0, y: 26, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1.1, 0.28, 1] }}
      >
        <motion.div
          className="teddy-slot"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <LoginCharacterRive
            checking={checking}
            handsUp={handsUp}
            look={look}
            authStatus={authStatus}
            onReady={markReady}
          />
        </motion.div>

        <LoginForm fieldsVisible reducedMotion={reducedMotion} {...formProps} />
      </motion.div>

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
        /* Both the card and the character's own panel are this same light blue-
           grey (sampled from the .riv: rgb(214,226,234)), so the character
           blends seamlessly into the top of the card. */
        :global(.card) {
          position: relative;
          width: 100%;
          max-width: 420px;
          border-radius: 22px;
          padding: 8px 30px 26px;
          background: #d6e2ea;
          box-shadow:
            0 42px 80px -28px rgba(20, 22, 70, 0.9),
            0 0 0 1px rgba(255, 255, 255, 0.5) inset;
          overflow: hidden;
        }
        /* The character sits flush at the top; its artwork already includes the
           light panel, so no gap or seam shows against the card. */
        :global(.teddy-slot) {
          position: relative;
          z-index: 2;
          width: 220px;
          height: 200px;
          margin: 0 auto -6px;
          pointer-events: none;
        }
        :global(.teddy-art) {
          width: 100%;
          height: 100%;
          display: block;
        }
        @media (max-width: 620px) {
          .stage {
            padding: 28px 16px;
          }
          :global(.card) {
            padding: 6px 20px 22px;
          }
          :global(.teddy-slot) {
            width: 190px;
            height: 172px;
          }
        }
      `}</style>
    </div>
  );
}

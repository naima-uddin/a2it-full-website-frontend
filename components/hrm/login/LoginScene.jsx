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
            radial-gradient(1000px 600px at 18% 8%, #1d5878 0%, transparent 58%),
            radial-gradient(880px 560px at 86% 92%, #12617c 0%, transparent 60%),
            linear-gradient(160deg, #071a2c 0%, #0d3149 52%, #08243a 100%);
          overflow: hidden;
        }
        /* Both the card and the character's own panel are this same light blue-
           grey (sampled from the .riv: rgb(214,226,234)), so the character
           blends seamlessly into the top of the card. */
        :global(.card) {
          position: relative;
          width: 100%;
          max-width: 430px;
          border-radius: 26px;
          padding: 150px 34px 30px;
          background: linear-gradient(180deg, #e4eef4 0%, #d3e0e9 100%);
          box-shadow:
            0 50px 90px -30px rgba(6, 20, 40, 0.85),
            0 0 0 1px rgba(255, 255, 255, 0.6) inset;
          /* visible so the avatar can break the card's top edge */
          overflow: visible;
        }
        /* The character rides in a circular badge that overlaps the top edge of
           the card, so its head pokes out above the form. The circle crops away
           the artwork's own light panel and baked shadow, leaving a clean badge
           of the character's face. The badge fill matches the artwork panel so
           there is no seam behind the character. */
        /* Centre with left/right/margin, not translateX — framer-motion writes
           its own inline transform on this element and would clobber it. */
        :global(.teddy-slot) {
          position: absolute;
          top: -150px;
          left: 0;
          right: 0;
          margin: 0 auto;
          z-index: 3;
          width: 274px;
          height: 274px;
          border-radius: 50%;
          overflow: hidden;
          background: #d6e2ea;
          border: 7px solid #eef4f8;
          box-shadow: 0 24px 46px -16px rgba(6, 20, 40, 0.62);
          pointer-events: none;
        }
        /* Zoom into the face: the canvas is larger than the badge and shifted so
           the head/face sits at the badge centre. */
        :global(.teddy-art) {
          position: absolute;
          left: 50%;
          top: -46px;
          transform: translateX(-50%);
          width: 400px;
          height: 365px;
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

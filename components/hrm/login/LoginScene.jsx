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
      <div className="panel">
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

        <motion.div
          className="card"
          initial={reducedMotion ? false : { opacity: 0, y: 26, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1.1, 0.28, 1] }}
        >
          <LoginForm fieldsVisible reducedMotion={reducedMotion} {...formProps} />
        </motion.div>
      </div>

      <style jsx>{`
        .stage {
          position: relative;
          min-height: 100vh;
          width: 100%;
          /* A single flex child centred with margin:auto (not align/justify)
             stays reachable when it's taller than the viewport — on short
             laptop screens it then scrolls instead of clipping the top. */
          display: flex;
          padding: 40px 24px;
          background:
            radial-gradient(1000px 600px at 18% 8%, #1d5878 0%, transparent 58%),
            radial-gradient(880px 560px at 86% 92%, #12617c 0%, transparent 60%),
            linear-gradient(160deg, #071a2c 0%, #0d3149 52%, #08243a 100%);
          overflow: hidden;
        }
        /* Wrapper holding the character + card in normal flow, so the character
           no longer overhangs the card as an absolute element (which is what
           got clipped at the top on short screens). */
        .panel {
          margin: auto;
          width: 100%;
          max-width: 430px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        /* Both the card and the character's own panel are this same light blue-
           grey (sampled from the .riv: rgb(214,226,234)), so the character
           blends seamlessly into the top of the card. */
        :global(.card) {
          position: relative;
          z-index: 1;
          width: 100%;
          border-radius: 26px;
          padding: 168px 34px 30px;
          background: linear-gradient(180deg, #e4eef4 0%, #d3e0e9 100%);
          box-shadow:
            0 50px 90px -30px rgba(6, 20, 40, 0.85),
            0 0 0 1px rgba(255, 255, 255, 0.6) inset;
          /* visible so the avatar can break the card's top edge */
          overflow: visible;
        }
        /* The character rides in a circular badge that sits above the card and
           pulls the card up under it (negative margin), so its head pokes out
           above the form. The circle crops away the artwork's own light panel
           and baked shadow, leaving a clean badge of the face. z-index keeps it
           painted above the card even though it comes first in the DOM. */
        :global(.teddy-slot) {
          position: relative;
          z-index: 2;
          margin: 0 auto -142px;
          width: 316px;
          height: 316px;
          border-radius: 50%;
          overflow: hidden;
          background: #d6e2ea;
          border: 8px solid #eef4f8;
          box-shadow: 0 26px 50px -16px rgba(6, 20, 40, 0.62);
          pointer-events: none;
        }
        /* Zoom into the face: the canvas is larger than the badge and shifted so
           the head/face sits at the badge centre. */
        :global(.teddy-art) {
          position: absolute;
          left: 50%;
          top: -90px;
          transform: translateX(-50%);
          width: 462px;
          height: 422px;
          display: block;
        }
        /* Responsive: the badge, its zoom, the negative margin, and the card's
           top padding all scale together (they're geometrically linked):
             slot overlap (‑margin) ≈ 0.45 * slot
             art.width              ≈ 1.46 * slot   (height 0.913 * width)
             art.top                ≈ -0.285 * slot
             card.pad-top           ≈ 0.45 * slot + 26 */
        @media (max-width: 560px) {
          .stage {
            padding: 30px 14px;
          }
          .panel {
            max-width: 400px;
          }
          :global(.card) {
            border-radius: 22px;
            padding: 138px 22px 24px;
          }
          :global(.teddy-slot) {
            margin: 0 auto -112px;
            width: 250px;
            height: 250px;
            border-width: 7px;
          }
          :global(.teddy-art) {
            top: -71px;
            width: 366px;
            height: 334px;
          }
        }
        @media (max-width: 380px) {
          .stage {
            padding: 22px 10px;
          }
          :global(.card) {
            padding: 120px 16px 22px;
          }
          :global(.teddy-slot) {
            margin: 0 auto -94px;
            width: 210px;
            height: 210px;
            border-width: 6px;
          }
          :global(.teddy-art) {
            top: -60px;
            width: 307px;
            height: 280px;
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import LoginForm from "./LoginForm";

/**
 * Interactive "cute lamp" login stage. The pull-string cycles the lamp through
 * OFF → green ON → OFF → orange ON, and the whole scene (glow, card accent, the
 * lamp's own face) re-themes on each pull. The form itself is the shared
 * <LoginForm>, so all auth/validation/forgot-password logic is untouched — only
 * the surrounding animation changed from the Rive teddy to this lamp.
 */

// Each pull advances to the next state (wraps around).
const lampStates = [
  {
    themeColor: "#2a2c30",
    themeGlowRGB: "42, 44, 48",
    shadeColor: "#2c2c2c",
    bulbColor: "#1a1a1a",
    lightOpacity: 0,
    faceAwakeOpacity: 0,
    faceSleepOpacity: 1,
  },
  {
    themeColor: "#22c55e",
    themeGlowRGB: "34, 197, 94",
    shadeColor: "#6c8c73",
    bulbColor: "#e6ffe6",
    lightOpacity: 0.15,
    faceAwakeOpacity: 1,
    faceSleepOpacity: 0,
  },
  {
    themeColor: "#2a2c30",
    themeGlowRGB: "42, 44, 48",
    shadeColor: "#2c2c2c",
    bulbColor: "#1a1a1a",
    lightOpacity: 0,
    faceAwakeOpacity: 0,
    faceSleepOpacity: 1,
  },
  {
    themeColor: "#f97316",
    themeGlowRGB: "249, 115, 22",
    shadeColor: "#947463",
    bulbColor: "#fff0e6",
    lightOpacity: 0.15,
    faceAwakeOpacity: 1,
    faceSleepOpacity: 0,
  },
];

export default function LampLoginScene(formProps) {
  const reducedMotion = useReducedMotion();
  const [stateIndex, setStateIndex] = useState(0);
  const svgRef = useRef(null);
  // How far (in SVG user units) the string is being dragged right now.
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartY = useRef(0);

  const config = lampStates[stateIndex];

  // Lamp is lit whenever the light cone is showing. The pull-string rests short
  // while OFF and long while ON; during a drag it follows the pointer.
  const lit = config.lightOpacity > 0;
  const restHeight = lit ? 100 : 45; // resting length for the current state
  const PULL_THRESHOLD = 45; // drag this far (user units) to flip the lamp
  const stringHeight = Math.max(35, Math.min(180, restHeight + drag));
  const handleY = 180 + stringHeight; // handle follows the string's bottom

  const toggleLamp = () => setStateIndex((i) => (i + 1) % lampStates.length);

  // Convert client pixels to SVG user units (viewBox is 450 tall).
  const clientToUserY = (clientPx) => {
    const rect = svgRef.current?.getBoundingClientRect();
    return rect ? clientPx * (450 / rect.height) : clientPx;
  };

  const onPullDown = (e) => {
    e.target.setPointerCapture?.(e.pointerId);
    dragStartY.current = e.clientY;
    setDragging(true);
    setDrag(0);
  };

  const onPullMove = (e) => {
    if (!dragging) return;
    // Only downward pulls count; cap so it can't stretch forever.
    const delta = clientToUserY(e.clientY - dragStartY.current);
    setDrag(Math.max(0, Math.min(120, delta)));
  };

  const onPullEnd = () => {
    if (!dragging) return;
    if (drag >= PULL_THRESHOLD) toggleLamp(); // pulled far enough → flip
    setDragging(false);
    setDrag(0); // snap the string back to its resting length
  };

  // CSS custom properties drive the re-theme; set them on the stage root.
  const cssVars = {
    "--theme-color": config.themeColor,
    "--theme-glow-rgb": config.themeGlowRGB,
    "--shade-color": config.shadeColor,
    "--bulb-color": config.bulbColor,
    "--light-opacity": config.lightOpacity,
  };

  return (
    <div className={`stage ${lit ? "lit" : ""}`} style={cssVars}>
      <div className="container">
        <div className="lamp-section">
          <div className="lamp-ambient-glow" />
          <svg ref={svgRef} className="lamp-svg" viewBox="0 0 300 450" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lightConeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <clipPath id="mouthClip">
                <path d="M 125 155 Q 150 190 175 155 Z" />
              </clipPath>
            </defs>

            <polygon points="90,180 210,180 320,450 -20,450" fill="url(#lightConeGrad)" className="light-cone" />
            <ellipse cx="150" cy="400" rx="60" ry="15" fill="#151515" />
            <ellipse cx="150" cy="395" rx="60" ry="15" fill="#3a3c40" />
            <rect x="140" y="180" width="20" height="220" fill="#2a2c30" />
            <rect x="142" y="180" width="8" height="220" fill="#4a4c50" />
            <ellipse cx="150" cy="175" rx="90" ry="20" className="shade-inner" />

            <g
              className={`pull-string-group ${dragging ? "dragging" : ""}`}
              onPointerDown={onPullDown}
              onPointerMove={onPullMove}
              onPointerUp={onPullEnd}
              onPointerCancel={onPullEnd}
            >
              {/* Wide invisible hit-area so the thin string is easy to grab. */}
              <rect x="90" y="175" width="30" height={stringHeight + 45} fill="transparent" />
              <rect
                className="lamp-string"
                x="103.5"
                width="3"
                y="180"
                style={{ height: `${stringHeight}px`, transition: dragging ? "none" : undefined }}
              />
              <rect
                className="string-handle"
                x="101"
                width="8"
                rx="4"
                style={{ y: `${handleY}px`, height: "30px", transition: dragging ? "none" : undefined }}
              />
            </g>

            <path d="M 95 60 Q 150 45 205 60 L 240 175 Q 150 195 60 175 Z" className="shade-main" />

            <g className="face-sleep" style={{ opacity: config.faceSleepOpacity }}>
              <path d="M 115 130 Q 125 140 135 130" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M 165 130 Q 175 140 185 130" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>

            <g className="face-awake" style={{ opacity: config.faceAwakeOpacity }}>
              <path d="M 115 130 Q 125 115 135 130" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M 165 130 Q 175 115 185 130" stroke="#111" strokeWidth="4" fill="none" strokeLinecap="round" />
              <g>
                <path d="M 125 155 Q 150 190 175 155 Z" fill="#111" />
                <path d="M 140 165 Q 150 190 160 165 Z" fill="#f87171" clipPath="url(#mouthClip)" />
              </g>
            </g>
          </svg>
          <p className="lamp-hint">{lit ? "Welcome — please sign in" : "Pull the string 💡"}</p>
        </div>

        <div className={`login-section ${lit ? "show" : ""}`} aria-hidden={!lit}>
          <div className="card">
            <LoginForm fieldsVisible reducedMotion={reducedMotion} {...formProps} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .stage {
          --bg-color: #0b0f14;
          position: relative;
          min-height: 100vh;
          width: 100%;
          background-color: var(--bg-color);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow-x: hidden;
          padding: 40px 24px;
        }
        /* When the lamp is lit, wash the dark screen with a soft glow tinted to
           the current theme colour. */
        .stage::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            1200px 800px at 30% 40%,
            rgba(var(--theme-glow-rgb), 0.22) 0%,
            transparent 65%
          );
          opacity: 0;
          transition: opacity 0.7s ease;
          pointer-events: none;
          z-index: 0;
        }
        .stage.lit::before {
          opacity: 1;
        }
        .container {
          position: relative;
          z-index: 1;
          display: flex;
          width: 100%;
          max-width: 1100px;
          align-items: center;
          justify-content: center;
          gap: 0;
        }
        /* Lamp sits dead-centre while OFF, then glides left when the lamp is
           lit to make room for the form on the right. */
        .lamp-section {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          /* Returning to centre (OFF): wait for the form to clear first. */
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.3, 1) 0.35s;
        }
        .stage.lit .lamp-section {
          transform: translateX(-210px);
          /* Sliding left (ON): move immediately, then the form follows. */
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.3, 1) 0s;
        }
        .lamp-svg {
          width: 100%;
          max-width: 350px;
          height: auto;
          overflow: visible;
          filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.5));
        }
        .lamp-hint {
          margin-top: 8px;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.45);
          user-select: none;
        }
        .lamp-section :global(.shade-main) {
          fill: var(--shade-color);
          transition: fill 0.6s ease;
        }
        .lamp-section :global(.shade-inner) {
          fill: var(--bulb-color);
          transition: fill 0.6s ease;
        }
        .lamp-section :global(.light-cone) {
          opacity: var(--light-opacity);
          transition: opacity 0.6s ease;
        }
        .lamp-section :global(.face-sleep),
        .lamp-section :global(.face-awake) {
          transition: opacity 0.3s ease;
        }
        .lamp-section :global(.pull-string-group) {
          cursor: grab;
          touch-action: none;
        }
        .lamp-section :global(.pull-string-group.dragging) {
          cursor: grabbing;
        }
        /* The thin string stretches (height) and the handle drops (y) on pull.
           Rect geometry props (height / y) transition smoothly where line
           endpoints can't. */
        .lamp-section :global(.lamp-string) {
          fill: #555;
          transition: height 0.45s cubic-bezier(0.34, 1.2, 0.4, 1);
        }
        .lamp-section :global(.string-handle) {
          fill: #888;
          transition: y 0.45s cubic-bezier(0.34, 1.2, 0.4, 1);
        }
        .lamp-section :global(.pull-string-group:hover .string-handle) {
          fill: #ffffff;
        }
        .lamp-ambient-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(var(--theme-glow-rgb), 0.15) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          transition: background 0.6s ease;
          pointer-events: none;
        }
        /* Form is hidden while the lamp is OFF. Once lit it rises up from below
           on the right-hand side and fades in. Absolutely placed so the lamp
           can stay perfectly centred underneath it while OFF. */
        .login-section {
          position: absolute;
          z-index: 2;
          top: 50%;
          left: 54%;
          width: min(420px, 42%);
          display: flex;
          justify-content: center;
          opacity: 0;
          transform: translateY(calc(-50% + 90px)) scale(0.96);
          visibility: hidden;
          /* OFF: exit quickly and right away (no delay) so the form is gone
             before the lamp glides back to centre. */
          transition: opacity 0.3s ease 0s, transform 0.35s ease 0s, visibility 0s linear 0.35s;
        }
        .login-section.show {
          opacity: 1;
          transform: translateY(-50%) scale(1);
          visibility: visible;
          /* ON: wait for the lamp to slide left, then rise up and fade in. */
          transition: opacity 0.55s ease 0.4s, transform 0.75s cubic-bezier(0.18, 1, 0.3, 1) 0.4s,
            visibility 0s linear 0s;
        }
        /* Light card (same surface as the original scene) so the shared
           <LoginForm> stays readable, but its border/glow re-themes with the
           lamp via the CSS variables. */
        :global(.card) {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          border-radius: 22px;
          padding: 34px 30px 30px;
          background: linear-gradient(180deg, #e4eef4 0%, #d3e0e9 100%);
          border: 2px solid var(--theme-color);
          box-shadow:
            0 40px 80px -30px rgba(6, 20, 40, 0.85),
            0 0 30px rgba(var(--theme-glow-rgb), 0.18);
          transition: border-color 0.6s ease, box-shadow 0.6s ease;
          overflow: visible;
        }

        /* On narrower screens there isn't room to slide sideways, so stack:
           lamp centred on top, form flows in below (still rising from the
           bottom). Absolute positioning and the sideways slide are undone. */
        @media (max-width: 860px) {
          .container {
            flex-direction: column;
            justify-content: center;
            gap: 1.5rem;
          }
          .stage.lit .lamp-section {
            transform: none;
          }
          .lamp-svg {
            max-width: 240px;
          }
          .login-section {
            position: static;
            top: auto;
            left: auto;
            width: 100%;
            max-width: 400px;
            transform: translateY(80px) scale(0.94);
          }
          .login-section.show {
            transform: translateY(0) scale(1);
          }
        }
        @media (max-width: 560px) {
          .stage {
            padding: 30px 14px;
          }
          .lamp-svg {
            max-width: 200px;
          }
          :global(.card) {
            padding: 28px 20px 24px;
          }
        }
      `}</style>
    </div>
  );
}

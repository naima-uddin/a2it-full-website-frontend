"use client";

import { useEffect, useState } from "react";

/**
 * Master choreography for the login scene.
 * All times are milliseconds from mount. Keep in sync with the durations
 * called out in the character asset spec (see public/animations/login-character/ASSET_SPEC.md).
 */
export const TIMELINE = {
  walkStart: 0,
  walkEnd: 1200, // character walk-cycle plays, container slides in
  approachEnd: 2200, // character slows, settles into idle near the form's future position
  burstAt: 2200, // login card bursts into view
  badgeAt: 2350, // "Task Assigned" badge appears just after the burst
  pointStart: 3000,
  pointEnd: 4000,
  leanStart: 4000,
  leanEnd: 4800, // character is fully settled into the lean-idle loop from here on
};

// Character "pose" drives which Lottie state (or SVG rig variant) is shown.
// walking -> idle -> point -> lean -> leanIdle
export const STAGE_POSE = {
  walk: "walking",
  approach: "idle",
  burst: "idle",
  point: "point",
  lean: "lean",
  settled: "leanIdle",
};

/**
 * Drives the scene through its stages on a timer.
 * Respects prefers-reduced-motion by skipping straight to the final, settled state.
 */
export function useLoginTimeline(reducedMotion) {
  const [stage, setStage] = useState(reducedMotion ? "settled" : "walk");
  const [formVisible, setFormVisible] = useState(reducedMotion);
  const [badgeVisible, setBadgeVisible] = useState(reducedMotion);

  useEffect(() => {
    // Initial state already accounts for reducedMotion (see useState above);
    // only the full-motion path needs a timer sequence.
    if (reducedMotion) return;

    const timers = [
      setTimeout(() => setStage("approach"), TIMELINE.walkEnd),
      setTimeout(() => setStage("burst"), TIMELINE.approachEnd),
      setTimeout(() => setFormVisible(true), TIMELINE.burstAt),
      setTimeout(() => setBadgeVisible(true), TIMELINE.badgeAt),
      setTimeout(() => setStage("point"), TIMELINE.pointStart),
      setTimeout(() => setStage("lean"), TIMELINE.leanStart),
      setTimeout(() => setStage("settled"), TIMELINE.leanEnd),
    ];

    return () => timers.forEach(clearTimeout);
  }, [reducedMotion]);

  return { stage, pose: STAGE_POSE[stage], formVisible, badgeVisible };
}

"use client";

import { useEffect, useState } from "react";

/**
 * Choreography for the login intro, matching the reference: the character
 * walks in from the left, the card pops in as it arrives, then the fields
 * cascade in.
 *
 * `walkEnd` is tuned to the artwork's own cycle (~1.33s at 30fps) so the
 * character stops on a full stride rather than mid-step.
 *
 * All values are milliseconds from mount.
 */
export const TIMELINE = {
  walkEnd: 1330, // character has finished walking in
  cardAt: 1450, // card pops into view
  fieldsAt: 1750, // fields start cascading
};

/**
 * Stages: "walk" -> "arrive" -> "settled"
 *
 * `ready` gates the start so the walk-in doesn't play out before the
 * character artwork has finished loading — otherwise on a slow connection
 * the character pops in already standing.
 */
export function useLoginTimeline(reducedMotion, ready = true) {
  const [stage, setStage] = useState(reducedMotion ? "settled" : "walk");
  const [cardVisible, setCardVisible] = useState(!!reducedMotion);
  const [fieldsVisible, setFieldsVisible] = useState(!!reducedMotion);

  useEffect(() => {
    if (reducedMotion || !ready) return;

    const timers = [
      setTimeout(() => setStage("arrive"), TIMELINE.walkEnd),
      setTimeout(() => setCardVisible(true), TIMELINE.cardAt),
      setTimeout(() => setFieldsVisible(true), TIMELINE.fieldsAt),
      setTimeout(() => setStage("settled"), TIMELINE.fieldsAt + 300),
    ];

    return () => timers.forEach(clearTimeout);
  }, [reducedMotion, ready]);

  return { stage, cardVisible, fieldsVisible };
}

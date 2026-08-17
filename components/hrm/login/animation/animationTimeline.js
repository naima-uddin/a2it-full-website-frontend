"use client";

import { useEffect, useState } from "react";

/**
 * Choreography for the login intro, matching the reference clips: the
 * character walks in from the left carrying its bag, the card pops in as it
 * arrives, the character gives a little startled recoil ("surprise"), and
 * finally settles leaning against the card while the fields cascade in.
 *
 * `walkEnd` is tuned to the artwork's own cycle (~1.33s at 30fps) so the
 * character stops on a full stride rather than mid-step.
 *
 * All values are milliseconds from mount.
 */
export const TIMELINE = {
  walkEnd: 1330, // character has finished walking in
  cardAt: 1480, // card pops into view
  surpriseAt: 1560, // character startles as the card appears
  fieldsAt: 2050, // fields start cascading (mid-recoil)
  leanAt: 2750, // character relaxes and leans against the card
};

/**
 * Poses: "walk" -> "arrive" -> "surprise" -> "lean"
 *
 *   walk     - the walk-in cycle is playing
 *   arrive   - stopped, standing upright at the card's edge
 *   surprise - a quick startled recoil (leans away, small hop, "!" spark)
 *   lean     - relaxed, shoulder resting against the card
 *
 * `ready` gates the start so the walk-in doesn't play out before the
 * character artwork has finished loading — otherwise on a slow connection
 * the character pops in already standing.
 */
export function useLoginTimeline(reducedMotion, ready = true) {
  // Reduced motion skips straight to the calm leaned pose, no jolt.
  const [pose, setPose] = useState(reducedMotion ? "lean" : "walk");
  const [cardVisible, setCardVisible] = useState(!!reducedMotion);
  const [fieldsVisible, setFieldsVisible] = useState(!!reducedMotion);

  useEffect(() => {
    if (reducedMotion || !ready) return;

    const timers = [
      setTimeout(() => setPose("arrive"), TIMELINE.walkEnd),
      setTimeout(() => setCardVisible(true), TIMELINE.cardAt),
      setTimeout(() => setPose("surprise"), TIMELINE.surpriseAt),
      setTimeout(() => setFieldsVisible(true), TIMELINE.fieldsAt),
      setTimeout(() => setPose("lean"), TIMELINE.leanAt),
    ];

    return () => timers.forEach(clearTimeout);
  }, [reducedMotion, ready]);

  return { pose, cardVisible, fieldsVisible };
}

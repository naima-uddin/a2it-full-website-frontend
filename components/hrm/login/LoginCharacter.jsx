"use client";

import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

/**
 * The 3D character that walks in from the left and settles against the card.
 *
 * The artwork is a walk-cycle loop, so playback is driven by the scene:
 * while `walking` it loops at full speed; once the character arrives it is
 * parked on the passing pose (legs together) so it reads as standing rather
 * than marching in place forever.
 *
 * Artwork lives at frontend/public/animations/character.json — swapping that
 * file swaps the character, no code change needed.
 */

const SRC = "/animations/character.json";

/**
 * Frame to hold on once the character stops. Verified against this asset's
 * cycle: 0 and 20 are contact poses (legs wide), 10 is mid-air. 15 is the
 * upright, feet-together frame that reads as standing.
 */
const REST_FRAME = 15;

/** Set to true if a replacement character faces left instead of right. */
const FACE_LEFT = false;

export default function LoginCharacter({ walking = false, onReady }) {
  const [data, setData] = useState(null);
  const lottieRef = useRef(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  useEffect(() => {
    let cancelled = false;

    fetch(SRC, { cache: "force-cache" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return;
        if (json) setData(json);
        // Signal either way — the scene must not stall on a missing asset.
        readyRef.current?.();
      })
      .catch(() => {
        if (!cancelled) readyRef.current?.();
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const api = lottieRef.current;
    if (!api || !data) return;

    if (walking) api.goToAndPlay(0, true);
    else api.goToAndStop(REST_FRAME, true);
  }, [walking, data]);

  if (!data) return null;

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={data}
      loop
      autoplay={false}
      className="char-art"
      style={FACE_LEFT ? { transform: "scaleX(-1)" } : undefined}
    />
  );
}

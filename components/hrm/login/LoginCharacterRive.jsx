"use client";

import { useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

/**
 * Rive-driven login character.
 *
 * This replaces the Lottie walk-cycle with an interactive Rive state machine
 * so the character can genuinely react: walk in, get startled when the form
 * appears, then lean against the card.
 *
 * ─── CONTRACT (the .riv file MUST match these names exactly) ──────────────
 *
 *   File            public/animations/login-character.riv
 *   State Machine   "Login"
 *   Number input    "stage"   drives the pose:
 *                     0 → walk   (walk-cycle loop)
 *                     1 → arrive (stopped, standing idle)
 *                     2 → surprise (startled reaction)
 *                     3 → lean   (relaxed, leaning on the card)
 *
 * In the Rive editor: build one State Machine called `Login`, add a Number
 * input called `stage`, and wire transitions so stage 0→1→2→3 plays each
 * animation. That's all the code below needs.
 *
 * If you use a Trigger-based machine instead of a number, tell me and I'll
 * switch to useStateMachineInput triggers — but the number is the simplest.
 */

const SRC = "/animations/login-character.riv";
const STATE_MACHINE = "Login";

/** Maps our timeline poses to the `stage` number the .riv expects. */
const STAGE_VALUE = { walk: 0, arrive: 1, surprise: 2, lean: 3 };

export default function LoginCharacterRive({ pose = "walk", onReady }) {
  const { rive, RiveComponent } = useRive({
    src: SRC,
    stateMachines: STATE_MACHINE,
    autoplay: true,
    onLoad: () => onReady?.(),
    onLoadError: () => onReady?.(), // never stall the scene on a bad asset
  });

  const stageInput = useStateMachineInput(rive, STATE_MACHINE, "stage");

  useEffect(() => {
    if (!stageInput) return;
    stageInput.value = STAGE_VALUE[pose] ?? 0;
  }, [pose, stageInput]);

  return <RiveComponent className="char-art" />;
}

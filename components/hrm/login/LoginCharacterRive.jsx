"use client";

import { useEffect } from "react";
import { useRive, useStateMachineInput, RuntimeLoader } from "@rive-app/react-canvas";

// Load the WASM from our own /public instead of the default CDN (unpkg), so a
// blocked or slow CDN can never leave the character blank. The file is copied
// from node_modules/@rive-app/canvas/rive.wasm and must match that version.
if (typeof window !== "undefined") {
  RuntimeLoader.setWasmUrl("/rive.wasm");
}

/**
 * Rive-driven login character (the "Teddy" login machine from the Rive
 * community, by JcToon). It sits above the form and reacts to it:
 *
 *   - watches the email as it is typed (eyes track along the field)
 *   - covers its eyes with its hands while the password is focused
 *   - celebrates on a successful login, slumps on a failed one
 *
 * Verified against the .riv binary:
 *   File           public/animations/login-character.riv
 *   State Machine  "Login Machine"
 *   Inputs         isChecking (bool)  - watching the email
 *                  numLook   (number 0-100) - horizontal eye tracking
 *                  isHandsUp (bool)   - covering eyes (password)
 *                  trigSuccess (trigger)
 *                  trigFail    (trigger)
 */

const SRC = "/animations/login-character.riv";
const STATE_MACHINE = "Login Machine";

export default function LoginCharacterRive({
  checking = false, // watching the email being typed
  handsUp = false, // covering its eyes (password)
  look = 0, // 0-100: how far along the email the eyes track
  authStatus = null, // "success" | "fail" | null → fires the matching trigger
  onReady,
}) {
  const { rive, RiveComponent } = useRive({
    src: SRC,
    stateMachines: STATE_MACHINE,
    autoplay: true,
    onLoad: () => onReady?.(),
    onLoadError: () => onReady?.(), // never stall the scene on a bad asset
  });

  const isChecking = useStateMachineInput(rive, STATE_MACHINE, "isChecking");
  const numLook = useStateMachineInput(rive, STATE_MACHINE, "numLook");
  const isHandsUp = useStateMachineInput(rive, STATE_MACHINE, "isHandsUp");
  const trigSuccess = useStateMachineInput(rive, STATE_MACHINE, "trigSuccess");
  const trigFail = useStateMachineInput(rive, STATE_MACHINE, "trigFail");

  useEffect(() => {
    if (isChecking) isChecking.value = checking;
  }, [checking, isChecking]);

  useEffect(() => {
    if (isHandsUp) isHandsUp.value = handsUp;
  }, [handsUp, isHandsUp]);

  useEffect(() => {
    if (numLook) numLook.value = look;
  }, [look, numLook]);

  useEffect(() => {
    if (authStatus === "success") trigSuccess?.fire();
    else if (authStatus === "fail") trigFail?.fire();
  }, [authStatus, trigSuccess, trigFail]);

  return <RiveComponent className="teddy-art" />;
}

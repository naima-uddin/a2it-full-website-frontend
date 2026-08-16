"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import animationData from "@/public/document.json";
import {
  THANK_YOU_DELAY_MS,
  getReturnToFromStorage,
} from "@/components/shared/contactSuccessRedirect";

export default function ThankYouPage() {
  const router = useRouter();
  const [returnTo, setReturnTo] = useState("/");
  const [secondsLeft, setSecondsLeft] = useState(
    Math.ceil(THANK_YOU_DELAY_MS / 1000),
  );

  const safeRedirectTarget = useMemo(() => {
    return returnTo && returnTo.startsWith("/") ? returnTo : "/";
  }, [returnTo]);

  useEffect(() => {
    // determine where to return to: sessionStorage -> document.referrer -> /
    const stored = getReturnToFromStorage();
    let resolved = "/";
    if (typeof window !== "undefined") {
      const fallback = document.referrer
        ? new URL(document.referrer).pathname
        : "/";
      resolved = stored && stored.startsWith("/") ? stored : fallback || "/";
      setReturnTo(resolved);
    }

    // Use resolved directly so we don't rely on async state updates.
    const timeoutId = window.setTimeout(() => {
      try {
        sessionStorage.removeItem("thankYouReturnTo");
      } catch (e) {}
      router.replace(resolved);
    }, THANK_YOU_DELAY_MS);

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#E8F4FA] via-white to-[#7DB9FF] px-4 py-12">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white/95 backdrop-blur p-8 text-center shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] md:p-16">
        {/* Decorative gradient circle behind animation */}
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-linear-to-br from-sky-100/40 to-blue-100/20 blur-3xl" />

        <div className="relative z-10">
          {/* Lottie Animation - Larger Size */}
          <div className="mx-auto mb-8 h-64 w-64 rounded-full bg-linear-to-br from-sky-50 to-blue-50 p-4 shadow-lg">
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* Badge */}
          <div className="mb-4 inline-block rounded-full bg-sky-50 px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              ✓ Message received
            </p>
          </div>

          {/* Heading */}
          <h1
            className="text-5xl font-bold tracking-tight text-gray-900 md:text-7xl"
            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
          >
            Thank you
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-3 max-w-lg text-2xl font-semibold text-gray-700">
            for your email
          </p>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500">
            We&apos;ll contact you shortly. This page will automatically take
            you back to the previous page.
          </p>

          {/* Countdown Badge */}
          <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-6 py-3 text-sm font-medium text-gray-700 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Redirecting in{" "}
            <span className="ml-1 font-bold text-sky-600">{secondsLeft}s</span>
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={() => router.replace(safeRedirectTarget)}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-linear-to-r from-sky-500 to-blue-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:shadow-xl hover:from-sky-600 hover:to-blue-600 active:scale-95"
          >
            Go back now
          </button>
        </div>
      </div>
    </div>
  );
}

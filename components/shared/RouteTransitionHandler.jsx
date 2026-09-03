"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Lightweight top progress bar. No full-screen skeleton overlay and no
// artificial delays — the site is a static export, so client-side route
// changes are effectively instant. This just paints a thin bar that fills
// and fades within a couple hundred milliseconds to give subtle feedback.
function RouteTransitionContent() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstRender = useRef(true);

  useEffect(() => {
    // Skip the very first mount so the bar does not flash on initial load.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setVisible(true);
    setProgress(15);

    const bump = setTimeout(() => setProgress(80), 20);
    const finish = setTimeout(() => setProgress(100), 120);
    const hide = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 260);

    return () => {
      clearTimeout(bump);
      clearTimeout(finish);
      clearTimeout(hide);
    };
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[10000] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-[#00f0ff]"
        style={{
          width: `${progress}%`,
          transition: "width 120ms ease-out, opacity 140ms ease-out",
          opacity: progress >= 100 ? 0 : 1,
        }}
      />
    </div>
  );
}

const RouteTransitionHandler = () => {
  return (
    <Suspense fallback={null}>
      <RouteTransitionContent />
    </Suspense>
  );
};

export default RouteTransitionHandler;

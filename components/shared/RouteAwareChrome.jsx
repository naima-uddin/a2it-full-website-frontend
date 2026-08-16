"use client";

import React from "react";
import { usePathname } from "next/navigation";
import TopBar from "@/components/shared/TopBar";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function RouteAwareChrome({ children }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith("/dashboard");
  // The HRM module ships its own chrome (sidebar + topbar) under /hrm.
  const isHrmRoute = pathname === "/hrm" || pathname?.startsWith("/hrm/");
  const isLoginRoute = pathname === "/login" || pathname === "/login/";
  const isThankYouRoute =
    pathname === "/thank-you" || pathname === "/thank-you/";

  if (isDashboardRoute || isHrmRoute || isLoginRoute || isThankYouRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

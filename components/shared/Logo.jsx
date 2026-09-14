"use client";
import React from "react";
import Image from "next/image";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const Logo = () => {
  const { logo, siteName } = useSiteSettings();

  return (
    <div className="flex">
      <Image
        src={logo || "/A2ITLogo.png"}
        alt={siteName ? `${siteName} Logo` : "A2it Logo"}
        width={120}
        height={40}
        className="h-8 w-auto"
        unoptimized
      />
    </div>
  );
};

export default Logo;

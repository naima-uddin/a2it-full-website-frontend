import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex">
      <Image
        src="/A2ITLogo.png"
        alt="A2it Logo"
        width={120}
        height={40}
        className="h-8 w-auto"
        unoptimized
      />
    </div>
  );
};

export default Logo;

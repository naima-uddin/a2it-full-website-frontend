"use client";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import React from "react";

const StatCard = ({ count, title, subtitle, bgImage, logo, color, suffix }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
 <div
  ref={ref}
  className="relative rounded-2xl p-6 sm:p-8 flex flex-col justify-start min-h-[200px] sm:min-h-[260px] w-full overflow-hidden"
  style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    boxShadow: `0 10px 25px -5px ${color}20`,
    border: "1px solid rgba(255, 255, 255, 0.1)",
  }}
>
  {/* Dark Overlay */}
  <div 
    className="absolute inset-0 bg-black/40 rounded-2xl"
  ></div>
  
  {/* Dot Overlay */}
  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:18px_18px] opacity-10" />

  {/* Logo */}
  <div
    className="absolute top-6 right-6 w-10 h-10 sm:w-12 sm:h-12 opacity-85 z-10"
    style={{
      backgroundImage: `url(${logo})`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}
  />

  {/* Number */}
  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-md relative z-10">
    {inView ? <CountUp end={count} duration={3.5} /> : "0"}
    {suffix}
  </p>

  {/* Title */}
  <p
    className="text-xl sm:text-2xl lg:text-3xl font-extrabold mt-3 bg-clip-text text-transparent relative z-10"
    style={{
      backgroundImage: `linear-gradient(to right, #fff, ${color})`,
    }}
  >
    {title}
  </p>

  {/* Subtitle */}
  <p className="text-sm sm:text-base text-white/80 mt-2 leading-relaxed max-w-[90%] relative z-10">
    {subtitle}
  </p>
</div>
  );
};

const StatsSection = () => {
  const images = [
    "/assets/StatsCard/1.avif",
    "/assets/StatsCard/2.avif",
    "/assets/StatsCard/3.avif", 
    "/assets/Portfolio/portfolio-bg.avif",
  ];

  const logos = [
    "https://cdn-icons-png.flaticon.com/512/869/869869.png",
    "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
    "https://cdn-icons-png.flaticon.com/512/1077/1077063.png",
    "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
  ];

  const colors = ["#f97316", "#3b82f6", "#8b5cf6", "#10b981"];

  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
        <StatCard
          count={5}
          suffix="+"
          title="Years of Excellence"
          subtitle="Delivering premium solutions with cutting-edge technology"
          bgImage={images[0]}
          logo={logos[0]}
          color={colors[0]}
        />
        <StatCard
          count={200}
          suffix="+"
          title="Successful Projects"
          subtitle="Innovative solutions tailored to client needs"
          bgImage={images[1]}
          logo={logos[1]}
          color={colors[1]}
        />
        <StatCard
          count={100}
          suffix="+"
          title="Happy Clients"
          subtitle="Building lasting relationships with our partners"
          bgImage={images[2]}
          logo={logos[2]}
          color={colors[2]}
        />
        <StatCard
          count={50000}
          suffix="+"
          title="Lines of Code"
          subtitle="Crafting clean, scalable, and maintainable solutions"
          bgImage={images[3]}
          logo={logos[3]}
          color={colors[3]}
        />
      </div>
    </div>
  );
};

export default StatsSection;
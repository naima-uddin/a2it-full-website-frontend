import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import React from "react";

const StatCard = ({ count, title, subtitle, bgImage, logo, color }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        padding: "2.5rem",
        borderRadius: "1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "200px",
        width: "100%",
        maxWidth: "350px",
        overflow: "hidden",
        boxShadow: `0 25px 50px -12px ${color}40`,
        transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        background: `linear-gradient(to bottom right, ${color}20, #1c1c1c)`,
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        zIndex: 1,
      }}
      className="stat-card max-w-7xl mx-auto "
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
          zIndex: -1,
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          width: "60px",
          height: "60px",
          backgroundImage: `url(${logo})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.8,
          filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))",
        }}
      />

      {/* Floating Particles */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "radial-gradient(white 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.05,
          animation: "float 15s linear infinite",
        }}
      />

      {/* Reflection */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background:
            "linear-gradient(to top, rgba(255,255,255,0.15), transparent)",
          opacity: 0.3,
          borderBottomLeftRadius: "1.5rem",
          borderBottomRightRadius: "1.5rem",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <p
          style={{
            color: "white",
            fontSize: "3.5rem",
            fontWeight: "bold",
            margin: 0,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            lineHeight: 1,
          }}
        >
          {inView ? <CountUp end={count} duration={3.5} /> : "0"}+
        </p>
        <p
          style={{
            color: "white",
            fontSize: "1.75rem",
            fontWeight: 700,
            marginTop: "1rem",
            marginBottom: 0,
            textShadow: "0 2px 5px rgba(0,0,0,0.3)",
            background: `linear-gradient(to right, white, ${color})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </p>
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "1rem",
            marginTop: "0.75rem",
            maxWidth: "90%",
            marginBottom: 0,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Hover Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "1.5rem",
          boxShadow: `inset 0 0 50px ${color}20`,
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
        className="hover-glow"
      />
    </div>
  );
};

const StatsSection = () => {
  // Sample images (replace with your actual image URLs)
  const images = [
    "/assets/StatsCard/1.avif",
    "/assets/StatsCard/2.avif",
    "/assets/StatsCard/3.avif",
    "/assets/StatsCard/3.avif",
  ];

  const logos = [
    "https://cdn-icons-png.flaticon.com/512/869/869869.png", // Trophy icon
    "https://cdn-icons-png.flaticon.com/512/2933/2933245.png", // Project icon
    "https://cdn-icons-png.flaticon.com/512/1077/1077063.png", // Customer icon
  ];

  const colors = ["#f97316", "#3b82f6", "#8b5cf6"];

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        padding: "6rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Global styles */}
      <style>
        {`
          @keyframes float {
            0% { background-position: 0 0; }
            100% { background-position: 100% 100%; }
          }
          
          .stat-card:hover {
            transform: translateY(-10px) scale(1.03);
            box-shadow: 0 30px 60px -12px rgba(0,0,0,0.25);
          }
          
          .stat-card:hover .hover-glow {
            opacity: 1;
          }
          
          .stats-container {
            scrollbar-width: none;
          }
          
          .stats-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {/* Animated background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 30% 50%, #1e3a8a20, transparent 50%), radial-gradient(circle at 70% 70%, #7e22ce20, transparent 50%)",
          zIndex: 0,
          animation: "float 30s linear infinite alternate",
        }}
      />

      {/* Container */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          padding: "3rem 1rem",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10,
        }}
        className="stats-container"
      >
        <StatCard
          count={5}
          title="Years of Excellence"
          subtitle="Delivering premium solutions with cutting-edge technology"
          bgImage={images[0]}
          logo={logos[0]}
          color={colors[0]}
        />
        <StatCard
          count={200}
          title="Successful Projects"
          subtitle="Innovative solutions tailored to client needs"
          bgImage={images[1]}
          logo={logos[1]}
          color={colors[1]}
        />
        <StatCard
          count={100}
          title="Happy Clients"
          subtitle="Building lasting relationships with our partners"
          bgImage={images[2]}
          logo={logos[2]}
          color={colors[2]}
        />
      </div>

      {/* Scroll hint */}
      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.875rem",
          display: "none",
        }}
        className="scroll-hint"
      >
        ← Scroll to see more →
      </div>

      {/* Responsive styles */}
      <style>
        {`
          @media (max-width: 1024px) {
            .stats-container {
              scroll-snap-type: x mandatory;
              -webkit-overflow-scrolling: touch;
            }
            .stat-card {
              min-width: 280px;
              scroll-snap-align: center;
            }
            .scroll-hint {
              display: block;
            }
          }
        `}
      </style>
    </div>
  );
};

export default StatsSection;

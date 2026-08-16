"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiClock,
  FiUsers as FiTeam,
  FiHeart,
  FiAward,
  FiTrendingUp,
  FiBook,
  FiZap,
  FiShield,
  FiSun,
  FiMessageSquare,
  FiTarget,
  FiEye,
  FiStar,
} from "react-icons/fi";
import { FaRegStarHalf } from "react-icons/fa";

const ValuesSection = () => {
  const [activeValue, setActiveValue] = useState(0);

  const values = [
    {
      title: "User-Focused Solutions",
      icon: <FiUsers className="text-4xl" />,
      description: [
        "We create intuitive digital solutions by deeply understanding user needs through research and testing.",
        "Our human-centered design approach ensures seamless experiences that align with real-world expectations.",
        "By continuously integrating feedback throughout development, we minimize risk and maximize adoption.",
      ],
    },
    {
      title: "Agile, Timely Delivery",
      icon: <FiClock className="text-4xl" />,
      description: [
        "Our agile approach adapts quickly to changing requirements while maintaining quality and clear communication.",
        "We emphasize disciplined planning and risk management to consistently meet deadlines.",
        "Timely delivery helps you accelerate time-to-market and maintain a competitive edge.",
      ],
    },
    {
      title: "Skilled and Collaborative Team",
      icon: <FiTeam className="text-4xl" />,
      description: [
        "Our diverse experts solve challenges from multiple perspectives, delivering practical and innovative solutions.",
        "We stay ahead by anticipating emerging trends and continuously updating our skills.",
        "Ensuring solutions that are scalable, future-ready, and built to provide lasting value.",
      ],
    },
    {
      title: "Transparent Communication",
      icon: <FiMessageSquare className="text-4xl" />,
      description: [
        "We prioritize open dialogue, ensuring clients are informed at every turn.",
        "Our clear communication fosters trust and alignment, enriching collaboration.",
        "Transparency at every stage builds lasting partnerships.",
      ],
    },
    {
      title: "Innovative Excellence",
      icon: <FiStar className="text-4xl" />,
      description: [
        "We thrive on innovation, pushing creative boundaries.",
        "By blending cutting-edge trends and strategic insights.",
        "We consistently deliver designs that stand at the forefront of excellence.",
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % values.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a0a12]/10 text-[#e0e0ff] py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Values That <span className="text-[#006dff]">Set Us Apart</span>
          </h2>
          <div className="h-1 bg-gradient-to-r from-[#5c97ce] via-[#0066ff] to-transparent rounded-full mx-auto w-32 mb-6"></div>
          <p className="text-black text-lg max-w-2xl mx-auto">
            The principles that guide our work and define our culture
          </p>
        </motion.div>

        {/* Values Carousel */}
        <div className="relative">
          {/* Animated Values */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {values.map((value, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveValue(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  activeValue === index
                    ? "bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-black shadow-lg"
                    : "bg-white hover:bg-[#00f0ff] text-black"
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="mb-3">{value.icon}</div>
                  <h3 className="font-semibold text-center">{value.title}</h3>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Active Value Content */}
          <motion.div
            key={activeValue}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-[#6da5fa] to-[#0077b8] rounded-xl p-8 shadow-xl border border-[#00f0ff]/20"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                  {React.cloneElement(values[activeValue].icon, {
                    className: "text-4xl text-[#00f0ff]",
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-black">
                  {values[activeValue].title}
                </h3>
                <ul className="space-y-3">
                  {values[activeValue].description.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-white mr-2">•</span>
                      <span className="text-white">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ValuesSection;

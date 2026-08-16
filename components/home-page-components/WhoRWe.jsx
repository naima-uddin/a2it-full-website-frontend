"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image"; // ✅ Next.js Image
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const WhoRWe = () => {
  const stats = [
    {
      value: "5",
      label: "Years",
      description: "Of combined experience in software development",
    },
    {
      value: "100+",
      label: "Clients",
      description: "Worldwide satisfied clients",
    },
    {
      value: "200+",
      label: "Projects",
      description: "Successfully delivered products",
    },
  ];

  const [activeStat, setActiveStat] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <section
      className="relative py-16 px-4 sm:px-6 md:px-16 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url(/assets/backgroundImg/office-background.jpg)`,
      }}
    >
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src="/assets/backgroundImg/office-background.jpg"
          alt="Office background"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-64" />
      </div>

      {/* Glow */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-40 sm:w-60 h-40 sm:h-60 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#0066ff]"
          animate={{ x: [0, 20, 0], y: [0, 20, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          style={{ filter: "blur(80px)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-16 relative z-10">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 text-[#e0e0ff]"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
              What is <span className="text-[#0066ff]">A2IT</span>?
            </h2>
            <motion.div
              className="h-1 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>

          <div className="space-y-6 mt-8">
            <p className="text-white sm:text-lg leading-relaxed">
              <span className="font-medium">A2IT</span>, the love of business,
              is a service provider of business minded, well focused young IT
              professionals.
            </p>
            <p className="text-white sm:text-lg leading-relaxed">
              We provide quality and expedient services and are in a position to
              appreciate our customer’s need emphatically, especially when it
              comes to their concern as to the project launching. Our
              professional team for Web Development, Web Programming, Designing
              and Marketing, create clean, unique and resourceful works that you
              must love.
            </p>

            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/A2ITLtd"
                className="bg-[#0066ff] hover:bg-[#00f0ff] p-2 rounded text-white transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="bg-[#0066ff] hover:bg-[#00f0ff] p-2 rounded text-white transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/a2itlimited/"
                className="bg-[#0066ff] hover:bg-[#00f0ff] p-2 rounded text-white transition-colors"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Stats */}
        <div className="lg:w-1/2 relative flex flex-col items-center justify-center gap-2 lg:block h-auto lg:h-[400px]">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`bg-white p-6 rounded-xl border border-[#00f0ff]/20 
        w-[220px] text-center
        ${activeStat === index ? "z-10" : "z-0"}
        lg:absolute`}
              style={
                index === 0
                  ? {
                      left: "0%",
                      top: "20%",
                      transform: "translate(-50%, -50%)",
                    }
                  : index === 1
                    ? {
                        left: "50%",
                        top: "60%",
                        transform: "translate(-50%, -50%)",
                      }
                    : {
                        left: "25%",
                        top: "40%",
                        transform: "translate(-50%, -50%)",
                      }
              }
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: activeStat === index ? 1 : 0.7,
                scale: activeStat === index ? 1.05 : 0.95,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
            >
              <h3 className="text-[#0066ff] text-4xl font-bold">
                {stat.value}
              </h3>
              <p className="text-black text-lg font-semibold mt-1">
                {stat.label}
              </p>
              <p className="text-black/60 text-sm mt-2">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoRWe;

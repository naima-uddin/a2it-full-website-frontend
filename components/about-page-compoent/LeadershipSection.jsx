"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Safe motion components that filter out Framer Motion props
const MotionDiv =
  motion?.div ||
  (({
    children,
    initial,
    whileInView,
    transition,
    whileHover,
    whileTap,
    ...props
  }) => <div {...props}>{children}</div>);

const LeadershipSection = () => {
  const leaders = [
{
  name: "Avijit Lasker",
  title: "Founder",
  image: "/assets/AboutImg/Founder.jpg",
  bio: "A passionate technology entrepreneur focused on building innovative digital solutions and creating meaningful impact through technology.",
  quote: "Technology should solve real problems and help businesses grow smarter.",
}
,
{
  name: "Tanni Rani Saha",
  title: "CEO",
  image: "/assets/AboutImg/CEO.JPG",
  bio: "A visionary leader driving company growth through strategic planning, innovation, and a strong focus on client success.",
  quote: "Great leadership turns ideas into impact through clarity, vision, and execution.",
}

  ];

  return (
<section className="py-6 px-4 md:px-16 bg-white shadow-2xl mt-4">
  <div className="max-w-7xl mx-auto">
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 md:mb-16"
    >
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
        Meet Our <span className="text-[#006dff]">Leadership</span>
      </h2>
      <div className="h-1 bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-transparent rounded-full w-24 md:w-32 mx-auto mb-4 md:mb-6"></div>
      <p className="  max-w-2xl mx-auto text-sm  text-black px-4">
        Visionary leaders driving our company's success and innovation
      </p>
    </MotionDiv>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {leaders.map((leader, index) => (
        <MotionDiv
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className="bg-white rounded-xl overflow-hidden border shadow-2xl border-[#00f0ff]/20 hover:border-[#00f0ff]/40 transition-all duration-300"
        >
          <div className="md:flex">
            {/* Image Section with proper border */}
            <div className="md:w-6/12 relative">
              <div className="relative overflow-hidden h-64 md:h-full ">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  width={300}
                  height={400}
                  unoptimized
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/80 via-transparent to-transparent"></div>
              </div>
              {/* Border for the image section */}
              <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00f0ff]/40 to-transparent hidden md:block"></div>
            </div>
            
            {/* Content Section */}
            <div className="md:w-6/12 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-1">{leader.name}</h3>
              <p className="text-[#006dff]  mb-3 md:mb-4 text-sm md:text-base font-bold">{leader.title}</p>
              <p className="text-black mb-4 md:mb-6 text-sm md:text-base leading-relaxed">{leader.bio}</p>
              <div className="border-l-2 border-[#00f0ff] pl-3 md:pl-4 italic text-black text-sm md:text-base">
                "{leader.quote}"
              </div>
            </div>
          </div>
        </MotionDiv>
      ))}
    </div>
  </div>
</section>
  );
};

export default LeadershipSection;

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaBullhorn,
  FaCode,
  FaMobileAlt,
  FaPenNib,
} from "react-icons/fa";

const services = [
  {
    icon: <FaPenNib />,
    title: "Branding Strategy",
    desc: "Strategic branding to define your unique story.",
  },
  {
    icon: <FaBullhorn />,
    title: "Digital Marketing",
    desc: "Drive online success with data-driven strategies.",
  },
  {
    icon: <FaCode />,
    title: "Website Development",
    desc: "Custom web development for your business.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Mobile Apps Development",
    desc: "Feature-rich mobile apps for iOS & Android.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Service() {
  return (
    <section className="min-h-[500px] h-auto py-12 md:py-16 lg:py-0 lg:h-[500px] flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 md:gap-12 items-center w-full">

        {/* IMAGE - মোবাইলে উপরে দেখাবে */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] w-full flex items-center order-1 lg:order-1"
        >
          <div className="absolute -left-0 -top-5 w-full h-full border-l-[8px] border-b-[8px] border-orange-500 rotate-[-6deg] rounded-bl-2xl" />

          <Image
            src="/images/laptop (2).png"
            alt="service"
            fill
            className="object-contain md:object-cover rotate-[-6deg] top-[40%] scale-90 sm:scale-95 md:scale-100"
            priority
          />
        </motion.div>

        {/* CONTENT */}
        <div className="order-2 lg:order-2">

          {/* HEADING */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-orange-500 italic mb-2 text-sm sm:text-base flex items-center gap-1"
          >
            <span className="text-lg">●</span> Our Services
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight"
          >
            We Want To Give You,{" "}
            <span className="text-orange-500 block sm:inline">Our Best Services</span>
          </motion.h2>

          {/* LIST */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-4 sm:space-y-5"
          >
            {services.map((itemData, index) => (
              <motion.div
                key={index}
                variants={item}
                className="flex gap-3 sm:gap-4 group items-start"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-orange-100 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition text-base sm:text-lg">
                  {itemData.icon}
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-orange-500 transition text-base sm:text-lg">
                    {itemData.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {itemData.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
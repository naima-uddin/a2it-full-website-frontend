"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

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

const ContactBanner = () => {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#12121a]/10 rounded-xl md:rounded-2xl p-6 md:p-12 shadow-xl border border-[#00f0ff]/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Section - Contact Info */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight">
                Ready to{" "}
                <span className="text-[#006dff]">Transform</span> Your Business?
              </h2>
              <p className="text-black mb-6 md:mb-6 text-sm md:text-base max-w-lg mx-auto md:mx-0">
                Get in touch with our team to discuss how we can help you
                achieve your technology goals.
              </p>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center md:justify-start">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <FiMail className="text-[#00f0ff] text-lg" />
                    <h4 className="font-medium text-sm md:text-base">Email Us</h4>
                  </div>
                  <p className="text-black text-sm ">
                    info@a2itltd.com
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center md:justify-start">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <FiPhone className="text-[#00f0ff] text-lg" />
                    <h4 className="font-medium text-sm md:text-base">Call Us</h4>
                  </div>
                  <p className="text-black text-sm  ">
                    +880 1846-937397
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 justify-center md:justify-start">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <FiMapPin className="text-[#00f0ff] text-lg mt-0.5" />
                    <h4 className="font-medium text-sm md:text-base">Visit Us</h4>
                  </div>
                  <p className="text-black text-xs  text-center sm:text-left mt-1">
                    Plot No 470 Road No 06 (Old 29) DOHS Mirpur, Dhaka
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Form */}
            <div className="bg-white rounded-xl p-4 md:p-8 border border-[#00f0ff]/20">
              <form className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-black mb-1 md:mb-2 text-sm md:text-base">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#12121a]/10 border border-[#00f0ff]/20 rounded-lg px-4 py-2 md:py-3 text-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-black mb-1 md:mb-2 text-sm md:text-base">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#12121a]/10 border border-[#00f0ff]/20 rounded-lg px-4 py-2 md:py-3 text-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-black mb-1 md:mb-2 text-sm md:text-base">
                    Message
                  </label>
                  <textarea
                    rows="3"
                    className="w-full bg-[#12121a]/10 border border-[#00f0ff]/20 rounded-lg px-4 py-2 md:py-3 text-black focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button
                  type="button"
                  className="w-full bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-medium py-2.5 md:py-3 rounded-lg hover:shadow-lg hover:shadow-[#00f0ff]/30 transition-all duration-300 text-sm md:text-base active:scale-95"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
};

export default ContactBanner;
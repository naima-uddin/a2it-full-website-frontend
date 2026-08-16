"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiMessageSquare,
  FiSend,
  FiClock,
} from "react-icons/fi";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { redirectToThankYou } from "../shared/contactSuccessRedirect";

// Dynamically import the map component with no SSR
const ClientSideMap = dynamic(() => import("./ClientSideMap"), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full bg-[#0066ff] flex items-center justify-center rounded-lg">
      <p className="text-[#b0b0ff]">Loading map...</p>
    </div>
  ),
});

const officePosition = [23.836236, 90.358672];
const officeAddress =
  "Plot No 470, Road No 06 (Old 29), DOHS Mirpur, Dhaka Division, Bangladesh";

const SectionHeader = ({ icon, title }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] rounded-t-xl border-b border-[#00f0ff]/30"></div>
    <div className="relative z-10 py-5 px-8 flex items-center gap-3">
      <div className="text-black text-xl group-hover:text-black transition-colors">
        {icon}
      </div>
      <h2 className="text-xl font-bold tracking-wide group-hover:text-white transition-colors">
        {title}
      </h2>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
);

const ContactUs = () => {
  const router = useRouter();
  const [position, setPosition] = useState(officePosition);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { name, email, message, phone: formData.phone };

    try {
      const res = await fetch(
        "https://a2it-dashboard-backend.vercel.app/api/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      if (data.success) {
        redirectToThankYou(router);
        return;
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!isClient) {
    return (
      <div className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#e0e0ff] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00f0ff] mx-auto mb-4"></div>
          <p className="text-[#b0b0ff]">Loading contact form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#00f0ff] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-60 right-32 w-64 h-64 bg-[#0066ff] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#155257] to-[#0066ff]">
              Get in Touch
            </span>
          </h1>
          <p className="text-xl text-[#000] max-w-2xl mx-auto">
            Have questions or want to discuss a project? We'd love to hear from
            you.
          </p>
        </motion.div>

        {/* Contact Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#00f0ff]/20 hover:border-[#00f0ff]/50 transition-colors text-white"
          >
            <SectionHeader icon={<FiMapPin />} title="Contact Information" />

            <div className="p-8 space-y-8">
              <div className="flex items-start gap-5">
                <div className="bg-[#12121a]/10 p-3 rounded-xl text-[#006dff] flex-shrink-0">
                  <FiMapPin className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-black">
                    Our Address
                  </h3>
                  <p className="text-[#006dff]">{officeAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="bg-[#12121a]/10 p-3 rounded-xl text-[#006dff] flex-shrink-0">
                  <FiPhone className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-black">
                    Phone Number
                  </h3>
                  <p className="text-[#006dff]">+880 1846-937397</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="bg-[#12121a]/10 p-3 rounded-xl text-[#006dff] flex-shrink-0">
                  <FiMail className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-black">
                    Email Address
                  </h3>
                  <p className="text-[#006dff]">info@a2itltd.com</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="bg-[#12121a]/10 p-3 rounded-xl text-[#006dff] flex-shrink-0">
                  <FiClock className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-black">
                    Working Hours
                  </h3>
                  <p className="text-[#006dff]">
                    Saturday - Friday: 10AM - 7PM
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden border border-[#00f0ff]/20 hover:border-[#00f0ff]/50 transition-colors text-white"
          >
            <SectionHeader icon={<FiSend />} title="Send Us a Message" />

            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                {/* Name Field */}
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="block text-black font-medium"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#00f0ff]">
                      <FiUser />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="pl-10 w-full px-4 py-3 bg-[#12121a]/10 border border-[#00f0ff]/20 text-black rounded-lg focus:ring-2 focus:ring-[#00f0ff] focus:border-[#00f0ff] outline-none transition-all placeholder-[#b0b0ff] "
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-black font-medium"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#00f0ff]">
                      <FiMail />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="pl-10 w-full px-4 py-3 bg-[#12121a]/10 border border-[#00f0ff]/20 text-black rounded-lg focus:ring-2 focus:ring-[#00f0ff] focus:border-[#00f0ff] outline-none transition-all placeholder-[#b0b0ff] "
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1">
                  <label
                    htmlFor="phone"
                    className="block text-black font-medium"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#00f0ff]">
                      <FiPhone />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1234 567890"
                      className="pl-10 w-full px-4 py-3 bg-[#12121a]/10 border border-[#00f0ff]/20 text-black rounded-lg focus:ring-2 focus:ring-[#00f0ff] focus:border-[#00f0ff] outline-none transition-all placeholder-[#b0b0ff] "
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-1">
                  <label
                    htmlFor="message"
                    className="block text-black font-medium"
                  >
                    Your Message
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-[#00f0ff]">
                      <FiMessageSquare />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows="5"
                      placeholder="Write your message here..."
                      className="pl-10 w-full px-4 py-3 bg-[#12121a]/10 border border-[#00f0ff]/20 text-black rounded-lg focus:ring-2 focus:ring-[#00f0ff] focus:border-[#00f0ff] outline-none transition-all placeholder-[#b0b0ff] "
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-[0_0_20px_-5px_rgba(0,240,255,0.5)] transition-all duration-300 transform hover:scale-[1.01] ${
                    isSubmitting ? "opacity-80" : "hover:opacity-90"
                  }`}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <FiSend className="inline mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-[#12121a] rounded-xl shadow-xl overflow-hidden border border-[#00f0ff]/20 hover:border-[#00f0ff]/50 transition-colors text-white"
        >
          <SectionHeader icon={<FiMapPin />} title="Find Us on Map" />
          <ClientSideMap
            position={position}
            setPosition={setPosition}
            officeAddress={officeAddress}
          />
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;

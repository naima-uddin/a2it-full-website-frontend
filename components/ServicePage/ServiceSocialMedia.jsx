"use client"
import React from "react";
import { motion } from "framer-motion";
import {
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiTwitter,
  FiLinkedin,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiBarChart2,
} from "react-icons/fi";
import Link from "next/link";

const ServiceSocialMedia = () => {
  return (
    <div className="bg-[#0a0a12] text-[#e0e0ff] overflow-hidden">
      {/* **Hero Section – Social Media Collage** */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background collage */}
        <div className="absolute inset-0 flex flex-wrap opacity-10">
          <div className="w-1/2 md:w-1/4 h-1/3 bg-[url('https://images.unsplash.com/photo-1611162616475-46b635cb6868')] bg-cover bg-center"></div>
          <div className="w-1/2 md:w-1/4 h-1/3 bg-[url('https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0')] bg-cover bg-center"></div>
          <div className="w-1/2 md:w-1/4 h-1/3 bg-[url('https://images.unsplash.com/photo-1614680376573-df3480f0c6ff')] bg-cover bg-center"></div>
          <div className="w-1/2 md:w-1/4 h-1/3 bg-[url('https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0')] bg-cover bg-center"></div>
          <div className="w-1/2 md:w-1/4 h-1/3 bg-[url('https://images.unsplash.com/photo-1611162616475-46b635cb6868')] bg-cover bg-center"></div>
          <div className="w-1/2 md:w-1/4 h-1/3 bg-[url('https://images.unsplash.com/photo-1614680376573-df3480f0c6ff')] bg-cover bg-center"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a12] via-transparent to-[#0a0a12]"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-medium mb-6 rounded-full">
              SOCIAL MEDIA
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                Grow Your Brand
              </span>{" "}
              on Social
            </h1>
            <p className="text-xl text-[#b0b0ff] max-w-2xl mb-12">
              We create thumb-stopping content and data-driven strategies that
              build communities and drive conversions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold py-4 px-8 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 font-semibold py-4 px-8 rounded-lg transition-colors duration-300"
              >
                See Our Work
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            {/* Phone mockup with social content */}
            <div className="relative">
              <div className="absolute top-8 right-8 w-64 h-64 bg-[#0066ff] opacity-10 rounded-full blur-3xl"></div>
              <div className="mockup-phone">
                <div className="camera"></div>
                <div className="display">
                  <div className="artboard artboard-demo phone-1 bg-[#12121a]">
                    <div className="h-full overflow-y-scroll">
                      {/* Instagram post example */}
                      <div className="border-b border-[#00f0ff]/10">
                        <div className="p-4">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#0066ff]"></div>
                            <div className="ml-3 font-semibold">yourbrand</div>
                          </div>
                          <div className="aspect-square bg-gradient-to-r from-[#00f0ff] to-[#0066ff] flex items-center justify-center text-[#0a0a12] font-bold">
                            YOUR CONTENT
                          </div>
                          <div className="mt-3 flex space-x-4 text-xl">
                            <FiInstagram className="text-[#00f0ff]" />
                            <FiFacebook className="text-[#00f0ff]" />
                            <FiTwitter className="text-[#00f0ff]" />
                          </div>
                        </div>
                      </div>

                      {/* Instagram story example */}
                      <div className="p-4 border-b border-[#00f0ff]/10">
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                          {[1, 2, 3].map((item) => (
                            <div
                              key={item}
                              className="flex-shrink-0 w-24 h-32 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#0066ff] flex items-center justify-center text-[#0a0a12] font-bold text-sm"
                            >
                              Story {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* **Platform Expertise – Visual Showcase** */}
      <section className="py-20 px-6 sm:px-12 bg-[#12121a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#00f0ff] font-semibold tracking-widest text-sm">
              OUR EXPERTISE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Platform-Specific{" "}
              <span className="text-[#0066ff]">Strategies</span>
            </h2>
            <p className="text-[#b0b0ff] max-w-2xl mx-auto">
              We tailor content and campaigns for each social network's unique
              audience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                platform: "Instagram",
                icon: <FiInstagram className="text-4xl" />,
                image:
                  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0",
                stats: "1.2M+ Followers Grown",
                color: "text-[#00f0ff]",
              },
              {
                platform: "Facebook",
                icon: <FiFacebook className="text-4xl" />,
                image:
                  "https://images.unsplash.com/photo-1611162616475-46b635cb6868",
                stats: "3.5M+ Monthly Reach",
                color: "text-[#00f0ff]",
              },
              {
                platform: "YouTube",
                icon: <FiYoutube className="text-4xl" />,
                image:
                  "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff",
                stats: "500K+ Subscribers",
                color: "text-[#00f0ff]",
              },
              {
                platform: "LinkedIn",
                icon: <FiLinkedin className="text-4xl" />,
                image:
                  "https://images.unsplash.com/photo-1611944212129-29977ae1398c",
                stats: "200% Engagement Boost",
                color: "text-[#00f0ff]",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0e0e15] rounded-xl overflow-hidden border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-all duration-300"
              >
                <div className="h-48 relative">
                  <img
                    src={item.image}
                    alt={item.platform}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="w-16 h-16 bg-[#0066ff]/10 rounded-full flex items-center justify-center text-[#00f0ff]">
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white">
                        {item.platform}
                      </h3>
                      <p className="text-[#b0b0ff] text-sm">{item.stats}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2 text-[#b0b0ff]">
                    {[
                      "Content Strategy",
                      "Paid Campaigns",
                      "Community Growth",
                      "Analytics Reporting",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-[#00f0ff] mt-2 mr-3"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* **Content Types – Visual Gallery** */}
      <section className="py-20 px-6 sm:px-12 bg-[#0a0a12]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              CONTENT CREATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              <span className="text-[#00f0ff]">Engaging</span> Content Formats
            </h2>
            <p className="text-[#b0b0ff] max-w-2xl mx-auto">
              We produce diverse content that captures attention and drives
              action
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                type: "Photo Posts",
                description: "High-quality branded imagery",
                image:
                  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0",
              },
              {
                type: "Short Videos",
                description: "TikTok/Reels style content",
                image:
                  "https://images.unsplash.com/photo-1611162616475-46b635cb6868",
              },
              {
                type: "Stories",
                description: "24-hour engaging content",
                image:
                  "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff",
              },
              {
                type: "Live Streams",
                description: "Real-time audience interaction",
                image:
                  "https://images.unsplash.com/photo-1611944212129-29977ae1398c",
              },
              {
                type: "Carousels",
                description: "Swipeable educational content",
                image:
                  "https://images.unsplash.com/photo-1611162616475-46b635cb6868",
              },
              {
                type: "User Content",
                description: "Authentic customer stories",
                image:
                  "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl h-64"
              >
                <img
                  src={item.image}
                  alt={item.type}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {item.type}
                    </h3>
                    <p className="text-[#b0b0ff]">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* **Results – Before/After** */}
      <section className="py-20 px-6 sm:px-12 bg-[#12121a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#00f0ff] font-semibold tracking-widest text-sm">
              PROVEN RESULTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              <span className="text-[#0066ff]">Transforming</span> Social
              Presence
            </h2>
            <p className="text-[#b0b0ff] max-w-2xl mx-auto">
              Real metrics from our client campaigns
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                metric: "Follower Growth",
                before: "2,400",
                after: "48,900",
                icon: <FiUsers className="text-3xl" />,
                color: "text-[#00f0ff]",
              },
              {
                metric: "Engagement Rate",
                before: "1.2%",
                after: "6.8%",
                icon: <FiBarChart2 className="text-3xl" />,
                color: "text-[#0066ff]",
              },
              {
                metric: "Website Traffic",
                before: "320/mo",
                after: "4,100/mo",
                icon: <FiTrendingUp className="text-3xl" />,
                color: "text-[#00f0ff]",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#0e0e15] p-8 rounded-xl border border-[#00f0ff]/10"
              >
                <div
                  className={`w-14 h-14 bg-[#0066ff]/10 rounded-full flex items-center justify-center text-[#00f0ff] mb-6`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-6">{item.metric}</h3>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-sm text-[#b0b0ff] mb-1">Before</div>
                    <div className="text-2xl font-bold">{item.before}</div>
                  </div>
                  <div className="mx-4 text-[#00f0ff]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-[#b0b0ff] mb-1">After</div>
                    <div className={`text-2xl font-bold ${item.color}`}>
                      {item.after}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* **Final CTA – Gradient Section** */}
      <section className="py-32 px-6 sm:px-12 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Ready to <span className="text-[#0a0a12]">Elevate</span> Your Social
            Presence?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Let's create a social media strategy that grows your audience and
            drives real business results.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center bg-[#0a0a12] text-[#00f0ff] font-semibold py-4 px-12 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] transition-all duration-300 transform hover:scale-105"
            >
              Get Your Free Strategy Session
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceSocialMedia;

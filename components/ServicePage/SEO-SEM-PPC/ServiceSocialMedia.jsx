"use client";
import React, { useEffect, useState } from "react";
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
import Image from "next/image";

const ServiceSocialMedia = () => {
   const [selectedStory, setSelectedStory] = useState(null);
  
const stories = [
  {
    id: 1,
    title: "SEO",
    content: "Search Engine Optimization - Improve your website's visibility on search engines like Google. Increase organic traffic and rankings through keyword optimization, quality content, and technical SEO improvements.",
    color: "bg-gradient-to-br from-[#00f0ff] to-[#0066ff]",
    icon: "🔍",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stats: "Organic Traffic ↑ 150%"
  },
  {
    id: 2,
    title: "Social Media",
    content: "Social Media Marketing - Build brand awareness and engage with your audience across platforms like Facebook, Instagram, Twitter, and LinkedIn. Create viral content, run targeted ads, and grow communities.",
    color: "bg-gradient-to-br from-[#ff00cc] to-[#0066ff]",
    icon: "📱",
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stats: "Engagement Rate ↑ 85%"
  },
  {
    id: 3,
    title: "PPC Ads",
    content: "Pay-Per-Click Advertising - Drive immediate traffic with targeted ads on Google, Facebook, and other platforms. Pay only when users click your ads. Perfect for quick results and measurable ROI.",
    color: "bg-gradient-to-br from-[#00ff88] to-[#0066ff]",
    icon: "💰",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    stats: "Conversion Rate ↑ 200%"
  }
]; 
  // Story 1 always show on first load
  useEffect(() => {
    setSelectedStory(stories[0]);
  }, []);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };
  return (
    <div className="bg-white text-black overflow-hidden">
      {/* **Hero Section – Social Media Collage** */}
      <section className="relative  flex items-center overflow-hidden  py-6">
        {/* Background collage */}
        {/* <div className="absolute inset-0 flex flex-wrap opacity-10">
          <div className="w-1/2 md:w-1/4 h-1/3 bg-[url('/assets/SEO/youtube.jpeg')] bg-cover bg-center"></div>
          <div className="w-1/2 md:w-1/4 h-1/3 bg-[url('/assets/SEO/insta.jpeg')] bg-cover bg-center"></div>
          <div className="w-1/2 md:w-1/4 h-1/3 bg-[url('/assets/SEO/tiktok.jpeg')] bg-cover bg-center"></div>
        </div>  */}

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 py-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-medium mb-6 rounded-full">
              SOCIAL MEDIA
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                Grow Your Brand
              </span>{" "}
              on Social
            </h1>
            <p className="text-xl text-black max-w-2xl mb-12">
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
                className="border-2 border-[#00f0ff] text-[#0066ff] hover:bg-[#00f0ff]/10 font-semibold py-4 px-8 rounded-lg transition-colors duration-300"
              >
                See Our Work
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="  relative"
          >
            {/* Phone mockup with social content */}
<div className="relative min-h-screen flex items-center justify-center px-4">
  {/* Background Effects */}
  <div className="absolute -top-8 -right-8 w-64 h-64 bg-[#0066ff] opacity-10 rounded-full blur-3xl"></div>
  <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-[#00f0ff] opacity-10 rounded-full blur-3xl"></div>
  
  {/* Phone Container - Optimized Size */}
  <div className="relative z-10 w-full max-w-xs mx-auto">
    <div className="mockup-phone border-primary">
      <div className="camera"></div>
      <div className="display">
        <div className="artboard artboard-demo phone-1 bg-white shadow-2xl overflow-hidden"> 

          {/* Scrollable Content with Custom Scrollbar */}
          <div className="h-[calc(100%-60px)] overflow-y-auto
                        scroll-smooth
                        [scrollbar-width:thin]
                        [scrollbar-color:#00f0ff_#12121a]
                        hover:[scrollbar-color:#00f0ff/50_#12121a]
                        transition-colors
                        duration-300">
            {/* Main Content Area */}
            <div className="p-4">
              <div className="aspect-square rounded-lg flex flex-col items-center justify-center text-white overflow-hidden relative mb-4">
                {/* Background Image Container */}
                <div className="absolute inset-0">
                  {selectedStory ? (
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                      style={{ 
                        backgroundImage: `url(${selectedStory.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 ${selectedStory.overlayColor} transition-all duration-500`}></div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] to-[#0066ff]"></div>
                  )}
                </div>
                
                {/* Content Overlay */}
                <div className="relative z-10 p-4 text-center w-full">
                  {selectedStory ? (
                    <div className="animate-fadeIn">
                      <div className="text-3xl mb-3">{selectedStory.icon}</div>
                      <div className="text-xl font-bold mb-2 drop-shadow-lg">{selectedStory.title}</div>
                      <div className="text-xs mb-3 px-2 leading-relaxed bg-black/40 backdrop-blur-sm rounded-lg p-2">
                        {selectedStory.content}
                      </div>
                      <div className="bg-black/30 backdrop-blur-sm rounded-full py-1 px-3 text-xs font-semibold inline-block">
                        {selectedStory.stats}
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fadeIn">
                      <div className="text-2xl mb-3">📈</div>
                      <div className="text-lg font-bold drop-shadow-lg">Digital Marketing</div>
                      <div className="text-sm mt-1">Select a strategy</div>
                    </div>
                  )}
                </div>
              </div> 

              {/* Strategies Section */}
              <div className="mb-5"> 
                
                <div className="flex space-x-3 overflow-x-auto pb-3 -mx-2 px-2 py-3">
                  {/* Horizontal scrollable strategies with custom scrollbar */}
                  <div className="flex space-x-3 pb-3 min-w-min
                                [scrollbar-width:thin]
                                [scrollbar-color:#00f0ff/30_transparent]
                                hover:[scrollbar-color:#00f0ff/50_transparent]
                                transition-colors
                                duration-300">
                    {stories.map((story) => (
                      <button
                        key={story.id}
                        onClick={() => setSelectedStory(story)}
                        className={`flex-shrink-0 w-20 h-20 p-2 rounded-lg overflow-hidden relative group transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${selectedStory?.id === story.id ? 'ring-2 ring-white/30' : ''}`}
                      >
                        {/* Story Background Image */}
                        <div 
                          className="absolute inset-0 bg-cover bg-center "
                          style={{ backgroundImage: `url(${story.image})` }}
                        >
                          {/* Gradient Overlay */}
                          <div className={`absolute inset-0 ${story.overlayColor} opacity-80 group-hover:opacity-60 transition-opacity`}></div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full p-2">
                          {/* Active Indicator */}
                          {selectedStory?.id === story.id && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-600  flex items-center justify-center text-white text-[10px] font-bold z-20">
                              ✓
                            </div>
                          )}
                          
                          <div className="text-xl mb-1 drop-shadow-lg">{story.icon}</div>
                          <div className="text-xs font-bold text-white drop-shadow-lg">{story.title}</div>
                          <div className="text-[10px] mt-0.5 opacity-90 text-white">Strategy</div>
                          
                          {/* Hover Effect */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg"></div>
                        </div>
                      </button>
                    ))}
                    
                    {/* Reset Button */}
                    <button
                      onClick={() => setSelectedStory(stories[0])}
                      className="flex-shrink-0 w-20 h-20 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center text-white font-bold text-xs hover:opacity-90 transition-opacity relative overflow-hidden group"
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white"></div>
                        <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-white"></div>
                      </div>
                      
                      <div className="text-lg mb-1">↻</div>
                      <div>Reset</div>
                      <div className="text-[10px] mt-0.5 opacity-70">To SEO</div>
                      
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all"></div>
                    </button>
                  </div>
                </div>
                
                {/* Current Selection */}
                <div className="text-xs text-[#00f0ff]/70 mt-2 text-center">
                  {selectedStory ? (
                    <span>Viewing: <span className="font-semibold">{selectedStory.title}</span> strategy</span>
                  ) : (
                    <span>Tap any strategy to see details</span>
                  )}
                </div>
              </div> 
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
      <section className=" px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              OUR EXPERTISE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Platform-Specific{" "}
              <span className="text-[#0066ff]">Strategies</span>
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              We tailor content and campaigns for each social network's unique
              audience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                platform: "Instagram",
                icon: <FiInstagram className="text-4xl" />,
                image: "/assets/SEO/insta.jpeg",
                stats: "1.2M+ Followers Grown",
                color: "text-[#00f0ff]",
              },
              {
                platform: "Facebook",
                icon: <FiFacebook className="text-4xl" />,
                image:
                  "/assets/SEO/fb.avif",
                stats: "3.5M+ Monthly Reach",
                color: "text-[#00f0ff]",
              },
              {
                platform: "YouTube",
                icon: <FiYoutube className="text-4xl" />,
                image: "/assets/SEO/youtube.jpeg",
                stats: "500K+ Subscribers",
                color: "text-[#00f0ff]",
              },
              {
                platform: "LinkedIn",
                icon: <FiLinkedin className="text-4xl" />,
                image: "/assets/SEO/lindln.jpeg",
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
                className="bg-white mb-6 shadow-2xl rounded-xl overflow-hidden border border-[#00f0ff]/10 hover:border-[#0066ff]/50 transition-all duration-300"
              >
                <div className="h-48 relative">
                <div className="h-48 relative overflow-hidden bg-white">
                  <Image
                    src={item.image}
                    alt={item.platform}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    quality={70}
                    className="object-cover"
                    style={{
                      transform: "translateZ(0)",
                      willChange: "transform",
                    }}
                    priority={false}
                  />
                </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="w-16 h-16 bg-[#0066ff]/10 rounded-full flex items-center justify-center text-[#00f0ff]">
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-white">
                        {item.platform}
                      </h3>
                      <p className="text-black text-sm">{item.stats}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2 text-black">
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
      <section className="py-10 px-6 sm:px-12 bg-white">
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
              <span className="text-[#0066ff]">Engaging</span> Content Formats
            </h2>
            <p className="text-black max-w-2xl mx-auto">
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
                  "/assets/SEO/insta.jpeg",
              },
              {
                type: "Short Videos",
                description: "TikTok/Reels style content",
                image:
                  "/assets/SEO/youtube.jpeg",
              },
              {
                type: "Stories",
                description: "24-hour engaging content",
                image:
                  "/assets/SEO/tiktok.jpeg",
              },
              {
                type: "Live Streams",
                description: "Real-time audience interaction",
                image:
                  "/assets/SEO/lindln.jpeg",
              },
              {
                type: "Carousels",
                description: "Swipeable educational content",
                image:
                  "/assets/SEO/fb.avif",
              },
              {
                type: "User Content",
                description: "Authentic customer stories",
                image:
                  "/assets/SEO/twitter.avif",
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
              <div className="h-68 relative overflow-hidden bg-white">
                <Image
                  src={item.image}
                  alt={item}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  quality={70}
                  className="object-cover"
                  style={{
                    transform: "translateZ(0)",
                    willChange: "transform",
                  }}
                  priority={false}
                />
              </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {item.type}
                    </h3>
                    <p className="text-black">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* **Results – Before/After** */}
      <section className="py-10 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#0066ff] font-semibold tracking-widest text-sm">
              PROVEN RESULTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              <span className="text-[#0066ff]">Transforming</span> Social
              Presence
            </h2>
            <p className="text-black max-w-2xl mx-auto">
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
                color: "text-[#0066ff]",
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
                color: "text-[#0066ff]",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-2xl p-8 rounded-xl border border-[#00f0ff]/10"
              >
                <div
                  className={`w-14 h-14 bg-[#0066ff]/10 rounded-full flex items-center justify-center text-[#00f0ff] mb-6`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-6">{item.metric}</h3>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-sm text-black mb-1">Before</div>
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
                    <div className="text-sm text-black mb-1">After</div>
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
      <section className="py-22 px-6 sm:px-12 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12]">
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
              className="inline-flex items-center bg-white text-[#00f0ff] font-semibold py-4 px-12 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] transition-all duration-300 transform hover:scale-105"
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

"use client"
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiShoppingCart,
  FiCreditCard,
  FiTrendingUp,
  FiPieChart,
  FiTarget,
  FiLayers,
  FiBarChart2,
  FiCheckCircle,
  FiCpu,
  FiServer,
  FiTruck,
  FiUsers,
  FiBox,
  FiDollarSign,
  FiGlobe,
  FiAward,
  FiShoppingBag,
  FiGrid,
  FiSettings,
  FiMonitor,
  FiSmartphone,
  FiHeadphones,
  FiArrowRight,
  FiHexagon
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

const ShopifyServices = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: "Store Development",
      description: "Custom, high-converting Shopify stores built for your business",
      icon: <FiShoppingCart className="text-3xl" />,
      color: "bg-[#5A45EF]",
      features: [
        "Custom theme development",
        "Mobile-optimized design",
        "API integrations",
        "Performance optimization"
      ]
    },
    {
      title: "Platform Migration",
      description: "Seamless transition from other platforms to Shopify",
      icon: <FiServer className="text-3xl" />,
      color: "bg-[#9B5DE0]",
      features: [
        "Data migration",
        "SEO preservation",
        "Design conversion",
        "Post-migration support"
      ]
    },
    {
      title: "App Development",
      description: "Custom apps to extend your store's functionality",
      icon: <FiCpu className="text-3xl" />,
      color: "bg-[#D78FEE]",
      features: [
        "Custom app development",
        "Private app creation",
        "App integration",
        "App maintenance"
      ]
    },
    {
      title: "Marketing & SEO",
      description: "Drive traffic and increase conversions",
      icon: <FiTrendingUp className="text-3xl" />,
      color: "bg-[#5A45EF]",
      features: [
        "SEO optimization",
        "Conversion rate optimization",
        "Email marketing integration",
        "Analytics configuration"
      ]
    },
    {
      title: "Maintenance & Support",
      description: "Ongoing care for your Shopify store",
      icon: <FiHeadphones className="text-3xl" />,
      color: "bg-[#9B5DE0]",
      features: [
        "Regular updates",
        "Security monitoring",
        "24/7 support",
        "Backup solutions"
      ]
    }
  ];

  const successStories = [
    {
      title: "Fashion Retailer Transformation",
      metrics: "68% faster load times, 42% increase in mobile conversions",
      result: "$1.2M increased annual revenue",
      image: "/assets/BlogImg/1.avif"
    },
    {
      title: "Health Supplement Store",
      metrics: "83% subscription retention, 57% more repeat customers",
      result: "3.2x ROI within first year",
      image: "/assets/BlogImg/1.avif"
    },
    {
      title: "Home Decor Brand",
      metrics: "2.5x traffic growth, 40% higher conversion rate",
      result: "$850K in first 6 months",
      image: "/assets/BlogImg/1.avif"
    }
  ];

  return (
    <div className="bg-gradient-white text-black overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute opacity-5"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${100 + Math.random() * 300}px`,
              height: `${100 + Math.random() * 300}px`,
            }}
          >
            <FiHexagon className="w-full h-full text-[#7E6BF0]" />
          </motion.div>
        ))}
      </div>

      {/* Hero Section with Curved Divider */}
      <section className="relative min-h-screen flex items-center overflow-hidden py-10">
        <div className="absolute top-0 left-0 w-full h-3/4 bg-white z-0"></div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180" className="w-full">
            <path fill="#0F0F1A" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,144C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-[#7E6BF0] bg-opacity-10 text-[#f8f7f9] font-medium mb-6 rounded-full border border-[#7E6BF0] border-opacity-30"
            >
              <FiHexagon className="mr-2" />
              SHOPIFY EXPERTS
            </motion.span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7E6BF0] to-[#5A45EF]">
                Elevate Your
              </span>
              <br />
              Ecommerce Experience
            </h1>
            <p className="text-xl text-[#B0B0FF] max-w-2xl mb-12">
              We build high-performing Shopify stores that convert visitors into customers and drive sustainable growth for your business.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="relative overflow-hidden group bg-gradient-to-r from-[#7E6BF0] to-[#5A45EF] text-white font-semibold py-4 px-8 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(126,107,240,0.5)] transition-all duration-300 flex items-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Your Project
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/portfolio"
                className="border-2 border-[#7E6BF0] text-[#7E6BF0] hover:bg-[#7E6BF0] hover:bg-opacity-10 font-semibold py-4 px-8 rounded-lg transition-colors duration-300"
              >
                View Our Work
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white p-8 rounded-2xl border border-[#7E6BF0] border-opacity-20 overflow-hidden transform perspective-1000 rotate-x-5">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7E6BF0] to-[#5A45EF]"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#7E6BF0] rounded-full opacity-10"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#00D2AA] rounded-full opacity-10"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-xl font-bold">Shopify Dashboard</div>
                  <div className="text-sm text-[#f3f3f4] bg-[#7E6BF0] bg-opacity-10 px-3 py-1 rounded-full">Live Preview</div>
                </div>
                
                <div className="bg-white rounded-xl p-4 mb-6 overflow-hidden">
                  <div className="flex justify-between mb-4">
                    <div className="text-sm text-[#B0B0FF]">Monthly Revenue</div>
                    <div className="text-sm text-[#00D2AA]">+35.2%</div>
                  </div>
                  <div className="h-32 relative">
                    <div className="absolute inset-0 flex items-end">
                      {[30, 45, 60, 75, 65, 80, 90, 75, 85, 70, 65, 95].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="flex-1 mx-0.5 bg-gradient-to-t from-[#5A45EF] to-[#7E6BF0] rounded-t"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-[#7E6BF0] border-opacity-10">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-[#7E6BF0] bg-opacity-10 rounded-full flex items-center justify-center text-[#7E6BF0] mr-2">
                        <FiTrendingUp className="text-sm" />
                      </div>
                      <div className="text-sm">Conversion</div>
                    </div>
                    <div className="font-bold text-[#7E6BF0]">+35%</div>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-[#00D2AA] border-opacity-10">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-[#00D2AA] bg-opacity-10 rounded-full flex items-center justify-center text-[#00D2AA] mr-2">
                        <FiShoppingCart className="text-sm" />
                      </div>
                      <div className="text-sm">Avg. Order</div>
                    </div>
                    <div className="font-bold text-[#00D2AA]">$162.80</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section - Horizontal Scroller */}
      <section className="py-20 px-6 sm:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#7E6BF0] font-semibold tracking-widest text-sm uppercase">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7E6BF0] to-[#5A45EF]">Shopify Solutions</span>
            </h2>
            <p className="text-[#B0B0FF] max-w-3xl mx-auto">
              From initial setup to ongoing optimization, we provide everything you need to succeed with Shopify.
            </p>
          </motion.div>

          <div className="relative">
            <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex-shrink-0 w-80 snap-start mx-4 bg-gradient-to-br ${service.color} bg-opacity-10 rounded-2xl p-6 border border-opacity-20 backdrop-blur-sm`}
                  style={{ borderColor: service.color.split(' ')[1] }}
                  onMouseEnter={() => setActiveService(index)}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-6`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                  <p className="text-black mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <div className={`w-5 h-5 rounded-full ${service.color} bg-opacity-20 flex items-center justify-center mr-3`}> 
                        </div>
                        <span className="text-sm text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 text-sm font-medium flex items-center group bg-white p-2 rounded-full">
                    <span>Learn more</span>
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Vertical Timeline */}
      <section className="py-2 px-6 sm:px-12 bg-white relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-[#00D2AA] font-semibold tracking-widest text-sm uppercase">
              Our Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              How We <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D2AA] to-[#00B393]">Build Success</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7E6BF0] via-[#00D2AA] to-[#4C8BF5] opacity-30"></div>
            
            {[
              {
                step: "Discovery",
                description: "We dive deep into your business goals, target audience, and requirements to create a tailored strategy.",
                icon: <FiTarget className="text-xl" />
              },
              {
                step: "Design",
                description: "Our designers create a stunning, user-friendly interface that reflects your brand and converts visitors.",
                icon: <FiLayers className="text-xl" />
              },
              {
                step: "Development",
                description: "We build your store with clean code, optimized performance, and seamless functionality.",
                icon: <FiCpu className="text-xl" />
              },
              {
                step: "Testing",
                description: "Rigorous testing ensures your store works perfectly across all devices and browsers.",
                icon: <FiCheckCircle className="text-xl" />
              },
              {
                step: "Launch",
                description: "We handle the entire launch process and ensure a smooth transition to your new store.",
                icon: <FiTrendingUp className="text-xl" />
              },
              {
                step: "Support",
                description: "Ongoing maintenance and support to keep your store running at peak performance.",
                icon: <FiHeadphones className="text-xl" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start mb-12 last:mb-0"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7E6BF0] to-[#5A45EF] flex items-center justify-center text-white font-bold text-lg mr-6">
                    {index + 1}
                  </div>
                  {index < 5 && (
                    <div className="absolute left-7 top-14 w-0.5 h-12 bg-gradient-to-b from-[#7E6BF0] to-[#00D2AA] opacity-50"></div>
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-[#7E6BF0] bg-opacity-10 rounded-full flex items-center justify-center text-[#7E6BF0] mr-3">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold">{item.step}</h3>
                  </div>
                  <p className="text-[#B0B0FF]">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories - Card Grid */}
      <section className="py-10 px-6 sm:px-12 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-[#FF6B8B] font-semibold tracking-widest text-sm uppercase">
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Real <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B8B] to-[#F45A78]">Results</span> We've Delivered
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {successStories.map((story, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gradient-white shadow-2xl rounded-2xl overflow-hidden border border-[#7E6BF0] border-opacity-10 hover:border-opacity-30 transition-all duration-300 group"
    >
      <div className="relative h-48 overflow-hidden">
        {/* Using Next.js Image component */}
        <Image
          src="/assets/serviceImg/1.avif"
          alt={story.title}
          fill
          className="object-cover"
        /> 
        
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <h3 className="text-xl font-bold text-white">{story.title}</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-[#00D2AA] bg-opacity-10 rounded-full flex items-center justify-center text-[#00D2AA] mr-3">
            <FiTrendingUp />
          </div>
          <div className="text-sm text-[#B0B0FF]">{story.metrics}</div>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-10 bg-[#7E6BF0] bg-opacity-10 rounded-full flex items-center justify-center text-[#7E6BF0] mr-3">
            <FiDollarSign />
          </div>
          <div className="font-bold text-[#7E6BF0]">{story.result}</div>
        </div>
        
      </div>
    </motion.div>
  ))}
</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-90"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -20, 0],
                rotate: 360
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              className="absolute text-[#7E6BF0]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${1 + Math.random() * 3}rem`,
              }}
            >
              <FiHexagon />
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <span className="inline-flex items-center px-4 py-2 bg-[#7E6BF0] bg-opacity-10 text-[#f8f7fb] font-medium mb-6 rounded-full border border-[#7E6BF0] border-opacity-30">
              Ready To Start?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7E6BF0] to-[#5A45EF]">Amazing Together</span>
            </h2>
            <p className="text-xl text-[#B0B0FF] max-w-2xl mx-auto">
              Schedule a free consultation to discuss how we can help you achieve your ecommerce goals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/contact"
              className="relative overflow-hidden group bg-gradient-to-r from-[#7E6BF0] to-[#5A45EF] text-white font-semibold py-4 px-12 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(126,107,240,0.5)] transition-all duration-300 flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Your Project
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/portfolio"
              className="border-2 border-[#7E6BF0] text-[#7E6BF0] hover:bg-[#7E6BF0] hover:text-white hover:bg-opacity-10 font-semibold py-4 px-12 rounded-lg transition-colors duration-300"
            >
              View Our Work
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ShopifyServices;
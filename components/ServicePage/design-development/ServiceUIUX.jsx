"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiLayout,
  FiPenTool,
  FiEye,
  FiUsers,
  FiSmartphone,
  FiPieChart,
} from "react-icons/fi";
import Link from "next/link";

const ServiceUIUX = () => {
  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] xl:[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1561070791-2526d30994b5')] bg-cover bg-center opacity-40"></div> 

<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 text-center">
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    {/* Heading - Responsive */}
    <h1 className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-6 sm:mb-8">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00cc] to-[#0066ff]">
        UI/UX Design Services
      </span>
    </h1>
    
    {/* Description - Responsive */}
    <p className="text-base sm:text-lg md:text-xl text-black max-w-2xl sm:max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 px-2 sm:px-0">
      We craft intuitive, beautiful user experiences that drive
      engagement, conversion, and customer satisfaction through
      human-centered design.
    </p>
    
    {/* Button - Responsive */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      <Link
        href="/contact"
        className="relative overflow-hidden group bg-gradient-to-r from-[#ff00cc] to-[#0066ff] text-white font-semibold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 rounded-full shadow-lg sm:shadow-xl hover:shadow-[0_5px_30px_rgba(255,0,204,0.3)] transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <span className="whitespace-nowrap">
          Get Free Design Consultation
        </span>
        <FiArrowRight className="transition-transform group-hover:translate-x-1 w-4 h-4 sm:w-5 sm:h-5" />
      </Link>
    </div>
  </motion.div>
</div>
      </section>

      {/* Design Showcase Section */}
      <section className="py-10 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-[#ff00cc]">Our</span> Design Projects
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              Explore our portfolio of successful UI/UX design implementations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                image: "/assets/design_development/e-bike.png",
                title: "Best Electric Bike",
                category: "Shopify",
              },
              {
                id: 2,
                image: "/assets/design_development/trademil.png",
                title: "Best Home Gym Equipment",
                category: "E-commerce",
              },
              {
                id: 3,
                image: "/assets/eCommerce/travelBookingShopify.avif",
                title: "Health Dashboard",
                category: "Healthcare UI",
              },
              {
                id: 4,
                image: "/assets/design_development/c-tire.png",
                title: "Commercial Tyre",
                category: "Responsive Platform",
              },
              {
                id: 5,
                image:
                  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=800&q=80",
                title: "Food Delivery App",
                category: "Mobile Design",
              },
              {
                id: 6,
                image: "/assets/design_development/trading.png",
                title: "Cargo Logistics Group Inc",
                category: "Tracking",
              },
            ].map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#ff00cc]/20"
              >
                {/* Project Thumbnail */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={`Screenshot of ${project.title}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold bg-[#ff00cc] text-white rounded-full">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-[#e0e0ff]">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* View Project Link (invisible overlay) */}
                <Link
                  href={`/portfolio/${project.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View ${project.title} project details`}
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/portfolio"
              className="inline-flex items-center border-2 border-[#ff00cc] text-[#ff00cc] hover:bg-[#ff00cc] hover:text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 group"
            >
              View All Design Projects
              <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-10 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-[#ff00cc] font-semibold tracking-widest text-sm">
              OUR DESIGN SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Comprehensive UI/UX Solutions
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              End-to-end design services focused on user needs and business
              goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FiPenTool className="text-3xl text-[#ff00cc]" />,
                title: "User Research",
                description:
                  "Understand your users through comprehensive research methods",
                features: [
                  "User Interviews",
                  "Persona Development",
                  "Market Analysis",
                  "Competitive Audit",
                ],
              },
              {
                icon: <FiLayout className="text-3xl text-[#ff00cc]" />,
                title: "UX Strategy",
                description:
                  "Develop a clear plan to achieve your business and user goals",
                features: [
                  "User Journey Mapping",
                  "Information Architecture",
                  "Content Strategy",
                  "UX Roadmapping",
                ],
              },
              {
                icon: <FiEye className="text-3xl text-[#ff00cc]" />,
                title: "UI Design",
                description:
                  "Create visually stunning interfaces that delight users",
                features: [
                  "Visual Design",
                  "Design Systems",
                  "Interaction Design",
                  "Brand Integration",
                ],
              },
              {
                icon: <FiUsers className="text-3xl text-[#ff00cc]" />,
                title: "Usability Testing",
                description:
                  "Validate designs with real users to ensure effectiveness",
                features: [
                  "Prototype Testing",
                  "A/B Testing",
                  "User Feedback Sessions",
                  "Analytics Review",
                ],
              },
              {
                icon: <FiSmartphone className="text-3xl text-[#ff00cc]" />,
                title: "Mobile App Design",
                description:
                  "Design exceptional mobile experiences for iOS and Android",
                features: [
                  "iOS Human Interface",
                  "Material Design",
                  "Responsive Layouts",
                  "Touch Optimization",
                ],
              },
              {
                icon: <FiPieChart className="text-3xl text-[#ff00cc]" />,
                title: "Design Optimization",
                description:
                  "Improve existing designs based on data and user feedback",
                features: [
                  "Conversion Rate Optimization",
                  "Accessibility Audit",
                  "Performance Review",
                  "UI Refinement",
                ],
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl border border-[#ff00cc]/20 hover:border-[#ff00cc] transition-all duration-300 group shadow-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] rounded-lg flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-black mb-5">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <FiCheck className="text-[#ff00cc] mt-1 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-10 px-6 sm:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-[#ff00cc] font-semibold tracking-widest text-sm">
              OUR DESIGN PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-6">
              Human-Centered Design Approach
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              A proven methodology that puts users at the center of every
              decision
            </p>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute left-16 right-16 top-1/2 h-1 bg-[#12121a]"></div>
            <div className="grid md:grid-cols-5 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  title: "Discover",
                  description:
                    "Research & understand user needs and business goals",
                },
                {
                  step: "02",
                  title: "Define",
                  description:
                    "Synthesize findings and establish design direction",
                },
                {
                  step: "03",
                  title: "Ideate",
                  description: "Brainstorm and explore creative solutions",
                },
                {
                  step: "04",
                  title: "Prototype",
                  description:
                    "Create interactive models of proposed solutions",
                },
                {
                  step: "05",
                  title: "Test",
                  description: "Validate designs with real users and iterate",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white p-8 rounded-xl border border-[#ff00cc]/20 hover:border-[#ff00cc] transition-colors duration-300 shadow-2xl"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ff00cc] to-[#0066ff] rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto text-white">
                    {item.step}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-black">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-10 px-6 sm:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Ready to <span className="text-[#ff00cc]">Elevate</span> Your User
            Experience?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-black mb-8 max-w-2xl mx-auto"
          >
            Let's create intuitive, beautiful experiences that your users will
            love and that drive business results.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center bg-gradient-to-r from-[#ff00cc] to-[#0066ff] text-white font-semibold py-5 px-12 rounded-full shadow-xl hover:shadow-[0_5px_30px_rgba(255,0,204,0.4)] transition-all duration-300 transform hover:scale-105"
            >
              Start Your Design Project
              <FiArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceUIUX;

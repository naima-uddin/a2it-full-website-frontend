import React from "react";
import MissionAndTeam from "./MissionAndTeam";
import ValuesSection from "./ValuesSection";
import StatsSection from "./StatsSection";
import CapabilitiesSection from "./CapabilitiesSection";
import LeadershipSection from "./LeadershipSection";
import ContactBanner from "./ContactBanner";
import CompanyGallery from "@/components/home-page-components/CompanyGallery";
const About = () => {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            About <span className="text-[#0066ff]">A2IT </span>
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-black mb-8 leading-relaxed">
              Pioneering technology solutions with a human touch. We bridge the
              gap between cutting-edge innovation and real-world business needs.
            </p>
            <div className="h-1 bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-transparent rounded-full w-48 mx-auto mb-12"></div>
          </div>

          {/* Animated floating elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#00f0ff]/10 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#0066ff]/10 blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Scrolling animation trigger */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-14 rounded-3xl border-2 border-[#00f0ff] flex justify-center items-start p-2">
            <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-scroll"></div>
          </div>
        </div>
      </section>

      <MissionAndTeam />
      <ValuesSection />
      <CapabilitiesSection />
      <LeadershipSection />
      <CompanyGallery />
      {/* <ContactBanner /> */}
    </div>
  );
};

export default About;

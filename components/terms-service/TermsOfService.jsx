"use client";
import React from "react";
import {
  FaFileContract,
  FaGavel,
  FaUserCheck,
  FaExclamationTriangle,
  FaHandshake,
  FaBalanceScale,
  FaShieldAlt,
  FaLock,
  FaClipboardCheck,
} from "react-icons/fa";
import Link from "next/link";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white text-black pt-24 pb-16 px-6 md:px-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Animated Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <FaFileContract className="text-5xl text-[#19878f] relative z-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#034c52] via-[#0066ff] to-[#0066ff] bg-clip-text text-transparent drop-shadow-md">
              Terms of Service
            </h1>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] mx-auto rounded-full"></div>
        </div>

        {/* Introduction */}
        <section className="mb-16 text-center">
          <div className="bg-white rounded-2xl p-8 border border-[#00f0ff]/30 shadow-lg shadow-[#00f0ff]/10">
            <p className="text-xl md:text-2xl text-black leading-relaxed font-light italic">
              "Welcome to{" "}
              <span className="font-bold text-[#19878f]">A2It Ltd</span>. By
              accessing our website and using our services, you agree to comply
              with and be bound by the following terms and conditions."
            </p>
          </div>
        </section>

        {/* Terms Sections */}
        <div className="grid gap-10">
          {/* Agreement to Terms */}
          <section className="bg-white rounded-2xl p-8 border border-[#00f0ff]/20 shadow-lg hover:shadow-[#00f0ff]/15 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-[#00f0ff]/10">
                <FaHandshake className="text-3xl text-[#19878f]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00f0ff] to-[#0066ff] bg-clip-text text-transparent">
                Agreement to Terms
              </h2>
            </div>
            <div className="text-black space-y-4 pl-4 border-l-2 border-[#00f0ff]/30">
              <p>
                By accessing or using our website, you acknowledge that you have
                read, understood, and agree to be bound by these Terms of
                Service.
              </p>
              <p>
                If you do not agree with any part of these terms, you must not
                use our website or services.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="bg-white rounded-2xl p-8 border border-[#0066ff]/20 shadow-lg hover:shadow-[#0066ff]/15 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-[#0066ff]/10">
                <FaLock className="text-3xl text-[#0066ff]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0066ff] to-[#7e22ce] bg-clip-text text-transparent">
                Intellectual Property Rights
              </h2>
            </div>
            <div className="text-black space-y-4 pl-4 border-l-2 border-[#0066ff]/30">
              <p>
                All content on this website, including but not limited to text,
                graphics, logos, images, and software, is the property of A2It
                Ltd or its content suppliers and is protected by international
                copyright laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, or create derivative
                works of any content without our express written permission.
              </p>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="bg-white rounded-2xl p-8 border border-[#7e22ce]/20 shadow-lg hover:shadow-[#7e22ce]/15 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-[#7e22ce]/10">
                <FaUserCheck className="text-3xl text-[#7e22ce]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#7e22ce] to-[#00f0ff] bg-clip-text text-transparent">
                User Responsibilities
              </h2>
            </div>
            <div className="text-black space-y-4 pl-4 border-l-2 border-[#7e22ce]/30">
              <p>As a user of our website, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information when required</li>
                <li>
                  Maintain the confidentiality of your account credentials
                </li>
                <li>
                  Not use the website for any illegal or unauthorized purpose
                </li>
                <li>
                  Not engage in any activity that disrupts or interferes with
                  our services
                </li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="bg-white rounded-2xl p-8 border border-[#ff3366]/20 shadow-lg hover:shadow-[#ff3366]/15 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-[#ff3366]/10">
                <FaExclamationTriangle className="text-3xl text-[#ff3366]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ff3366] to-[#ff8c00] bg-clip-text text-transparent">
                Prohibited Activities
              </h2>
            </div>
            <div className="text-black space-y-4 pl-4 border-l-2 border-[#ff3366]/30">
              <p>You may not use our website to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Harass, abuse, or harm another person</li>
                <li>Submit false or misleading information</li>
                <li>Upload or transmit viruses or any other malicious code</li>
                <li>Spam, phish, or engage in other unethical practices</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section className="bg-white rounded-2xl p-8 border border-[#ff8c00]/20 shadow-lg hover:shadow-[#ff8c00]/15 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-[#ff8c00]/10">
                <FaGavel className="text-3xl text-[#ff8c00]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ff8c00] to-[#ff3366] bg-clip-text text-transparent">
                Termination
              </h2>
            </div>
            <div className="text-black space-y-4 pl-4 border-l-2 border-[#ff8c00]/30">
              <p>
                We may terminate or suspend your access to our website
                immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the
                Terms.
              </p>
              <p>
                Upon termination, your right to use the website will immediately
                cease.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-white rounded-2xl p-8 border border-[#00f0ff]/20 shadow-lg hover:shadow-[#00f0ff]/15 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-[#00f0ff]/10">
                <FaBalanceScale className="text-3xl text-[#19878f]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00f0ff] to-[#0066ff] bg-clip-text text-transparent">
                Limitation of Liability
              </h2>
            </div>
            <div className="text-black space-y-4 pl-4 border-l-2 border-[#00f0ff]/30">
              <p>
                In no event shall A2It Ltd, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="bg-white rounded-2xl p-8 border border-[#0066ff]/20 shadow-lg hover:shadow-[#0066ff]/15 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-[#0066ff]/10">
                <FaShieldAlt className="text-3xl text-[#0066ff]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0066ff] to-[#7e22ce] bg-clip-text text-transparent">
                Governing Law
              </h2>
            </div>
            <div className="text-black space-y-4 pl-4 border-l-2 border-[#0066ff]/30">
              <p>
                These Terms shall be governed and construed in accordance with
                the laws of Bangladesh, without regard to its conflict of law
                provisions.
              </p>
              <p>
                Any disputes relating to these Terms will be subject to the
                exclusive jurisdiction of the courts of Bangladesh.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="bg-white rounded-2xl p-8 border border-[#7e22ce]/20 shadow-lg hover:shadow-[#7e22ce]/15 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-[#7e22ce]/10">
                <FaClipboardCheck className="text-3xl text-[#7e22ce]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#7e22ce] to-[#00f0ff] bg-clip-text text-transparent">
                Changes to Terms
              </h2>
            </div>
            <div className="text-black space-y-4 pl-4 border-l-2 border-[#7e22ce]/30">
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time.
              </p>
              <p>
                By continuing to access or use our website after any revisions
                become effective, you agree to be bound by the revised terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white rounded-2xl p-8 border border-[#00f0ff]/30 shadow-lg text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#006dff] mb-6">
              Have Questions?
            </h2>
            <p className="text-black mb-6">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <Link
                href="/contact"
                className="px-6 py-3 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00f0ff]/30 transition-all duration-300"
              >
                Contact Us
              </Link>
              <a
                href="mailto:info@a2it.com"
                className="px-6 py-3 border border-[#00f0ff] text-[#006dff] font-semibold rounded-lg hover:bg-[#006dff] hover:text-white transition-all duration-300"
              >
                Email Us
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

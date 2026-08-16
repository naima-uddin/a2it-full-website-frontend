"use client";
import React from "react";
import { FaShieldAlt, FaUserLock, FaDatabase, FaCookie } from "react-icons/fa";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-black pt-24 pb-16 px-6 md:px-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 ">
            <FaShieldAlt className="text-4xl text-[#00f0ff] -mt-6" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#0298fc] to-[#0066ff] text-transparent bg-clip-text drop-shadow-md mb-6">
              Privacy Policy
            </h1>
          </div>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-black leading-relaxed mb-6">
            At A2It Ltd, we take your privacy seriously. This Privacy Policy
            describes how we collect, use, and share your personal information
            when you visit our website or use our services.
          </p>
          <p className="text-lg text-black leading-relaxed">
            By accessing our website, you agree to the terms outlined in this
            policy. If you do not agree with these terms, please refrain from
            using our website.
          </p>
        </section>

        {/* Policy Sections */}
        <div className="grid gap-8">
          {/* Information Collection */}
          <section className="bg-white shadow-2xl rounded-xl p-6 border border-[#00f0ff]/20">
            <div className="flex items-center gap-3 mb-4">
              <FaDatabase className="text-2xl text-[#19878f]" />
              <h2 className="text-2xl font-semibold text-[#006dff]">
                Information We Collect
              </h2>
            </div>
            <div className="text-black space-y-4">
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Personal identification information (Name, email address,
                  phone number, etc.)
                </li>
                <li>
                  Browser and device information (IP address, device type,
                  browser type)
                </li>
                <li>
                  Usage data (pages visited, time spent on site, click patterns)
                </li>
                <li>Cookies and similar tracking technologies</li>
                <li>
                  Information you provide when contacting us or submitting forms
                </li>
              </ul>
            </div>
          </section>

          {/* Use of Information */}
          <section className="bg-white shadow-2xl rounded-xl p-6 border border-[#00f0ff]/20">
            <div className="flex items-center gap-3 mb-4">
              <FaUserLock className="text-2xl text-[#19878f]" />
              <h2 className="text-2xl font-semibold text-[#006dff]">
                How We Use Your Information
              </h2>
            </div>
            <div className="text-black space-y-4">
              <p>We use the information we collect for various purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our services</li>
                <li>
                  To allow you to participate in interactive features of our
                  website
                </li>
                <li>To provide customer support</li>
                <li>
                  To gather analysis or valuable information to improve our
                  website
                </li>
                <li>To monitor the usage of our website</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section className="bg-white shadow-2xl rounded-xl p-6 border border-[#00f0ff]/20">
            <div className="flex items-center gap-3 mb-4">
              <FaCookie className="text-2xl text-[#19878f]" />
              <h2 className="text-2xl font-semibold text-[#006dff]">
                Cookies and Tracking
              </h2>
            </div>
            <div className="text-black space-y-4">
              <p>
                We use cookies and similar tracking technologies to track
                activity on our website and hold certain information. Cookies
                are files with a small amount of data which may include an
                anonymous unique identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to
                indicate when a cookie is being sent. However, if you do not
                accept cookies, you may not be able to use some portions of our
                website.
              </p>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="bg-white shadow-2xl rounded-xl p-6 border border-[#00f0ff]/20">
            <h2 className="text-2xl font-semibold text-[#006dff] mb-4">
              Data Sharing and Disclosure
            </h2>
            <div className="text-black space-y-4">
              <p>
                We may share your personal information in the following
                situations:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  With service providers to monitor and analyze the use of our
                  website
                </li>
                <li>
                  For business transfers in the event of a merger or acquisition
                </li>
                <li>
                  With affiliates in which case we will require those affiliates
                  to honor this policy
                </li>
                <li>
                  With business partners to offer you certain products, services
                  or promotions
                </li>
                <li>With your consent for any other purpose</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="bg-white shadow-2xl rounded-xl p-6 border border-[#00f0ff]/20">
            <h2 className="text-2xl font-semibold text-[#006dff] mb-4">
              Data Security
            </h2>
            <div className="text-black space-y-4">
              <p>
                The security of your data is important to us. We implement
                appropriate technical and organizational measures to protect
                your personal information against unauthorized access,
                alteration, disclosure, or destruction.
              </p>
              <p>
                However, remember that no method of transmission over the
                Internet or electronic storage is 100% secure. While we strive
                to use commercially acceptable means to protect your personal
                information, we cannot guarantee its absolute security.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="bg-white shadow-2xl rounded-xl p-6 border border-[#00f0ff]/20">
            <h2 className="text-2xl font-semibold text-[#006dff] mb-4">
              Your Data Protection Rights
            </h2>
            <div className="text-black space-y-4">
              <p>
                Depending on your location, you may have the following data
                protection rights:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The right to access, update or delete the information we have
                  on you
                </li>
                <li>
                  The right of rectification if that information is inaccurate
                  or incomplete
                </li>
                <li>
                  The right to object to our processing of your personal
                  information
                </li>
                <li>
                  The right to request that we restrict the processing of your
                  personal information
                </li>
                <li>The right to data portability</li>
                <li>
                  The right to withdraw consent where we relied on your consent
                  to process your information
                </li>
              </ul>
            </div>
          </section>

          {/* Changes to Policy */}
          <section className="bg-white shadow-2xl rounded-xl p-6 border border-[#00f0ff]/20">
            <h2 className="text-2xl font-semibold text-[#006dff] mb-4">
              Changes to This Privacy Policy
            </h2>
            <div className="text-black">
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
              <p className="mt-4">
                You are advised to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white shadow-2xl rounded-xl p-6 border border-[#00f0ff]/20">
            <h2 className="text-2xl font-semibold text-[#006dff] mb-4">
              Contact Us
            </h2>
            <div className="text-black space-y-4">
              <p>
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="space-y-2">
                <li>By email: info@a2it.com</li>
                <li>By phone: +880 1846-937397</li>
                <li>
                  By visiting this page on our website:{" "}
                  <Link
                    href="/contact"
                    className="text-[#006dff] font-bold hover:underline"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  By mail: Plot No 470, Road No 06 (Old 29), DOHS Mirpur, Dhaka
                  Division, Bangladesh
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

import StatsSection from "@/components/about-page-compoent/StatsSection";
import Banner from "@/components/home-page-components/Banner";
import ClientShowcase from "@/components/home-page-components/ClientShowcase";
import EmployeeSection from "@/components/home-page-components/EmployeeSection";
import WhatWeOffer from "@/components/home-page-components/WhatWeOffer";
import WhoRWe from "@/components/home-page-components/WhoRWe";
import Image from "next/image";
import React from "react";
import { fetchSiteSettings } from "@/lib/api/siteSettings";

// 🔹 SEO metadata for Home Page (site name/url/logo come from dashboard settings)
export async function generateMetadata() {
  const s = await fetchSiteSettings();
  const title = `${s.siteName} | IT Services, Web & eCommerce & Digital Solutions`;

  return {
    title,
    description:
      s.description ||
      "A2IT Ltd provides professional IT services including web development, mobile apps, UI/UX design, eCommerce solutions, Shopify, Amazon & eBay services, SEO, and digital marketing.",
    keywords: [
      s.siteName,
      "IT Services",
      "Web Development",
      "Mobile App Development",
      "UI/UX Design",
      "eCommerce Solutions",
      "Shopify",
      "Amazon",
      "eBay",
      "SEO",
      "Digital Marketing",
      "ERP Solutions",
      "Hosting",
    ],
    alternates: {
      canonical: s.siteUrl,
    },
    openGraph: {
      title,
      description:
        s.description ||
        "Discover our expertise in IT services, web & mobile development, eCommerce, digital marketing, and marketplace solutions including Shopify, Amazon, and eBay.",
      url: s.siteUrl,
      siteName: s.siteName,
      images: [
        {
          url: s.logo || "/A2ITLogo.png",
          width: 1200,
          height: 630,
          alt: `${s.siteName} - IT Services and Digital Solutions`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description:
        s.description ||
        "A2IT Ltd offers professional IT services including web development, mobile apps, UI/UX, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing.",
      images: [s.logo || "/A2ITLogo.png"],
    },
  };
}

export default async function Home() {
  const s = await fetchSiteSettings();
  const sameAs = [
    s.social?.facebook,
    s.social?.linkedin,
    s.social?.twitter,
    s.social?.instagram,
    s.social?.youtube,
  ].filter(Boolean);

  return (
    <>
      <Banner />
      <WhoRWe />
      <WhatWeOffer />
      <ClientShowcase />
      <StatsSection />
      <EmployeeSection />

      {/* 🔹 Schema Markup for Home Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: s.siteName,
            url: s.siteUrl,
            logo: s.logo,
            sameAs,
            description: s.description,
            contactPoint: [
              {
                "@type": "ContactPoint",
                contactType: "customer support",
                telephone: s.phone,
                email: s.email,
                areaServed: "Worldwide",
              },
            ],
          }),
        }}
      />
    </>
  );
}

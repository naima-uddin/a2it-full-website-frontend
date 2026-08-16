import DigitalMarketingServices from "@/components/ServicePage/SEO-SEM-PPC/DigitalMarketingServices";
import React from "react";

// 🔹 SEO metadata for Digital Marketing Services
export const metadata = {
  title: "Digital Marketing Services | SEO, SEM & PPC | A2IT",
  description:
    "A2IT provides expert digital marketing services including SEO, SEM, and PPC advertising. Boost your online visibility, generate leads, and maximize ROI.",
  keywords: [
    "Digital Marketing Services",
    "SEO Services",
    "Search Engine Optimization",
    "SEM Marketing",
    "PPC Advertising",
    "Google Ads Management",
    "Online Marketing Agency",
  ],
  alternates: {
    canonical: "https://a2itltd.com/services/digital-marketing",
  },
  openGraph: {
    title: "Digital Marketing Services | SEO, SEM & PPC | A2IT",
    description:
      "Grow your business with A2IT’s digital marketing solutions. We specialize in SEO, SEM, and PPC campaigns to increase traffic, leads, and sales.",
    url: "https://a2itltd.com/services/digital-marketing",
    siteName: "A2IT",
    images: [
      {
        url: "/og-digital-marketing.jpg", // 👉 place an OG image in /public
        width: 1200,
        height: 630,
        alt: "Digital Marketing SEO SEM PPC Services - A2IT",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketing Services | SEO, SEM & PPC | A2IT",
    description:
      "A2IT delivers result-driven SEO, SEM, and PPC services to improve visibility, generate leads, and maximize ROI.",
    images: ["/og-digital-marketing.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <DigitalMarketingServices />

      {/* 🔹 Schema Markup for Digital Marketing Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Digital Marketing (SEO, SEM, PPC)",
            provider: {
              "@type": "Organization",
              name: "A2IT",
              url: "https://a2itltd.com",
              logo: "https://a2itltd.com/logo.png",
            },
            areaServed: {
              "@type": "Country",
              name: "Worldwide",
            },
            description:
              "A2IT provides digital marketing services including search engine optimization (SEO), search engine marketing (SEM), and pay-per-click (PPC) advertising.",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Digital Marketing Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Search Engine Optimization (SEO)",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Search Engine Marketing (SEM)",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Pay-Per-Click (PPC) Advertising",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Google Ads Campaign Management",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Social Media Paid Campaigns",
                  },
                },
              ],
            },
          }),
        }}
      />
    </>
  );
}

import AmazonServices from "@/components/ServicePage/amazon/Amazon";
import React from "react";

// 🔹 SEO metadata for Amazon Services
export const metadata = {
  title: "Amazon Marketing & Vendor Services | A2IT",
  description:
    "Boost your Amazon business with A2IT’s services including Amazon Marketing, Vendor Central, DSP, FBA, and Affiliate Program solutions.",
  keywords: [
    "Amazon Marketing",
    "Amazon Vendor Central",
    "Amazon DSP",
    "Amazon FBA",
    "Amazon Affiliate Program",
  ],
  alternates: {
    canonical: "https://a2itltd.com/services/amazon",
  },
  openGraph: {
    title: "Amazon Services | A2IT",
    description:
      "Comprehensive Amazon services: Marketing, Vendor Central, DSP, FBA, and Affiliate Programs.",
    url: "https://a2itltd.com/services/amazon",
    siteName: "A2IT",
    images: [
      {
        url: "/og-amazon.jpg", // 👉 add an OG image in /public
        width: 1200,
        height: 630,
        alt: "Amazon Services by A2IT",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazon Services | A2IT",
    description:
      "Grow your Amazon business with A2IT’s Vendor Central, DSP, FBA, and Marketing solutions.",
    images: ["/og-amazon.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <AmazonServices />

      {/* 🔹 Schema Markup for Amazon Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Amazon Marketing and Vendor Services",
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
              "A2IT provides Amazon Marketing, Vendor Central, Demand Side Platform (DSP), FBA, and Affiliate Program support.",
          }),
        }}
      />
    </>
  );
}

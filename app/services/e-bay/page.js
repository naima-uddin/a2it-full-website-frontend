import ServiceEbayStyle from "@/components/ServicePage/ServiceEbay/ServiceEbayStyle";
import React from "react";

// 🔹 SEO metadata for eBay Services
export const metadata = {
  title: "eBay Store Management & Marketing Services | A2IT",
  description:
    "Grow your eBay business with A2IT’s expert services including eBay store setup, product listing optimization, marketing, and account management.",
  keywords: [
    "eBay Store Setup",
    "eBay Marketing",
    "eBay SEO",
    "eBay Account Management",
    "eBay Product Listing Optimization",
  ],
  alternates: {
    canonical: "https://a2itltd.com/services/ebay",
  },
  openGraph: {
    title: "eBay Services | A2IT",
    description:
      "Professional eBay services including store design, SEO, marketing, and account management to help your business grow.",
    url: "https://a2itltd.com/services/ebay",
    siteName: "A2IT",
    images: [
      {
        url: "/og-ebay.jpg", // 👉 place this OG image in /public
        width: 1200,
        height: 630,
        alt: "eBay Services by A2IT",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "eBay Services | A2IT",
    description:
      "A2IT offers eBay store management, SEO, product listing optimization, and marketing services for sellers worldwide.",
    images: ["/og-ebay.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <ServiceEbayStyle />

      {/* 🔹 Schema Markup for eBay Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "eBay Store Management and Marketing",
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
              "A2IT provides eBay services including store setup, SEO optimization, marketing campaigns, and account management.",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "eBay Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "eBay Store Setup & Design",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "eBay Product Listing Optimization",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "eBay SEO & Marketing",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "eBay Account Management",
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

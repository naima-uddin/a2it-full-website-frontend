import ShopifyServices from "@/components/ServicePage/shopify/ShopifyServices";
import React from "react";

// 🔹 SEO metadata for Shopify Services
export const metadata = {
  title: "Shopify Development Services | eCommerce Solutions | A2IT Ltd",
  description:
    "A2IT Ltd provides professional Shopify development services to build, customize, and optimize your eCommerce store for maximum sales and performance.",
  keywords: [
    "Shopify Development",
    "eCommerce Solutions",
    "Shopify Store Setup",
    "Shopify Customization",
    "Shopify Optimization",
    "Online Store Development",
    "Managed Shopify Services",
  ],
  alternates: {
    canonical: "https://a2itltd.com/services/shopify",
  },
  openGraph: {
    title: "Shopify Development Services | eCommerce Solutions | A2IT Ltd",
    description:
      "Professional Shopify development services from A2IT Ltd. Get custom Shopify stores, app integrations, and eCommerce optimization.",
    url: "https://a2itltd.com/services/shopify",
    siteName: "A2IT Ltd",
    images: [
      {
        url: "/og-shopify.jpg", // 👉 add Shopify OG image in /public
        width: 1200,
        height: 630,
        alt: "Shopify Services by A2IT Ltd",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Development Services | eCommerce Solutions | A2IT Ltd",
    description:
      "A2IT Ltd offers custom Shopify development, store optimization, and eCommerce solutions with professional support.",
    images: ["/og-shopify.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <ShopifyServices />

      {/* 🔹 Schema Markup for Shopify Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Shopify Development",
            provider: {
              "@type": "Organization",
              name: "A2IT Ltd",
              url: "https://a2itltd.com",
              logo: "https://a2itltd.com/logo.png",
            },
            areaServed: {
              "@type": "Country",
              name: "Worldwide",
            },
            description:
              "A2IT Ltd provides expert Shopify development services including store setup, customization, app integrations, and optimization for eCommerce success.",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Shopify Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Shopify Store Setup",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Shopify Theme Customization",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Shopify App Integration",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Shopify Store Optimization",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Managed Shopify Services",
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

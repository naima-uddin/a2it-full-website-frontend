import ServiceHosting from "@/components/ServicePage/ServiceHosting";
import React from "react";

// 🔹 SEO metadata for Web Hosting Services
export const metadata = {
  title: "Web Hosting Services | Secure & Scalable Hosting | A2IT",
  description:
    "A2IT provides secure, fast, and scalable web hosting services with 24/7 support. Choose shared, VPS, or dedicated hosting for your business website.",
  keywords: [
    "Web Hosting Services",
    "Secure Hosting",
    "Cloud Hosting",
    "VPS Hosting",
    "Dedicated Hosting",
    "Business Hosting",
    "Managed Hosting Solutions",
  ],
  alternates: {
    canonical: "https://a2itltd.com/services/hosting",
  },
  openGraph: {
    title: "Web Hosting Services | Secure & Scalable Hosting | A2IT",
    description:
      "Reliable and scalable hosting services from A2IT. Get cloud, VPS, and dedicated hosting with top-notch security and 24/7 support.",
    url: "https://a2itltd.com/services/hosting",
    siteName: "A2IT",
    images: [
      {
        url: "/og-hosting.jpg", // 👉 add hosting OG image in /public
        width: 1200,
        height: 630,
        alt: "Web Hosting Services by A2IT",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Hosting Services | Secure & Scalable Hosting | A2IT",
    description:
      "A2IT offers secure, scalable, and high-performance hosting solutions — Shared, VPS, Cloud, and Dedicated hosting with 24/7 support.",
    images: ["/og-hosting.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <ServiceHosting />

      {/* 🔹 Schema Markup for Hosting Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Web Hosting",
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
              "A2IT offers reliable and secure web hosting services including cloud hosting, VPS hosting, and dedicated servers with 24/7 support.",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Hosting Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Shared Hosting",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "VPS Hosting",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Dedicated Hosting",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Cloud Hosting",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Managed Hosting Solutions",
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

import ServiceSocialMedia from "@/components/ServicePage/ServiceSocialMedia";
import React from "react";

// 🔹 SEO metadata for Social Media Services
export const metadata = {
  title: "Social Media Marketing Services | Grow Your Brand | A2IT Ltd",
  description:
    "A2IT Ltd provides professional social media marketing services to grow your brand, increase engagement, and drive conversions across all major platforms.",
  keywords: [
    "Social Media Marketing",
    "SMM Services",
    "Facebook Marketing",
    "Instagram Marketing",
    "LinkedIn Marketing",
    "Twitter Marketing",
    "Social Media Campaigns",
    "Brand Growth Online",
  ],
  alternates: {
    canonical: "https://a2itltd.com/services/social-media",
  },
  openGraph: {
    title: "Social Media Marketing Services | Grow Your Brand | A2IT Ltd",
    description:
      "Professional social media marketing services from A2IT Ltd. Boost your brand presence, engagement, and sales on Facebook, Instagram, LinkedIn, and Twitter.",
    url: "https://a2itltd.com/services/social-media",
    siteName: "A2IT Ltd",
    images: [
      {
        url: "/og-socialmedia.jpg", // 👉 add social media OG image in /public
        width: 1200,
        height: 630,
        alt: "Social Media Marketing Services by A2IT Ltd",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Media Marketing Services | Grow Your Brand | A2IT Ltd",
    description:
      "A2IT Ltd offers expert social media marketing services to increase brand awareness, engagement, and conversions across all platforms.",
    images: ["/og-socialmedia.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <ServiceSocialMedia />

      {/* 🔹 Schema Markup for Social Media Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Social Media Marketing",
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
              "A2IT Ltd provides professional social media marketing services including campaign strategy, content creation, and platform management to grow your online brand presence.",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Social Media Marketing Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Facebook Marketing",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Instagram Marketing",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "LinkedIn Marketing",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Twitter Marketing",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Social Media Campaign Management",
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

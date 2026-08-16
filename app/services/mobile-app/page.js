import ServiceMobileApp from "@/components/ServicePage/design-development/ServiceMobileApp";
import React from "react";

// 🔹 SEO metadata for Mobile App Services
export const metadata = {
  title: "Mobile App Development Services | iOS & Android Apps | A2IT",
  description:
    "A2IT builds scalable mobile applications for iOS and Android. We offer custom mobile app development, cross-platform apps, UI/UX design, and app maintenance.",
  keywords: [
    "Mobile App Development",
    "iOS App Development",
    "Android App Development",
    "Cross-Platform Apps",
    "React Native Apps",
    "Flutter Apps",
    "Custom Mobile Applications",
  ],
  alternates: {
    canonical: "https://a2itltd.com/services/mobile-app",
  },
  openGraph: {
    title: "Mobile App Development Services | A2IT",
    description:
      "Custom iOS & Android app development with seamless UI/UX, cross-platform solutions, and ongoing app maintenance by A2IT.",
    url: "https://a2itltd.com/services/mobile-app",
    siteName: "A2IT",
    images: [
      {
        url: "/og-mobile-app.jpg", // 👉 add mobile app OG image in /public
        width: 1200,
        height: 630,
        alt: "Mobile App Development Services by A2IT",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobile App Development Services | A2IT",
    description:
      "A2IT delivers iOS, Android, and cross-platform mobile app solutions with modern UI/UX and scalable architecture.",
    images: ["/og-mobile-app.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <ServiceMobileApp />

      {/* 🔹 Schema Markup for Mobile App Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Mobile Application Development",
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
              "A2IT provides mobile app development services for iOS, Android, and cross-platform solutions with UI/UX design and app maintenance.",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Mobile App Development Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "iOS App Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Android App Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Cross-Platform App Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "React Native & Flutter Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Mobile App UI/UX Design",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "App Support & Maintenance",
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

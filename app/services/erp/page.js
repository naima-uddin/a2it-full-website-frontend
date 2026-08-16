import ServiceERP from "@/components/ServicePage/ServiceERP";
import React from "react";

// 🔹 SEO metadata for ERP Services
export const metadata = {
  title: "ERP Software Development & Integration Services | A2IT",
  description:
    "A2IT provides ERP solutions including custom ERP software, cloud ERP, CRM integration, and business process automation for enterprises worldwide.",
  keywords: [
    "ERP Development",
    "ERP Integration",
    "Cloud ERP",
    "Custom ERP Software",
    "ERP Solutions",
    "Business Process Automation",
    "CRM Integration",
  ],
  alternates: {
    canonical: "https://a2itltd.com/services/erp",
  },
  openGraph: {
    title: "ERP Services | A2IT",
    description:
      "Streamline your business with A2IT’s ERP services including custom ERP solutions, cloud ERP, and system integrations.",
    url: "https://a2itltd.com/services/erp",
    siteName: "A2IT",
    images: [
      {
        url: "/og-erp.jpg", // 👉 add an ERP OG image in /public
        width: 1200,
        height: 630,
        alt: "ERP Services by A2IT",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ERP Services | A2IT",
    description:
      "A2IT delivers ERP development, integration, and automation services to optimize business processes and scalability.",
    images: ["/og-erp.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <ServiceERP />

      {/* 🔹 Schema Markup for ERP Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "ERP Software Development and Integration",
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
              "A2IT offers ERP services including custom ERP software, cloud ERP, CRM integration, and business process automation.",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "ERP Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Custom ERP Software Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Cloud ERP Solutions",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "ERP System Integration",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "CRM & ERP Integration",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Business Process Automation",
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

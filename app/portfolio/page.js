import Portfolio from "@/components/portfolio-page-component/Portfolio";
import React from "react";

// 🔹 SEO metadata for Portfolio
export const metadata = {
  title: "Portfolio | A2IT Ltd | Our Projects in Web, eCommerce & Marketplaces",
  description:
    "Explore A2IT Ltd’s portfolio showcasing web development, mobile apps, UI/UX, eCommerce stores, Amazon, Shopify, and eBay projects. See our innovative IT solutions in action.",
  keywords: [
    "A2IT Portfolio",
    "Web Development Projects",
    "Mobile App Projects",
    "UI/UX Design Portfolio",
    "eCommerce Projects",
    "Shopify Projects",
    "Amazon Projects",
    "eBay Projects",
    "Digital Marketing Case Studies",
    "IT Solutions Portfolio",
  ],
  alternates: {
    canonical: "https://a2itltd.com/portfolio",
  },
  openGraph: {
    title: "Portfolio | A2IT Ltd | Web, eCommerce & Marketplace Projects",
    description:
      "Discover A2IT Ltd’s portfolio of web, mobile, UI/UX, eCommerce, Shopify, Amazon, and eBay projects delivered with excellence.",
    url: "https://a2itltd.com/portfolio",
    siteName: "A2IT Ltd",
    images: [
      {
        url: "/og-portfolio.jpg", // 👉 add portfolio OG image in /public
        width: 1200,
        height: 630,
        alt: "Portfolio of A2IT Ltd",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | A2IT Ltd | Web, eCommerce & Marketplace Projects",
    description:
      "Explore A2IT Ltd’s portfolio showcasing web, mobile, UI/UX, eCommerce, Shopify, Amazon, and eBay projects.",
    images: ["/og-portfolio.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <Portfolio />

      {/* 🔹 Schema Markup for Portfolio */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: "Portfolio",
            author: {
              "@type": "Organization",
              name: "A2IT Ltd",
              url: "https://a2itltd.com",
              logo: "https://a2itltd.com/logo.png",
            },
            description:
              "A2IT Ltd’s portfolio showcasing projects in web development, mobile apps, UI/UX, eCommerce, Shopify, Amazon, and eBay.",
            url: "https://a2itltd.com/portfolio",
            about: [
              { "@type": "Thing", name: "Web Development" },
              { "@type": "Thing", name: "Mobile App Development" },
              { "@type": "Thing", name: "UI/UX Design" },
              { "@type": "Thing", name: "eCommerce" },
              { "@type": "Thing", name: "Shopify" },
              { "@type": "Thing", name: "Amazon" },
              { "@type": "Thing", name: "eBay" },
            ],
          }),
        }}
      />
    </>
  );
}

import ContactUsWrapper from "@/components/contact-page-component/ContactUsWrapper";
import React from "react";

export const metadata = {

  metadataBase: new URL('https://a2itltd.com'),
  title: "Contact Us | A2IT Ltd | Get in Touch",
  description:
    "Get in touch with A2IT Ltd for inquiries about IT services, web development, eCommerce solutions, digital marketing, and more.",
  keywords: [
    "Contact A2IT Ltd",
    "IT Services Inquiry",
    "Web Development Contact",
    "eCommerce Consultation",
    "Digital Marketing Contact",
    "Shopify Contact",
    "Amazon Services Inquiry",
  ],
  alternates: {
    canonical: "https://a2itltd.com/contact",
  },
  openGraph: {
    title: "Contact Us | A2IT Ltd | Get in Touch",
    description:
      "Reach out to A2IT Ltd for any queries regarding web development, mobile apps, eCommerce, Shopify, Amazon, or digital marketing services.",
    url: "https://a2itltd.com/contact",
    siteName: "A2IT Ltd",
    images: [
      {
        url: "/og-contact.jpg", // Place this in /public
        width: 1200,
        height: 630,
        alt: "Contact A2IT Ltd",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | A2IT Ltd | Get in Touch",
    description:
      "Contact A2IT Ltd for inquiries about IT services, web development, eCommerce, Shopify, Amazon, and digital marketing solutions.",
    images: ["/og-contact.jpg"],
  },
};

export default function Page() {
  return (
    <>
      <ContactUsWrapper />

      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Us",
            url: "https://a2itltd.com/contact",
            description:
              "Get in touch with A2IT Ltd for inquiries about IT services, web development, eCommerce solutions, digital marketing, and more.",
            publisher: {
              "@type": "Organization",
              name: "A2IT Ltd",
              url: "https://a2itltd.com",
              logo: "https://a2itltd.com/logo.png",
            },
            contactOption: [
              {
                "@type": "ContactPoint",
                contactType: "customer support",
                telephone: "+880XXXXXXXXXX",
                email: "info@a2itltd.com",
                areaServed: "Worldwide",
              },
            ],
          }),
        }}
      />
    </>
  );
}






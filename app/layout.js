import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RouteTransitionHandler from "../components/shared/RouteTransitionHandler";
import RouteAwareChrome from "@/components/shared/RouteAwareChrome";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🔹 Global SEO metadata
export const metadata = {
  title:
    "A2IT Ltd | IT Services, Web Development, eCommerce & Digital Solutions",
  description:
    "A2IT Ltd provides IT services including web development, mobile apps, UI/UX design, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions worldwide.",
  icons: {
    icon: "/A2ITLogo.png",
  },
  openGraph: {
    title:
      "A2IT Ltd | IT Services, Web Development, eCommerce & Digital Solutions",
    description:
      "Professional IT services, web & mobile development, eCommerce, digital marketing, and marketplace solutions from A2IT Ltd.",
    url: "https://a2itltd.com",
    siteName: "A2IT Ltd",
    images: [
      {
        url: "/A2ITLogo.png", // 👉 site-wide OG image
        width: 1200,
        height: 630,
        alt: "A2IT Ltd - IT Services and Digital Solutions",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "A2IT Ltd | IT Services, Web Development, eCommerce & Digital Solutions",
    description:
      "A2IT Ltd offers IT services, web development, mobile apps, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions.",
    images: ["/A2ITLogo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RouteTransitionHandler />
        <AuthProvider>
          <RouteAwareChrome>{children}</RouteAwareChrome>
        </AuthProvider>
        {/* 🔹 JSON-LD structured data for organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "A2IT Ltd",
              url: "https://a2itltd.com",
              logo: "https://a2itltd.com/A2ITLogo.png",
              sameAs: [
                "https://www.facebook.com/A2ITLtd",
                "https://www.linkedin.com/company/yourcompany",
                "https://twitter.com/yourcompany",
              ],
              description:
                "A2IT Ltd provides IT services including web development, mobile apps, UI/UX, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions worldwide.",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  telephone: "+8801846937397", // replace with your number
                  email: "info@a2itltd.com", // replace with your email
                  areaServed: "Worldwide",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}

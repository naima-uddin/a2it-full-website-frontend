import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RouteTransitionHandler from "../components/shared/RouteTransitionHandler";
import RouteAwareChrome from "@/components/shared/RouteAwareChrome";
import { AuthProvider } from "@/context/AuthContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { fetchSiteSettings } from "@/lib/api/siteSettings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🔹 Global SEO metadata — title, description, favicon and OG image are now
// driven by the dashboard-managed site settings (with safe fallbacks).
export async function generateMetadata() {
  const s = await fetchSiteSettings();
  const title = `${s.siteName} | IT Services, Web Development, eCommerce & Digital Solutions`;

  return {
    title,
    description:
      s.description ||
      "A2IT Ltd provides IT services including web development, mobile apps, UI/UX design, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions worldwide.",
    icons: {
      icon: s.favicon || "/A2ITLogo.png",
    },
    openGraph: {
      title,
      description:
        s.description ||
        "Professional IT services, web & mobile development, eCommerce, digital marketing, and marketplace solutions.",
      url: s.siteUrl,
      siteName: s.siteName,
      images: [
        {
          url: s.logo || "/A2ITLogo.png",
          width: 1200,
          height: 630,
          alt: `${s.siteName} - IT Services and Digital Solutions`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description:
        s.description ||
        "A2IT Ltd offers IT services, web development, mobile apps, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions.",
      images: [s.logo || "/A2ITLogo.png"],
    },
  };
}

export default async function RootLayout({ children }) {
  const settings = await fetchSiteSettings();
  const sameAs = [
    settings.social?.facebook,
    settings.social?.linkedin,
    settings.social?.twitter,
    settings.social?.instagram,
    settings.social?.youtube,
  ].filter(Boolean);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RouteTransitionHandler />
        <AuthProvider>
          <SiteSettingsProvider initial={settings}>
            <RouteAwareChrome>{children}</RouteAwareChrome>
          </SiteSettingsProvider>
        </AuthProvider>
        {/* 🔹 JSON-LD structured data for organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: settings.siteName,
              url: settings.siteUrl,
              logo: settings.logo,
              sameAs,
              description: settings.description,
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  telephone: settings.phone,
                  email: settings.email,
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

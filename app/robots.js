export const dynamic = "force-static";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://a2itltd.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/private/", "/temp/", "/_next/", "/hrm", "/hrm/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/private/", "/hrm", "/hrm/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/private/", "/hrm", "/hrm/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

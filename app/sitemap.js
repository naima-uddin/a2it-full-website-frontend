export const dynamic = "force-static";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://a2itltd.com";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Public, indexable routes only.
// NOTE: login-protected routes (/login, /dashboard/**) are intentionally
// excluded so they never appear in the generated sitemap.
const staticRoutes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services/amazon", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/design-development", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/e-bay", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/e-commerce", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/erp", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/mobile-app", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/seo", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/server-hosting", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/shopify", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/social-media", priority: 0.7, changeFrequency: "monthly" },
  { path: "/portfolio", priority: 0.8, changeFrequency: "weekly" },
  { path: "/promotions/website", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms-of-service", priority: 0.3, changeFrequency: "yearly" },
];

// trailingSlash: true is set in next.config.js, so keep URLs consistent.
const toUrl = (routePath) => {
  if (routePath === "/") return `${baseUrl}/`;
  return `${baseUrl}${routePath}/`;
};

const loadBlogSlugs = async () => {
  try {
    const resp = await fetch(`${API}/api/blog?limit=1000`, {
      cache: "force-cache",
    });

    if (resp.ok) {
      const data = await resp.json();
      const blogs = data.blogs || data.data || [];

      return blogs
        .map((blog) => ({
          slug: blog.slug || slugify(blog.title),
          lastModified: blog.updatedAt || blog.createdAt || undefined,
        }))
        .filter((item) => item.slug);
    }
  } catch (error) {
    console.warn("sitemap: falling back to local blog list", error);
  }

  try {
    const { readFile } = await import("fs/promises");
    const path = (await import("path")).default;
    const jsonPath = path.join(
      process.cwd(),
      "public",
      "extended_blogPosts.json",
    );
    const raw = await readFile(jsonPath, "utf8");
    const posts = JSON.parse(raw);

    return posts
      .map((post) => ({
        slug: post.slug || slugify(post.title),
        lastModified: post.updatedAt || post.createdAt || undefined,
      }))
      .filter((item) => item.slug);
  } catch (error) {
    console.warn("sitemap: failed to load local blog list", error);
    return [];
  }
};

export default async function sitemap() {
  const now = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: toUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogSlugs = await loadBlogSlugs();
  const blogEntries = blogSlugs.map(({ slug, lastModified }) => ({
    url: toUrl(`/blog/${slug}`),
    lastModified: lastModified ? new Date(lastModified) : now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}

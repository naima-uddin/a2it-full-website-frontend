import { readFile } from "fs/promises";
import path from "path";
import BlogDetailClient from "@/components/blog/BlogDetailClient";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const loadStaticBlogParams = async () => {
  try {
    const resp = await fetch(`${API}/api/blog?limit=1000`, {
      cache: "force-cache",
    });

    if (resp.ok) {
      const data = await resp.json();
      const blogs = data.blogs || data.data || [];

      if (blogs.length > 0) {
        return blogs
          .map((blog) => ({
            slug: blog.slug || slugify(blog.title),
          }))
          .filter((item) => item.slug);
      }
    }
  } catch (error) {
    console.warn("Falling back to local blog list for static params", error);
  }

  try {
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
      }))
      .filter((item) => item.slug);
  } catch (error) {
    console.warn("Failed to load local blog list for static params", error);
    return [];
  }
};

export async function generateStaticParams() {
  return loadStaticBlogParams();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const resp = await fetch(`${API}/api/blog/${slug}`, {
      cache: "force-cache",
    });

    if (resp.ok) {
      const data = await resp.json();
      const blog = data.blog || data.post;

      // Helper to safely extract image URL
      const getImageUrl = (featuredImage, thumbnail) => {
        if (featuredImage?.url) return featuredImage.url;
        if (typeof featuredImage === "string") return featuredImage;
        if (thumbnail) return thumbnail;
        return null;
      };

      const imageUrl = getImageUrl(blog?.featuredImage, blog?.thumbnail);

      return {
        title: `${blog?.title || "Blog"} | A2IT`,
        description:
          blog?.excerpt ||
          blog?.content?.substring(0, 160) ||
          "Read this article from A2IT.",
        openGraph: {
          title: `${blog?.title || "Blog"} | A2IT`,
          description: blog?.excerpt || blog?.content?.substring(0, 160),
          images: imageUrl ? [{ url: imageUrl }] : [],
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch blog metadata:", error);
  }

  return {
    title: "A2IT Blog",
    description: "Read the latest A2IT articles and updates.",
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  return (
    <>
      <BlogDetailClient slug={slug} />
    </>
  );
}

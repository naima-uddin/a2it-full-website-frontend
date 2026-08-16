"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const BlogCacheContext = createContext(null);

export function BlogCacheProvider({ children }) {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all published blogs
  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/blog`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("Blog fetch failed:", res.status, res.statusText);
        throw new Error(`Failed to fetch blogs: ${res.status}`);
      }

      const data = await res.json();
      const fetchedBlogs = data.blogs || [];

      setBlogs(fetchedBlogs);
      return fetchedBlogs;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reload blogs - same as fetchBlogs but always fetches fresh
  const reloadBlogs = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/blog?_t=${Date.now()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch blogs");

      const data = await res.json();
      const fetchedBlogs = data.blogs || [];

      setBlogs(fetchedBlogs);
      console.log("✅ Blogs reloaded:", fetchedBlogs.length);
      return fetchedBlogs;
    } catch (error) {
      console.error("Error reloading blogs:", error);
      return blogs;
    }
  }, [blogs]);

  // Fetch on app load
  useEffect(() => {
    fetchBlogs();
  }, []);

  const value = {
    blogs,
    isLoading,
    fetchBlogs,
    reloadBlogs,
  };

  return (
    <BlogCacheContext.Provider value={value}>
      {children}
    </BlogCacheContext.Provider>
  );
}

export function useBlogCache() {
  const context = useContext(BlogCacheContext);
  if (!context) {
    throw new Error("useBlogCache must be used within BlogCacheProvider");
  }
  return context;
}

export default BlogCacheContext;

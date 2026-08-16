"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper function to safely get image URL from featuredImage (object or string)
const getImageUrl = (featuredImage, thumbnail = null) => {
  if (!featuredImage && !thumbnail) return null;

  // If featuredImage is an object with url property
  if (featuredImage && typeof featuredImage === "object" && featuredImage.url) {
    return featuredImage.url;
  }

  // Fall back to thumbnail
  return thumbnail || null;
};

export default function BlogListClient() {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const postsSectionRef = useRef(null);

  const BLOGS_PER_PAGE = 9;

  const getCategoryLabel = (category) => {
    if (!category) return "";
    if (typeof category === "string") return category;
    return category.name || category.slug || "";
  };

  const getCategorySlug = (category) => {
    if (!category) return "";
    if (typeof category === "string") {
      return category.toLowerCase().trim().replace(/\s+/g, "-");
    }
    return (
      category.slug ||
      category.name?.toLowerCase().trim().replace(/\s+/g, "-") ||
      ""
    );
  };

  const getPrimaryCategory = (blog) => {
    if (blog?.categories?.length > 0) {
      return getCategoryLabel(blog.categories[0]);
    }
    if (blog?.tags?.length > 0) {
      const firstTag = blog.tags[0];
      return typeof firstTag === "object"
        ? firstTag.name || firstTag.slug || "Tag"
        : firstTag;
    }
    return "";
  };

  const getReadingMinutes = (blog) => {
    const raw = blog?.readingTime ?? blog?.readTime;
    const parsed = Number.parseInt(String(raw ?? ""), 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
  };

  const scrollToPosts = () => {
    postsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCategoryClick = (categorySlug) => {
    console.log("🔍 Category clicked:", categorySlug);
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
    scrollToPosts();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchQuery(searchInput.trim());
    scrollToPosts();
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch featured blogs
        const featuredResp = await fetch(
          `${API}/api/blog?featured=true&limit=10`,
        );
        if (featuredResp.ok) {
          const featuredData = await featuredResp.json();
          setFeaturedBlogs(featuredData.data || featuredData.blogs || []);
        }

        // Fetch regular blogs
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("limit", String(BLOGS_PER_PAGE));
        params.set("featured", "false"); // Only non-featured blogs
        if (selectedCategory) {
          params.set("category", selectedCategory);
          console.log("📁 Filter by category:", selectedCategory);
        }
        if (searchQuery) {
          params.set("q", searchQuery);
          console.log("🔎 Search query:", searchQuery);
        }

        const fetchUrl = `${API}/api/blog?${params.toString()}`;
        console.log("🌐 Fetching URL:", fetchUrl);

        const resp = await fetch(fetchUrl);
        const data = await resp.json();

        console.log("📦 Response data:", data);

        if (!resp.ok) {
          throw new Error(data.error || "Failed to fetch blogs");
        }

        const blogs = data.data || data.blogs || [];
        console.log(`📝 Loaded ${blogs.length} blogs`);
        setBlogs(blogs);
        setTotalPages(
          Math.ceil(
            (data.total || data.pagination?.total || 0) / BLOGS_PER_PAGE,
          ),
        );
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, selectedCategory, searchQuery]);

  // Auto-advance featured blog slider
  useEffect(() => {
    if (featuredBlogs.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredBlogs.length);
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [featuredBlogs.length]);

  // Fetch blog categories for hero section display
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await fetch(`${API}/api/blog/categories`);
        if (resp.ok) {
          const data = await resp.json();
          console.log("📂 Fetched categories:", data.categories);
          setCategories(data.categories || []);
        } else {
          console.error(
            "Failed to fetch categories:",
            resp.status,
            resp.statusText,
          );
        }
      } catch (err) {
        console.error("Error fetching blog categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative text-white py-8 sm:py-12 md:py-24 lg:py-48 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/assets/blogBg-Bqvv8GaU.jpg"
            alt="Electronics Blog Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              Explore.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Learn.
              </span>{" "}
              Grow.
            </h1>
            <p className="text-sm sm:text-base md:text-lg opacity-90 mb-4 sm:mb-6 leading-relaxed">
              Discover the latest electronics, gadget reviews, tech guides, and
              digital trends
            </p>

            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
              <div className="flex items-center gap-2 bg-white/95 rounded-full p-2 shadow-lg backdrop-blur-sm border border-white/40">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search blogs by title, excerpt, or content"
                  className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 px-3 py-2 text-sm sm:text-base focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    className="px-3 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 sm:px-5 py-2 bg-gradient-to-r from-[#0066ff] to-[#00f0ff] hover:from-[#00f0ff] hover:to-[#0066ff] transition-all duration-300 text-white rounded-full"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
        {/* Featured Post Section with Categories Sidebar */}
        {!loading && featuredBlogs.length > 0 && (
          <div className="mb-4 sm:mb-6 md:mb-10">
            {/* Featured Post Header */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="hidden sm:block w-6 h-px bg-gradient-to-r from-transparent to-blue-400"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gradient-to-r from-[#0066ff] to-[#00f0ff] hover:from-[#00f0ff] hover:to-[#0066ff] transition-all duration-300 ">
                  Featured Post
                </h2>
              </div>
              <div className="hidden sm:block w-6 h-px bg-gradient-to-l from-transparent to-blue-400"></div>
            </div>

            {/* Layout: Categories Sidebar + Featured Post */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-stretch">
              {/* Categories Sidebar */}
              <style>{`
                .categories-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .categories-scrollbar::-webkit-scrollbar-track {
                  background: #f3f4f6;
                  border-radius: 10px;
                }
                .categories-scrollbar::-webkit-scrollbar-thumb {
                  background: #ec4899;
                  border-radius: 10px;
                  transition: background 0.3s;
                }
                .categories-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #be185d;
                }
              `}</style>

              <aside className="hidden md:flex md:col-span-4 lg:col-span-3 order-2 md:order-1 bg-white rounded-lg sm:rounded-2xl border border-gray-200 shadow-sm h-auto md:h-[300px] lg:h-[360px] flex-col">
                <div className="flex items-center gap-2 mb-2 sm:mb-3 px-3 sm:px-4 pt-3 sm:pt-4 pb-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <h3 className="text-base sm:text-xl md:text-lg lg:text-2xl font-bold text-gray-900">
                    Categories
                  </h3>
                </div>

                <div className="categories-scrollbar flex-1 overflow-y-auto space-y-1 sm:space-y-2 px-3 sm:px-4 pb-3 sm:pb-4">
                  <button
                    onClick={() => handleCategoryClick("")}
                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-xs lg:text-base font-semibold transition-colors ${
                      selectedCategory === ""
                        ? "bg-gradient-to-r from-[#0066ff] to-[#00f0ff] hover:from-[#00f0ff] hover:to-[#0066ff] transition-all duration-300 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    All Posts
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={
                        cat._id || getCategorySlug(cat) || getCategoryLabel(cat)
                      }
                      onClick={() => handleCategoryClick(getCategorySlug(cat))}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-xs lg:text-base font-medium transition-colors truncate ${
                        selectedCategory === getCategorySlug(cat)
                          ? "bg-cyan-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {getCategoryLabel(cat) || "Unnamed Category"}
                    </button>
                  ))}

                  {!categories.length && (
                    <p className="text-xs sm:text-sm text-gray-500 px-1 py-2">
                      No categories available
                    </p>
                  )}
                </div>
              </aside>

              {/* Featured Post Image */}
              <div className="md:col-span-8 lg:col-span-9 order-1 md:order-2">
                {!loading && featuredBlogs.length > 0 && (
                  <div>
                    {featuredBlogs.length === 1 ? (
                      <Link
                        href={`/blog/${featuredBlogs[0].slug}`}
                        className="block"
                      >
                        <div className="relative h-48 sm:h-56 md:h-64 lg:h-[360px] rounded-lg sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 group cursor-pointer shadow-lg sm:shadow-2xl">
                          {getImageUrl(
                            featuredBlogs[0].featuredImage,
                            featuredBlogs[0].thumbnail,
                          ) && (
                            <Image
                              src={getImageUrl(
                                featuredBlogs[0].featuredImage,
                                featuredBlogs[0].thumbnail,
                              )}
                              alt={featuredBlogs[0].title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              priority
                            />
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 group-hover:from-black/70 transition-all duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

                          <div className="absolute inset-0 flex items-end">
                            <div className="p-4 sm:p-6 md:p-8 lg:p-10 text-white w-full">
                              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm mb-4">
                                <span className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  {formatDate(
                                    featuredBlogs[0].publishDate ||
                                      featuredBlogs[0].createdAt,
                                  )}
                                </span>
                                {featuredBlogs[0].author && (
                                  <span className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                      />
                                    </svg>
                                    A2IT Ltd
                                  </span>
                                )}
                                <span className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                                  <svg
                                    className="w-3 h-3 sm:w-4 sm:h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="hidden sm:inline">
                                    {getReadingMinutes(featuredBlogs[0])} min
                                  </span>
                                </span>
                              </div>

                              {featuredBlogs[0].tags &&
                                featuredBlogs[0].tags[0] && (
                                  <span className="inline-flex w-max bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 shadow-lg">
                                    {typeof featuredBlogs[0].tags[0] ===
                                    "object"
                                      ? featuredBlogs[0].tags[0].name ||
                                        featuredBlogs[0].tags[0].slug ||
                                        "Featured"
                                      : featuredBlogs[0].tags[0]}
                                  </span>
                                )}

                              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 leading-tight">
                                {featuredBlogs[0].title}
                              </h1>

                              <p className="text-white/90 text-base md:text-lg mb-6 line-clamp-2 max-w-4xl">
                                {truncateText(
                                  featuredBlogs[0].excerpt ||
                                    featuredBlogs[0].content?.replace(
                                      /<[^>]*>/g,
                                      "",
                                    ),
                                  150,
                                )}
                              </p>

                              <div className="flex items-center gap-2 text-white font-semibold group-hover:text-blue-300 transition-colors">
                                <span className="text-lg">Read full story</span>
                                <svg
                                  className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className="relative">
                        <div className="overflow-hidden rounded-2xl shadow-2xl">
                          <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{
                              transform: `translateX(-${currentFeaturedIndex * 100}%)`,
                            }}
                          >
                            {featuredBlogs.map((featured, index) => (
                              <div
                                key={featured._id}
                                className="w-full flex-shrink-0"
                              >
                                <Link
                                  href={`/blog/${featured.slug}`}
                                  className="block"
                                >
                                  <div className="relative h-[280px] md:h-[320px] lg:h-[360px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 group cursor-pointer">
                                    {getImageUrl(
                                      featured.featuredImage,
                                      featured.thumbnail,
                                    ) && (
                                      <Image
                                        src={getImageUrl(
                                          featured.featuredImage,
                                          featured.thumbnail,
                                        )}
                                        alt={featured.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        priority={index === 0}
                                      />
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 group-hover:from-black/70 transition-all duration-300" />

                                    <div className="absolute inset-0 flex items-end">
                                      <div className="p-2.5 sm:p-4 md:p-6 lg:p-8 text-white w-full h-full flex flex-col justify-between">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-white/80 text-xs sm:text-sm mb-2 sm:mb-3">
                                          <span className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <svg
                                              className="w-4 h-4"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                              />
                                            </svg>
                                            {formatDate(featured.createdAt)}
                                          </span>
                                          {featured.author && (
                                            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                              {featured.author.name ||
                                                featured.author}
                                            </span>
                                          )}
                                          <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                            {getReadingMinutes(featured)} min
                                            read
                                          </span>
                                        </div>

                                        {featured.tags && featured.tags[0] && (
                                          <span className="inline-flex w-max bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 shadow-lg">
                                            {typeof featured.tags[0] ===
                                            "object"
                                              ? featured.tags[0].name ||
                                                featured.tags[0].slug ||
                                                "Featured"
                                              : featured.tags[0]}
                                          </span>
                                        )}

                                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 leading-tight">
                                          {featured.title}
                                        </h1>

                                        <p className="text-white/90 text-base md:text-lg mb-6 line-clamp-2 max-w-4xl">
                                          {truncateText(
                                            featured.excerpt ||
                                              featured.content?.replace(
                                                /<[^>]*>/g,
                                                "",
                                              ),
                                            150,
                                          )}
                                        </p>

                                        <div className="flex items-center gap-2 text-cyan-600 font-semibold group-hover:text-white transition-colors">
                                          <span className="text-lg">
                                            Read full story
                                          </span>
                                          <svg
                                            className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                                            />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setCurrentFeaturedIndex(
                              (prev) =>
                                (prev - 1 + featuredBlogs.length) %
                                featuredBlogs.length,
                            )
                          }
                          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 bg-cyan-600/20 hover:bg-cyan-600/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all shadow-lg"
                        >
                          <svg
                            className="w-5 sm:w-6 h-5 sm:h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() =>
                            setCurrentFeaturedIndex(
                              (prev) => (prev + 1) % featuredBlogs.length,
                            )
                          }
                          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 sm:w-12 h-10 sm:h-12 bg-cyan-600/20 hover:bg-cyan-600/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all shadow-lg"
                        >
                          <svg
                            className="w-5 sm:w-6 h-5 sm:h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                          {featuredBlogs.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentFeaturedIndex(index)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                index === currentFeaturedIndex
                                  ? "bg-cyan-600 shadow-lg"
                                  : "bg-white/50 hover:bg-white/70"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mobile Category Sorting */}
                    <div className="mt-4 md:hidden">
                      <div className="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-3 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <label
                              htmlFor="mobile-category-sort"
                              className="block text-sm font-semibold text-gray-900"
                            >
                              Sort By Category
                            </label>
                          </div>
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-cyan-100 text-cyan-600">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 4h18M6 12h12m-9 8h6"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="relative">
                          <select
                            id="mobile-category-sort"
                            value={selectedCategory}
                            onChange={(e) =>
                              handleCategoryClick(e.target.value)
                            }
                            className="w-full appearance-none bg-white border border-cyan-200 rounded-lg pl-3 pr-10 py-2.5 text-sm font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400"
                          >
                            <option value="">All Posts</option>
                            {categories.map((cat) => {
                              const value = getCategorySlug(cat);
                              const label =
                                getCategoryLabel(cat) || "Unnamed Category";
                              return (
                                <option
                                  key={cat._id || value || label}
                                  value={value}
                                >
                                  {label}
                                </option>
                              );
                            })}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-cyan-500">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500 border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-600 text-lg mb-4">Failed to load blogs</p>
            <p className="text-gray-500">{error}</p>
            <button
              onClick={() => setCurrentPage(1)}
              className="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No blogs found
            </h2>
            <p className="text-gray-500">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : "Check back later for new articles!"}
            </p>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && !error && blogs.length > 0 && (
          <>
            <div
              ref={postsSectionRef}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6"
            >
              {blogs.map((blog) => (
                <Link
                  key={blog._id || blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    {getImageUrl(blog.featuredImage, blog.thumbnail) ? (
                      <Image
                        src={getImageUrl(blog.featuredImage, blog.thumbnail)}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-cyan-100">
                        <span className="text-4xl">📖</span>
                      </div>
                    )}
                    {getPrimaryCategory(blog) && (
                      <span className="absolute top-2 sm:top-3 left-2 sm:left-3 inline-flex max-w-max items-center bg-cyan-600 text-white text-xs font-medium px-2 sm:px-3 py-1 rounded-full">
                        {getPrimaryCategory(blog)}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="px-3 sm:px-5 py-1 sm:py-2 flex flex-col flex-grow">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-1 line-clamp-3 flex-grow">
                      {truncateText(
                        blog.excerpt || blog.content?.replace(/<[^>]*>/g, ""),
                        120,
                      )}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-1 border-t border-gray-300">
                      <span className="flex items-center gap-1 text-xs">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(blog.createdAt || blog.publishedAt)}
                      </span>

                      <p className="text-cyan-600 font-medium text-xs hover:text-cyan-700 transition-colors">
                        Read more
                      </p>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {getReadingMinutes(blog)} min read
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-cyan-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

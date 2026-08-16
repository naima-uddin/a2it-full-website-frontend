"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const promotionalProjects = [
  {
    id: 2,
    img: "/images/project (2).jpeg",
    category: ["ecommerce", "affiliate"],
    title: "Asian Import Export LTD",
    description:
      "Our agricultural solutions are designed to support modern farming through sustainable practices, premium-quality products, and efficient supply chains.",
    technologies: ["Next.js", "Nodemailer", "JavaScript"],
    client: "Craft Masters",
    date: "2024",
  },
  {
    id: 3,
    img: "/images/project (3).jpeg",
    category: ["ecommerce", "affiliate"],
    title: "Asian Import Export Co.",
    description:
      "An import-export e-commerce platform connecting Asian manufacturers with global buyers.",
    technologies: ["Next.js", "Nodemailer", "JavaScript"],
    client: "Tech Corp",
    date: "2023",
  },
  {
    id: 4,
    img: "/images/project (4).jpeg",
    category: ["ecommerce", "affiliate"],
    title: "BestBikeReview – Affiliate Bike Review Platform",
    description:
      "Affiliate-based bicycle review and buying guide platform focused on helping users choose the best bikes and accessories.",
    technologies: ["React", "Node.js", "MongoDB"],
    client: "Review Pros",
    date: "2024",
  },
  {
    id: 5,
    img: "/images/project (5).jpeg",
    category: "affiliate",
    title: "BestGearBuy – Affiliate Product Discovery Platform",
    description:
      "Affiliate-driven product discovery and buying guide platform focused on electronics, tools, and everyday gear.",
    technologies: ["Next.js", "Framer Motion", "Nodemailer"],
    client: "Creative Agency",
    date: "2023",
  },
  {
    id: 6,
    img: "/images/project (6).jpeg",
    category: ["ecommerce", "affiliate"],
    title: "BestBuyersView – Discover, Compare & Pick the Best Products",
    description:
      "A scalable UI/UX design system created to support a high-performance affiliate review and content-driven platform.",
    technologies: ["Next.js", "Node.js", "express.js", "mongodb"],
    client: "Fresh Foods",
    date: "2024",
  },
  {
    id: 7,
    img: "/images/project (7).jpeg",
    category: "affiliate",
    title: "Best Baby Gears",
    description:
      "A centralized analytics dashboard to track affiliate performance, content growth, and traffic insights across multiple review websites.",
    technologies: ["Next.js", "Framer Motion"],
    client: "Diamond Collections",
    date: "2023",
  },
  {
    id: 8,
    img: "/images/project (8).jpeg",
    category: "affiliate",
    title: "Best Smart Gadget",
    description:
      "A centralized analytics dashboard to track affiliate performance, content growth, and traffic insights across multiple review websites.",
    technologies: ["Next.js", "Framer Motion"],
    client: "Daily News",
    date: "2024",
  },
  {
    id: 9,
    img: "/images/project (9).jpeg",
    category: ["shopify", "ecommerce"],
    title: "BackPack Pro – Affiliate Travel Gear Review Platform",
    description:
      "A travel gear review platform providing in-depth analysis and affiliate links for the latest backpacks and travel accessories.",
    technologies: ["shopify"],
    client: "Tech Savvy",
    date: "2023",
  },
  {
    id: 10,
    img: "/images/project (10).jpeg",
    category: ["ecommerce", "wordpress"],
    title:
      "Kitchen Pro Supply – Kitchen Appliances & Equipment Review Platform",
    description:
      "An affiliate-driven kitchen appliance and equipment review platform helping users choose the best tools for home and professional kitchens.",
    technologies: ["HTML", "CSS", "JavaScript", "PHP"],
    client: "Gourmet Bistro",
    date: "2024",
  },
  {
    id: 11,
    img: "/images/project (11).jpeg",
    category: "affiliate",
    title: "BestProductBuy – Affiliate Product Comparison Platform",
    description:
      "A scalable affiliate product discovery platform helping users find the best products through comparisons, reviews, and buying guides.",
    technologies: ["HTML", "CSS", "JavaScript"],
    client: "Gourmet Bistro",
    date: "2024",
  },
  {
    id: 12,
    img: "/images/project (12).jpeg",
    category: "ecommerce",
    title: "Fitness and Health Store",
    description:
      "A scalable e-commerce store for fitness and health products, built on Shopify with a focus on user experience and product discovery.",
    technologies: ["HTML", "CSS", "JavaScript"],
    client: "Gourmet Bistro",
    date: "2024",
  },
  {
    id: 13,
    img: "/images/project (13).jpeg",
    category: "wordpress",
    title: "JuteCraftify – Sustainable Jute E-commerce Platform",
    description:
      "A modern e-commerce platform dedicated to promoting sustainable jute products worldwide, featuring secure payments, streamlined inventory management, and export-ready workflows.",
    technologies: ["HTML", "CSS", "JavaScript", "wordpress"],
    client: "Gourmet Bistro",
    date: "2024",
  },
  {
    id: 14,
    img: "/images/project (14).jpeg",
    category: "wordpress",
    title: "Cargo Logistic Company",
    description: "Moving Your Cargo, Moving Your Business Forward.",
    technologies: ["HTML", "CSS", "JavaScript", "wordpress"],
    client: "Gourmet Bistro",
    date: "2024",
  },
];

const projects = promotionalProjects;

const fallbackCategories = [
  { name: "ecommerce", displayName: "E-Commerce" },
  { name: "affiliate", displayName: "Affiliate" },
  { name: "shopify", displayName: "Shopify" },
  { name: "wordpress", displayName: "WordPress" },
  { name: "web", displayName: "Web" },
  { name: "mobile-app", displayName: "Mobile App" },
  { name: "erp", displayName: "ERP" },
];

const categoryButtonColors = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-green-600",
  "bg-orange-600",
  "bg-pink-600",
  "bg-indigo-600",
  "bg-cyan-600",
];

export default function Project() {
  const [hoveredId, setHoveredId] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [initialDistance, setInitialDistance] = useState(null);
  const [initialZoom, setInitialZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [projectCategories, setProjectCategories] =
    useState(fallbackCategories);

  const [projects, setProjects] = useState(promotionalProjects);
  const scrollRefs = useRef({});
  const imageContainerRef = useRef(null);
  const zoomableImageRef = useRef(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/promotional-project-categories`,
        );

        if (!response.ok) return;

        const data = await response.json();
        if (data.categories?.length) {
          setProjectCategories(data.categories);
        }
      } catch (error) {
        console.error("Error loading promotional project categories:", error);
      }
    };

    const loadProjects = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/promotional-projects`);

        if (!response.ok) return;

        const data = await response.json();
        if (data.projects?.length) {
          setProjects(
            data.projects.map((p) => ({
              ...p,
              img: p.image || p.img || "",
              category: Array.isArray(p.category)
                ? p.category
                : p.category
                  ? [p.category]
                  : [],
            })),
          );
        }
      } catch (error) {
        console.error("Error loading promotional projects:", error);
      }
    };

    loadCategories();
    loadProjects();
  }, []);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter projects
  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => {
          if (Array.isArray(project.category)) {
            return project.category.includes(activeCategory);
          }
          return project.category === activeCategory;
        });

  const visibleProjects = showAll
    ? filteredProjects
    : filteredProjects.slice(0, 4);
  const hasMore = filteredProjects.length > 4;

  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  // Auto-scroll on hover (only for desktop)
  useEffect(() => {
    if (isMobile) return;

    let frame;
    let pos = {};

    const animate = () => {
      if (hoveredId && scrollRefs.current[hoveredId]) {
        const el = scrollRefs.current[hoveredId];
        const max = el.scrollHeight - el.clientHeight;

        if (!pos[hoveredId]) pos[hoveredId] = 0;

        pos[hoveredId] += 2;

        if (pos[hoveredId] >= max) pos[hoveredId] = 0;

        el.scrollTop = pos[hoveredId];
      }

      frame = requestAnimationFrame(animate);
    };

    if (hoveredId) frame = requestAnimationFrame(animate);

    if (!hoveredId) {
      Object.values(scrollRefs.current).forEach((el) => {
        if (el) el.scrollTop = 0;
      });
    }

    return () => cancelAnimationFrame(frame);
  }, [hoveredId, isMobile]);

  // Keyboard control
  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;

      if (e.key === "Escape") {
        setLightboxOpen(false);
        resetZoom();
      }
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "auto";
  }, [lightboxOpen]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projects.length);
    resetZoom();
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + projects.length) % projects.length,
    );
    resetZoom();
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // Mouse wheel zoom - only for image area (desktop)
  const handleImageWheel = (e) => {
    if (isMobile) return;
    e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.min(Math.max(zoomLevel + delta, 1), 3);

    if (newZoom !== zoomLevel) {
      setZoomLevel(newZoom);
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 });
      }
    }
  };

  // Mouse drag for panning (desktop)
  const handleMouseDown = (e) => {
    if (isMobile) return;
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isMobile) return;
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const maxX = (zoomLevel - 1) * 300;
      const maxY = (zoomLevel - 1) * 300;

      setImagePosition({
        x: Math.min(Math.max(newX, -maxX), maxX),
        y: Math.min(Math.max(newY, -maxY), maxY),
      });
    }
  };

  const handleMouseUp = () => {
    if (isMobile) return;
    setIsDragging(false);
  };

  // Touch handlers for mobile pinch-to-zoom and pan
  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (!isMobile) return;

    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getDistance(e.touches);
      setInitialDistance(distance);
      setInitialZoom(zoomLevel);
    } else if (e.touches.length === 1 && zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - imagePosition.x,
        y: e.touches[0].clientY - imagePosition.y,
      });
    } else if (e.touches.length === 1 && zoomLevel === 1) {
      setDragStart({ x: e.touches[0].clientX, y: 0 });
    }
  };

  const handleTouchMove = (e) => {
    if (!isMobile) return;

    if (e.touches.length === 2 && initialDistance) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches);
      const scale = currentDistance / initialDistance;
      let newZoom = Math.min(Math.max(initialZoom * scale, 1), 3);
      newZoom = Math.round(newZoom * 10) / 10;

      setZoomLevel(newZoom);

      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && isDragging && zoomLevel > 1) {
      e.preventDefault();
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;

      const maxX = (zoomLevel - 1) * 300;
      const maxY = (zoomLevel - 1) * 300;

      setImagePosition({
        x: Math.min(Math.max(newX, -maxX), maxX),
        y: Math.min(Math.max(newY, -maxY), maxY),
      });
    } else if (e.touches.length === 1 && !isDragging && zoomLevel === 1) {
      const touchEnd = e.touches[0].clientX;
      const diff = dragStart.x - touchEnd;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextImage();
        } else {
          prevImage();
        }
        setDragStart({ x: 0, y: 0 });
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    setInitialDistance(null);
    setIsDragging(false);
  };

  const toggleShowMore = () => {
    setShowAll(!showAll);
  };

  const getCategoryColor = (category) => {
    const colors = {
      all: "bg-blue-600",
      ecommerce: "bg-purple-600",
      shopify: "bg-green-600",
      wordpress: "bg-orange-600",
      affiliate: "bg-pink-600",
      web: "bg-indigo-600",
      "mobile-app": "bg-cyan-600",
      erp: "bg-rose-600",
    };
    return colors[category] || "bg-blue-600";
  };

  const getDisplayCategory = (category) => {
    if (Array.isArray(category)) {
      return category[0];
    }
    return category;
  };

  return (
    <>
      <section className="bg-gray-50 py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            Experience Our <span className="text-blue-600">Award-Winning</span>{" "}
            Web Projects
          </h2>

          {/* Filter Buttons */}
          <div className="relative mb-6 sm:mb-10">
            <div className="overflow-x-auto pb-2 hide-scrollbar">
              <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 sm:gap-3 min-w-max sm:min-w-0 px-1">
                {[
                  { name: "all", displayName: "All Projects" },
                  ...projectCategories,
                ].map((category, index) => (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full capitalize font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${
                      activeCategory === category.name
                        ? `${getCategoryColor(category.name)} text-white shadow-lg`
                        : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    {category.displayName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-4 sm:gap-6 md:gap-10 grid-cols-2 lg:grid-cols-4">
            {visibleProjects.map((project, index) => {
              const globalIndex = projects.findIndex(
                (p) => (p._id || p.id) === (project._id || project.id),
              );
              const displayCategory = getDisplayCategory(project.category);

              return (
                <div
                  key={project._id || project.id}
                  onMouseEnter={() =>
                    !isMobile && setHoveredId(project._id || project.id)
                  }
                  onMouseLeave={() => !isMobile && setHoveredId(null)}
                  onClick={() => {
                    setCurrentImageIndex(globalIndex);
                    setLightboxOpen(true);
                    resetZoom();
                  }}
                  className="cursor-pointer hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div className="bg-black rounded-xl p-1.5 sm:p-2 shadow-xl">
                    <div className="aspect-[16/10] overflow-hidden rounded-lg bg-white relative">
                      <div
                        ref={(el) =>
                          (scrollRefs.current[project._id || project.id] = el)
                        }
                        onWheel={(e) => !isMobile && e.preventDefault()}
                        className="h-full overflow-hidden"
                      >
                        <Image
                          src={project.img}
                          alt={project.title}
                          width={400}
                          height={1000}
                          className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          priority={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="h-2 sm:h-3 w-3/4 mx-auto bg-black rounded-b-xl mt-0.5 sm:mt-1"></div>

                  {/* Category Badge */}
                  <div className="mt-1.5 sm:mt-2">
                    <span
                      className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs text-white rounded-full capitalize ${getCategoryColor(displayCategory)}`}
                    >
                      {displayCategory === "ecommerce"
                        ? "E-Commerce"
                        : displayCategory === "shopify"
                          ? "Shopify"
                          : displayCategory === "wordpress"
                            ? "WordPress"
                            : displayCategory === "affiliate"
                              ? "Affiliate"
                              : displayCategory}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* More/Less Button */}
          {hasMore && (
            <div className="mt-6 sm:mt-10">
              <button
                onClick={toggleShowMore}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            </div>
          )}

          {/* No Projects Message */}
          {visibleProjects.length === 0 && (
            <div className="text-center py-8 sm:py-10 text-gray-500">
              <p className="text-lg sm:text-xl">
                No projects found in this category
              </p>
              <button
                onClick={() => setActiveCategory("all")}
                className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm sm:text-base"
              >
                View All Projects
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox with Mobile Support */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar */}
          <div className="flex justify-between items-center p-2 sm:p-4 text-white bg-black/50 backdrop-blur-md border-b border-white/20">
            <div className="flex gap-2">
              <button
                onClick={() => setZoomLevel(Math.min(zoomLevel + 0.2, 3))}
                className="text-xl sm:text-2xl p-2 hover:bg-white/10 rounded-lg transition-all"
                aria-label="Zoom in"
              >
                🔍+
              </button>
              <button
                onClick={() => {
                  if (zoomLevel > 1) {
                    setZoomLevel(Math.max(zoomLevel - 0.2, 1));
                    if (zoomLevel - 0.2 <= 1) setImagePosition({ x: 0, y: 0 });
                  }
                }}
                className="text-xl sm:text-2xl p-2 hover:bg-white/10 rounded-lg transition-all"
                aria-label="Zoom out"
              >
                🔍-
              </button>
              <div className="ml-2 px-3 py-2 bg-white/10 rounded-lg text-sm">
                {Math.round(zoomLevel * 100)}%
              </div>
            </div>
            <div className="text-sm sm:text-lg bg-white/10 px-3 py-1 rounded-lg">
              {currentImageIndex + 1} / {projects.length}
            </div>
            <button
              onClick={() => {
                setLightboxOpen(false);
                resetZoom();
              }}
              className="text-xl sm:text-2xl p-2 hover:bg-white/10 rounded-lg transition-all"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Main Content - Mobile Optimized */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Image Section */}
            <div
              ref={imageContainerRef}
              className="w-full lg:w-2/3 relative overflow-hidden bg-black/30 flex items-center justify-center min-h-[50vh] lg:min-h-0"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleImageWheel}
              style={{
                cursor:
                  zoomLevel > 1
                    ? isDragging
                      ? "grabbing"
                      : "grab"
                    : "default",
              }}
            >
              <div className="w-full h-full flex items-center justify-center p-4">
                <div
                  ref={zoomableImageRef}
                  className="transition-transform duration-200 ease-out"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
                  }}
                >
                  <Image
                    src={projects[currentImageIndex].img}
                    alt={projects[currentImageIndex].title}
                    width={800}
                    height={1000}
                    className="max-w-full max-h-[50vh] lg:max-h-[70vh] w-auto h-auto object-contain pointer-events-none select-none"
                    draggable={false}
                    priority
                  />
                </div>
              </div>

              {/* Navigation Arrows - Desktop only */}
              {!isMobile && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Details Section - Thumbnail above description on mobile */}
            <div className="lg:w-1/3 text-white bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-xl lg:rounded-l-none lg:rounded-r-xl overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Thumbnail row - moved to top on mobile */}
                <div className="block lg:hidden">
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar pb-2">
                    {projects.map((item, i) => (
                      <div
                        key={item._id || item.id}
                        onClick={() => {
                          setCurrentImageIndex(i);
                          resetZoom();
                        }}
                        className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === i
                            ? "border-blue-500 scale-105 shadow-lg"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={item.img}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">
                  {projects[currentImageIndex].title}
                </h3>

                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                  <div>
                    <h4 className="text-xs sm:text-sm text-gray-400 mb-1 font-semibold uppercase tracking-wide">
                      Description
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {projects[currentImageIndex].description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm text-gray-400 mb-1 font-semibold uppercase tracking-wide">
                      Category
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(projects[currentImageIndex].category) ? (
                        projects[currentImageIndex].category.map((cat, idx) => (
                          <span
                            key={idx}
                            className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs text-white rounded-full capitalize ${getCategoryColor(cat)}`}
                          >
                            {cat === "ecommerce"
                              ? "E-Commerce"
                              : cat === "shopify"
                                ? "Shopify"
                                : cat === "wordpress"
                                  ? "WordPress"
                                  : cat === "affiliate"
                                    ? "Affiliate"
                                    : cat}
                          </span>
                        ))
                      ) : (
                        <span
                          className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs text-white rounded-full capitalize ${getCategoryColor(projects[currentImageIndex].category)}`}
                        >
                          {projects[currentImageIndex].category === "ecommerce"
                            ? "E-Commerce"
                            : projects[currentImageIndex].category === "shopify"
                              ? "Shopify"
                              : projects[currentImageIndex].category ===
                                  "wordpress"
                                ? "WordPress"
                                : projects[currentImageIndex].category ===
                                    "affiliate"
                                  ? "Affiliate"
                                  : projects[currentImageIndex].category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm text-gray-400 mb-1 font-semibold uppercase tracking-wide">
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {projects[currentImageIndex].technologies.map(
                        (tech, i) => (
                          <span
                            key={i}
                            className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/10 rounded-lg text-xs sm:text-sm"
                          >
                            {tech}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-white/10">
                    <div>
                      <h4 className="text-xs sm:text-sm text-gray-400 mb-1 font-semibold uppercase tracking-wide">
                        Client
                      </h4>
                      <p className="text-gray-300 text-sm">
                        {projects[currentImageIndex].client}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm text-gray-400 mb-1 font-semibold uppercase tracking-wide">
                        Year
                      </h4>
                      <p className="text-gray-300 text-sm">
                        {projects[currentImageIndex].date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnails - Desktop only (hidden on mobile since moved to top) */}
          <div className="hidden lg:block bg-black/50 backdrop-blur-md border-t border-white/10 p-3">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar justify-center">
              {projects.map((item, i) => (
                <div
                  key={item._id || item.id}
                  onClick={() => {
                    setCurrentImageIndex(i);
                    resetZoom();
                  }}
                  className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === i
                      ? "border-blue-500 scale-105 shadow-lg"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}

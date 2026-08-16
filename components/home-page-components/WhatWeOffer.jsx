"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Smartphone,
  ShoppingCart,
  Database,
  TrendingUp,
  Share2,
  Store,
  Tag,
  ShoppingBag,
  Palette,
  Server,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

const WhatWeOffer = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(4); // Initially show 4 services
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");

  const formatCategoryLabel = (value) =>
    String(value || "")
      .trim()
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/services`,
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load services");
        }

        if (isMounted) {
          setServices(Array.isArray(data.services) ? data.services : []);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || "Failed to load services");
          setServices([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/service-categories`,
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load categories");
        }

        if (isMounted) {
          setCategories(Array.isArray(data.categories) ? data.categories : []);
        }
      } catch (fetchError) {
        if (isMounted) {
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const iconMap = {
    Code,
    Smartphone,
    ShoppingCart,
    Database,
    TrendingUp,
    Share2,
    Store,
    Tag,
    ShoppingBag,
    Palette,
    Server,
  };

  const categoryIconMap = {
    ecommerce: ShoppingBag,
    development: Code,
    marketing: TrendingUp,
    design: Palette,
  };

  const serviceIconMap = {
    amazon: ShoppingCart,
    shopify: Store,
    "design-development": Code,
    "e-bay": Tag,
    "mobile-app": Smartphone,
    "e-commerce": ShoppingBag,
    erp: Database,
    seo: TrendingUp,
    "social-media": Share2,
    "server-hosting": Server,
  };

  const resolveServiceIcon = (service) => {
    const categoryIcon = categoryIconMap[service?.category];
    if (categoryIcon) {
      return categoryIcon.name;
    }

    const pathKey = (service?.path || "")
      .replace(/^\/services\//, "")
      .replace(/^\//, "")
      .toLowerCase();

    if (serviceIconMap[pathKey]) {
      return serviceIconMap[pathKey].name;
    }

    const titleKey = (service?.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (serviceIconMap[titleKey]) {
      return serviceIconMap[titleKey].name;
    }

    return Code.name;
  };

  const colorPalette = ["bg-[#0066ff]", "bg-[#00a0ff]", "bg-[#00f0ff]"];

  const categoryColors = {
    ecommerce: "bg-[#0066ff]",
    development: "bg-[#00a0ff]",
    marketing: "bg-[#00f0ff]",
    design: "bg-[#0066ff]",
  };

  const resolveCategoryColor = (category) => {
    const preset = categoryColors[category];
    if (preset) return preset;

    const palette = ["bg-[#0066ff]", "bg-[#00a0ff]", "bg-[#00f0ff]"];
    const hash = String(category || "")
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return palette[hash % palette.length];
  };

  const servicesWithPresentation = useMemo(
    () =>
      services.map((service, index) => ({
        ...service,
        color: service.color || colorPalette[index % colorPalette.length],
        iconName: resolveServiceIcon(service),
        features: Array.isArray(service.features) ? service.features : [],
      })),
    [services],
  );

  const filteredServices =
    activeCategory === "all"
      ? servicesWithPresentation
      : servicesWithPresentation.filter(
          (service) => service.category === activeCategory,
        );

  const visibleServices = filteredServices.slice(0, visibleCount);

  const allLoaded = visibleCount >= filteredServices.length;

  const categoryButtons = useMemo(
    () => [
      {
        id: "all",
        label: "All Services",
        count: servicesWithPresentation.length,
      },
      ...categories.map((category) => ({
        id: category.name,
        label: category.displayName || formatCategoryLabel(category.name),
        count: servicesWithPresentation.filter(
          (service) => service.category === category.name,
        ).length,
      })),
    ],
    [categories, servicesWithPresentation],
  );

  const renderIcon = (iconName) => {
    const Icon = iconMap[iconName] || Code;
    return <Icon className="w-6 h-6 text-white" />;
  };

  return (
    <section className="relative py-10 md:py-14 bg-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#0066ff] filter blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-[#00a0ff] to-[#0066ff] filter blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center bg-[#00f0ff]/10 p-3 md:p-4 rounded-full mb-4 md:mb-6">
            <Code className="w-6 h-6 md:w-8 md:h-8 text-[#00f0ff]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-3 md:mb-4">
            Our <span className="text-[#0066ff]">Services</span>
          </h2>
          <motion.div
            className="h-1 bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-transparent rounded-full mx-auto w-24 md:w-32 mb-3 md:mb-4"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          />
          <p className="text-black/60 text-base md:text-lg max-w-2xl mx-auto px-2">
            Comprehensive digital solutions tailored to elevate your business to
            new heights
          </p>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
          {categoriesLoading && categories.length === 0 ? (
            <div className="text-sm text-slate-500">Loading categories...</div>
          ) : null}
          {categoryButtons.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveCategory(category.id);
                setVisibleCount(4); // Reset
              }}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 text-slate-600">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading services...
          </div>
        )}

        {!loading && error && (
          <div className="max-w-xl mx-auto mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {visibleServices.map((service, index) => (
            <motion.div
              key={service._id || service.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 25 },
              }}
              className="group"
            >
              <div className="relative h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:border-gray-300">
                <div className={`h-1.5 ${service.color}`}></div>
                <div className="p-5 flex flex-col h-full">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-12 h-12 rounded-lg ${service.color} bg-opacity-10 flex items-center justify-center overflow-hidden`}
                      >
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          renderIcon(service.iconName)
                        )}
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {categories.find((cat) => cat.name === service.category)
                          ?.displayName ||
                          formatCategoryLabel(service.category)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="space-y-2 mb-5">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full ${resolveCategoryColor(service.category) || service.color} mr-3 flex-shrink-0`}
                          ></div>
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                      {service.features.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{service.features.length - 3} more
                        </p>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => router.push(service.path)}
                      className={`w-full py-2.5 ${service.color} text-white font-medium rounded-lg text-sm transition-all duration-300 hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer`}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.button>
                  </div>
                </div>
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More / Show Less Button */}
        {!loading && filteredServices.length > 4 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount(allLoaded ? 4 : visibleCount + 4)}
              className="px-6 py-2.5 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-medium rounded-lg text-sm shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {allLoaded ? "Show Less" : "Load More"}
            </button>
          </div>
        )}

        {!loading && !error && filteredServices.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No services found.
          </div>
        )}
      </div>
    </section>
  );
};

export default WhatWeOffer;

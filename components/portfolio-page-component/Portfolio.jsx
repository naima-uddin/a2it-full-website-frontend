"use client";
import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import Link from "next/link";
import { BiRightArrow } from "react-icons/bi";
import { GoArrowUpRight } from "react-icons/go";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ITEMS_PER_LOAD = 4;

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load portfolio projects");
        }

        setProjects(data.portfolios || []);
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load portfolio projects");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
  }, [activeFilter]);

  const categories = [
    "All",
    "Web Development",
    "Mobile App",
    "UI/UX Design",
    "AI/ML",
    "eCommerce Development",
    "Digital Marketing",
    "Affiliate",
    "Wordpress",
    "Import Export",
  ];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) =>
          Array.isArray(p.category)
            ? p.category.includes(activeFilter)
            : p.category === activeFilter,
        );

  // Load more function
  const handleLoadMore = () => {
    setVisibleCount((prev) => {
      const nextCount = prev + ITEMS_PER_LOAD;
      // Don't exceed total filtered projects
      return Math.min(nextCount, filteredProjects.length);
    });
  };

  const handleLoadLess = () => {
    setVisibleCount((prev) => Math.max(ITEMS_PER_LOAD, prev - ITEMS_PER_LOAD));
  };

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
    setHoveredProject(null);
  }, [activeFilter]);
  return (
    <div className=" bg-[#0a0a12] text-[#e0e0ff]">
      {/* Hero Section with Background Image */}
      <div
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#45454f] bg-opacity-80"
        style={{
          backgroundImage: "url(/assets/Portfolio/portfolio-bg.avif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0  opacity-70 z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                Portfolio
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#b0b0ff] mb-10 max-w-3xl mx-auto">
              Projects loaded directly from the database and synced to your
              dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] hover:shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Start a Project
              </Link>
              <Link
                href="/about"
                className="border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <section className="py-10 bg-slate-100 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                Work
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Discover our diverse range of projects across multiple industries
            </p>
          </div>

          {loading && (
            <div className="text-center py-10 text-slate-600">
              Loading projects from the database...
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-10 text-red-500">{error}</div>
          )}

          {/* Filter Buttons */}
          <div className="mb-16">
            {/* Mobile Dropdown */}
            <div className="block sm:hidden px-4 mb-4">
              <button
                onClick={() => setOpen(true)}
                className="w-full py-3 rounded-full bg-slate-900 text-white font-semibold border border-slate-900/10 shadow-sm hover:bg-slate-800 transition"
              >
                Filter Category
              </button>

              {open && (
                <div
                  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end"
                  onClick={() => setOpen(false)} // tap outside → close
                >
                  <div
                    className="
          w-full bg-white rounded-t-3xl p-5
          max-h-[70vh] overflow-y-auto
          animate-slideUp
          border-t border-slate-200
        "
                    onClick={(e) => e.stopPropagation()} // prevent accidental close
                  >
                    {/* Drag / Minimize Handle */}
                    <button
                      onClick={() => setOpen(false)}
                      className="w-full flex justify-center mb-3"
                    >
                      <div className="h-1.5 w-12 bg-slate-300 rounded-full" />
                    </button>

                    {/* Title */}
                    <h3 className="text-center text-sm font-semibold text-slate-500 mb-4">
                      Select Category
                    </h3>

                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setActiveFilter(category);
                          setOpen(false);
                        }}
                        className={`w-full text-left py-3 border-b border-slate-100 transition ${activeFilter === category ? "text-[#0066ff]" : "text-slate-700"} active:bg-slate-50`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Buttons */}
            <div className="hidden sm:flex flex-wrap justify-center gap-2 items-center">
              <Filter className="h-5 w-5 text-slate-400 mr-1" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 border shadow-sm ${
                    activeFilter === category
                      ? "bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white border-transparent shadow-lg"
                      : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {!loading && !error && filteredProjects.length === 0 && (
            <div className="text-center py-10 text-[#e8e8ff]">
              No portfolio projects found in the database.
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 -mt-8">
            {filteredProjects.slice(0, visibleCount).map((project, index) => {
              return (
                <div
                  key={`${project.id}-${index}`}
                  className="group flex flex-col bg-white rounded-2xl ring-1 ring-slate-200/70 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_-8px_rgba(15,23,42,0.10)] hover:ring-[#00f0ff]/40 hover:shadow-[0_4px_12px_rgba(0,102,255,0.06),0_20px_40px_-12px_rgba(0,102,255,0.22)] transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden relative cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                  onMouseEnter={() =>
                    window.innerWidth >= 768 &&
                    setHoveredProject(`${project.id}-${index}`)
                  }
                  onMouseLeave={() =>
                    window.innerWidth >= 768 && setHoveredProject(null)
                  }
                >
                  {/* IMAGE */}
                  <div className="relative overflow-hidden h-52 md:h-60">
                    <img
                      src={project.image}
                      alt={project.title}
                      className={`w-full h-full object-cover transition-transform duration-[600ms] ease-out ${
                        hoveredProject === `${project.id}-${index}`
                          ? "scale-[1.07]"
                          : "scale-100"
                      }`}
                    />
                    {/* Soft gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                    {/* Category badge on image */}
                    {(() => {
                      const firstCat = Array.isArray(project.category)
                        ? project.category[0]
                        : project.category;
                      return firstCat ? (
                        <span className="absolute top-2.5 left-2.5 bg-white/85 backdrop-blur-md text-slate-800 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide shadow-sm ring-1 ring-black/5">
                          {firstCat}
                        </span>
                      ) : null;
                    })()}
                  </div>

                  <div className="flex flex-col flex-1 px-3.5 sm:px-4 pt-2 pb-2.5">
                    {/* Title + description */}
                    <h3 className="text-[13px] sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-[#0066ff] transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-0.5 text-slate-500 text-[10px] sm:text-[11px] leading-relaxed line-clamp-2 min-h-[1.9rem]">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {project.technologies
                        ?.slice(0, 4)
                        .map((tech, techIndex) => (
                          <span
                            key={`${project.id}-desktop-tech-${techIndex}`}
                            className="bg-[#00f0ff]/5 text-[#0066ff] px-1.5 py-0.5 rounded-md text-[8px] font-medium border border-[#00f0ff]/20"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>

                    {/* Metrics */}
                    {project.metrics?.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {project.metrics
                          ?.slice(0, 2)
                          .map((metric, metricIndex) => (
                            <div
                              key={`${project.id}-desktop-metric-${metricIndex}`}
                              className="rounded-xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 p-1.5 text-center transition-colors group-hover:border-[#00f0ff]/30"
                            >
                              <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff] font-extrabold text-xs sm:text-sm leading-none">
                                {metric.value}
                              </p>
                              <p className="text-slate-400 text-[8px] sm:text-[9px] font-medium leading-tight mt-0.5 line-clamp-1">
                                {metric.label}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-700 group-hover:text-[#0066ff] transition-colors">
                        View details
                      </span>
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-100 text-[#0066ff] group-hover:bg-gradient-to-r group-hover:from-[#00f0ff] group-hover:to-[#0066ff] group-hover:text-white transition-all">
                        <GoArrowUpRight className="text-xs" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* --- LOAD MORE / LOAD LESS BUTTONS --- */}
            <div className="col-span-full flex justify-center gap-4">
              {visibleCount < filteredProjects.length && (
                <button
                  onClick={handleLoadMore}
                  className="px-8 sm:px-10 py-3 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white font-semibold shadow-lg hover:opacity-90 transition"
                >
                  Load More
                </button>
              )}

              {visibleCount > ITEMS_PER_LOAD && (
                <button
                  onClick={handleLoadLess}
                  className="px-8 sm:px-10 py-3 rounded-full border border-slate-200 text-slate-700 bg-white font-semibold shadow-sm hover:bg-slate-50 transition"
                >
                  Load Less
                </button>
              )}
            </div>
          </div>

          {selectedProject && (
            <div
              className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm p-3 sm:p-4 md:p-8 overflow-y-auto"
              onClick={() => setSelectedProject(null)}
            >
              <div
                className="relative w-full max-w-6xl mx-auto my-auto bg-[#12121a] rounded-2xl border border-[#00f0ff]/20 overflow-hidden shadow-2xl shadow-black/40 h-[90vh] flex flex-col lg:flex-row"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button (fixed to modal) */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3 right-3 z-20 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg backdrop-blur"
                >
                  Close
                </button>

                {/* LEFT: Full image */}
                <div className="lg:w-[48%] shrink-0 bg-[#0a0a12] flex items-start justify-center p-4 sm:p-5 h-[38vh] lg:h-full overflow-y-auto">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="max-w-full h-auto rounded-xl object-contain"
                  />
                </div>

                {/* RIGHT: Details */}
                <div className="lg:w-[52%] p-5 sm:p-7 md:p-8 space-y-5 overflow-y-auto">
                  {/* Title + description */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight pr-16">
                      {selectedProject.title}
                    </h3>
                    <p className="mt-2 text-[#c8c8e8] text-sm sm:text-base leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedProject.category)
                      ? selectedProject.category
                      : [selectedProject.category]
                    ).map((cat, idx) => (
                      <span
                        key={`modal-cat-${idx}`}
                        className="bg-gradient-to-r from-[#00f0ff]/80 to-[#0066ff]/80 text-white px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/5">
                      <p className="text-[#b0b0ff]">Duration</p>
                      <p className="text-white font-semibold">
                        {selectedProject.duration || "N/A"}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/5">
                      <p className="text-[#b0b0ff]">Team Size</p>
                      <p className="text-white font-semibold">
                        {selectedProject.teamSize || "N/A"}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/5">
                      <p className="text-[#b0b0ff]">Role</p>
                      <p className="text-white font-semibold">
                        {selectedProject.role || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies?.map((tech, idx) => (
                        <span
                          key={`modal-tech-${idx}`}
                          className="bg-[#0a0a12]/40 text-[#e6e6ff] px-3 py-1 rounded-full text-xs border border-[#00f0ff]/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {(selectedProject.challenge ||
                    selectedProject.solution ||
                    selectedProject.result) && (
                    <div className="grid grid-cols-1 gap-3">
                      {selectedProject.challenge && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                          <h4 className="text-sm font-semibold text-[#00f0ff] mb-1.5">
                            Challenge
                          </h4>
                          <p className="text-[#c8c8e8] leading-relaxed text-sm">
                            {selectedProject.challenge}
                          </p>
                        </div>
                      )}

                      {selectedProject.solution && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                          <h4 className="text-sm font-semibold text-[#00f0ff] mb-1.5">
                            Solution
                          </h4>
                          <p className="text-[#c8c8e8] leading-relaxed text-sm">
                            {selectedProject.solution}
                          </p>
                        </div>
                      )}

                      {selectedProject.result && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                          <h4 className="text-sm font-semibold text-[#00f0ff] mb-1.5">
                            Results
                          </h4>
                          <p className="text-[#c8c8e8] leading-relaxed text-sm">
                            {selectedProject.result}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedProject.features?.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-2">
                        Features
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#c8c8e8]">
                        {selectedProject.features.map((feature, idx) => (
                          <li
                            key={`modal-feature-${idx}`}
                            className="flex gap-2"
                          >
                            <span className="text-[#00f0ff] mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedProject.metrics?.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-3">
                        Metrics
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedProject.metrics.map((metric, idx) => (
                          <div
                            key={`modal-metric-${idx}`}
                            className="bg-[#0a0a12]/40 rounded-lg p-3 text-center border border-[#00f0ff]/10"
                          >
                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff] font-bold text-lg">
                              {metric.value}
                            </p>
                            <p className="text-[#b0b0ff] text-xs mt-1">
                              {metric.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProject.link && (
                    <div>
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-white px-5 py-2 rounded-full font-semibold shadow-lg"
                      >
                        Visit Project
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-6 border-t border-[#00f0ff]/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-black mb-6">
            Ready to Create Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
              Amazing?
            </span>
          </h2>
          <Link
            href="/contact"
            className=" flex text-[#084347]   font-semibold text-lg transition-all duration-200 transform hover:scale-105 justify-center"
          >
            Get In Touch <GoArrowUpRight className="text-red-600" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;

"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function CompanyGallery() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  // Pull admin-managed gallery images (uploaded from the dashboard) so they
  // appear here alongside the built-in showcase images.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/upload/gallery`);
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        const mapped = (data.resources || []).map((r, i) => ({
          id: `uploaded-${r.public_id}`,
          src: r.secure_url,
          alt: "A2it Company Gallery",
          title: "A2it Gallery",
          description:
            "A moment from A2IT Ltd — our team, workspace and culture.",
          category: "Gallery",
          rowSpan: 1,
          colSpan: i % 5 === 3 ? 2 : 1,
        }));
        setUploadedImages(mapped);
      } catch (err) {
        console.error("Failed to load gallery images:", err);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initially set to true for SSR
    setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto slide on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isMobile, currentSlide]);

  // Only the images uploaded from the dashboard Company Gallery are shown here.
  const companyImages = uploadedImages;

  // Calculate total slides for mobile
  const totalSlides = companyImages.length;

  // Slider functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  const openModal = (index) => setSelectedImageIndex(index);
  const closeModal = () => setSelectedImageIndex(null);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % companyImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? companyImages.length - 1 : prev - 1
    );
  }; 

  const MobileImageCard = ({ image, index }) => (
    <div
      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-[#12121a] h-full border border-[#00f0ff]/20 min-w-full"
    >
      <div className="relative overflow-hidden h-full">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-56 object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75" 
        /> 

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-[#00f0ff]/90 text-[#0a0a12] px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          {image.category}
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/90 via-[#0a0a12]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 flex flex-col justify-end">
          <h3 className="font-bold text-md text-[#e0e0ff] mb-1 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
            {image.title}
          </h3>
          <p className="text-xs text-[#b0b0ff] line-clamp-2 mb-2 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-75">
            {image.description}
          </p>
          <button
            onClick={() => openModal(index)}
            className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] hover:from-[#00c0ff] hover:to-[#0044ff] text-[#0a0a12] px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-100 w-max"
          >
            <Eye className="w-3 h-3" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  const DesktopImageCard = ({ image, index }) => {
    // ✅ প্রথমে চেক করুন image আছে কিনা
    if (!image) {
      return (
        <div className="group relative overflow-hidden rounded-lg shadow-md bg-gray-800 h-full border border-gray-700 min-h-[200px] animate-pulse">
          <div className="w-full h-full bg-gray-700"></div>
        </div>
      );
    }

    return (
      <div
        className={`group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-[#12121a] h-full border border-[#00f0ff]/20 ${
          image.colSpan === 2 ? "md:col-span-2" : ""
        }`}
      >
        <div className="relative overflow-hidden h-full">
          <img
            src={image.src}
            alt={image.alt}
            className={`w-full ${
              image.featured ? "h-72" : "h-56"
            } object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75`}
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-[#00f0ff]/90 text-[#0a0a12] px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            {image.category}
          </div>

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12]/90 via-[#0a0a12]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-4 flex flex-col justify-end">
            <h3 className="font-bold text-md text-[#e0e0ff] mb-1 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
              {image.title}
            </h3>
            <p className="text-xs text-[#b0b0ff] line-clamp-2 mb-2 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-75">
              {image.description}
            </p>
            <button
              onClick={() => openModal(index)}
              className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] hover:from-[#00c0ff] hover:to-[#0044ff] text-[#0a0a12] px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-100 w-max"
            >
              <Eye className="w-3 h-3" />
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Nothing to show until admins upload images from the dashboard gallery.
  if (companyImages.length === 0) return null;

  return (
    <section className=" bg-white mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 pt-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 md:mb-3">
            Our <span className="text-[#006dff]">Company Gallery</span>
          </h2>
          <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] mx-auto mb-3 md:mb-4"></div>
          <p className="text-base md:text-lg text-black max-w-3xl mx-auto px-2">
            Explore our comprehensive IT services through our company gallery
          </p>
        </div>

        {/* Desktop Grid Layout - dynamic (uploaded + default images) */}
        <div className="hidden md:grid grid-cols-3 gap-4 auto-rows-fr">
          {companyImages.map((image, index) => (
            <DesktopImageCard key={image.id} image={image} index={index} />
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden relative w-full">
          <div 
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {companyImages.map((image, index) => (
              <div key={image.id} className="flex-shrink-0 w-full px-2">
                <MobileImageCard image={image} index={index} />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#0a0a12] shadow-lg rounded-full w-8 h-8 border flex items-center justify-center z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#0a0a12] shadow-lg rounded-full w-8 h-8 border flex items-center justify-center z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Slide Counter */}
          <div className="text-center mt-2 text-[#b0b0ff] text-sm">
            {currentSlide + 1} / {companyImages.length}
          </div>
        </div>

      </div>

      {/* Fullscreen Modal with responsive fixes */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-[#0a0a12]/95 z-50 flex items-center justify-center p-2 md:p-4">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-3 md:top-4 right-3 md:right-4 bg-[#12121a]/90 hover:bg-[#12121a] text-[#e0e0ff] border border-[#00f0ff]/20 z-10 backdrop-blur-sm p-1.5 md:p-2 rounded-md"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Navigation Arrows - Larger on mobile for touch */}
          <button
            onClick={prevImage}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-[#12121a]/90 hover:bg-[#12121a] text-[#e0e0ff] border border-[#00f0ff]/20 z-10 backdrop-blur-sm p-2 md:p-2 rounded-md w-10 h-10 md:w-auto md:h-auto flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 md:w-5 md:h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-[#12121a]/90 hover:bg-[#12121a] text-[#e0e0ff] border border-[#00f0ff]/20 z-10 backdrop-blur-sm p-2 md:p-2 rounded-md w-10 h-10 md:w-auto md:h-auto flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 md:w-5 md:h-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-[#0a0a12]/90 text-[#e0e0ff] px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-[#00f0ff]/20">
            {selectedImageIndex + 1} / {companyImages.length}
          </div>

          {/* Action Buttons - Mobile: bottom, Desktop: bottom center */}
          <div className="absolute bottom-16 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
            <button className="bg-gradient-to-r from-[#00f0ff] to-[#0066ff] hover:from-[#00c0ff] hover:to-[#0044ff] text-[#0a0a12] border border-[#00f0ff] backdrop-blur-sm px-3 py-1.5 md:px-3 md:py-1 rounded-md text-xs flex items-center gap-1 whitespace-nowrap">
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">DL</span>
            </button>
            <button className="bg-[#12121a]/90 hover:bg-[#12121a] text-[#e0e0ff] border border-[#00f0ff]/20 backdrop-blur-sm px-3 py-1.5 md:px-3 md:py-1 rounded-md text-xs flex items-center gap-1 whitespace-nowrap">
              <Share2 className="w-3 h-3" />
              <span className="hidden sm:inline">Share</span>
              <span className="sm:hidden">SH</span>
            </button>
          </div>

          {/* Main Image Content */}
          <div className="relative w-full h-full max-w-6xl max-h-[60vh] md:max-h-[70vh]">
            <img
              src={companyImages[selectedImageIndex].src}
              alt={companyImages[selectedImageIndex].alt}
              className="w-full h-full object-contain rounded-md"
            />

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a12]/95 to-transparent p-3 md:p-4 rounded-b-md">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#00f0ff] text-[#0a0a12] px-2 py-0.5 rounded-full text-xs font-semibold">
                  {companyImages[selectedImageIndex].category}
                </span>
              </div>
              <h3 className="text-[#e0e0ff] text-sm md:text-md font-bold mb-0.5 md:mb-1 line-clamp-1">
                {companyImages[selectedImageIndex].title}
              </h3>
              <p className="text-[#b0b0ff] text-xs line-clamp-2 md:line-clamp-3">
                {companyImages[selectedImageIndex].description}
              </p>
            </div>
          </div>

          {/* Thumbnail Strip - Mobile: smaller and scrollable */}
          <div className="absolute bottom-20 md:bottom-16 left-1/2 -translate-x-1/2 flex gap-1 max-w-[90vw] md:max-w-full overflow-x-auto px-2 py-1 md:py-1">
            {companyImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-10 h-8 md:w-12 md:h-9 rounded-sm overflow-hidden border transition-all ${
                  index === selectedImageIndex
                    ? "border-[#00f0ff] scale-110 md:scale-110"
                    : "border-[#b0b0ff]/30 hover:border-[#00f0ff]/60"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
"use client";

import { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// আলাদা একটি কম্পোনেন্টে useSearchParams() সরিয়ে নিন
function RouteTransitionContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetPage, setTargetPage] = useState("");
  const [currentPageType, setCurrentPageType] = useState("default");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // formatPageName ফাংশন
  const formatPageName = (path) => {
    if (path === '/') return 'Home';
    const pathWithoutSlash = path.replace(/^\//, '');
    const words = pathWithoutSlash.split(/[-\/]/);
    const formattedName = words
      .map(word => {
        if (word === 'privacy-policy') return 'Privacy Policy';
        if (word === 'terms-of-service') return 'Terms of Service';
        if (word === 'design-development') return 'Design & Development';
        if (word === 'e-commerce') return 'E-Commerce';
        if (word === 'server-hosting') return 'Server Hosting';
        if (word === 'e-bay') return 'eBay';
        if (word === 'erp') return 'ERP';
        if (word === 'seo') return 'SEO';
        if (word === 'amazon') return 'Amazon';
        if (word === 'shopify') return 'Shopify';
        if (word === 'mobile-app') return 'Mobile App';
        if (word === 'social-media') return 'Social Media';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
    return formattedName;
  };

  // Detect page type for skeleton
  const detectPageType = (path) => {
    if (path === '/') return 'home';
    if (path.startsWith('/services/')) return 'service';
    if (path.startsWith('/portfolio/')) return 'portfolio-detail';
    if (path === '/portfolio') return 'portfolio';
    if (path === '/about') return 'about';
    if (path.startsWith('/blog/')) return 'blog-detail';
    if (path === '/blog') return 'blog';
    if (path === '/contact') return 'contact';
    return 'default';
  };

  // Click handler for links
  useEffect(() => {
    let progressInterval;
    
    const handleClick = (event) => {
      const link = event.target.closest('a');
      
      if (link && link.href && !link.href.includes('#')) {
        const targetUrl = new URL(link.href, window.location.origin);
        const currentUrl = new URL(window.location.href);
        
        if (targetUrl.pathname !== currentUrl.pathname) {
          const pageType = detectPageType(targetUrl.pathname);
          setCurrentPageType(pageType);
          setTargetPage(formatPageName(targetUrl.pathname));
          setIsLoading(true);
          setProgress(0);
          
          // Progress animation
          progressInterval = setInterval(() => {
            setProgress(prev => {
              if (prev >= 90) {
                clearInterval(progressInterval);
                return 90;
              }
              return prev + 5;
            });
          }, 30);
          
          // Auto cleanup after 3 seconds
          const timeoutId = setTimeout(() => {
            clearInterval(progressInterval);
            setProgress(100);
            setTimeout(() => {
              setIsLoading(false);
              setProgress(0);
            }, 300);
          }, 3000);
          
          // Store timeout for cleanup
          link.dataset.timeoutId = timeoutId;
        }
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
      // Clear any existing intervals
      if (progressInterval) clearInterval(progressInterval);
    };
  }, []);

  // Route change detection (for Next.js navigation)
  useEffect(() => {
    if (pathname) {
      const pageType = detectPageType(pathname);
      setCurrentPageType(pageType);
      setTargetPage(formatPageName(pathname));
      setIsLoading(true);
      setProgress(0);
      
      // Progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 50);
      
      // Complete loading after 800ms (simulate page load)
      const timer = setTimeout(() => {
        clearInterval(progressInterval);
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 300);
      }, 800);
      
      return () => {
        clearInterval(progressInterval);
        clearTimeout(timer);
      };
    }
  }, [pathname, searchParams]);

  // Home page skeleton - WHITE VERSION
  const renderHomeSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Hero Section Skeleton */}
      <div className="mb-12">
        <div className="h-12 bg-gray-200 rounded-xl w-3/4 mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-8 animate-pulse"></div>
        <div className="flex flex-wrap gap-4">
          <div className="h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-40 animate-pulse"></div>
          <div className="h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-48 animate-pulse"></div>
        </div>
      </div>

      {/* Services Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Preview Skeleton */}
      <div className="mb-12">
        <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded-lg w-2/3 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-full mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Service page skeleton - WHITE VERSION
  const renderServiceSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Service Header */}
      <div className="text-center mb-12">
        <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-2/3 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto mb-8 animate-pulse"></div>
      </div>

      {/* Service Details */}
      <div className="space-y-8">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-6 animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/4 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="h-5 bg-gray-200 rounded-lg w-2/3 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Portfolio page skeleton - WHITE VERSION
  const renderPortfolioSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
      </div>

      {/* Portfolio Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {['All', 'Web', 'Mobile', 'E-commerce', 'Design'].map((item) => (
          <div key={item} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="h-56 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded-lg w-2/3 mb-2 animate-pulse"></div>
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="h-4 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded-lg w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // Blog page skeleton - WHITE VERSION
  const renderBlogSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3 mx-auto mb-4 animate-pulse"></div>
      </div>

      {/* Blog Posts */}
      <div className="space-y-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="h-8 bg-gray-200 rounded-lg w-2/3 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-full mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // Default skeleton (for unknown pages) - WHITE VERSION
  const renderDefaultSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-2/3 mx-auto mb-6 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
        ))}
      </div>
    </motion.div>
  );

  // Render skeleton based on page type
  const renderSkeleton = () => {
    switch (currentPageType) {
      case 'home':
        return renderHomeSkeleton();
      case 'service':
        return renderServiceSkeleton();
      case 'portfolio':
      case 'portfolio-detail':
        return renderPortfolioSkeleton();
      case 'blog':
      case 'blog-detail':
        return renderBlogSkeleton();
      default:
        return renderDefaultSkeleton();
    }
  };

  return (
    <>
      {/* Full Page Loading Overlay with Skeleton - WHITE VERSION */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="skeleton-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-white overflow-y-auto"
          >
            {/* Fixed Navbar Skeleton - WHITE */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                  </div>
                  
                  <div className="hidden md:flex items-center space-x-6">
                    {['Home', 'Services', 'Portfolio', 'Blog', 'About'].map((item) => (
                      <div key={item} className="h-4 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
                    ))}
                    <div className="h-10 bg-gradient-to-r from-[#00f0ff]/20 to-[#0066ff]/20 rounded-full w-32 animate-pulse border border-[#00f0ff]/30"></div>
                  </div>
                  
                  <div className="md:hidden">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
              {/* Page Title */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-12"
              >
                <div className="inline-block">
                  <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-64 mx-auto mb-4 animate-pulse"></div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-2 w-2 bg-[#00f0ff] rounded-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
                    <div className="h-2 w-2 bg-[#00f0ff] rounded-full animate-pulse"></div>
                  </div>
                </div>
              </motion.div>

              {/* Dynamic Skeleton Content */}
              {renderSkeleton()}

              {/* Loading Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="fixed bottom-8 right-8 bg-white rounded-full p-4 border border-[#00f0ff]/30 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-6 h-6 border-2 border-[#00f0ff]/30 border-t-[#00f0ff] rounded-full animate-spin"></div>
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-800 font-medium">{targetPage}</div>
                    <div className="text-xs text-gray-500">Loading... {progress}%</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer Skeleton - WHITE */}
            <div className="bg-white border-t border-gray-200 mt-12">
              <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map((col) => (
                    <div key={col} className="space-y-4">
                      <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="h-4 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded-lg w-48 mb-4 md:mb-0 animate-pulse"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Progress Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[10000]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00f0ff] via-[#0066ff] to-[#00f0ff]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite linear',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
}

// মূল কম্পোনেন্ট যা Suspense দিয়ে কন্টেন্টকে র‍্যাপ করে
const RouteTransitionHandler = () => {
  return (
    <Suspense 
      fallback={
        <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#00f0ff]/20 border-t-[#00f0ff] rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-gray-800 font-medium">Initializing...</div>
          </div>
        </div>
      }
    >
      <RouteTransitionContent />
    </Suspense>
  );
};

export default RouteTransitionHandler;
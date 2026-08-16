"use client";
import React, { useState } from 'react';
import ConsultModal from '@/components/promotion/promotionModal';

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+18723353070';
  };

  const handleLiveChatClick = () => {
    // Format: https://wa.me/phone_number?text=optional_message
    const phoneNumber = '18723353070'; // Remove any special characters
    const message = encodeURIComponent("Hello! I'm interested in your services.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#e8d5c8] flex items-center justify-center p-4 overflow-hidden relative">
      
      {/* Background Floating Bubbles (Decorative) */} 
      <div className="absolute top-24 right-[20%] w-52 h-28 bg-[#f2cc8f] rounded-xl shadow-2xl opacity-40 transform rotate-3 hidden lg:block"></div> 
      
      <div className="relative z-10 w-full max-w-4xl">
        
        {/* Main Content Box (Speech Bubble Style) */}
        <div className="relative bg-white border-[8px] md:border-[12px] border-gray-100/50 rounded-2xl p-6 md:p-16 shadow-[30px_30px_60px_-15px_rgba(0,0,0,0.1)] text-center max-w-2xl mx-auto">
          
          {/* Bubble Tail - Hidden on mobile */}
          <div className="absolute -bottom-[50px] right-12 w-0 h-0 
            border-l-[30px] border-l-transparent 
            border-t-[40px] border-t-white 
            border-r-[30px] border-r-transparent 
            drop-shadow-[15px_15px_15px_rgba(0,0,0,0.05)]
            hidden md:block">
          </div>

          <h1 className="text-xl md:text-4xl font-extrabold text-[#1a3a5f] mb-4 leading-tight">
            Require a Rapid Project Delivery?
          </h1>
          <p className="text-base md:text-lg font-bold text-gray-800 mb-6">
            Contact Us Now - We're Ready to Assist!
          </p>
          <p className="text-sm md:text-lg text-gray-500 leading-relaxed max-w-lg mx-auto">
            Whether you seek a brand-new website or wish to rejuvenate an existing one, 
            our dedicated customer representatives are just a phone call away, 
            eager to address your inquiries.
          </p>
        </div>

        {/* Floating Action Elements */}
        
        {/* Get a Quote Button - Responsive positioning */}
        <div className="absolute md:top-1/2 top-[-30px] left-1/2 md:left-[-12px] transform -translate-x-1/2 md:-translate-y-1/2 md:translate-x-0">
          <button 
            onClick={handleOpenModal}
            className="bg-[#0071bc] text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-black shadow-[10px_10px_20px_rgba(0,0,0,0.2)] hover:scale-105 transition-all text-xs md:text-base uppercase cursor-pointer whitespace-nowrap"
          >
            Get a Quote
          </button>
        </div>

        {/* Phone Number Box - Responsive positioning */}
        <div 
          onClick={handlePhoneClick}
          className="absolute md:-bottom-8 -bottom-10 left-1/2 md:right-[-10%] md:left-auto transform -translate-x-1/2 md:translate-x-0 bg-[#2d3436] text-white p-3 md:p-4 px-4 md:px-6 rounded-xl flex items-center gap-2 md:gap-3 shadow-2xl border border-gray-600 cursor-pointer hover:bg-[#3d4346] transition-colors"
        >
          <div className="bg-white/10 p-1.5 md:p-2 rounded-full">
             <span className="text-lg md:text-xl">📞</span>
          </div>
          <span className="text-base md:text-xl font-mono font-bold tracking-tighter whitespace-nowrap">
            +880 1846-937397
          </span>
        </div>

        {/* Live Chat Component - Responsive positioning */}
        <div 
          onClick={handleLiveChatClick}
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-[#fbe5d6] border-2 border-[#e6ccb2] px-6 md:px-10 py-3 md:py-4 rounded-xl shadow-xl flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-white transition-colors"
        >
          <span className="text-xl md:text-2xl">💬</span>
          <span className="text-[#a68a73] font-bold text-sm md:text-lg whitespace-nowrap">Live Chat With Us</span>
          {/* Small tail for chat */}
          <div className="absolute -top-3 left-8 w-0 h-0 border-l-[10px] border-l-transparent border-b-[12px] border-b-[#fbe5d6] border-r-[10px] border-r-transparent hidden md:block"></div>
        </div>

      </div>

      {/* Consult Modal */}
      <ConsultModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default Contact;
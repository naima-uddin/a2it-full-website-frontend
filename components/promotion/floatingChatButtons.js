"use client";
import { PhoneCall, FileText, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import ConsultModal from '@/components/promotion/promotionModal';
import {   MapPin } from 'lucide-react';
export default function FloatingChatButtons() {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {/* Top Two Buttons Container */}
        <div className="fixed -right-3 hover:right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {/* Call Button */}
       {/* Location/Map Button */}
<div 
  className="relative"
  onMouseEnter={() => setHoveredButton('map')}
  onMouseLeave={() => setHoveredButton(null)}
>
  <div className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
    hoveredButton === 'map' 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 translate-x-4 pointer-events-none'
  }`}>
    <span className="font-medium">Find Us</span>
    <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-blue-500"></div>
  </div>
  
  <button
    onClick={() => window.open('https://www.google.com/maps/place/Pallabi/@23.8260058,90.3605328,14z/data=!3m1!4b1!4m6!3m5!1s0x3755c13eb3b73875:0xff0422f2f438c467!8m2!3d23.8203566!4d90.3649546!16s%2Fg%2F11f712ctr7?entry=ttu&g_ep=EgoyMDI2MDIxOC4wIKXMDSoASAFQAw%3D%3D', '_blank')}
    className=" bg-blue-500  hover:bg-blue-600 text-white w-12 h-12 rounded-l-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:translate-x-[-4px] relative z-10"
  >
    <MapPin className="w-5 h-5" />
  </button>
</div>

          {/* Get Consult Button */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredButton('consult')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <div className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
              hoveredButton === 'consult' 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-4 pointer-events-none'
            }`}>
              <span className="font-medium">Get Consult</span>
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-blue-500"></div>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#f5b342] hover:bg-blue-600 text-white w-12 h-12 rounded-l-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:translate-x-[-4px] relative z-10"
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom WhatsApp Button */}
<button
  onClick={() => window.open('https://wa.me/8801846937397', '_blank')}
  className="fixed bottom-1 md:bottom-1 right-1 md:right-1 
    bg-green-600 hover:bg-green-700 text-white 
    p-2 md:p-3 rounded-full shadow-2xl 
    flex items-center justify-center
    transition-all duration-300 hover:scale-105 hover:shadow-xl 
    border-2 border-white/20
    z-50"
>
  <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
  <span className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-30"></span>
</button>
      </div>

      {/* Consult Modal */}
      <ConsultModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
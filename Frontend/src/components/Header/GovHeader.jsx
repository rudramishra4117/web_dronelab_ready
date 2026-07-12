import React from "react";

export function GovHeader() {
  return (
    <div
      className="w-full bg-white border-b-[6px] border-[#0e1e32] py-2 px-4 md:px-6 flex flex-col lg:flex-row justify-between items-center gap-4 shadow-sm z-50 relative font-sans overflow-hidden"
    >
      {/* Left Section: NIELIT */}
      <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-auto justify-center lg:justify-start relative z-10">
        <img
          src="/bhubaneswar_logo.webp"
          alt="NIELIT Bhubaneswar Logo"
          className="h-14 md:h-16 object-contain"
        />
        <div className="flex flex-col justify-center">
          <span className="text-[#0e1e32] font-semibold text-[12px] md:text-[14px] leading-tight">
            राष्ट्रीय इलेक्ट्रॉनिकी एवं सूचना प्रौद्योगिकी संस्थान, भुवनेश्वर
          </span>
          <span className="text-gray-900 font-bold text-[11px] md:text-[13px] leading-tight mt-0.5">
            National Institute of Electronics &amp; Information Technology, Bhubaneswar
          </span>
        </div>
      </div>

      {/* Right Section: Ministry & Emblem */}
      <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-auto justify-center lg:justify-end relative z-10">
        <div className="flex flex-col items-end text-right">
          <span className="text-gray-900 font-bold text-[12px] md:text-[14px] leading-tight mb-1">
            इलेक्ट्रॉनिकी और सूचना प्रौद्योगिकी मंत्रालय
          </span>
          <div className="bg-[#0e1e32] text-white text-[10px] md:text-[12px] font-medium px-4 py-1 rounded-full whitespace-nowrap">
            Ministry of Electronics &amp; Information Technology
          </div>
        </div>
        <img
          src="/National-Emblem.webp"
          alt="National Emblem of India"
          className="h-12 md:h-16 object-contain"
        />
      </div>
    </div>
  );
}

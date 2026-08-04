'use client';

import React from 'react';
import { Compass, Smile, ShieldCheck, Film, Popcorn, Camera } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[32px] p-8 md:p-14 retro-shadow-lg grid md:grid-cols-12 gap-8 items-center">
        
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 bg-[#D7B4A8] border border-[#5A3B38] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5 text-[#5A3B38]" /> Event Details & Experience
          </div>

          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-black text-[#5A3B38] tracking-tight leading-tight mb-4">
            Sunday, August 9th @ La Kofe Cafe.
          </h2>

          <p className="text-sm md:text-base text-[#342224] leading-relaxed mb-4">
            We are bringing the community together for a special Sunday night under the open sky! Enjoy a crystal-clear outdoor cinema experience projected on a high-definition <strong>SMD Screen</strong>, snap instant memories at our fun <strong>Photobooth</strong>, and munch on <strong>FREE freshly popped popcorn</strong>.
          </p>

          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="bg-[#F2D8D5] border border-[#5A3B38] p-3 rounded-2xl text-center">
              <Film className="w-5 h-5 text-[#5A3B38] mx-auto mb-1" />
              <span className="font-bold text-xs block text-[#5A3B38]">SMD Display</span>
            </div>

            <div className="bg-[#F2D8D5] border border-[#5A3B38] p-3 rounded-2xl text-center">
              <Camera className="w-5 h-5 text-[#5A3B38] mx-auto mb-1" />
              <span className="font-bold text-xs block text-[#5A3B38]">Photobooth</span>
            </div>

            <div className="bg-[#F2D8D5] border border-[#5A3B38] p-3 rounded-2xl text-center">
              <Popcorn className="w-5 h-5 text-[#5A3B38] mx-auto mb-1" />
              <span className="font-bold text-xs block text-[#5A3B38]">Free Popcorn</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t-2 border-dashed border-[#5A3B38]">
            <div className="flex items-start gap-2.5">
              <Smile className="w-5 h-5 text-[#5A3B38] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-[#5A3B38]">Location</h4>
                <p className="text-[11px] text-[#7B5A58]">La Kofe Cafe, Citrus City</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#5A3B38] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-[#5A3B38]">Timing</h4>
                <p className="text-[11px] text-[#7B5A58]">Sunday Aug 9, 7:00 PM Onwards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Poster Graphics Column */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative bg-[#F2D8D5] border-3 border-[#5A3B38] rounded-3xl p-6 retro-shadow-sm rotate-2 text-center max-w-sm w-full">
            <div className="w-16 h-16 bg-[#5A3B38] text-[#FAF0EE] rounded-full mx-auto flex items-center justify-center font-serif-display font-black text-2xl mb-4 border-2 border-[#5A3B38]">
              AUG 9
            </div>
            <h3 className="font-serif-display text-xl font-bold text-[#5A3B38] mb-2">
              "Outdoor Cinema & Photobooth"
            </h3>
            <p className="text-xs text-[#342224] italic mb-4">
              "Reserve your ticket pass online for instant entry at the door. Free popcorn & good vibes guaranteed!"
            </p>
            <span className="inline-block bg-[#D7B4A8] border border-[#5A3B38] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#342224]">
              La Kofe Cafe • Citrus City
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

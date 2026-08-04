'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Film, Camera, Popcorn, Sparkles, MapPin, Calendar, Clock } from 'lucide-react';

interface HeroProps {
  onRegisterClick?: () => void;
}

export default function Hero({ onRegisterClick }: HeroProps) {
  const handleRegisterBtnClick = (e: React.MouseEvent) => {
    if (onRegisterClick) {
      e.preventDefault();
      onRegisterClick();
    }
  };

  return (
    <section className="relative pt-8 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Horizontal Marquee Ticker */}
      <div className="bg-[#5A3B38] text-[#FAF0EE] border-y-2 border-[#342224] py-2.5 overflow-hidden mb-12 -mx-4 md:-mx-8 font-mono text-xs tracking-wider uppercase font-bold">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          <span>🍿 SUNDAY AUG 9: OUTDOOR CINEMA & PHOTOBOOTH NIGHT @ LA KOFE CAFE</span>
          <span>✦</span>
          <span>✨ MASSIVE SMD SCREEN • FREE POPCORN FOR ALL</span>
          <span>✦</span>
          <span>📸 FUN PHOTOBOOTH MEMORIES • 7:00 PM ONWARDS</span>
          <span>✦</span>
          <span>🎟️ REGISTRATION NOW OPEN</span>
          <span>✦</span>
          <span>🍿 SUNDAY AUG 9: OUTDOOR CINEMA & PHOTOBOOTH NIGHT @ LA KOFE CAFE</span>
          <span>✦</span>
          <span>✨ MASSIVE SMD SCREEN • FREE POPCORN FOR ALL</span>
        </div>
      </div>

      {/* Main Hero Container: 70s Editorial Layout */}
      <div className="relative bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[32px] p-6 md:p-12 retro-shadow-lg overflow-hidden">
        
        {/* Background Graphic Watermark */}
        <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 text-[#F2D8D5] select-none pointer-events-none font-serif-display font-black text-[180px] leading-none opacity-40">
          WKD
        </div>

        {/* Floating Decorative Sticker - Starburst */}
        <div className="absolute -top-4 right-8 bg-[#D97706] text-white border-2 border-[#5A3B38] rounded-full p-4 font-bold text-xs rotate-12 retro-shadow animate-float hidden sm:block">
          <div className="text-center leading-tight">
            <span className="block text-lg">★</span>
            SUNDAY<br />SPECIAL
          </div>
        </div>

        {/* Floating Sticker - Category Pill */}
        <div className="inline-flex items-center gap-2 bg-[#D7B4A8] border-2 border-[#5A3B38] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 -rotate-1">
          <Sparkles className="w-4 h-4 text-[#5A3B38]" />
          <span>Next Gathering • Sunday, August 9</span>
        </div>

        {/* Diagonal Hero Ribbons */}
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="font-serif-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#5A3B38] tracking-tight leading-[0.95]">
            OUTDOOR CINEMA <br />
            <span className="inline-block bg-[#F2D8D5] border-2 border-[#5A3B38] px-4 py-1 rounded-2xl rotate-1 retro-shadow text-[#342224] my-2">
              & PHOTOBOOTH
            </span>{' '}
            NIGHT.
          </h1>
        </div>

        {/* Editorial Subtitle & Description */}
        <div className="grid md:grid-cols-12 gap-6 items-end mt-6">
          <div className="md:col-span-7 space-y-3">
            <p className="text-base sm:text-lg md:text-xl text-[#342224] font-medium leading-relaxed">
              Join us for an exclusive Sunday evening at <strong className="text-[#5A3B38]">La Kofe Cafe, Citrus City</strong>! Experience cinema on a massive SMD Screen, capture fun photobooth memories, and enjoy FREE popcorn all night.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono font-bold text-[#7B5A58] pt-1">
              <span className="flex items-center gap-1.5 bg-[#F2D8D5] border border-[#5A3B38] px-3 py-1 rounded-full">
                <Calendar className="w-4 h-4 text-[#5A3B38]" /> Sunday, Aug 9
              </span>
              <span className="flex items-center gap-1.5 bg-[#F2D8D5] border border-[#5A3B38] px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 text-[#5A3B38]" /> 7:00 PM Onwards
              </span>
              <span className="flex items-center gap-1.5 bg-[#F2D8D5] border border-[#5A3B38] px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4 text-[#5A3B38]" /> La Kofe Cafe, Citrus City
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
            <button
              onClick={handleRegisterBtnClick}
              className="bg-[#5A3B38] text-[#FAF0EE] border-2 border-[#5A3B38] hover:bg-[#7B5A58] px-8 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 retro-shadow hover:scale-105 active:scale-95 transition-all text-center cursor-pointer"
            >
              <span>Register & Claim Ticket Pass</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <a
              href="#about"
              className="bg-[#D7B4A8] text-[#342224] border-2 border-[#5A3B38] hover:bg-[#5A3B38] hover:text-[#FAF0EE] px-6 py-3.5 rounded-full font-bold text-sm text-center transition-all"
            >
              Event Details & Perks
            </a>
          </div>
        </div>

        {/* Feature Icons Ribbon at Bottom of Hero */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t-2 border-dashed border-[#5A3B38]">
          <div className="flex items-center gap-3 bg-[#FBE5E1] p-3 rounded-2xl border border-[#5A3B38]">
            <Film className="w-6 h-6 text-[#5A3B38]" />
            <div>
              <h4 className="font-bold text-xs uppercase">SMD Screen</h4>
              <p className="text-[11px] text-[#7B5A58]">HD Outdoor Display</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#FBE5E1] p-3 rounded-2xl border border-[#5A3B38]">
            <Camera className="w-6 h-6 text-[#5A3B38]" />
            <div>
              <h4 className="font-bold text-xs uppercase">Photobooth</h4>
              <p className="text-[11px] text-[#7B5A58]">Instant Photo Keepsakes</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#FBE5E1] p-3 rounded-2xl border border-[#5A3B38]">
            <Popcorn className="w-6 h-6 text-[#5A3B38]" />
            <div>
              <h4 className="font-bold text-xs uppercase">Free Popcorn</h4>
              <p className="text-[11px] text-[#7B5A58]">Complimentary Snacks</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

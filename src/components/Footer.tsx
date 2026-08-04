'use client';

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Heart, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenAuth: () => void;
}

export default function Footer({ onOpenAuth }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="relative bg-[#5A3B38] text-[#FAF0EE] pt-20 pb-12 mt-20 border-t-3 border-[#342224] overflow-hidden">
      
      {/* Editorial Burst Star CTA */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-16 relative z-10">
        <div className="bg-[#FAF0EE] text-[#342224] border-3 border-[#5A3B38] rounded-[36px] p-8 md:p-14 retro-shadow-lg relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 bg-[#D7B4A8] border border-[#5A3B38] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4 text-[#5A3B38]" /> Outdoor Cinema & Photobooth
          </div>

          <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-black text-[#5A3B38] tracking-tight mb-4">
            Join the Weekend.
          </h2>

          <p className="text-sm md:text-base text-[#7B5A58] max-w-xl mx-auto mb-8 font-medium">
            Reserve your seat online, upload your SadaPay transfer screenshot, and receive your official ticket pass.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onOpenAuth}
              className="bg-[#5A3B38] text-[#FAF0EE] border-2 border-[#5A3B38] hover:bg-[#7B5A58] px-8 py-4 rounded-full font-bold text-base flex items-center gap-2 retro-shadow hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center"
            >
              <span>Become a Member</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 relative z-10">
        
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#F2D8D5] text-[#5A3B38] font-serif-display font-black text-xl px-3 py-1 rounded-full border border-[#FAF0EE]">
              WKD
            </div>
            <span className="font-serif-display font-bold text-2xl tracking-tight text-[#F2D8D5]">
              The Weekend Club
            </span>
          </div>

          <p className="text-xs text-[#D7B4A8] leading-relaxed max-w-sm">
            An open community hub for outdoor cinema screenings, photobooth sessions, and authentic weekend gatherings.
          </p>

          {/* Social Icons inside Outlined Circles */}
          <div className="flex items-center gap-3 pt-2">
            {['Instagram', 'Substack', 'Spotify', 'Twitter'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 rounded-full border-2 border-[#D7B4A8] flex items-center justify-center text-xs font-bold hover:bg-[#F2D8D5] hover:text-[#5A3B38] transition-all"
                title={social}
              >
                {social[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 space-y-2 text-xs">
          <h4 className="font-serif-display text-sm font-bold text-[#F2D8D5] uppercase tracking-wider mb-3">
            Navigation
          </h4>
          <ul className="space-y-2 text-[#D7B4A8]">
            <li><a href="#events" className="hover:text-white hover:underline">Upcoming Event</a></li>
            <li><a href="#gallery" className="hover:text-white hover:underline">Event Poster & Gallery</a></li>
            <li><a href="#about" className="hover:text-white hover:underline">About Event</a></li>
            <li><a href="#contact" className="hover:text-white hover:underline">Contact & Inquiries</a></li>
          </ul>
        </div>

        {/* Newsletter Pill Input */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-serif-display text-sm font-bold text-[#F2D8D5] uppercase tracking-wider mb-2">
            Weekly Updates
          </h4>
          <p className="text-xs text-[#D7B4A8]">
            Get new event drops & timing announcements delivered to your inbox.
          </p>

          {subscribed ? (
            <div className="bg-[#059669] text-white p-3 rounded-full text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> You're on the list!
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex bg-[#FAF0EE] p-1.5 rounded-full border-2 border-[#D7B4A8]">
              <input
                type="email"
                required
                placeholder="your.email@domain.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-transparent text-[#342224] placeholder-[#7B5A58] text-xs px-4 py-2 w-full focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="bg-[#5A3B38] text-[#FAF0EE] px-5 py-2 rounded-full font-bold text-xs hover:bg-[#7B5A58] transition-all flex-shrink-0"
              >
                Join
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Massive Faded Background Typography */}
      <div className="text-center font-serif-display font-black text-6xl sm:text-8xl md:text-[140px] leading-none text-[#7B5A58]/20 select-none pointer-events-none tracking-tighter">
        WEEKEND CLUB
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 pt-6 border-t border-[#7B5A58]/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#D7B4A8]">
        <span>© {new Date().getFullYear()} The Weekend Club. All rights reserved.</span>
        <span className="mt-2 sm:mt-0 font-mono">70s Editorial Aesthetics</span>
      </div>
    </footer>
  );
}

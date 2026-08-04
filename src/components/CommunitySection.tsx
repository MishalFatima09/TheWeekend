'use client';

import React from 'react';
import { Quote, Heart, Camera, MessageSquare, Star } from 'lucide-react';

export default function CommunitySection() {
  const polaroids = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
      caption: '35mm Film Screening Crew • July 2026',
      quote: '"The retro cinema setup felt like stepping back into 1974. Loved the single-origin soda!"',
      author: 'Marcus & Elena',
      rotate: '-rotate-2'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop',
      caption: 'Riso Zine Workshop Session',
      quote: '"Printed my first 8-page zine in soy ink. The organizers were super friendly and patient."',
      author: 'Sarah Lin',
      rotate: 'rotate-3'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
      caption: 'Friday Vinyl Listening Lounge',
      quote: '"No phones, just spinning Motown records and drinking hot pour-overs. Highlight of my month."',
      author: 'Julian Vance',
      rotate: '-rotate-1'
    }
  ];

  return (
    <section id="community" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      
      {/* Section Title */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-[#D7B4A8] border border-[#5A3B38] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <Heart className="w-3.5 h-3.5 text-[#5A3B38]" /> Member Stories
        </div>
        <h2 className="font-serif-display text-4xl sm:text-5xl font-black text-[#5A3B38] tracking-tight">
          Polaroids & Sticky Notes
        </h2>
        <p className="text-[#7B5A58] font-medium text-sm mt-2">
          Snapshots and real quotes from our growing community of weekend creators.
        </p>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
        {polaroids.map((item) => (
          <div
            key={item.id}
            className={`bg-white border-3 border-[#5A3B38] rounded-2xl p-4 retro-shadow-lg transition-transform duration-300 hover:rotate-0 hover:scale-105 ${item.rotate}`}
          >
            {/* Image Box */}
            <div className="h-64 border-2 border-[#5A3B38] rounded-xl overflow-hidden bg-[#FAF0EE] mb-4">
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Handwritten Polaroid Caption */}
            <div className="text-center pb-2 border-b-2 border-dashed border-[#D7B4A8]">
              <span className="font-serif-display font-bold text-sm text-[#5A3B38]">
                {item.caption}
              </span>
            </div>

            {/* Sticky Note Quote */}
            <div className="mt-4 bg-[#FBE5E1] border-2 border-[#5A3B38] rounded-xl p-4 relative">
              <Quote className="w-5 h-5 text-[#5A3B38] opacity-50 mb-1" />
              <p className="text-xs text-[#342224] italic font-medium leading-relaxed">
                {item.quote}
              </p>
              <span className="block text-[11px] font-bold text-[#5A3B38] mt-2 text-right">
                — {item.author}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Community Stats Banner */}
      <div className="mt-16 bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[28px] p-8 retro-shadow flex flex-wrap items-center justify-around gap-6 text-center">
        <div>
          <span className="font-serif-display font-black text-3xl md:text-4xl text-[#5A3B38]">
            1,250+
          </span>
          <span className="block text-xs font-mono text-[#7B5A58] uppercase font-bold mt-1">
            Registered Members
          </span>
        </div>

        <div className="h-10 w-0.5 bg-[#D7B4A8] hidden sm:block"></div>

        <div>
          <span className="font-serif-display font-black text-3xl md:text-4xl text-[#5A3B38]">
            48
          </span>
          <span className="block text-xs font-mono text-[#7B5A58] uppercase font-bold mt-1">
            Workshops Hosted
          </span>
        </div>

        <div className="h-10 w-0.5 bg-[#D7B4A8] hidden sm:block"></div>

        <div>
          <span className="font-serif-display font-black text-3xl md:text-4xl text-[#5A3B38]">
            100%
          </span>
          <span className="block text-xs font-mono text-[#7B5A58] uppercase font-bold mt-1">
            Analog Good Vibes
          </span>
        </div>
      </div>
    </section>
  );
}

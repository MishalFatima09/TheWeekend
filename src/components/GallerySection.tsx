'use client';

import React from 'react';
import { Camera, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function GallerySection() {
  const galleryItems = [
    {
      id: 1,
      title: 'Sunday Outdoor Cinema & Photobooth',
      category: 'Aug 9 Event Poster',
      image: '/poster.jpeg',
      size: 'col-span-1 md:col-span-2'
    },
    {
      id: 2,
      title: 'Free Popcorn & Snacks',
      category: 'Movie Night',
      image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=800&auto=format&fit=crop',
      size: 'col-span-1'
    },
    {
      id: 3,
      title: 'Massive Outdoor SMD Display',
      category: 'Cinema Setup',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
      size: 'col-span-1'
    },
    {
      id: 4,
      title: 'Photobooth Fun & Keepsakes',
      category: 'Memories',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
      size: 'col-span-1 md:col-span-2'
    }
  ];

  return (
    <section id="gallery" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#5A3B38] text-[#FAF0EE] border border-[#5A3B38] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5 text-[#D7B4A8]" /> Event Gallery & Artwork
          </div>
          <h2 className="font-serif-display text-4xl font-black text-[#5A3B38] tracking-tight">
            Sunday Cinema Poster & Experience
          </h2>
        </div>
        <p className="text-xs font-mono text-[#7B5A58] uppercase font-bold mt-2 md:mt-0">
          Sunday Aug 9 @ La Kofe Cafe
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className={`relative rounded-3xl overflow-hidden border-3 border-[#5A3B38] retro-shadow group h-64 md:h-80 ${item.size}`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5A3B38]/90 via-[#5A3B38]/20 to-transparent p-6 flex flex-col justify-end">
              <span className="bg-[#D7B4A8] text-[#342224] border border-[#5A3B38] px-3 py-1 rounded-full text-[10px] font-bold w-max mb-1">
                {item.category}
              </span>
              <h3 className="font-serif-display text-xl font-bold text-[#FAF0EE]">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

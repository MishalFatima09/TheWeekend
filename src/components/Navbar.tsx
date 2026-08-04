'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, User, ShieldCheck, Ticket, LogOut, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentUser: any;
  onOpenAuth: (role?: 'admin' | 'member') => void;
  onLogout: () => void;
}

export default function Navbar({ currentUser, onOpenAuth, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-40 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <nav className="bg-[#F2D8D5] border-2 border-[#5A3B38] rounded-full px-4 md:px-6 py-3 retro-shadow flex items-center justify-between transition-all">
        
        {/* Brand Logo / Poster Tag */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#5A3B38] text-[#FAF0EE] font-serif-display font-black text-xl px-3 py-1 rounded-full border border-[#5A3B38] group-hover:rotate-3 transition-transform">
            WKD
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif-display font-bold text-lg text-[#5A3B38] tracking-tight">
              The Weekend Club
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#7B5A58] uppercase">
              Members Only
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 font-medium text-sm text-[#342224]">
          <Link href="/#events" className="hover:text-[#5A3B38] hover:underline underline-offset-4 decoration-2 transition-all">
            Events
          </Link>
          <Link href="/#gallery" className="hover:text-[#5A3B38] hover:underline underline-offset-4 decoration-2 transition-all">
            Gallery
          </Link>
          <Link href="/#about" className="hover:text-[#5A3B38] hover:underline underline-offset-4 decoration-2 transition-all">
            About
          </Link>
          <Link href="/#contact" className="hover:text-[#5A3B38] hover:underline underline-offset-4 decoration-2 transition-all">
            Contact
          </Link>
          <Link href="/my-tickets" className="hover:text-[#5A3B38] font-bold text-[#5A3B38] flex items-center gap-1 hover:underline underline-offset-4 decoration-2 transition-all">
            <Ticket className="w-4 h-4" /> My Tickets
          </Link>
          {currentUser && currentUser.role === 'admin' && (
            <Link href="/admin" className="bg-[#D97706] text-white px-3 py-1 rounded-full text-xs font-bold border border-[#5A3B38] flex items-center gap-1 hover:rotate-2 transition-transform">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
            </Link>
          )}
        </div>

        {/* User Account / Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5A3B38] bg-[#D7B4A8] px-3 py-1 rounded-full border border-[#5A3B38]">
                {currentUser.name}
              </span>
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-1.5 rounded-full border-2 border-[#5A3B38] hover:bg-[#5A3B38] hover:text-[#FAF0EE] text-[#5A3B38] transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('member')}
                className="bg-[#5A3B38] text-[#FAF0EE] hover:bg-[#7B5A58] border-2 border-[#5A3B38] px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Member Sign In
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#5A3B38] rounded-full border-2 border-[#5A3B38]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-3xl p-6 retro-shadow flex flex-col gap-4 text-center">
          <Link
            href="/#events"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-[#342224] py-2 border-b border-[#D7B4A8]"
          >
            Events
          </Link>
          <Link
            href="/#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-[#342224] py-2 border-b border-[#D7B4A8]"
          >
            Gallery
          </Link>
          <Link
            href="/my-tickets"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-[#5A3B38] py-2 border-b border-[#D7B4A8] flex items-center justify-center gap-1.5"
          >
            <Ticket className="w-4 h-4" /> My Tickets
          </Link>
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-[#342224] py-2 border-b border-[#D7B4A8]"
          >
            About
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="font-bold text-[#342224] py-2"
          >
            Contact
          </Link>

          {currentUser ? (
            <div className="flex flex-col gap-2 pt-2">
              {currentUser.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#D97706] text-white py-2 rounded-full font-bold border-2 border-[#5A3B38] flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="text-xs text-[#7B5A58] underline py-1 cursor-pointer"
              >
                Log Out ({currentUser.name})
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => { onOpenAuth('member'); setMobileMenuOpen(false); }}
                className="bg-[#5A3B38] text-[#FAF0EE] border-2 border-[#5A3B38] py-2 rounded-full font-bold"
              >
                Member Sign In
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

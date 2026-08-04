'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EventsSection from '@/components/EventsSection';
import GallerySection from '@/components/GallerySection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialRole, setInitialRole] = useState<'admin' | 'member'>('member');
  const [triggerRegisterSignal, setTriggerRegisterSignal] = useState(0);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Auth check error:', err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleOpenAuth = (role: 'admin' | 'member' = 'member') => {
    setInitialRole(role);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
  };

  const handleTriggerRegister = () => {
    setTriggerRegisterSignal((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F2D8D5] text-[#342224]">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <Hero onRegisterClick={handleTriggerRegister} />

      {/* Events Grid & Registration */}
      <EventsSection
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuth('member')}
        triggerRegisterSignal={triggerRegisterSignal}
      />

      {/* Event Artwork Gallery */}
      <GallerySection />

      {/* About Section */}
      <AboutSection />

      {/* Contact & Inquiries */}
      <ContactSection />

      {/* Editorial Footer */}
      <Footer onOpenAuth={() => handleOpenAuth('member')} />

      {/* Auth Modal (Login / Sign-up) */}
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={(user) => setCurrentUser(user)}
          initialRole={initialRole}
        />
      )}
    </main>
  );
}

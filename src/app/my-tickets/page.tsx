'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TicketPassModal from '@/components/TicketPassModal';
import AuthModal from '@/components/AuthModal';
import { Ticket, ArrowLeft, Calendar, MapPin, User, Printer, Sparkles, Clock3, CheckCircle2, AlertCircle, ImageIcon, Search } from 'lucide-react';

export default function MyTicketsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setSearchQuery(data.user.email);
        fetchMyTickets(data.user.email);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMyTickets = async (query: string) => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      setHasSearched(true);
      const res = await fetch(`/api/registrations?email=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMyTickets(searchQuery);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    setRegistrations([]);
    setHasSearched(false);
    setSearchQuery('');
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F2D8D5] text-[#342224]">
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        {/* Header Ribbon */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2.5 bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full hover:bg-[#5A3B38] hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif-display text-3xl md:text-4xl font-black text-[#5A3B38]">
              My Ticket Passes & Verification
            </h1>
            <p className="text-xs text-[#7B5A58] font-mono">
              Search your tickets by Email or Ticket Code to check SadaPay payment status & print entry stubs.
            </p>
          </div>
        </div>

        {/* Email / Ticket Search Bar */}
        <div className="bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[28px] p-6 md:p-8 retro-shadow mb-8 max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <label className="block text-xs font-bold text-[#5A3B38] font-mono uppercase tracking-wider">
              🔍 Search Your Ticket Pass (No Login Required)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder="Enter your Email Address (e.g. shajiaazhar8@gmail.com) or Ticket Code"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-3 pl-10 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
                />
                <Search className="w-4 h-4 text-[#5A3B38] absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="bg-[#5A3B38] text-[#FAF0EE] border-2 border-[#5A3B38] hover:bg-[#7B5A58] px-6 py-3 rounded-full font-bold text-xs retro-shadow transition-all cursor-pointer"
              >
                Search Ticket
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-16 font-serif-display text-xl text-[#5A3B38]">
            Searching ticket passes...
          </div>
        ) : !hasSearched ? (
          <div className="bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[32px] p-12 text-center max-w-md mx-auto retro-shadow">
            <Ticket className="w-12 h-12 text-[#5A3B38] mx-auto mb-4" />
            <h2 className="font-serif-display font-bold text-2xl text-[#5A3B38]">
              Find Your Ticket Pass
            </h2>
            <p className="text-xs text-[#7B5A58] mt-2">
              Type your email address or reference code above to view your registration status and printable ticket pass.
            </p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[32px] p-12 text-center max-w-lg mx-auto retro-shadow">
            <AlertCircle className="w-10 h-10 text-[#D97706] mx-auto mb-3" />
            <h3 className="font-serif-display font-bold text-xl text-[#5A3B38]">
              No Tickets Found for "{searchQuery}"
            </h3>
            <p className="text-xs text-[#7B5A58] mt-1 mb-6">
              Make sure you entered the same email address used when transferring payment and registering.
            </p>
            <Link
              href="/#events"
              className="bg-[#5A3B38] text-[#FAF0EE] border-2 border-[#5A3B38] px-6 py-3 rounded-full font-bold text-xs retro-shadow"
            >
              Register & Reserve Seat
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((reg) => {
              const isApproved = reg.payment_status === 'approved' || reg.status === 'confirmed';
              const isPending = reg.payment_status === 'pending' || reg.status === 'pending_approval';

              return (
                <div
                  key={reg.id}
                  className="bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-3xl p-6 retro-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#5A3B38] mb-4">
                      <span className="font-mono text-xs font-bold text-[#5A3B38] bg-[#D7B4A8] border border-[#5A3B38] px-2.5 py-0.5 rounded-full">
                        {reg.ticket_code}
                      </span>
                      
                      {isApproved ? (
                        <span className="text-[10px] font-mono font-bold uppercase text-[#059669] flex items-center gap-1 bg-[#D1FAE5] border border-[#059669] px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold uppercase text-[#D97706] flex items-center gap-1 bg-[#FEF3C7] border border-[#D97706] px-2 py-0.5 rounded-full">
                          <Clock3 className="w-3.5 h-3.5" /> Pending Verification
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif-display font-black text-xl text-[#5A3B38] mb-2">
                      {reg.event_title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-[#342224] mb-4 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#5A3B38]" /> {reg.event_date} ({reg.event_time})
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#5A3B38]" /> {reg.event_location}
                      </div>
                      <div className="flex items-center gap-2 text-[#7B5A58]">
                        <User className="w-4 h-4 text-[#5A3B38]" /> Attendee: <strong className="text-[#342224]">{reg.attendee_name}</strong> ({reg.guest_count} seat(s))
                      </div>
                    </div>

                    {/* Screenshot Status Banner */}
                    {reg.payment_screenshot && (
                      <div className="bg-[#F2D8D5] border border-[#5A3B38] p-2.5 rounded-2xl mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[11px] text-[#342224] font-bold">
                          <ImageIcon className="w-4 h-4 text-[#5A3B38]" /> Payment Receipt SS
                        </div>
                        <button
                          onClick={() => setPreviewScreenshot(reg.payment_screenshot)}
                          className="text-[10px] font-bold underline text-[#5A3B38]"
                        >
                          View SS
                        </button>
                      </div>
                    )}
                  </div>

                  {isApproved ? (
                    <button
                      onClick={() => setSelectedTicket(reg)}
                      className="w-full bg-[#D7B4A8] border-2 border-[#5A3B38] hover:bg-[#5A3B38] hover:text-[#FAF0EE] text-[#342224] py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" /> View & Print Ticket Pass
                    </button>
                  ) : (
                    <div className="bg-[#FEF3C7] border-2 border-[#D97706] text-[#92400E] p-3 rounded-2xl text-center text-xs font-bold mt-2">
                      ⏳ SadaPay payment screenshot is under review by organizers. Ticket pass will unlock here once approved!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Screenshot Preview Modal */}
      {previewScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-3xl p-4 max-w-lg w-full">
            <button
              onClick={() => setPreviewScreenshot(null)}
              className="absolute top-2 right-2 bg-[#F2D8D5] border border-[#5A3B38] p-1.5 rounded-full text-xs font-bold"
            >
              ✕
            </button>
            <h4 className="font-serif-display font-bold text-sm text-[#5A3B38] mb-2 text-center">Payment Screenshot Preview</h4>
            <img src={previewScreenshot} alt="Payment SS" className="w-full max-h-[70vh] object-contain rounded-xl border border-[#5A3B38]" />
          </div>
        </div>
      )}

      {selectedTicket && (
        <TicketPassModal
          registration={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setSearchQuery(user.email);
            fetchMyTickets(user.email);
          }}
        />
      )}

      <Footer onOpenAuth={() => setAuthModalOpen(true)} />
    </main>
  );
}

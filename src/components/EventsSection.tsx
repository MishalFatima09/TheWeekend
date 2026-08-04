'use client';

import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, MapPin, Sparkles, AlertCircle, X, Check, Upload, CreditCard, Copy, CheckCircle2, Clock3 } from 'lucide-react';
import TicketPassModal from './TicketPassModal';
import confetti from 'canvas-confetti';

interface EventsSectionProps {
  currentUser: any;
  onOpenAuth: () => void;
  triggerRegisterSignal?: number;
}

export default function EventsSection({ currentUser, onOpenAuth, triggerRegisterSignal }: EventsSectionProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Registration Modal State
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [paymentScreenshot, setPaymentScreenshot] = useState<string>('');
  const [paymentRef, setPaymentRef] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [regError, setRegError] = useState('');
  const [copiedAcc, setCopiedAcc] = useState(false);
  
  // Pending Confirmation Modal State
  const [pendingRegistration, setPendingRegistration] = useState<any | null>(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState<any | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/events', window.location.origin);
      if (selectedCategory !== 'All') url.searchParams.append('category', selectedCategory);
      if (searchQuery) url.searchParams.append('search', searchQuery);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, searchQuery]);

  // Open registration modal when signal is received
  useEffect(() => {
    if (triggerRegisterSignal && triggerRegisterSignal > 0 && events.length > 0) {
      const activeEvent = events[0];
      if (activeEvent && activeEvent.status !== 'full' && activeEvent.status !== 'cancelled') {
        handleOpenRegisterModal(activeEvent);
      }
    }
  }, [triggerRegisterSignal, events]);

  useEffect(() => {
    if (currentUser && selectedEvent) {
      setAttendeeName(currentUser.name || '');
      setAttendeeEmail(currentUser.email || '');
      setAttendeePhone(currentUser.phone || '');
    }
  }, [currentUser, selectedEvent]);

  const handleOpenRegisterModal = (event: any) => {
    if (event.status === 'full' || event.status === 'cancelled') return;
    setSelectedEvent(event);
    setRegError('');
    setPaymentScreenshot('');
    setPaymentRef('');
    if (currentUser) {
      setAttendeeName(currentUser.name || '');
      setAttendeeEmail(currentUser.email || '');
      setAttendeePhone(currentUser.phone || '');
    } else {
      setAttendeeName('');
      setAttendeeEmail('');
      setAttendeePhone('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setRegError('Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPaymentScreenshot(reader.result as string);
      setRegError('');
    };
    reader.readAsDataURL(file);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('03254204200');
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    if (!paymentScreenshot) {
      setRegError('Please upload your payment transfer screenshot to proceed.');
      return;
    }

    try {
      setSubmitting(true);
      setRegError('');

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEvent.id,
          user_id: currentUser ? currentUser.id : null,
          attendee_name: attendeeName,
          attendee_email: attendeeEmail,
          attendee_phone: attendeePhone,
          guest_count: parseInt(guestCount || '1'),
          payment_screenshot: paymentScreenshot,
          payment_ref: paymentRef,
          notes
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setRegError(data.error || 'Failed to submit registration.');
        return;
      }

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setPendingRegistration(data.registration);
      setSelectedEvent(null);
      fetchEvents();
    } catch (err: any) {
      setRegError(err.message || 'Network error, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="events" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#5A3B38] text-[#FAF0EE] border border-[#5A3B38] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D7B4A8]" />
            Upcoming Event Schedule
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl font-black text-[#5A3B38] tracking-tight">
            Sunday Outdoor Cinema & Photobooth
          </h2>
          <p className="text-[#7B5A58] font-medium text-sm mt-1">
            Reserve your pass online, transfer via SadaPay, and upload your screenshot for fast entry verification.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search events, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] text-[#342224] placeholder-[#7B5A58] rounded-full px-4 py-2.5 pl-10 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
          />
          <Search className="w-4 h-4 text-[#5A3B38] absolute left-3.5 top-3.5" />
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-16 font-serif-display text-[#5A3B38] text-xl">
          Loading upcoming event...
        </div>
      ) : events.length === 0 ? (
        <div className="bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-3xl p-12 text-center text-[#7B5A58] retro-shadow">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-[#5A3B38]" />
          <h3 className="font-serif-display font-bold text-xl text-[#5A3B38]">No events found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const isFull = event.status === 'full' || event.registered_count >= event.capacity;

            return (
              <div
                key={event.id}
                className="bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[28px] p-5 flex flex-col justify-between retro-shadow hover:scale-[1.02] transition-all duration-200 relative group col-span-1 md:col-span-2 lg:col-span-3 max-w-3xl mx-auto w-full"
              >
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  
                  {/* Poster Header Image */}
                  <div className="md:col-span-5 relative h-64 md:h-80 rounded-2xl overflow-hidden border-2 border-[#5A3B38] bg-[#D7B4A8]">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-[#5A3B38] retro-shadow-sm bg-[#D97706] text-white">
                        {event.badge_text || 'UPCOMING'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="bg-[#5A3B38] text-[#FAF0EE] border border-[#5A3B38] px-3 py-1 rounded-full text-xs font-bold">
                        Ticket: {event.ticket_price || 'Rs. 1,500'}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#7B5A58] font-bold">
                      <span className="flex items-center gap-1 bg-[#F2D8D5] border border-[#5A3B38] px-2.5 py-0.5 rounded-full">
                        <Calendar className="w-3.5 h-3.5 text-[#5A3B38]" /> {event.date}
                      </span>
                      <span className="flex items-center gap-1 bg-[#F2D8D5] border border-[#5A3B38] px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-[#5A3B38]" /> {event.time}
                      </span>
                    </div>

                    <h3 className="font-serif-display font-black text-2xl md:text-3xl text-[#5A3B38] leading-tight">
                      {event.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#342224] leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-[#5A3B38] font-bold">
                      <MapPin className="w-4 h-4 text-[#5A3B38] flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 border-t-2 border-dashed border-[#5A3B38]">
                      <button
                        onClick={() => handleOpenRegisterModal(event)}
                        disabled={isFull}
                        className="w-full py-3.5 rounded-full font-bold text-sm bg-[#5A3B38] text-[#FAF0EE] border-2 border-[#5A3B38] hover:bg-[#7B5A58] retro-shadow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" /> Register & Upload Payment Screenshot
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Registration & Payment Upload Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[32px] p-6 md:p-8 retro-shadow-lg max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 bg-[#F2D8D5] border-2 border-[#5A3B38] text-[#5A3B38] p-2 rounded-full hover:rotate-90 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7B5A58] font-bold">
                Seat Registration & Payment
              </span>
              <h3 className="font-serif-display text-2xl font-black text-[#5A3B38] mt-0.5">
                {selectedEvent.title}
              </h3>
              <p className="text-xs text-[#7B5A58] mt-0.5 font-mono">
                📅 {selectedEvent.date} ({selectedEvent.time})
              </p>
            </div>

            {/* Official Payment Bank Details Box */}
            <div className="bg-[#F2D8D5] border-2 border-[#5A3B38] rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between border-b border-[#5A3B38] pb-2 mb-3">
                <span className="text-xs font-bold text-[#5A3B38] uppercase font-mono flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" /> Official Payment Transfer Details
                </span>
                <span className="bg-[#5A3B38] text-[#FAF0EE] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  Rs. 1,500 / seat
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#342224]">
                <div className="flex justify-between">
                  <span className="text-[#7B5A58]">Bank Name:</span>
                  <span className="font-bold">SadaPay</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#7B5A58]">Account Title:</span>
                  <span className="font-bold">Sabahat Batool</span>
                </div>

                <div className="flex justify-between items-center bg-[#FAF0EE] p-2 rounded-xl border border-[#5A3B38] mt-1">
                  <div>
                    <span className="text-[10px] text-[#7B5A58] block uppercase font-mono">Account / Mobile Number</span>
                    <span className="font-mono font-bold text-sm text-[#5A3B38]">03254204200</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="bg-[#5A3B38] text-[#FAF0EE] px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedAcc ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    {copiedAcc ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-[#5A3B38] font-bold text-center">
                Total Payable: <span className="text-sm font-black underline">Rs. {1500 * parseInt(guestCount || '1')}</span> ({guestCount} seat(s))
              </div>
            </div>

            {regError && (
              <div className="bg-[#FEE2E2] border-2 border-[#DC2626] text-[#991B1B] p-3 rounded-2xl text-xs font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5A3B38] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-2.5 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5A3B38] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-2.5 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A3B38] mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={attendeePhone}
                    onChange={(e) => setAttendeePhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-2.5 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3B38] mb-1">
                  Number of Seats *
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-2.5 text-xs text-[#342224] font-bold focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
                >
                  <option value="1">1 Seat (Rs. 1,500)</option>
                  <option value="2">2 Seats (Rs. 3,000)</option>
                  <option value="3">3 Seats (Rs. 4,500)</option>
                  <option value="4">4 Seats (Rs. 6,000)</option>
                </select>
              </div>

              {/* Payment Screenshot Upload Field */}
              <div>
                <label className="block text-xs font-bold text-[#5A3B38] mb-1">
                  Upload SadaPay Payment Screenshot (SS) *
                </label>
                <div className="relative border-2 border-dashed border-[#5A3B38] bg-[#F2D8D5] rounded-2xl p-4 text-center cursor-pointer hover:bg-[#D7B4A8] transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {paymentScreenshot ? (
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={paymentScreenshot}
                        alt="Screenshot Preview"
                        className="w-16 h-16 object-cover rounded-xl border-2 border-[#5A3B38]"
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Screenshot Attached
                        </span>
                        <span className="text-[10px] text-[#7B5A58] block">Click to change image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-[#5A3B38]">
                      <Upload className="w-6 h-6" />
                      <span className="text-xs font-bold">Click or drag your payment screenshot here</span>
                      <span className="text-[10px] text-[#7B5A58]">Supports PNG, JPG, JPEG (Max 5MB)</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3B38] mb-1">
                  Sender Name or Transaction Ref / ID (Optional)
                </label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g. Sabahat / Ref # 81928371"
                  className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-2.5 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#5A3B38] text-[#FAF0EE] border-2 border-[#5A3B38] hover:bg-[#7B5A58] py-3.5 rounded-full font-bold text-sm retro-shadow transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Submitting Receipt...' : 'Submit Registration & Payment Proof'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PENDING APPROVAL CONFIRMATION MODAL */}
      {pendingRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[32px] p-6 md:p-8 retro-shadow-lg text-center">
            
            <div className="w-14 h-14 bg-[#D97706] text-white rounded-full mx-auto flex items-center justify-center mb-3 border-2 border-[#5A3B38] retro-shadow-sm">
              <Clock3 className="w-8 h-8" />
            </div>

            <h3 className="font-serif-display text-2xl font-black text-[#5A3B38]">
              Payment Screenshot Submitted!
            </h3>

            <p className="text-xs text-[#342224] leading-relaxed my-3 font-medium">
              Thank you, <strong className="text-[#5A3B38]">{pendingRegistration.attendee_name}</strong>! Your payment screenshot has been sent to our organizers for SadaPay verification.
            </p>

            <div className="bg-[#F2D8D5] border border-[#5A3B38] rounded-2xl p-3 text-xs text-[#7B5A58] mb-6 space-y-1">
              <div>Reference Code: <strong className="font-mono text-[#5A3B38]">{pendingRegistration.ticket_code}</strong></div>
              <div>Seats Reserved: <strong>{pendingRegistration.guest_count} spot(s)</strong></div>
              <div className="text-[11px] text-[#059669] font-bold pt-1">
                ✓ Once verified, your official ticket pass will unlock in "My Tickets"!
              </div>
            </div>

            <button
              onClick={() => setPendingRegistration(null)}
              className="w-full bg-[#5A3B38] text-[#FAF0EE] border-2 border-[#5A3B38] py-3 rounded-full font-bold text-xs retro-shadow hover:scale-105 transition-all cursor-pointer"
            >
              Done / Return to Home
            </button>
          </div>
        </div>
      )}

      {confirmedRegistration && (
        <TicketPassModal
          registration={confirmedRegistration}
          onClose={() => setConfirmedRegistration(null)}
        />
      )}
    </section>
  );
}

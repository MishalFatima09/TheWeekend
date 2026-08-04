'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { 
  ShieldCheck, Plus, Edit2, Trash2, Users, Calendar, MapPin, 
  MessageSquare, CheckCircle2, AlertCircle, ArrowLeft, X, Sparkles, 
  CreditCard, ImageIcon, Check, XCircle, Clock3 
} from 'lucide-react';

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'payments' | 'events' | 'inquiries'>('payments');

  // Screenshot Preview Modal
  const [previewSS, setPreviewSS] = useState<string | null>(null);

  // Event Modal Form state (Create/Edit)
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Movie Night');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ticketPrice, setTicketPrice] = useState('Rs. 1,500');
  const [paymentInfo, setPaymentInfo] = useState('');
  const [capacity, setCapacity] = useState('50');
  const [badgeText, setBadgeText] = useState('NEW');
  const [eventStatus, setEventStatus] = useState('upcoming');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Registration Attendees Modal View
  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState<any | null>(null);
  const [attendeesList, setAttendeesList] = useState<any[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        if (data.user.role === 'admin') {
          fetchEvents();
          fetchInquiries();
          fetchPendingPayments();
        }
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.success) setEvents(data.events);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) setInquiries(data.inquiries);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      if (data.success) {
        setPendingRegistrations(data.registrations);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleApprovePayment = async (regId: number, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: regId, action })
      });
      const data = await res.json();
      if (data.success) {
        fetchPendingPayments();
        fetchEvents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingEventId(null);
    setTitle('');
    setCategory('Movie Night');
    setDate('Sunday, Aug 9, 2026');
    setTime('7:00 PM Onwards');
    setLocation('La Kofe Cafe, Citrus City');
    setDescription('');
    setImageUrl('/poster.jpeg');
    setTicketPrice('Rs. 1,500');
    setPaymentInfo('Bank: SadaPay\nAccount Title: Sabahat Batool\nAccount Number: 03254204200');
    setCapacity('50');
    setBadgeText('NEW');
    setEventStatus('upcoming');
    setFormError('');
    setEventModalOpen(true);
  };

  const handleOpenEditModal = (ev: any) => {
    setEditingEventId(ev.id);
    setTitle(ev.title);
    setCategory(ev.category);
    setDate(ev.date);
    setTime(ev.time);
    setLocation(ev.location);
    setDescription(ev.description);
    setImageUrl(ev.image_url);
    setTicketPrice(ev.ticket_price || 'Rs. 1,500');
    setPaymentInfo(ev.payment_info || '');
    setCapacity(ev.capacity.toString());
    setBadgeText(ev.badge_text || 'NEW');
    setEventStatus(ev.status);
    setFormError('');
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFormError('');

      const method = editingEventId ? 'PUT' : 'POST';
      const endpoint = editingEventId ? `/api/events/${editingEventId}` : '/api/events';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          date,
          time,
          location,
          description,
          image_url: imageUrl,
          ticket_price: ticketPrice,
          payment_info: paymentInfo,
          capacity: parseInt(capacity),
          badge_text: badgeText,
          status: eventStatus
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || 'Failed to save event.');
        return;
      }

      setEventModalOpen(false);
      fetchEvents();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event and its registrations?')) return;
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (e) {
      console.error(e);
    }
  };

  const handleViewAttendees = async (ev: any) => {
    setSelectedEventForAttendees(ev);
    setAttendeeModalOpen(true);
    setLoadingAttendees(true);
    try {
      const res = await fetch(`/api/registrations?event_id=${ev.id}`);
      const data = await res.json();
      if (data.success) {
        setAttendeesList(data.registrations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const pendingCount = pendingRegistrations.filter(r => r.payment_status === 'pending').length;

  return (
    <main className="min-h-screen flex flex-col bg-[#F2D8D5] text-[#342224]">
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={async () => {
          await fetch('/api/auth/logout', { method: 'POST' });
          setCurrentUser(null);
        }}
      />

      <div className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-10 w-full">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2.5 bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full hover:bg-[#5A3B38] hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#D97706] text-white border border-[#5A3B38] px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Private Organizer Portal
              </div>
              <h1 className="font-serif-display text-3xl md:text-4xl font-black text-[#5A3B38]">
                Admin Event Dashboard
              </h1>
            </div>
          </div>

          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={handleOpenCreateModal}
              className="bg-[#5A3B38] text-[#FAF0EE] border-2 border-[#5A3B38] hover:bg-[#7B5A58] px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 retro-shadow hover:scale-105 transition-all self-start md:self-auto"
            >
              <Plus className="w-4 h-4" /> Create New Event
            </button>
          )}
        </div>

        {!currentUser || currentUser.role !== 'admin' ? (
          <div className="bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[32px] p-12 text-center max-w-md mx-auto retro-shadow">
            <ShieldCheck className="w-12 h-12 text-[#5A3B38] mx-auto mb-4" />
            <h2 className="font-serif-display font-bold text-2xl text-[#5A3B38]">
              Organizer Access Required
            </h2>
            <p className="text-xs text-[#7B5A58] mt-2 mb-6">
              Please sign in with your organizer admin account to verify SadaPay payments and manage events.
            </p>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-[#D97706] text-white border-2 border-[#5A3B38] px-8 py-3.5 rounded-full font-bold text-xs retro-shadow hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4" /> Sign In as Organizer Admin
            </button>
          </div>
        ) : (
          <div>
            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-3 mb-8 border-b-2 border-[#5A3B38] pb-4">
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-5 py-2 rounded-full font-bold text-xs border-2 transition-all flex items-center gap-2 ${
                  activeTab === 'payments'
                    ? 'bg-[#5A3B38] text-[#FAF0EE] border-[#5A3B38] retro-shadow-sm'
                    : 'bg-[#FAF0EE] text-[#342224] border-[#5A3B38]'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Payment Screenshot Approvals ({pendingCount} Pending)
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`px-5 py-2 rounded-full font-bold text-xs border-2 transition-all flex items-center gap-2 ${
                  activeTab === 'events'
                    ? 'bg-[#5A3B38] text-[#FAF0EE] border-[#5A3B38] retro-shadow-sm'
                    : 'bg-[#FAF0EE] text-[#342224] border-[#5A3B38]'
                }`}
              >
                <Calendar className="w-4 h-4 text-[#FAF0EE]" /> Manage Events ({events.length})
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-5 py-2 rounded-full font-bold text-xs border-2 transition-all flex items-center gap-2 ${
                  activeTab === 'inquiries'
                    ? 'bg-[#5A3B38] text-[#FAF0EE] border-[#5A3B38] retro-shadow-sm'
                    : 'bg-[#FAF0EE] text-[#342224] border-[#5A3B38]'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Contact Inquiries ({inquiries.length})
              </button>
            </div>

            {/* TAB 1: PAYMENT SCREENSHOT APPROVALS */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                {pendingRegistrations.length === 0 ? (
                  <div className="bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-3xl p-12 text-center text-[#7B5A58] retro-shadow">
                    <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-[#059669]" />
                    <h3 className="font-serif-display font-bold text-xl text-[#5A3B38]">No Pending Payments</h3>
                    <p className="text-xs mt-1">All SadaPay transfer screenshots have been processed.</p>
                  </div>
                ) : (
                  pendingRegistrations.map((reg) => {
                    const isPending = reg.payment_status === 'pending';

                    return (
                      <div
                        key={reg.id}
                        className={`bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-3xl p-6 retro-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                          isPending ? 'border-l-8 border-l-[#D97706]' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Payment Screenshot Thumbnail */}
                          {reg.payment_screenshot ? (
                            <div 
                              onClick={() => setPreviewSS(reg.payment_screenshot)}
                              className="relative w-20 h-24 rounded-2xl border-2 border-[#5A3B38] overflow-hidden bg-black/10 cursor-pointer group flex-shrink-0"
                            >
                              <img src={reg.payment_screenshot} alt="SS" className="w-full h-full object-cover group-hover:opacity-80" />
                              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                Preview
                              </div>
                            </div>
                          ) : (
                            <div className="w-20 h-24 rounded-2xl border-2 border-[#5A3B38] bg-[#D7B4A8] flex items-center justify-center text-xs font-bold text-[#5A3B38] flex-shrink-0">
                              No SS
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#5A3B38] bg-[#D7B4A8] border border-[#5A3B38] px-2.5 py-0.5 rounded-full">
                                {reg.ticket_code}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border border-[#5A3B38] ${
                                reg.payment_status === 'approved'
                                  ? 'bg-[#059669] text-white'
                                  : reg.payment_status === 'rejected'
                                  ? 'bg-[#DC2626] text-white'
                                  : 'bg-[#D97706] text-white'
                              }`}>
                                {reg.payment_status === 'pending' ? '⏳ Pending SadaPay Verification' : reg.payment_status}
                              </span>
                            </div>

                            <h3 className="font-serif-display font-black text-xl text-[#5A3B38]">
                              {reg.attendee_name}
                            </h3>

                            <div className="text-xs text-[#7B5A58] space-y-0.5 font-mono">
                              <div>📧 {reg.attendee_email} • 📞 {reg.attendee_phone}</div>
                              <div>Event: <strong className="text-[#342224]">{reg.event_title}</strong></div>
                              <div>Seats: <strong>{reg.guest_count} spot(s)</strong> • Amount: <strong className="text-[#5A3B38]">Rs. {1500 * reg.guest_count}</strong></div>
                              {reg.payment_ref && <div>Sender / Ref ID: <strong className="text-[#342224]">{reg.payment_ref}</strong></div>}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#D7B4A8]">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => handleApprovePayment(reg.id, 'approve')}
                                className="flex-1 md:flex-initial bg-[#059669] text-white border-2 border-[#5A3B38] hover:bg-[#047857] px-5 py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 retro-shadow-sm transition-all"
                              >
                                <Check className="w-4 h-4" /> Approve & Issue Ticket
                              </button>
                              
                              <button
                                onClick={() => handleApprovePayment(reg.id, 'reject')}
                                className="p-2.5 bg-[#FEE2E2] border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white rounded-full transition-all"
                                title="Reject Payment"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-bold font-mono text-[#059669] bg-[#D1FAE5] border border-[#059669] px-4 py-1.5 rounded-full">
                              ✓ Ticket Pass Issued
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: EVENTS MANAGEMENT */}
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 gap-6">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-3xl p-6 retro-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={ev.image_url}
                        alt={ev.title}
                        className="w-24 h-24 rounded-2xl border-2 border-[#5A3B38] object-cover flex-shrink-0 bg-[#D7B4A8]"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#D7B4A8] text-[#342224] border border-[#5A3B38] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            {ev.category}
                          </span>
                          <span className="bg-[#5A3B38] text-[#FAF0EE] border border-[#5A3B38] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            Price: {ev.ticket_price || 'Rs. 1,500'}
                          </span>
                        </div>
                        <h3 className="font-serif-display font-black text-xl text-[#5A3B38]">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-[#7B5A58] mt-1 font-mono">
                          📅 {ev.date} • 🕒 {ev.time} • 📍 {ev.location}
                        </p>
                        <p className="text-xs font-bold text-[#5A3B38] mt-1">
                          Attendees Confirmed: {ev.registered_count} / {ev.capacity}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                      <button
                        onClick={() => handleViewAttendees(ev)}
                        className="flex-1 md:flex-initial bg-[#D7B4A8] border-2 border-[#5A3B38] hover:bg-[#5A3B38] hover:text-[#FAF0EE] text-[#342224] px-4 py-2 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Users className="w-3.5 h-3.5" /> View Roster ({ev.registered_count})
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(ev)}
                        className="p-2 bg-[#FAF0EE] border-2 border-[#5A3B38] text-[#5A3B38] hover:bg-[#5A3B38] hover:text-white rounded-full transition-all"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-2 bg-[#FEE2E2] border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white rounded-full transition-all"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="grid grid-cols-1 gap-4">
                {inquiries.length === 0 ? (
                  <div className="bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-3xl p-8 text-center text-[#7B5A58]">
                    No inquiries received yet.
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-3xl p-6 retro-shadow flex flex-col md:flex-row justify-between items-start gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border border-[#5A3B38] ${
                            inq.status === 'replied' ? 'bg-[#059669] text-white' : 'bg-[#D97706] text-white'
                          }`}>
                            {inq.status}
                          </span>
                          <span className="text-xs font-bold text-[#5A3B38]">
                            {inq.name} ({inq.email})
                          </span>
                        </div>
                        <h4 className="font-serif-display font-bold text-base text-[#5A3B38]">
                          {inq.subject}
                        </h4>
                        <p className="text-xs text-[#342224] mt-1 bg-[#F2D8D5] p-3 rounded-xl border border-[#5A3B38]">
                          "{inq.message}"
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        )}

      </div>

      {/* SCREENSHOT PREVIEW MODAL */}
      {previewSS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-3xl p-6 max-w-lg w-full">
            <button
              onClick={() => setPreviewSS(null)}
              className="absolute top-4 right-4 bg-[#F2D8D5] border border-[#5A3B38] p-1.5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-serif-display font-bold text-lg text-[#5A3B38] mb-3">SadaPay Transfer Screenshot</h4>
            <img src={previewSS} alt="SadaPay SS" className="w-full max-h-[70vh] object-contain rounded-xl border-2 border-[#5A3B38]" />
          </div>
        </div>
      )}

      {/* VIEW ATTENDEES MODAL */}
      {attendeeModalOpen && selectedEventForAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[32px] p-6 md:p-8 retro-shadow-lg max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setAttendeeModalOpen(false)}
              className="absolute top-4 right-4 bg-[#F2D8D5] border-2 border-[#5A3B38] text-[#5A3B38] p-2 rounded-full hover:rotate-90 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-display text-2xl font-black text-[#5A3B38] mb-1">
              Confirmed Roster List
            </h3>
            <p className="text-xs text-[#7B5A58] font-mono mb-6">
              Event: <span className="font-bold text-[#342224]">{selectedEventForAttendees.title}</span> ({selectedEventForAttendees.registered_count} seats confirmed)
            </p>

            {loadingAttendees ? (
              <div className="text-center py-8 font-serif-display text-[#5A3B38]">Loading roster...</div>
            ) : attendeesList.length === 0 ? (
              <div className="text-center py-8 text-[#7B5A58] text-xs">No confirmed registrations yet.</div>
            ) : (
              <div className="space-y-3">
                {attendeesList.map((att) => (
                  <div
                    key={att.id}
                    className="bg-[#F2D8D5] border-2 border-[#5A3B38] rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-sm text-[#5A3B38]">{att.attendee_name}</span>
                      <div className="text-xs text-[#7B5A58] flex gap-3 font-mono mt-0.5">
                        <span>📧 {att.attendee_email}</span>
                        <span>📞 {att.attendee_phone}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="bg-[#5A3B38] text-[#FAF0EE] px-3 py-1 rounded-full text-xs font-bold">
                        {att.guest_count} Seat(s)
                      </span>
                      <span className="block text-[10px] font-mono text-[#7B5A58] mt-1">
                        Code: {att.ticket_code}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            if (user.role === 'admin') {
              fetchEvents();
              fetchInquiries();
              fetchPendingPayments();
            }
          }}
        />
      )}

      <Footer onOpenAuth={() => setAuthModalOpen(true)} />
    </main>
  );
}

'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setStatusMsg('');
      setErrorMsg('');

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to send inquiry.');
        return;
      }

      setStatusMsg(data.message || 'Message sent successfully!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Card */}
        <div className="md:col-span-5 bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[32px] p-8 retro-shadow">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#7B5A58] font-bold">
            Get In Touch
          </span>
          <h2 className="font-serif-display text-3xl font-black text-[#5A3B38] mt-1 mb-4">
            Have Questions? Write to Us.
          </h2>
          <p className="text-xs text-[#342224] leading-relaxed mb-6">
            Whether you want to propose a workshop idea, ask about accessibility, or inquire about private group bookings — drop us a message!
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-[#F2D8D5] p-3.5 rounded-2xl border border-[#5A3B38]">
              <Mail className="w-5 h-5 text-[#5A3B38]" />
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7B5A58] block">Email Us</span>
                <span className="text-xs font-bold text-[#342224]">hello@weekendclub.org</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#F2D8D5] p-3.5 rounded-2xl border border-[#5A3B38]">
              <Phone className="w-5 h-5 text-[#5A3B38]" />
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7B5A58] block">Call / Text</span>
                <span className="text-xs font-bold text-[#342224]">+1 (555) 749-2026</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#F2D8D5] p-3.5 rounded-2xl border border-[#5A3B38]">
              <MapPin className="w-5 h-5 text-[#5A3B38]" />
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7B5A58] block">Main Studio</span>
                <span className="text-xs font-bold text-[#342224]">14 Studio Alley, Building 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-[32px] p-8 retro-shadow">
          <h3 className="font-serif-display text-2xl font-black text-[#5A3B38] mb-6">
            Send an Inquiry
          </h3>

          {statusMsg && (
            <div className="bg-[#D1FAE5] border-2 border-[#059669] text-[#065F46] p-3.5 rounded-2xl text-xs font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-[#FEE2E2] border-2 border-[#DC2626] text-[#991B1B] p-3.5 rounded-2xl text-xs font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5A3B38] mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-2.5 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5A3B38] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-2.5 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A3B38] mb-1">Subject / Event Topic *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Question about 35mm film night..."
                className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-full px-4 py-2.5 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A3B38] mb-1">Your Message *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your question or message here..."
                className="w-full bg-[#FAF0EE] border-2 border-[#5A3B38] rounded-2xl p-3 text-xs text-[#342224] focus:outline-none focus:ring-2 focus:ring-[#5A3B38]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#5A3B38] text-[#FAF0EE] border-2 border-[#5A3B38] hover:bg-[#7B5A58] py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 retro-shadow transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Sending Message...' : 'Send Inquiry Message'}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}

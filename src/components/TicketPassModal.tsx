'use client';

import React, { useRef } from 'react';
import { X, Printer, CheckCircle2, Ticket, Calendar, Clock, MapPin, User, Mail, Sparkles } from 'lucide-react';

interface TicketPassModalProps {
  registration: any;
  onClose: () => void;
}

export default function TicketPassModal({ registration, onClose }: TicketPassModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!registration) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#F2D8D5] border-3 border-[#5A3B38] rounded-[32px] p-6 md:p-8 retro-shadow-lg max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#FAF0EE] border-2 border-[#5A3B38] text-[#5A3B38] p-2 rounded-full hover:rotate-90 transition-transform"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Confirmation Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-[#059669] text-white border-2 border-[#5A3B38] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" /> Registration Confirmed!
          </div>
          <h2 className="font-serif-display text-2xl md:text-3xl font-black text-[#5A3B38]">
            Your Official Member Ticket Pass
          </h2>
          <p className="text-xs text-[#7B5A58] mt-1 font-mono">
            A confirmation receipt has also been simulated for <span className="font-bold text-[#342224]">{registration.attendee_email}</span>
          </p>
        </div>

        {/* Printable Ticket Pass Container */}
        <div ref={printRef} className="print-area bg-[#FAF0EE] border-3 border-[#5A3B38] rounded-3xl p-6 retro-shadow relative overflow-hidden">
          
          {/* Perforated Edge Header */}
          <div className="bg-[#5A3B38] text-[#FAF0EE] -mx-6 -mt-6 p-4 border-b-2 border-[#5A3B38] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              <span className="font-serif-display font-bold text-lg">THE WEEKEND CLUB</span>
            </div>
            <div className="font-mono text-xs bg-[#D7B4A8] text-[#342224] px-3 py-1 rounded-full font-bold border border-[#5A3B38]">
              {registration.ticket_code}
            </div>
          </div>

          {/* Event Title */}
          <div className="mt-4 pb-4 border-b-2 border-dashed border-[#5A3B38]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7B5A58] font-bold">
              Event Pass • {registration.event_category || 'Weekend Special'}
            </span>
            <h3 className="font-serif-display text-xl md:text-2xl font-black text-[#5A3B38] mt-1">
              {registration.event_title}
            </h3>
          </div>

          {/* Event Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b-2 border-dashed border-[#5A3B38]">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-[#5A3B38] mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7B5A58] block">Date</span>
                <span className="text-xs font-bold text-[#342224]">{registration.event_date}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#5A3B38] mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7B5A58] block">Time</span>
                <span className="text-xs font-bold text-[#342224]">{registration.event_time}</span>
              </div>
            </div>

            <div className="col-span-2 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#5A3B38] mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7B5A58] block">Location</span>
                <span className="text-xs font-bold text-[#342224]">{registration.event_location}</span>
              </div>
            </div>
          </div>

          {/* Attendee Details & Simulated QR Code */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#342224] font-bold">
                <User className="w-3.5 h-3.5 text-[#5A3B38]" /> {registration.attendee_name}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#7B5A58]">
                <Mail className="w-3.5 h-3.5 text-[#7B5A58]" /> {registration.attendee_email}
              </div>
              <div className="inline-block bg-[#D7B4A8] border border-[#5A3B38] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#342224] mt-1">
                Seats Reserved: {registration.guest_count}
              </div>
            </div>

            {/* Simulated 70s Retro QR Code Graphics */}
            <div className="bg-[#FAF0EE] border-2 border-[#5A3B38] p-2 rounded-xl text-center retro-shadow-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#5A3B38] rounded-lg p-1.5 flex flex-wrap gap-1 items-center justify-center">
                <div className="w-3 h-3 bg-[#FAF0EE] rounded-sm"></div>
                <div className="w-3 h-3 bg-[#D7B4A8] rounded-sm"></div>
                <div className="w-3 h-3 bg-[#FAF0EE] rounded-sm"></div>
                <div className="w-3 h-3 bg-[#D7B4A8] rounded-sm"></div>
                <div className="w-3 h-3 bg-[#FAF0EE] rounded-sm"></div>
                <div className="w-3 h-3 bg-[#FAF0EE] rounded-sm"></div>
              </div>
              <span className="text-[9px] font-mono font-bold text-[#5A3B38] mt-1 uppercase">ENTRY QR</span>
            </div>
          </div>

          {/* Perforated Stub Line */}
          <div className="mt-4 pt-3 border-t-2 border-dotted border-[#5A3B38] text-center text-[10px] font-mono text-[#7B5A58] uppercase tracking-widest">
            ✦ Present this pass at door for entry ✦
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 mt-6">
          <button
            onClick={handlePrint}
            className="bg-[#D7B4A8] border-2 border-[#5A3B38] hover:bg-[#5A3B38] hover:text-[#FAF0EE] text-[#342224] px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save Ticket Pass
          </button>
          
          <button
            onClick={onClose}
            className="bg-[#5A3B38] text-[#FAF0EE] border-2 border-[#5A3B38] hover:bg-[#7B5A58] px-6 py-3 rounded-full font-bold text-xs transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

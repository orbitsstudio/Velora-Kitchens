import React, { useState, useEffect, useRef } from 'react';
import { Booking, ConsultationType, KitchenSize, PropertyType, StudioConfig } from '../types';
import { api } from '../services/api';
import { Calendar, Clock, CheckCircle2, Copy, Check, Search, Download, AlertCircle, ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BookingSectionProps {
  initialStudioConfig?: StudioConfig | null;
  initialRequirement?: string;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  initialStudioConfig,
  initialRequirement
}) => {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Penthouse');
  const [kitchenSize, setKitchenSize] = useState<KitchenSize>('Grand (250 - 400 sq ft)');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 12:00 PM');
  const [consultationType, setConsultationType] = useState<ConsultationType>('Initial Design Consultation');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Status Lookup modal / state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookedUpBooking, setLookedUpBooking] = useState<Booking | null | 'not_found'>(null);
  const [isSearchingLookup, setIsSearchingLookup] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const formBoxRef = useRef<HTMLDivElement>(null);

  // Tomorrow as min date
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  useEffect(() => {
    if (!preferredDate) {
      const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
      setPreferredDate(nextWeek);
    }
  }, [preferredDate]);

  useEffect(() => {
    if (initialRequirement) {
      setAdditionalRequirements(prev =>
        prev ? `${prev}\n[Interest: ${initialRequirement}]` : `[Interest: ${initialRequirement}]`
      );
    }
  }, [initialRequirement]);

  useEffect(() => {
    if (initialStudioConfig) {
      setConsultationType('3D Kitchen Design Consultation');
      const studioNote = `[3D Studio Configuration]: Layout: ${initialStudioConfig.layout}, Facade: ${initialStudioConfig.finish}, Stone: ${initialStudioConfig.countertop}, Hardware: ${initialStudioConfig.hardware}`;
      setAdditionalRequirements(prev => (prev.includes(studioNote) ? prev : prev ? `${prev}\n${studioNote}` : studioNote));
    }
  }, [initialStudioConfig]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (formBoxRef.current) {
        gsap.fromTo(
          formBoxRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formBoxRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !preferredDate) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newBooking = await api.createBooking({
        fullName,
        email,
        phone,
        city: city || 'International / Private',
        propertyType,
        kitchenSize,
        preferredDate,
        preferredTime,
        consultationType,
        additionalRequirements,
        customStudioConfig: initialStudioConfig || null
      });

      setConfirmedBooking(newBooking);
    } catch {
      setErrorMsg('Unable to transmit booking to concierge. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (!confirmedBooking) return;
    navigator.clipboard.writeText(confirmedBooking.id);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    setIsSearchingLookup(true);
    setLookedUpBooking(null);

    try {
      const all = await api.getBookings();
      const match = all.find(b => b.id.trim().toUpperCase() === lookupQuery.trim().toUpperCase());
      setLookedUpBooking(match || 'not_found');
    } catch {
      setLookedUpBooking('not_found');
    } finally {
      setIsSearchingLookup(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="booking"
      className="py-24 lg:py-32 bg-[#F5F1E9] text-[#171717] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] font-semibold mb-3">
              Design Consultation & Booking System
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#29231F] leading-tight text-balance">
              Commission Your Private Architectural Consultation
            </h2>
            <p className="mt-4 text-[#29231F]/70 text-base font-light leading-relaxed">
              Meet directly with a Senior Interior Architect at our London, Milan, or New York studios, or schedule a dedicated virtual spatial review of your floor plans.
            </p>
          </div>

          {/* Quick Lookup Bar */}
          <div className="bg-white p-4 border border-[#D8CCBA]/60 shadow-sm">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#29231F]/60 mb-2 font-medium">
              Existing Appointment Lookup
            </div>
            <form onSubmit={handleLookup} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. VK-2026-7841"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                className="px-3 py-1.5 text-xs border border-[#D8CCBA] bg-[#F5F1E9]/50 focus:border-[#29231F] outline-none tracking-wider w-40"
              />
              <MagneticButton
                type="submit"
                disabled={isSearchingLookup}
                className="px-3 py-1.5 bg-[#29231F] text-[#F5F1E9] text-xs uppercase tracking-wider hover:bg-[#C6A875] hover:text-[#171717]"
              >
                <Search size={14} />
              </MagneticButton>
            </form>
          </div>
        </div>

        {/* Lookup Result Card */}
        {lookedUpBooking && (
          <div className="mb-10 p-6 bg-[#29231F] text-[#F5F1E9] border border-[#C6A875] animate-fade-in shadow-xl">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C6A875]">
                Consultation Record
              </span>
              <button
                onClick={() => setLookedUpBooking(null)}
                className="text-xs text-[#D8CCBA]/60 hover:text-white cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            {lookedUpBooking === 'not_found' ? (
              <div className="text-sm text-[#D8CCBA]/80 flex items-center gap-2">
                <AlertCircle size={16} className="text-[#C6A875]" />
                No appointment found with reference code "{lookupQuery}". Please check your code or contact concierge.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
                <div>
                  <div className="text-[#D8CCBA]/50 uppercase tracking-wider">Reference</div>
                  <div className="font-semibold text-white mt-0.5">{lookedUpBooking.id}</div>
                </div>
                <div>
                  <div className="text-[#D8CCBA]/50 uppercase tracking-wider">Client</div>
                  <div className="font-semibold text-white mt-0.5">{lookedUpBooking.fullName}</div>
                </div>
                <div>
                  <div className="text-[#D8CCBA]/50 uppercase tracking-wider">Appointment</div>
                  <div className="font-semibold text-white mt-0.5">
                    {lookedUpBooking.preferredDate} · {lookedUpBooking.preferredTime}
                  </div>
                </div>
                <div>
                  <div className="text-[#D8CCBA]/50 uppercase tracking-wider">Status</div>
                  <div className="font-semibold text-[#C6A875] mt-0.5">{lookedUpBooking.status}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Screen View */}
        {confirmedBooking ? (
          <div className="bg-white border border-[#C6A875] p-8 sm:p-12 lg:p-16 shadow-2xl max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#F5F1E9] border border-[#C6A875] mx-auto flex items-center justify-center text-[#C6A875]">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] font-semibold">
                Consultation Confirmed
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#29231F]">
                Thank You, {confirmedBooking.fullName}
              </h3>
              <p className="text-sm text-[#29231F]/70 max-w-lg mx-auto font-light leading-relaxed">
                Your private appointment has been logged directly into our master schedule. A Senior Architect from the Velora Concierge will contact you within 24 hours to confirm architectural materials and prepare your bespoke presentation.
              </p>
            </div>

            {/* Reference Box */}
            <div className="bg-[#F5F1E9] p-6 border border-[#D8CCBA] max-w-md mx-auto space-y-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#29231F]/60">
                Official Booking Reference
              </div>
              <div className="font-mono text-2xl font-bold tracking-wider text-[#29231F]">
                {confirmedBooking.id}
              </div>
              <button
                onClick={handleCopyReference}
                className="inline-flex items-center gap-1.5 text-xs text-[#C6A875] hover:text-[#29231F] font-semibold tracking-wider uppercase cursor-pointer"
              >
                {copiedRef ? <Check size={14} /> : <Copy size={14} />}
                {copiedRef ? 'Reference Copied' : 'Copy Reference Code'}
              </button>
            </div>

            {/* Booking Details Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto text-xs border-t border-[#D8CCBA]/60 pt-6">
              <div>
                <span className="text-[#29231F]/50 uppercase tracking-wider block">Service</span>
                <span className="font-medium text-[#29231F]">{confirmedBooking.consultationType}</span>
              </div>
              <div>
                <span className="text-[#29231F]/50 uppercase tracking-wider block">Date & Time</span>
                <span className="font-medium text-[#29231F]">
                  {confirmedBooking.preferredDate} ({confirmedBooking.preferredTime})
                </span>
              </div>
              <div>
                <span className="text-[#29231F]/50 uppercase tracking-wider block">Property & Size</span>
                <span className="font-medium text-[#29231F]">
                  {confirmedBooking.propertyType} · {confirmedBooking.kitchenSize}
                </span>
              </div>
              <div>
                <span className="text-[#29231F]/50 uppercase tracking-wider block">Contact</span>
                <span className="font-medium text-[#29231F]">{confirmedBooking.phone}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <MagneticButton
                onClick={() => window.print()}
                className="px-6 py-3 border border-[#29231F] text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#29231F] hover:text-[#F5F1E9]"
              >
                <Download size={14} />
                <span>Print / Save Appointment Pass</span>
              </MagneticButton>

              <MagneticButton
                onClick={() => setConfirmedBooking(null)}
                className="px-6 py-3 bg-[#C6A875] text-[#171717] text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#DFCA9E]"
              >
                <span>Schedule Another Consultation</span>
              </MagneticButton>
            </div>
          </div>
        ) : (
          /* Live Booking Form */
          <div
            ref={formBoxRef}
            className="bg-white border border-[#D8CCBA]/60 shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Context & Guarantees */}
              <div className="lg:col-span-4 bg-[#29231F] text-[#F5F1E9] p-8 lg:p-12 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] font-semibold">
                    The Consultation Process
                  </div>
                  <h3 className="font-serif text-3xl font-normal leading-snug">
                    A Curated Spatial Experience
                  </h3>
                  <p className="text-xs text-[#D8CCBA]/80 font-light leading-relaxed">
                    Our consultations are comprehensive 90-minute design immersions tailored specifically to your residence.
                  </p>

                  <div className="space-y-4 pt-4 border-t border-[#F5F1E9]/10 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-none border border-[#C6A875] text-[#C6A875] flex items-center justify-center shrink-0 font-serif">
                        1
                      </span>
                      <div>
                        <div className="font-semibold text-white">Spatial Analysis</div>
                        <div className="text-[#D8CCBA]/70 text-[11px] mt-0.5">Review of architectural CAD/PDF plans, window orientations & sightlines.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-none border border-[#C6A875] text-[#C6A875] flex items-center justify-center shrink-0 font-serif">
                        2
                      </span>
                      <div>
                        <div className="font-semibold text-white">Direct Quarry Swatch Touch</div>
                        <div className="text-[#D8CCBA]/70 text-[11px] mt-0.5">Physical tactile review of rare marbles, fluted timbers, and Austrian PVD metals.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-none border border-[#C6A875] text-[#C6A875] flex items-center justify-center shrink-0 font-serif">
                        3
                      </span>
                      <div>
                        <div className="font-semibold text-white">3D Spatial Ray-Tracing</div>
                        <div className="text-[#D8CCBA]/70 text-[11px] mt-0.5">Interactive adjustments to island lengths, appliance garages, and lighting temperatures.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#171717] border border-[#C6A875]/30 text-[11px] text-[#D8CCBA]/80">
                  <span className="text-[#C6A875] font-semibold block uppercase tracking-wider mb-1">
                    Confidentiality Notice
                  </span>
                  All architectural drawings and client particulars are held under strict non-disclosure agreements.
                </div>
              </div>

              {/* Right Column: Interactive Form */}
              <div className="lg:col-span-8 p-8 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle size={14} />
                      {errorMsg}
                    </div>
                  )}

                  {/* 1. Client Particulars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.14em] text-[#29231F] font-semibold mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Eleanor Kensington"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F5F1E9]/50 border border-[#D8CCBA] text-sm text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.14em] text-[#29231F] font-semibold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. eleanor@residence.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F5F1E9]/50 border border-[#D8CCBA] text-sm text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.14em] text-[#29231F] font-semibold mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+44 20 7946 0912"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F5F1E9]/50 border border-[#D8CCBA] text-sm text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.14em] text-[#29231F] font-semibold mb-2">
                        City / Residence Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mayfair, London"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 bg-[#F5F1E9]/50 border border-[#D8CCBA] text-sm text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* 2. Property & Project Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-[#D8CCBA]/40">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.14em] text-[#29231F] font-semibold mb-2">
                        Property Type
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                        className="w-full px-4 py-3 bg-[#F5F1E9]/50 border border-[#D8CCBA] text-sm text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none"
                      >
                        <option value="Penthouse">Penthouse</option>
                        <option value="Luxury Villa">Luxury Villa</option>
                        <option value="Contemporary Apartment">Contemporary Apartment</option>
                        <option value="Private Estate">Private Estate</option>
                        <option value="Architect / Developer Project">Architect / Developer Project</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.14em] text-[#29231F] font-semibold mb-2">
                        Approximate Kitchen Size
                      </label>
                      <select
                        value={kitchenSize}
                        onChange={(e) => setKitchenSize(e.target.value as KitchenSize)}
                        className="w-full px-4 py-3 bg-[#F5F1E9]/50 border border-[#D8CCBA] text-sm text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none"
                      >
                        <option value="Compact (< 150 sq ft)">Compact (&lt; 150 sq ft)</option>
                        <option value="Executive (150 - 250 sq ft)">Executive (150 - 250 sq ft)</option>
                        <option value="Grand (250 - 400 sq ft)">Grand (250 - 400 sq ft)</option>
                        <option value="Estate Master (> 400 sq ft)">Estate Master (&gt; 400 sq ft)</option>
                      </select>
                    </div>
                  </div>

                  {/* 3. Consultation Type */}
                  <div className="pt-3 border-t border-[#D8CCBA]/40">
                    <label className="block text-xs uppercase tracking-[0.14em] text-[#29231F] font-semibold mb-2">
                      Consultation Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        [
                          'Initial Design Consultation',
                          '3D Kitchen Design Consultation',
                          'Material Selection Consultation',
                          'Installation Consultation'
                        ] as ConsultationType[]
                      ).map((ctype) => (
                        <label
                          key={ctype}
                          className={`flex items-center gap-3 p-3.5 border cursor-pointer transition-all ${
                            consultationType === ctype
                              ? 'border-[#29231F] bg-[#29231F] text-[#F5F1E9]'
                              : 'border-[#D8CCBA] bg-white text-[#29231F] hover:border-[#29231F]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="consultationType"
                            value={ctype}
                            checked={consultationType === ctype}
                            onChange={() => setConsultationType(ctype)}
                            className="accent-[#C6A875]"
                          />
                          <span className="text-xs font-medium">{ctype}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 4. Preferred Date & Available Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-[#D8CCBA]/40">
                    <div>
                      <label className="block text-xs uppercase tracking-[0.14em] text-[#29231F] font-semibold mb-2">
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          min={tomorrowStr}
                          required
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full px-4 py-3 bg-[#F5F1E9]/50 border border-[#D8CCBA] text-sm text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none"
                        />
                        <Calendar size={16} className="absolute right-4 top-3.5 text-[#29231F]/50 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.14em] text-[#29231F] font-semibold mb-2">
                        Preferred Time Slot
                      </label>
                      <div className="relative">
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full px-4 py-3 bg-[#F5F1E9]/50 border border-[#D8CCBA] text-sm text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none"
                        >
                          <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Morning Slot)</option>
                          <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM (Afternoon Slot)</option>
                          <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM (Evening Salon)</option>
                        </select>
                        <Clock size={16} className="absolute right-4 top-3.5 text-[#29231F]/50 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* 5. Additional Requirements */}
                  <div className="pt-3 border-t border-[#D8CCBA]/40">
                    <label className="block text-xs uppercase tracking-[0.14em] text-[#29231F] font-semibold mb-2">
                      Additional Requirements & Architectural Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Seeking integrated Sub-Zero wine columns, bookmatched island waterfall, ceiling height 3.4m, delivery requested Autumn 2026."
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F5F1E9]/50 border border-[#D8CCBA] text-sm text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none"
                    />
                  </div>

                  {/* Submission */}
                  <div className="pt-4">
                    <MagneticButton
                      type="submit"
                      disabled={isSubmitting}
                      cursorText="CONFIRM"
                      className="w-full py-4 bg-[#C6A875] hover:bg-[#DFCA9E] text-[#171717] text-xs uppercase tracking-[0.18em] font-semibold shadow-lg group"
                    >
                      {isSubmitting ? (
                        <span>Logging with Concierge...</span>
                      ) : (
                        <>
                          <span>Confirm & Book Design Consultation</span>
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </MagneticButton>
                    <div className="text-[11px] text-[#29231F]/60 text-center mt-2.5">
                      Complimentary private consultation · Fully confidential
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

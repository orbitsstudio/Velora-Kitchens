import React, { useState } from 'react';
import { api } from '../services/api';
import { MessageSquare, Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface ContactSectionProps {
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Architectural Kitchen Commission');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    try {
      await api.createEnquiry({
        name,
        email,
        phone,
        subject,
        message
      });
      setSentSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setTimeout(() => setSentSuccess(false), 5000);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hello Velora Kitchens Concierge, I would like to inquire about commissioning a bespoke modular kitchen.");
    window.open(`https://wa.me/442079460912?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-[#F5F1E9] text-[#171717] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Flagship Studio Addresses & Concierge */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] font-semibold mb-3">
                Concierge & Studios
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#29231F] leading-tight">
                Connect with the Velora Atelier
              </h2>
              <p className="mt-4 text-[#29231F]/70 text-sm font-light leading-relaxed">
                Whether you have existing architectural floor plans or are beginning initial concept discovery, our studio team is at your disposal.
              </p>
            </div>

            {/* Quick Contact Options */}
            <div className="space-y-4 pt-4 border-t border-[#D8CCBA]/60 text-xs">
              <a
                href="tel:+442079460912"
                data-cursor="CALL"
                className="flex items-center gap-3 p-3.5 bg-white border border-[#D8CCBA]/60 hover:border-[#C6A875] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 rounded-none bg-[#29231F] text-[#C6A875] flex items-center justify-center shrink-0">
                  <Phone size={14} />
                </div>
                <div>
                  <div className="text-[#29231F]/50 uppercase tracking-wider text-[10px]">Private Concierge Line</div>
                  <div className="font-medium text-[#29231F] text-sm">+44 (0) 20 7946 0912</div>
                </div>
              </a>

              <a
                href="mailto:concierge@velorakitchens.com"
                data-cursor="EMAIL"
                className="flex items-center gap-3 p-3.5 bg-white border border-[#D8CCBA]/60 hover:border-[#C6A875] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 rounded-none bg-[#29231F] text-[#C6A875] flex items-center justify-center shrink-0">
                  <Mail size={14} />
                </div>
                <div>
                  <div className="text-[#29231F]/50 uppercase tracking-wider text-[10px]">Direct Studio Enquiries</div>
                  <div className="font-medium text-[#29231F] text-sm">concierge@velorakitchens.com</div>
                </div>
              </a>

              <MagneticButton
                onClick={handleWhatsApp}
                cursorText="WHATSAPP"
                className="w-full flex items-center justify-between p-3.5 bg-[#171717] text-[#F5F1E9] border border-[#29231F] hover:bg-[#29231F] shadow-sm hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <MessageSquare size={14} />
                  </div>
                  <div className="text-left">
                    <div className="text-[#D8CCBA]/60 uppercase tracking-wider text-[10px]">Instant VIP Dispatch</div>
                    <div className="font-medium text-xs">Direct WhatsApp Concierge</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-[#C6A875]" />
              </MagneticButton>
            </div>

            {/* Flagship Showrooms */}
            <div className="pt-6 border-t border-[#D8CCBA]/60 space-y-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[#29231F] font-semibold">
                International Studio Locations
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-serif font-medium text-[#29231F] text-sm flex items-center gap-1">
                    <MapPin size={12} className="text-[#C6A875]" />
                    London
                  </div>
                  <div className="text-[#29231F]/60 text-[11px] mt-1">
                    28 Berkeley Square, Mayfair<br />W1J 6EN
                  </div>
                </div>

                <div>
                  <div className="font-serif font-medium text-[#29231F] text-sm flex items-center gap-1">
                    <MapPin size={12} className="text-[#C6A875]" />
                    Milan
                  </div>
                  <div className="text-[#29231F]/60 text-[11px] mt-1">
                    Via Montenapoleone 14<br />20121 Milano
                  </div>
                </div>

                <div>
                  <div className="font-serif font-medium text-[#29231F] text-sm flex items-center gap-1">
                    <MapPin size={12} className="text-[#C6A875]" />
                    New York
                  </div>
                  <div className="text-[#29231F]/60 text-[11px] mt-1">
                    480 Broome St, SoHo<br />NY 10013
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Enquiry Form */}
          <div className="lg:col-span-7 bg-white p-8 lg:p-12 border border-[#D8CCBA]/60 shadow-xl">
            <div className="mb-6">
              <div className="text-xs uppercase tracking-[0.2em] text-[#C6A875] font-semibold mb-1">
                Studio Communication
              </div>
              <h3 className="font-serif text-2xl text-[#29231F]">
                Send an Architectural Enquiry
              </h3>
            </div>

            {sentSuccess ? (
              <div className="p-8 bg-[#F5F1E9] border border-[#C6A875] text-center space-y-3 animate-fade-in">
                <CheckCircle2 size={32} className="text-[#C6A875] mx-auto" />
                <h4 className="font-serif text-2xl text-[#29231F]">Enquiry Transmitted</h4>
                <p className="text-xs text-[#29231F]/70 font-light max-w-sm mx-auto">
                  Your message has reached our Mayfair & Milan studio directors. We will review your project brief and follow up promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#29231F] font-semibold mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Sterling"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F5F1E9]/40 border border-[#D8CCBA] text-xs text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#29231F] font-semibold mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sterling@architects.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F5F1E9]/40 border border-[#D8CCBA] text-xs text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#29231F] font-semibold mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (212) 555-0198"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F5F1E9]/40 border border-[#D8CCBA] text-xs text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#29231F] font-semibold mb-1.5">
                      Enquiry Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F5F1E9]/40 border border-[#D8CCBA] text-xs text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none"
                    >
                      <option value="Architectural Kitchen Commission">Architectural Kitchen Commission</option>
                      <option value="Trade & Developer Collaboration">Trade & Developer Collaboration</option>
                      <option value="Custom 3D Studio Specification">Custom 3D Studio Specification</option>
                      <option value="Material & Swatch Procurement">Material & Swatch Procurement</option>
                      <option value="Press & Media Enquiry">Press & Media Enquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#29231F] font-semibold mb-1.5">
                    Project Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your property, approximate dimensions, timeline, and design aesthetic..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F5F1E9]/40 border border-[#D8CCBA] text-xs text-[#29231F] focus:border-[#29231F] focus:bg-white outline-none transition-colors"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <MagneticButton
                    type="submit"
                    disabled={submitting}
                    cursorText="TRANSMIT"
                    className="w-full sm:w-auto px-8 py-3.5 bg-[#29231F] hover:bg-[#C6A875] text-[#F5F1E9] hover:text-[#171717] text-xs uppercase tracking-[0.16em] font-semibold shadow-md"
                  >
                    <Send size={14} />
                    <span>{submitting ? 'Transmitting...' : 'Send Message'}</span>
                  </MagneticButton>

                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="text-xs uppercase tracking-wider text-[#C6A875] hover:text-[#29231F] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Prefer Dedicated Booking Calendar?</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

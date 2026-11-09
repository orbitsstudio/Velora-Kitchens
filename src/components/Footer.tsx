import React from 'react';
import { ArrowUp, Shield } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenBooking }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#171717] text-[#F5F1E9] border-t border-[#29231F] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#29231F]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#C6A875] flex items-center justify-center text-[#C6A875] font-serif text-sm font-semibold tracking-widest">
                VK
              </div>
              <span className="font-serif text-2xl font-normal tracking-[0.2em] text-[#F5F1E9] uppercase">
                VELORA KITCHENS
              </span>
            </div>

            <p className="text-xs text-[#D8CCBA]/70 font-light leading-relaxed max-w-sm">
              Bespoke luxury modular kitchens engineered with Italian craftsmanship, rare natural stone, and Austrian precision joinery.
            </p>

            <div className="pt-2 text-[11px] text-[#C6A875] tracking-widest uppercase font-medium">
              Milan · London · New York · Zurich
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-[#C6A875] font-semibold">
              Collections
            </div>
            <ul className="space-y-2 text-xs text-[#D8CCBA]/70">
              <li><a href="#collections" className="hover:text-white transition-colors">Modern Minimalist</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Contemporary Luxury</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Italian-Inspired</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Bespoke Island Kitchens</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Handleless Modular</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Classic European</a></li>
            </ul>
          </div>

          {/* Atelier & Architecture */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-[#C6A875] font-semibold">
              Atelier
            </div>
            <ul className="space-y-2 text-xs text-[#D8CCBA]/70">
              <li><a href="#materials" className="hover:text-white transition-colors">Material Library</a></li>
              <li><a href="#3d-studio" className="hover:text-white transition-colors">3D Kitchen Studio</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors">Project Portfolio</a></li>
              <li><a href="#craftsmanship" className="hover:text-white transition-colors">Guild Craftsmanship</a></li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-[#C6A875] transition-colors text-left cursor-pointer"
                >
                  Book Private Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Administration */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-[#C6A875] font-semibold">
              Governance
            </div>
            <ul className="space-y-2 text-xs text-[#D8CCBA]/70">
              <li><span className="hover:text-white transition-colors cursor-pointer">15-Year Warranty Terms</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Architectural NDA Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">FSC Sustainable Wood Charter</span></li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-[#C6A875]/80 hover:text-[#C6A875] transition-colors flex items-center gap-1.5 pt-2 cursor-pointer"
                >
                  <Shield size={12} />
                  <span>Studio Administration</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8CCBA]/50">
          <div>
            © {new Date().getFullYear()} VELORA KITCHENS LTD. ALL RIGHTS RESERVED. ARCHITECTURAL JOINERY & MARBLE ATELIER.
          </div>

          <div className="flex items-center gap-6">
            <span className="tracking-widest uppercase text-[10px]">CRAFTED FOR PRIVATE RESIDENCIES</span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 border border-[#29231F] hover:border-[#C6A875] flex items-center justify-center text-[#D8CCBA] hover:text-[#C6A875] transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

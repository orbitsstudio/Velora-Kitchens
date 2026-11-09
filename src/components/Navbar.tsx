import React, { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAdmin, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Collections', href: '#collections' },
    { label: 'Materials', href: '#materials' },
    { label: '3D Studio', href: '#3d-studio' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Craftsmanship', href: '#craftsmanship' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(target, { offset: -70, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#1D1815]/95 backdrop-blur-md border-b border-[#C6A875]/25 py-3 shadow-xl'
            : 'bg-gradient-to-b from-[#171717]/85 via-[#171717]/40 to-transparent py-5'
        }`}
      >
        {/* Scroll Progress Hairline Indicator */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#C6A875] via-[#DFCA9E] to-[#C6A875] transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element in display face) */}
          <a
            href="/"
            className="flex items-center gap-3 group text-left whitespace-nowrap shrink-0"
            data-cursor="VELORA"
          >
            <div className="w-8 h-8 rounded-none border border-[#C6A875] flex items-center justify-center text-[#C6A875] font-serif text-sm font-semibold tracking-widest transition-transform duration-300 group-hover:scale-105">
              VK
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-normal tracking-[0.2em] text-[#F5F1E9] uppercase transition-colors group-hover:text-[#C6A875]">
                VELORA
              </span>
              <span className="text-[9px] tracking-[0.35em] text-[#C6A875] uppercase -mt-1 font-light">
                KITCHENS
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-[0.12em] text-[#D8CCBA] uppercase">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative py-1 transition-colors duration-200 hover:text-[#C6A875] whitespace-nowrap shrink-0 group ${
                    isActive ? 'text-[#C6A875] font-semibold' : ''
                  }`}
                >
                  {link.label}
                  {/* Underline hover effect */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#C6A875] transition-transform duration-300 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-4 shrink-0">
            <MagneticButton
              onClick={onOpenBooking}
              cursorText="RESERVE"
              className="px-5 py-2.5 text-xs font-semibold tracking-[0.15em] text-[#171717] bg-[#C6A875] hover:bg-[#DFCA9E] uppercase whitespace-nowrap shadow-sm hover:shadow-md"
            >
              <span>Book Consultation</span>
            </MagneticButton>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-[#F5F1E9] p-1.5 hover:text-[#C6A875] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu with Staggered Entrance */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#171717]/98 backdrop-blur-xl pt-24 px-8 pb-10 flex flex-col justify-between md:hidden animate-fade-in">
          <div className="space-y-6">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] pb-2 border-b border-[#29231F]">
              Atelier Directory
            </div>
            {navLinks.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{ animationDelay: `${idx * 80}ms` }}
                className="block font-serif text-2xl text-[#F5F1E9] hover:text-[#C6A875] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="space-y-4 pt-6 border-t border-[#29231F]">
            <MagneticButton
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              cursorText="RESERVE"
              className="w-full py-3.5 text-xs font-semibold tracking-[0.15em] text-[#171717] bg-[#C6A875] uppercase text-center"
            >
              <span>Book Consultation</span>
            </MagneticButton>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 text-xs text-[#D8CCBA]/70 hover:text-[#C6A875] flex items-center justify-center gap-2 tracking-wider uppercase cursor-pointer"
            >
              <Shield size={14} />
              <span>Studio Administration</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

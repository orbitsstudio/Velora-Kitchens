import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import gsap from 'gsap';
import { handleImageFallback, LUXURY_IMAGE_FALLBACKS } from '../utils/imageUtils';

interface HeroProps {
  onExploreKitchens: () => void;
  onBookConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreKitchens, onBookConsultation }) => {
  const heroRef = useRef<HTMLElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic image reveal using clip-path and gentle scale
      if (bgImgRef.current) {
        gsap.fromTo(
          bgImgRef.current,
          {
            clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            scale: 1.15
          },
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            scale: 1.04,
            duration: 2.2,
            ease: 'power3.inOut'
          }
        );
      }

      // Kicker badge entrance
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.2, delay: 0.6, ease: 'power2.out' }
        );
      }

      // Headline split word-by-word reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word-wrap');
        gsap.fromTo(
          words,
          { opacity: 0, y: 40, rotateX: 20 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.1,
            delay: 0.8,
            ease: 'power3.out'
          }
        );
      }

      // Supporting text
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.2, delay: 1.4, ease: 'power2.out' }
        );
      }

      // CTAs entrance
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, delay: 1.6, ease: 'power2.out' }
        );
      }

      // Proof metrics entrance
      if (proofRef.current) {
        gsap.fromTo(
          proofRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, delay: 1.8, ease: 'power2.out' }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = ["Where", "Craftsmanship", "Meets", "Culinary", "Luxury."];

  return (
    <section
      ref={heroRef}
      className="relative min-h-[95vh] lg:min-h-screen flex flex-col justify-between bg-[#171717] text-[#F5F1E9] overflow-hidden"
    >
      {/* Background Photography with Cinematic Zoom & Measured Scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          ref={bgImgRef}
          src="/images/hero_luxury_kitchen.jpg"
          alt="Velora bespoke luxury modular kitchen featuring marble waterfall island and smoked oak cabinetry"
          className="w-full h-full object-cover object-center will-change-transform"
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          onError={(e) => handleImageFallback(e, LUXURY_IMAGE_FALLBACKS.hero)}
        />
        {/* Measured Scrim for Media Overlays (ensuring > 4.5:1 WCAG contrast) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/65 to-[#171717]/35" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-36 pb-16 lg:pt-44 lg:pb-24 flex-1 flex flex-col justify-end">
        <div className="max-w-3xl space-y-6">
          {/* Subtle Monogram Kicker */}
          <div
            ref={badgeRef}
            className="flex items-center gap-3 text-xs tracking-[0.25em] text-[#C6A875] uppercase font-medium"
          >
            <span>Bespoke Architecture</span>
            <span aria-hidden="true" className="text-[#C6A875]/60">/</span>
            <span>Milan · London · New York</span>
          </div>

          {/* Word-by-Word Staggered Display Headline */}
          <h1
            ref={headlineRef}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.08] tracking-tight text-[#F5F1E9] text-balance overflow-hidden"
          >
            {headlineWords.map((word, idx) => (
              <span key={idx} className="inline-block overflow-hidden mr-3">
                <span className="word-wrap inline-block">
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {/* Supporting Text */}
          <p
            ref={textRef}
            className="text-base sm:text-lg text-[#D8CCBA]/90 leading-relaxed font-light max-w-2xl"
          >
            Bespoke modular kitchens conceived with architectural discipline, rare Italian marbles, and millimeter-precise Austrian joinery engineering. Crafted specifically around how you live and entertain.
          </p>

          {/* Magnetic CTA Buttons */}
          <div
            ref={ctaRef}
            className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-5"
          >
            <MagneticButton
              onClick={onExploreKitchens}
              cursorText="EXPLORE"
              className="px-8 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#171717] bg-[#C6A875] hover:bg-[#DFCA9E] uppercase whitespace-nowrap shadow-sm hover:shadow-lg group"
            >
              <span>Explore Our Kitchens</span>
              <ArrowDown size={14} className="transition-transform group-hover:translate-y-1" />
            </MagneticButton>

            <MagneticButton
              onClick={onBookConsultation}
              cursorText="RESERVE"
              className="px-8 py-3.5 text-xs font-semibold tracking-[0.16em] text-[#F5F1E9] border border-[#C6A875]/60 hover:border-[#C6A875] hover:bg-[#C6A875]/15 uppercase whitespace-nowrap group"
            >
              <span>Book a Design Consultation</span>
              <ArrowUpRight size={14} className="text-[#C6A875] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Proof & Architectural Standards Strip */}
      <div
        ref={proofRef}
        className="relative z-10 border-t border-[#F5F1E9]/15 bg-[#171717]/85 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="space-y-1">
            <div className="font-serif text-2xl lg:text-3xl text-[#C6A875] font-light tabular-nums">
              0.1mm
            </div>
            <div className="text-[11px] tracking-[0.15em] text-[#D8CCBA]/80 uppercase">
              CNC Joinery Tolerance
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-serif text-2xl lg:text-3xl text-[#C6A875] font-light tabular-nums">
              450+
            </div>
            <div className="text-[11px] tracking-[0.15em] text-[#D8CCBA]/80 uppercase">
              Bespoke Residencies
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-serif text-2xl lg:text-3xl text-[#C6A875] font-light tabular-nums">
              15 Years
            </div>
            <div className="text-[11px] tracking-[0.15em] text-[#D8CCBA]/80 uppercase">
              Structural Warranty
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-serif text-2xl lg:text-3xl text-[#C6A875] font-light tabular-nums">
              100%
            </div>
            <div className="text-[11px] tracking-[0.15em] text-[#D8CCBA]/80 uppercase">
              Austrian & Italian Mechanics
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

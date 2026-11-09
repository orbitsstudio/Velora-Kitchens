import React, { useState, useRef, useEffect } from 'react';
import { clientTestimonials } from '../data/initialContent';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import gsap from 'gsap';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const quoteBoxRef = useRef<HTMLDivElement>(null);

  const prev = () => {
    animateQuoteChange(() => {
      setCurrentIndex((p) => (p === 0 ? clientTestimonials.length - 1 : p - 1));
    });
  };

  const next = () => {
    animateQuoteChange(() => {
      setCurrentIndex((p) => (p === clientTestimonials.length - 1 ? 0 : p + 1));
    });
  };

  const animateQuoteChange = (updateState: () => void) => {
    if (quoteBoxRef.current) {
      gsap.to(quoteBoxRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          updateState();
          gsap.fromTo(
            quoteBoxRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
          );
        }
      });
    } else {
      updateState();
    }
  };

  const current = clientTestimonials[currentIndex];

  return (
    <section className="py-24 lg:py-32 bg-[#1D1815] text-[#F5F1E9] relative border-t border-[#F5F1E9]/10 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] font-semibold mb-3">
            Client Voices
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#F5F1E9]">
            The Art of Living with Velora
          </h2>
        </div>

        {/* Testimonial Display */}
        <div className="relative bg-[#171717] border border-[#C6A875]/30 p-8 sm:p-14 lg:p-16 shadow-2xl">
          <Quote className="text-[#C6A875]/30 w-12 h-12 mb-6" />

          <div ref={quoteBoxRef}>
            <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl text-[#F5F1E9] font-normal leading-relaxed text-balance min-h-[90px]">
              "{current.quote}"
            </blockquote>

            <div className="mt-8 pt-6 border-t border-[#F5F1E9]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-serif text-lg text-white font-medium">
                  {current.author}
                </div>
                <div className="text-xs text-[#C6A875] tracking-wider uppercase mt-0.5">
                  {current.role} · {current.residence}
                </div>
                <div className="text-[11px] text-[#D8CCBA]/50 mt-0.5">
                  Commission: {current.projectRef}
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center gap-3">
                <MagneticButton
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="w-10 h-10 border border-[#F5F1E9]/20 hover:border-[#C6A875] text-[#F5F1E9] hover:text-[#C6A875] transition-colors"
                >
                  <ChevronLeft size={18} />
                </MagneticButton>

                <span className="text-xs text-[#D8CCBA]/60 px-2 font-mono tabular-nums">
                  0{currentIndex + 1} / 0{clientTestimonials.length}
                </span>

                <MagneticButton
                  onClick={next}
                  aria-label="Next testimonial"
                  className="w-10 h-10 border border-[#F5F1E9]/20 hover:border-[#C6A875] text-[#F5F1E9] hover:text-[#C6A875] transition-colors"
                >
                  <ChevronRight size={18} />
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

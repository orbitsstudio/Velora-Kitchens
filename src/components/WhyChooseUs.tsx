import React, { useEffect, useRef } from 'react';
import { brandPillars } from '../data/initialContent';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const WhyChooseUs: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#F5F1E9] text-[#171717] border-t border-[#D8CCBA]/60 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] font-semibold mb-3">
            Why Velora
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#29231F] leading-tight text-balance">
            Six Tenets of Uncompromising Kitchen Architecture
          </h2>
          <p className="mt-4 text-[#29231F]/70 text-base font-light leading-relaxed">
            From millimeter-accurate engineering to lifetime concierge care, our methodology is built entirely around discerning homeowners.
          </p>
        </div>

        {/* 6 Pillars Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {brandPillars.map((pillar) => (
            <div
              key={pillar.number}
              className="bg-white border border-[#D8CCBA]/50 p-8 flex flex-col justify-between hover:border-[#C6A875] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="font-serif text-3xl text-[#C6A875] font-light mb-4">
                  {pillar.number}
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#29231F] mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#29231F]/70 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D8CCBA]/30 text-[10px] uppercase tracking-[0.2em] text-[#C6A875] font-semibold">
                Velora Standard
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

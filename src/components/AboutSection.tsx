import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AboutSectionProps {
  onExploreMaterials: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onExploreMaterials }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: leftColRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { opacity: 0, x: 40, scale: 0.96 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rightColRef.current,
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
      id="craftsmanship"
      className="py-24 lg:py-32 bg-[#29231F] text-[#F5F1E9] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand Storytelling */}
          <div ref={leftColRef} className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] font-semibold">
              The Architecture of Velora
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F5F1E9] leading-tight text-balance">
              Designed Around Your Lifestyle. Crafted Beyond Expectations.
            </h2>

            <p className="text-base text-[#D8CCBA]/90 font-light leading-relaxed">
              At Velora Kitchens, we do not believe in standard cabinet widths or compromise. We operate as an architectural design atelier where every kitchen is custom-engineered from raw slabs of Tuscan marble, acoustic German timbers, and hand-finished Austrian mechanics.
            </p>

            <p className="text-sm text-[#D8CCBA]/75 font-light leading-relaxed">
              Our master guild brings together structural architects, stone artisans, and aerospace-grade CNC programmers. From the initial 3D laser survey of your floor plan to the final silent glide of our motorized servo drawers, every touchpoint reflects quiet international luxury.
            </p>

            {/* 3 Core Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#F5F1E9]/10">
              <div className="space-y-1.5">
                <div className="font-serif text-2xl text-[#C6A875]">01. Precision</div>
                <div className="text-xs text-[#D8CCBA]/70">0.1mm robotic joinery tolerance with hand-sanded Italian finishes.</div>
              </div>

              <div className="space-y-1.5">
                <div className="font-serif text-2xl text-[#C6A875]">02. Provenance</div>
                <div className="text-xs text-[#D8CCBA]/70">Direct single-quarry block selection and FSC-certified timbers.</div>
              </div>

              <div className="space-y-1.5">
                <div className="font-serif text-2xl text-[#C6A875]">03. Permanence</div>
                <div className="text-xs text-[#D8CCBA]/70">Engineered to endure generations with 15-year warranty protection.</div>
              </div>
            </div>

            <div className="pt-4">
              <MagneticButton
                onClick={onExploreMaterials}
                cursorText="MATERIALS"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#C6A875] hover:text-white font-semibold transition-colors cursor-pointer border-b border-[#C6A875] pb-1"
              >
                <span>Explore Our Rare Material Library</span>
                <ArrowUpRight size={14} />
              </MagneticButton>
            </div>
          </div>

          {/* Right Column: Architectural Photography Grid */}
          <div ref={rightColRef} className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] bg-[#171717] border border-[#C6A875]/40 overflow-hidden shadow-2xl group">
              <img
                src="/src/assets/images/project_penthouse_kitchen_1794074100537.jpg"
                alt="Velora master craftsman fitting bespoke stone island"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-108"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D1815] via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#171717]/85 backdrop-blur-md border border-white/10">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#C6A875] font-semibold">
                  Hand-Commissioned
                </div>
                <div className="font-serif text-lg text-white mt-0.5">
                  The Milanese Guild Atelier
                </div>
                <div className="text-xs text-[#D8CCBA]/70 mt-1">
                  Every stone edge chamfered and hand-polished by master artisans.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { ArrowUpRight, X, MapPin, Calendar, Check } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getOptimizedImageUrl, handleImageFallback, LUXURY_IMAGE_FALLBACKS } from '../utils/imageUtils';

gsap.registerPlugin(ScrollTrigger);

interface PortfolioSectionProps {
  projects: Project[];
  onConsultFromProject: (projectName: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  projects,
  onConsultFromProject
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const projectsGridRef = useRef<HTMLDivElement>(null);

  const filters = ['All', 'Penthouses', 'Lakeside Villas', 'Urban Lofts', 'Historic Residencies'];

  const filteredProjects = selectedFilter === 'All'
    ? projects
    : projects.filter(p => {
        if (selectedFilter === 'Penthouses') return p.name.includes('Penthouse') || p.location.includes('London');
        if (selectedFilter === 'Lakeside Villas') return p.name.includes('Villa') || p.location.includes('Lake Como');
        if (selectedFilter === 'Urban Lofts') return p.name.includes('Loft') || p.location.includes('New York');
        if (selectedFilter === 'Historic Residencies') return p.name.includes('Vendôme') || p.location.includes('Paris');
        return true;
      });

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (projectsGridRef.current) {
        gsap.fromTo(
          projectsGridRef.current.children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: projectsGridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedFilter]);

  // Subtle 3D tilt for portfolio cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 6;
    const rotY = (x / rect.width) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="py-24 lg:py-32 bg-[#171717] text-[#F5F1E9] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] font-semibold mb-3">
              Installation Portfolio
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F5F1E9] leading-tight text-balance">
              Private Residencies & Architectural Commissions
            </h2>
            <p className="mt-4 text-[#D8CCBA]/80 text-base font-light leading-relaxed">
              An international portfolio of private estates, historic Haussmannian salons, and contemporary penthouse installations completed across London, Como, Zurich, Paris, and Manhattan.
            </p>
          </div>

          <div className="text-xs text-[#D8CCBA]/60 tracking-wider uppercase">
            Global Execution · Commissioned 2024–2026
          </div>
        </div>

        {/* Filter Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar border-b border-[#F5F1E9]/10">
          {filters.map((flt) => (
            <button
              key={flt}
              onClick={() => setSelectedFilter(flt)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.14em] transition-all duration-300 whitespace-nowrap cursor-pointer border-b-2 -mb-[18px] ${
                selectedFilter === flt
                  ? 'border-[#C6A875] text-[#C6A875] font-semibold'
                  : 'border-transparent text-[#D8CCBA]/50 hover:text-[#F5F1E9]'
              }`}
            >
              {flt}
            </button>
          ))}
        </div>

        {/* Projects Editorial Gallery */}
        <div
          ref={projectsGridRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              data-cursor="VIEW PROJECT"
              onClick={() => setActiveProject(proj)}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transition: 'transform 0.25s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out',
                transformStyle: 'preserve-3d'
              }}
              className="group bg-[#1D1815] border border-[#F5F1E9]/10 hover:border-[#C6A875]/70 cursor-pointer flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl"
            >
              {/* Large Project Image with Cinematic Hover Zoom */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#29231F]">
                <img
                  src={getOptimizedImageUrl(proj.image, LUXURY_IMAGE_FALLBACKS.penthouse)}
                  alt={proj.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-108"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => handleImageFallback(e, LUXURY_IMAGE_FALLBACKS.penthouse)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#171717]/85 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-wider text-[#D8CCBA] border border-white/10">
                  <MapPin size={12} className="text-[#C6A875]" />
                  <span>{proj.location}</span>
                </div>

                <div className="absolute top-4 right-4 bg-[#C6A875] text-[#171717] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                  {proj.style}
                </div>
              </div>

              {/* Project Overview */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#C6A875] uppercase tracking-widest mb-1.5 font-medium">
                    <span>{proj.year} Handover</span>
                    <span className="flex items-center gap-1 group-hover:underline">
                      View Project <ArrowUpRight size={14} />
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl lg:text-3xl font-normal text-[#F5F1E9] group-hover:text-[#C6A875] transition-colors mb-3">
                    {proj.name}
                  </h3>

                  <p className="text-sm text-[#D8CCBA]/80 font-light leading-relaxed mb-6 line-clamp-2">
                    {proj.overview}
                  </p>

                  <div className="border-t border-[#F5F1E9]/10 pt-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#D8CCBA]/50 mb-1">
                      Material Specification
                    </div>
                    <div className="text-xs text-[#D8CCBA] font-light">
                      {proj.materialsUsed}
                    </div>
                  </div>
                </div>

                {proj.clientQuote && (
                  <div className="mt-6 pt-4 border-t border-[#F5F1E9]/10 italic text-xs text-[#D8CCBA]/70 font-serif">
                    "{proj.clientQuote}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Lightbox & Architectural Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#171717]/90 backdrop-blur-md animate-fade-in">
          <div className="relative bg-[#1D1815] text-[#F5F1E9] w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#C6A875]/50 shadow-2xl">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-[#171717] text-[#F5F1E9] hover:bg-[#C6A875] hover:text-[#171717] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close project modal"
            >
              <X size={18} />
            </button>

            <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
              <img
                src={getOptimizedImageUrl(activeProject.image, LUXURY_IMAGE_FALLBACKS.penthouse)}
                alt={activeProject.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                onError={(e) => handleImageFallback(e, LUXURY_IMAGE_FALLBACKS.penthouse)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D1815] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C6A875]">
                    {activeProject.style}
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#F5F1E9]">
                    {activeProject.name}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-10 space-y-6">
              <div className="flex flex-wrap items-center gap-6 text-xs text-[#D8CCBA]/80 border-b border-[#F5F1E9]/10 pb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#C6A875]" />
                  {activeProject.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#C6A875]" />
                  Handover: {activeProject.year}
                </span>
                <span>Style: {activeProject.style}</span>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#C6A875] font-semibold mb-2">
                  Architectural Brief & Execution
                </h4>
                <p className="text-sm text-[#D8CCBA] font-light leading-relaxed">
                  {activeProject.overview}
                </p>
              </div>

              <div className="bg-[#171717] p-5 border border-[#F5F1E9]/10">
                <h4 className="text-xs uppercase tracking-[0.2em] text-[#C6A875] font-semibold mb-2">
                  Crafted Materials & Hardware
                </h4>
                <p className="text-xs text-[#D8CCBA]/90 leading-relaxed">
                  {activeProject.materialsUsed}
                </p>
              </div>

              {activeProject.clientQuote && (
                <div className="border-l-2 border-[#C6A875] pl-4 py-1 italic font-serif text-base text-[#F5F1E9]">
                  "{activeProject.clientQuote}"
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <MagneticButton
                  onClick={() => {
                    const name = activeProject.name;
                    setActiveProject(null);
                    onConsultFromProject(name);
                  }}
                  cursorText="RESERVE"
                  className="w-full py-3.5 text-xs uppercase tracking-[0.16em] font-semibold bg-[#C6A875] text-[#171717] hover:bg-[#DFCA9E] shadow-lg"
                >
                  <Check size={16} />
                  <span>Book Consultation for this Architecture</span>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { collectionsData } from '../data/initialContent';
import { KitchenCollection } from '../types';
import { ArrowUpRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getOptimizedImageUrl, handleImageFallback, LUXURY_IMAGE_FALLBACKS } from '../utils/imageUtils';

gsap.registerPlugin(ScrollTrigger);

interface CollectionsSectionProps {
  onSelectForStudio: (collectionTitle: string) => void;
  onBookWithStyle: (collectionTitle: string) => void;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({
  onSelectForStudio,
  onBookWithStyle
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCollection, setActiveCollection] = useState<KitchenCollection | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All',
    'Minimalist',
    'Contemporary',
    'Italian Design',
    'Island Focus',
    'Handleless',
    'European Classic'
  ];

  const filteredCollections = selectedCategory === 'All'
    ? collectionsData
    : collectionsData.filter(c => c.category === selectedCategory);

  // ScrollTrigger card entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
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
  }, [selectedCategory]);

  // Subtle 3D tilt interaction for collection cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 8; // degrees
    const rotY = (x / rect.width) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  return (
    <section
      ref={sectionRef}
      id="collections"
      className="py-24 lg:py-32 bg-[#F5F1E9] text-[#171717] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 lg:mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] font-semibold mb-3">
            Kitchen Collections
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#29231F] leading-tight text-balance">
            Curated Architectural Lines Tailored to Your Residence
          </h2>
          <p className="mt-4 text-[#29231F]/70 text-base font-light leading-relaxed">
            Six distinctive design languages, unified by uncompromising craftsmanship, seamless concealed appliances, and structural monolithic stone forms.
          </p>
        </div>

        {/* Interactive Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar border-b border-[#D8CCBA]/60">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.12em] transition-all duration-300 whitespace-nowrap cursor-pointer border-b-2 -mb-[18px] ${
                selectedCategory === cat
                  ? 'border-[#29231F] text-[#29231F] font-semibold'
                  : 'border-transparent text-[#29231F]/50 hover:text-[#29231F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Collections Grid with 3D Tilt & Cursor Context */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCollections.map((col) => (
            <div
              key={col.id}
              data-cursor="EXPLORE"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transition: 'transform 0.25s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out',
                transformStyle: 'preserve-3d'
              }}
              className="group bg-[#FFFFFF] border border-[#D8CCBA]/50 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-[#C6A875]"
            >
              {/* Image Frame with Smooth Zoom */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#29231F]/5">
                <img
                  src={getOptimizedImageUrl(col.image, LUXURY_IMAGE_FALLBACKS.hero)}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-108"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => handleImageFallback(e, LUXURY_IMAGE_FALLBACKS.hero)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#171717] bg-[#F5F1E9]/90 backdrop-blur-md px-2.5 py-1">
                  {col.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-[#29231F] tracking-wide mb-2 group-hover:text-[#C6A875] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#C6A875] font-medium mb-3">
                    {col.tagline}
                  </p>
                  <p className="text-sm text-[#29231F]/70 font-light leading-relaxed mb-6 line-clamp-3">
                    {col.description}
                  </p>

                  {/* Material Highlights */}
                  <div className="border-t border-[#D8CCBA]/40 pt-4 mb-6">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#29231F]/50 font-medium mb-2">
                      Material Specification
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#29231F]/80">
                      {col.materialsHighlight.map((mat, idx) => (
                        <React.Fragment key={mat}>
                          <span>{mat}</span>
                          {idx < col.materialsHighlight.length - 1 && (
                            <span aria-hidden="true" className="text-[#C6A875]">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Explore Collection Action */}
                <MagneticButton
                  onClick={() => setActiveCollection(col)}
                  cursorText="EXPLORE"
                  className="w-full py-3 text-xs uppercase tracking-[0.16em] font-semibold border border-[#29231F]/20 hover:border-[#29231F] text-[#29231F] hover:bg-[#29231F] hover:text-[#F5F1E9] transition-all duration-200"
                >
                  <span>Explore Collection</span>
                  <ArrowUpRight size={14} />
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collection Detail Modal */}
      {activeCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#171717]/85 backdrop-blur-md animate-fade-in">
          <div className="relative bg-[#F5F1E9] text-[#171717] w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#C6A875]/40 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActiveCollection(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-[#171717] text-[#F5F1E9] hover:bg-[#C6A875] hover:text-[#171717] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close details"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative min-h-[300px] lg:min-h-full bg-[#29231F]">
                <img
                  src={getOptimizedImageUrl(activeCollection.image, LUXURY_IMAGE_FALLBACKS.hero)}
                  alt={activeCollection.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => handleImageFallback(e, LUXURY_IMAGE_FALLBACKS.hero)}
                />
              </div>

              <div className="p-8 lg:p-10 space-y-6">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#C6A875] font-semibold">
                    {activeCollection.category}
                  </span>
                  <h3 className="font-serif text-3xl font-normal text-[#29231F] mt-1">
                    {activeCollection.title}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#29231F]/60 mt-1">
                    {activeCollection.tagline}
                  </p>
                </div>

                <p className="text-sm text-[#29231F]/80 font-light leading-relaxed">
                  {activeCollection.description}
                </p>

                <div className="space-y-3 pt-3 border-t border-[#D8CCBA]">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#29231F] font-semibold">
                    Architectural Specifications
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 text-xs">
                    <div className="flex items-start gap-2 text-[#29231F]/90">
                      <CheckCircle2 size={14} className="text-[#C6A875] shrink-0 mt-0.5" />
                      <span><strong>Island Footprint:</strong> {activeCollection.specs.islandFootprint}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#29231F]/90">
                      <CheckCircle2 size={14} className="text-[#C6A875] shrink-0 mt-0.5" />
                      <span><strong>Cabinetry Style:</strong> {activeCollection.specs.cabinetryStyle}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#29231F]/90">
                      <CheckCircle2 size={14} className="text-[#C6A875] shrink-0 mt-0.5" />
                      <span><strong>Hardware & Mechanics:</strong> {activeCollection.specs.fittings}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[#29231F]/90">
                      <CheckCircle2 size={14} className="text-[#C6A875] shrink-0 mt-0.5" />
                      <span><strong>Appliance Integration:</strong> {activeCollection.specs.applianceIntegration}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <MagneticButton
                    onClick={() => {
                      const title = activeCollection.title;
                      setActiveCollection(null);
                      onSelectForStudio(title);
                    }}
                    cursorText="STUDIO"
                    className="flex-1 py-3 text-xs uppercase tracking-[0.14em] font-semibold bg-[#29231F] text-[#F5F1E9] hover:bg-[#C6A875] hover:text-[#171717]"
                  >
                    <Sparkles size={14} />
                    <span>Open in 3D Studio</span>
                  </MagneticButton>

                  <MagneticButton
                    onClick={() => {
                      const title = activeCollection.title;
                      setActiveCollection(null);
                      onBookWithStyle(title);
                    }}
                    cursorText="RESERVE"
                    className="flex-1 py-3 text-xs uppercase tracking-[0.14em] font-semibold border border-[#29231F] text-[#29231F] hover:bg-[#29231F] hover:text-[#F5F1E9]"
                  >
                    <span>Consult on this Style</span>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Material } from '../types';
import { Sparkles, X, ShieldCheck, Compass, Check } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MaterialGalleryProps {
  materials: Material[];
  onRequestSample: (materialName: string) => void;
}

export const MaterialGallery: React.FC<MaterialGalleryProps> = ({
  materials,
  onRequestSample
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [inspectedMaterial, setInspectedMaterial] = useState<Material | null>(null);
  const [sampleRequested, setSampleRequested] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All',
    'Natural Marble',
    'Quartz Surfaces',
    'Natural Wood Veneers',
    'Italian Laminates',
    'Matte Lacquer Finishes',
    'Luxury Hardware',
    'Designer Cabinet Finishes'
  ];

  const filteredMaterials = activeCategory === 'All'
    ? materials
    : materials.filter(m => m.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 35, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.08,
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
  }, [activeCategory]);

  const handleRequestSample = (mat: Material) => {
    setSampleRequested(mat.id);
    onRequestSample(mat.name);
    setTimeout(() => {
      setSampleRequested(null);
    }, 3000);
  };

  return (
    <section
      ref={sectionRef}
      id="materials"
      className="py-24 lg:py-32 bg-[#29231F] text-[#F5F1E9] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] font-semibold mb-3">
              Sensory Materia
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F5F1E9] leading-tight text-balance">
              Rare Natural Stone, Hand-Rubbed Oaks & Precision Metals
            </h2>
            <p className="mt-4 text-[#D8CCBA]/80 text-base font-light leading-relaxed">
              We travel directly to historic Italian quarries and German timber preserves to hand-select each slab and veneer flitch for exceptional grain alignment and tactile warmth.
            </p>
          </div>

          <div className="text-xs text-[#D8CCBA]/60 tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C6A875]" />
            <span>Tactile Swatch Box Available Upon Request</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar border-b border-[#F5F1E9]/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.14em] transition-all duration-300 whitespace-nowrap cursor-pointer border-b-2 -mb-[18px] ${
                activeCategory === cat
                  ? 'border-[#C6A875] text-[#C6A875] font-semibold'
                  : 'border-transparent text-[#D8CCBA]/60 hover:text-[#F5F1E9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              data-cursor="INSPECT"
              onClick={() => setInspectedMaterial(mat)}
              className="group bg-[#171717] border border-[#F5F1E9]/10 hover:border-[#C6A875] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Texture-focused Image Presentation with Macro Zoom */}
              <div className="relative aspect-square overflow-hidden bg-[#29231F]">
                <img
                  src={mat.image}
                  alt={mat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-115"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-[#C6A875] text-[#171717] p-1.5 text-xs shadow-md">
                  <Sparkles size={14} />
                </div>

                <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.2em] text-[#C6A875] font-medium">
                  {mat.origin}
                </div>
              </div>

              {/* Material Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#D8CCBA]/50 mb-1">
                    {mat.category}
                  </div>
                  <h3 className="font-serif text-xl font-normal text-[#F5F1E9] group-hover:text-[#C6A875] transition-colors mb-2">
                    {mat.name}
                  </h3>
                  <p className="text-xs text-[#D8CCBA]/70 font-light line-clamp-2 leading-relaxed mb-4">
                    {mat.description}
                  </p>
                </div>

                <div className="border-t border-[#F5F1E9]/10 pt-3 flex items-center justify-between text-[11px] text-[#D8CCBA]/80">
                  <span className="truncate pr-2">{mat.finish}</span>
                  <span className="text-[#C6A875] uppercase text-[10px] tracking-wider shrink-0 font-medium group-hover:underline">
                    Inspect
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Material Detail Inspection Modal */}
      {inspectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#171717]/90 backdrop-blur-md animate-fade-in">
          <div className="relative bg-[#1D1815] text-[#F5F1E9] w-full max-w-3xl border border-[#C6A875]/50 shadow-2xl">
            <button
              onClick={() => setInspectedMaterial(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-[#171717] text-[#F5F1E9] hover:bg-[#C6A875] hover:text-[#171717] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close material preview"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative min-h-[320px] bg-black overflow-hidden">
                <img
                  src={inspectedMaterial.image}
                  alt={inspectedMaterial.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-[#171717]/90 p-3 text-center border border-[#C6A875]/30">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C6A875]">
                    Tactile Macro Swatch Texture
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C6A875]">
                    <Compass size={14} />
                    <span>{inspectedMaterial.origin}</span>
                  </div>
                  <h3 className="font-serif text-3xl font-normal text-[#F5F1E9] mt-1">
                    {inspectedMaterial.name}
                  </h3>
                  <div className="text-xs text-[#D8CCBA]/60 uppercase tracking-wider mt-0.5">
                    {inspectedMaterial.category}
                  </div>
                </div>

                <p className="text-sm text-[#D8CCBA]/80 font-light leading-relaxed">
                  {inspectedMaterial.description}
                </p>

                <div className="space-y-2.5 pt-2 border-t border-[#F5F1E9]/10 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F5F1E9]/5">
                    <span className="text-[#D8CCBA]/50 uppercase tracking-wider">Surface Texture</span>
                    <span className="text-[#F5F1E9] font-medium">{inspectedMaterial.finish}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F5F1E9]/5">
                    <span className="text-[#D8CCBA]/50 uppercase tracking-wider">Durability & Care</span>
                    <span className="text-[#F5F1E9] font-medium">{inspectedMaterial.durabilityRating}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F5F1E9]/5">
                    <span className="text-[#D8CCBA]/50 uppercase tracking-wider">Recommended Application</span>
                    <span className="text-[#F5F1E9] font-medium text-right max-w-[60%]">{inspectedMaterial.recommendedUse}</span>
                  </div>
                </div>

                <div className="pt-3">
                  <MagneticButton
                    onClick={() => handleRequestSample(inspectedMaterial)}
                    cursorText="SAMPLE"
                    className="w-full py-3.5 text-xs uppercase tracking-[0.16em] font-semibold bg-[#C6A875] text-[#171717] hover:bg-[#DFCA9E] shadow-lg"
                  >
                    {sampleRequested === inspectedMaterial.id ? (
                      <>
                        <Check size={16} />
                        <span>Sample Added to Consultation Pack</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        <span>Request Physical Swatch in Consultation</span>
                      </>
                    )}
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

import React, { useState, useEffect, useRef } from 'react';
import { StudioConfig } from '../types';
import { Sparkles, Sun, Moon, Sunrise, Layers, Eye, SlidersHorizontal, ArrowRight, Box } from 'lucide-react';
import { ThreeKitchenViewer } from './ThreeKitchenViewer';
import { MagneticButton } from './MagneticButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { handleImageFallback, LUXURY_IMAGE_FALLBACKS } from '../utils/imageUtils';

gsap.registerPlugin(ScrollTrigger);

interface Studio3DSectionProps {
  onStartDesign: (config: StudioConfig) => void;
}

export const Studio3DSection: React.FC<Studio3DSectionProps> = ({ onStartDesign }) => {
  // Configurator state
  const [layout, setLayout] = useState<string>('Island Parallel');
  const [cabinetFinish, setCabinetFinish] = useState<string>('Fluted Canaletto Walnut');
  const [countertop, setCountertop] = useState<string>('Calacatta Viola');
  const [hardware, setHardware] = useState<string>('Brushed Champagne Brass');
  const [lighting, setLighting] = useState<'morning' | 'golden' | 'evening'>('evening');
  const [viewMode, setViewMode] = useState<'webgl3d' | 'perspective' | 'blueprint'>('webgl3d');

  // Before / After Slider state (0 to 100 percentage)
  const [sliderPos, setSliderPos] = useState<number>(50);

  const sectionRef = useRef<HTMLElement>(null);
  const studioBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (studioBoxRef.current) {
        gsap.fromTo(
          studioBoxRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: studioBoxRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const layouts = [
    { id: 'Island Parallel', name: 'Parallel Island', desc: 'Monolithic prep island & tall larder run' },
    { id: 'L-Shaped + Island', name: 'L-Shape & Island', desc: 'Wraparound prep perimeter with central dining' },
    { id: 'Double Monolith', name: 'Double Island', desc: 'Dual dedicated chef & sommelier blocks' },
    { id: 'Peninsula Gourmet', name: 'Peninsula Flow', desc: 'Architectural divider to living lounge' }
  ];

  const cabinetFinishes = [
    { id: 'Fluted Canaletto Walnut', name: 'Fluted Walnut', color: '#543D2B', texture: 'linear-gradient(90deg, #543D2B 50%, #442F20 50%)' },
    { id: 'Smoked Crown Oak', name: 'Smoked Oak', color: '#3A312A', texture: '#3A312A' },
    { id: 'Matte Nero Ingot', name: 'Matte Nero', color: '#1A1A1A', texture: '#1A1A1A' },
    { id: 'Warm Cashmere Lacquer', name: 'Cashmere Lacquer', color: '#D9D0C3', texture: '#D9D0C3' }
  ];

  const countertops = [
    { id: 'Calacatta Viola', name: 'Calacatta Viola', color: '#E8E2DA', accent: '#582C4D' },
    { id: 'Arabescato Corchia', name: 'Arabescato', color: '#EDEDED', accent: '#333333' },
    { id: 'Pietra Grey Marble', name: 'Pietra Grey', color: '#4A4A48', accent: '#E0E0E0' },
    { id: 'Taj Mahal Quartzite', name: 'Taj Mahal', color: '#DDD2C1', accent: '#C4B59D' }
  ];

  const hardwareFinishes = [
    { id: 'Brushed Champagne Brass', name: 'Champagne Brass', color: '#C6A875' },
    { id: 'Burnished Gunmetal', name: 'Burnished Gunmetal', color: '#3E3E3E' },
    { id: 'Knurled Bronze', name: 'Knurled Bronze', color: '#825838' }
  ];

  const currentStudioConfig: StudioConfig = {
    layout,
    finish: cabinetFinish,
    countertop,
    hardware,
    lighting
  };

  const activeCab = cabinetFinishes.find(c => c.id === cabinetFinish) || cabinetFinishes[0];
  const activeStone = countertops.find(c => c.id === countertop) || countertops[0];
  const activeHdw = hardwareFinishes.find(h => h.id === hardware) || hardwareFinishes[0];

  return (
    <section
      ref={sectionRef}
      id="3d-studio"
      className="py-24 lg:py-32 bg-[#F5F1E9] text-[#171717] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] font-semibold mb-3">
            Bespoke 3D Kitchen Design Studio
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#29231F] leading-tight text-balance">
            Visualize Form, Material & Ambient Light Before Installation
          </h2>
          <p className="mt-4 text-[#29231F]/70 text-base font-light leading-relaxed">
            Experience how rare natural stones interact with custom architectural joinery under shifting daylight and warm evening LED illumination with our real-time 3D spatial studio.
          </p>
        </div>

        {/* Studio Interactive Interface Box */}
        <div
          ref={studioBoxRef}
          className="bg-[#171717] text-[#F5F1E9] border border-[#C6A875]/40 shadow-2xl overflow-hidden mb-16"
        >
          {/* Studio Top Control Strip */}
          <div className="p-4 sm:p-6 border-b border-[#29231F] flex flex-wrap items-center justify-between gap-4 bg-[#1D1815]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-none bg-[#C6A875]" />
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#F5F1E9]">
                Interactive Spatial Studio v4.2
              </span>
              <span className="text-xs text-[#D8CCBA]/40 hidden sm:inline">|</span>
              <span className="text-xs text-[#D8CCBA]/60 hidden sm:inline">
                {layout} · {cabinetFinish} · {countertop}
              </span>
            </div>

            {/* View Mode & Lighting Presets */}
            <div className="flex items-center gap-3">
              {/* 3D WebGL vs Perspective vs Blueprint Toggle */}
              <div className="flex items-center bg-[#171717] border border-[#29231F] p-1">
                <button
                  onClick={() => setViewMode('webgl3d')}
                  className={`px-3 py-1 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                    viewMode === 'webgl3d'
                      ? 'bg-[#C6A875] text-[#171717] font-semibold shadow-sm'
                      : 'text-[#D8CCBA]/60 hover:text-[#F5F1E9]'
                  }`}
                >
                  <Box size={13} />
                  Real 3D WebGL
                </button>
                <button
                  onClick={() => setViewMode('perspective')}
                  className={`px-3 py-1 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                    viewMode === 'perspective'
                      ? 'bg-[#C6A875] text-[#171717] font-semibold shadow-sm'
                      : 'text-[#D8CCBA]/60 hover:text-[#F5F1E9]'
                  }`}
                >
                  <Eye size={13} />
                  Room Perspective
                </button>
                <button
                  onClick={() => setViewMode('blueprint')}
                  className={`px-3 py-1 text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                    viewMode === 'blueprint'
                      ? 'bg-[#C6A875] text-[#171717] font-semibold shadow-sm'
                      : 'text-[#D8CCBA]/60 hover:text-[#F5F1E9]'
                  }`}
                >
                  <Layers size={13} />
                  Floor Plan
                </button>
              </div>

              {/* Lighting Preset Buttons */}
              <div className="hidden md:flex items-center bg-[#171717] border border-[#29231F] p-1">
                <button
                  onClick={() => setLighting('morning')}
                  title="5000K Morning Daylight"
                  className={`p-1.5 text-xs transition-colors cursor-pointer ${
                    lighting === 'morning' ? 'bg-[#C6A875] text-[#171717]' : 'text-[#D8CCBA]/60 hover:text-[#F5F1E9]'
                  }`}
                >
                  <Sun size={15} />
                </button>
                <button
                  onClick={() => setLighting('golden')}
                  title="3200K Golden Sunset"
                  className={`p-1.5 text-xs transition-colors cursor-pointer ${
                    lighting === 'golden' ? 'bg-[#C6A875] text-[#171717]' : 'text-[#D8CCBA]/60 hover:text-[#F5F1E9]'
                  }`}
                >
                  <Sunrise size={15} />
                </button>
                <button
                  onClick={() => setLighting('evening')}
                  title="2700K Warm Evening Ambient"
                  className={`p-1.5 text-xs transition-colors cursor-pointer ${
                    lighting === 'evening' ? 'bg-[#C6A875] text-[#171717]' : 'text-[#D8CCBA]/60 hover:text-[#F5F1E9]'
                  }`}
                >
                  <Moon size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Main Visualizer Area & Customization Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Left 8 Cols: Architectural Canvas Display */}
            <div
              data-cursor="INTERACT"
              className="lg:col-span-8 relative bg-gradient-to-b from-[#131110] to-[#1C1714] flex items-center justify-center overflow-hidden"
            >
              {viewMode === 'webgl3d' ? (
                /* Interactive Three.js WebGL 3D Model */
                <ThreeKitchenViewer
                  layout={layout}
                  cabinetFinish={cabinetFinish}
                  countertop={countertop}
                  hardware={hardware}
                  lighting={lighting}
                />
              ) : viewMode === 'perspective' ? (
                /* Dynamic Architectural SVG Kitchen Perspective Renderer */
                <div className="w-full max-w-2xl p-6 lg:p-10 relative">
                  <svg
                    viewBox="0 0 800 500"
                    className="w-full h-auto drop-shadow-2xl transition-all duration-500"
                  >
                    <defs>
                      <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={lighting === 'morning' ? '#2D2824' : lighting === 'golden' ? '#3B291D' : '#1C1613'} />
                        <stop offset="100%" stopColor="#120E0C" />
                      </linearGradient>

                      <linearGradient id="floorGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#25201C" />
                        <stop offset="100%" stopColor="#14100D" />
                      </linearGradient>

                      <pattern id="veinPattern2" width="120" height="80" patternUnits="userSpaceOnUse">
                        <path
                          d="M0,20 Q40,60 80,30 T120,40"
                          fill="none"
                          stroke={activeStone.accent}
                          strokeWidth="2.5"
                          opacity="0.4"
                        />
                      </pattern>

                      <pattern id="cabinetFlute2" width="10" height="20" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="20" stroke="#000000" strokeWidth="1.8" opacity="0.35" />
                        <line x1="5" y1="0" x2="5" y2="20" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.15" />
                      </pattern>

                      <filter id="ledGlow2" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Room Perspective Geometry */}
                    <polygon points="100,50 700,50 700,320 100,320" fill="url(#wallGrad)" />
                    <polygon points="0,0 100,50 100,320 0,420" fill="#1A1513" />
                    <polygon points="0,0 800,0 700,50 100,50" fill="#15110F" />
                    <polygon points="0,420 100,320 700,320 800,420 800,500 0,500" fill="url(#floorGrad2)" />

                    {/* Rear Tall Larder Cabinetry Bank */}
                    <rect x="140" y="70" width="520" height="150" fill={activeCab.color} />
                    {cabinetFinish.includes('Fluted') && (
                      <rect x="140" y="70" width="520" height="150" fill="url(#cabinetFlute2)" />
                    )}
                    <line x1="244" y1="70" x2="244" y2="220" stroke="#120E0C" strokeWidth="2" />
                    <line x1="348" y1="70" x2="348" y2="220" stroke="#120E0C" strokeWidth="2" />
                    <line x1="452" y1="70" x2="452" y2="220" stroke="#120E0C" strokeWidth="2" />
                    <line x1="556" y1="70" x2="556" y2="220" stroke="#120E0C" strokeWidth="2" />

                    {/* Integrated Built-in Miele / Gaggenau Ovens */}
                    <rect x="358" y="90" width="84" height="55" fill="#0A0A0A" stroke={activeHdw.color} strokeWidth="1" />
                    <rect x="358" y="150" width="84" height="55" fill="#0A0A0A" stroke={activeHdw.color} strokeWidth="1" />

                    {/* Recessed Niche Splashback with Stone */}
                    <rect x="140" y="220" width="520" height="40" fill={activeStone.color} />
                    <rect x="140" y="220" width="520" height="40" fill="url(#veinPattern2)" opacity="0.6" />

                    {/* Under-cabinet Warm Linear LED Bar */}
                    <rect
                      x="140"
                      y="218"
                      width="520"
                      height="4"
                      fill={lighting === 'evening' ? '#FFE4A0' : lighting === 'golden' ? '#FFBE6B' : '#EAEAEA'}
                      filter="url(#ledGlow2)"
                      opacity={lighting === 'evening' ? '0.95' : '0.6'}
                    />

                    {/* Centerpiece Island Architecture */}
                    <polygon
                      points="180,310 620,310 660,430 140,430"
                      fill={activeCab.color}
                    />
                    {cabinetFinish.includes('Fluted') && (
                      <polygon
                        points="180,310 620,310 660,430 140,430"
                        fill="url(#cabinetFlute2)"
                      />
                    )}

                    {/* Island Waterfall Countertop Top Face */}
                    <polygon
                      points="160,285 640,285 660,310 140,310"
                      fill={activeStone.color}
                    />
                    <polygon
                      points="160,285 640,285 660,310 140,310"
                      fill="url(#veinPattern2)"
                      opacity="0.85"
                    />

                    {/* Left & Right Waterfall Drops */}
                    <polygon
                      points="140,310 160,285 160,405 140,430"
                      fill={activeStone.color}
                      opacity="0.9"
                    />
                    <polygon
                      points="640,285 660,310 660,430 640,405"
                      fill={activeStone.color}
                      opacity="0.85"
                    />

                    {/* Flush Induction Cooktop */}
                    <polygon
                      points="260,292 370,292 375,302 255,302"
                      fill="#0D0D0D"
                      stroke={activeHdw.color}
                      strokeWidth="1"
                    />

                    {/* Island Integrated Hardware Shadow Line */}
                    <line
                      x1="180"
                      y1="340"
                      x2="620"
                      y2="340"
                      stroke={activeHdw.color}
                      strokeWidth="3"
                      opacity="0.85"
                    />

                    {/* Suspended Minimalist Linear Pendant */}
                    <line x1="300" y1="50" x2="300" y2="170" stroke={activeHdw.color} strokeWidth="1.5" />
                    <line x1="500" y1="50" x2="500" y2="170" stroke={activeHdw.color} strokeWidth="1.5" />
                    <rect x="250" y="170" width="300" height="4" fill={activeHdw.color} />
                    <rect
                      x="250"
                      y="174"
                      width="300"
                      height="3"
                      fill="#FFF5D6"
                      filter="url(#ledGlow2)"
                      opacity="0.85"
                    />
                  </svg>
                </div>
              ) : (
                /* Top-Down Architectural Blueprint Floor Plan */
                <div className="w-full max-w-xl aspect-[4/3] bg-[#0E1521] border border-[#3A4D6B] p-6 relative font-mono text-[11px] text-[#A6C5EA] overflow-hidden m-6">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start border-b border-[#3A4D6B] pb-3">
                      <div>
                        <div className="text-white font-bold tracking-widest uppercase">
                          ARCHITECTURAL SCHEMATIC: {layout.toUpperCase()}
                        </div>
                        <div className="text-[10px] text-[#7A9FC4]">
                          SCALE: 1:20 · CLEARANCE TOLERANCE: 0.1mm · BLUM DYNAMICS
                        </div>
                      </div>
                      <span className="text-[10px] bg-[#1E293B] px-2 py-1 text-[#93C5FD]">REV 4.2</span>
                    </div>

                    <div className="my-auto relative h-56 flex items-center justify-center">
                      <div className="absolute top-2 w-full h-14 border-2 border-[#60A5FA] bg-[#1E293B]/70 flex items-center justify-around px-4 text-[10px] text-white">
                        <span>LARDER 1 (600)</span>
                        <span>GAGGENAU OVENS (760)</span>
                        <span>WINE CELLAR (600)</span>
                        <span>REFRIGERATION (900)</span>
                      </div>

                      <div className="absolute top-20 flex items-center gap-2 text-[10px] text-[#93C5FD]">
                        <span className="h-[1px] w-16 bg-[#60A5FA]" />
                        <span>1,200mm CLEAR PASSAGEWAY</span>
                        <span className="h-[1px] w-16 bg-[#60A5FA]" />
                      </div>

                      <div className="absolute bottom-2 w-4/5 h-20 border-2 border-[#C6A875] bg-[#29231F]/90 flex items-center justify-between px-6 text-[10px] text-[#C6A875]">
                        <div className="text-left">
                          <div className="font-bold">CANTILEVER ISLAND</div>
                          <div className="text-[9px] text-[#D8CCBA]">5200 × 1200 mm</div>
                        </div>
                        <div className="border border-[#C6A875]/50 px-2 py-1 text-[9px]">
                          SURFACE INDUCTION
                        </div>
                        <div className="border border-[#C6A875]/50 px-2 py-1 text-[9px]">
                          INTEGRATED SINK
                        </div>
                        <div className="text-right text-[9px] text-[#D8CCBA]">
                          4-SEAT BAR
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#3A4D6B] pt-2 flex justify-between text-[10px] text-[#7A9FC4]">
                      <span>SPEC: {cabinetFinish} + {countertop}</span>
                      <span>VELORA ARCHITECTURAL SYSTEMS</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Configuration Swatches & Controls */}
            <div className="lg:col-span-4 bg-[#171717] p-6 lg:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#29231F] space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#29231F] pb-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C6A875] font-semibold">
                    <SlidersHorizontal size={14} />
                    <span>Configuration</span>
                  </div>
                  <span className="text-[10px] uppercase text-[#D8CCBA]/50 tracking-wider">
                    Instant Live Render
                  </span>
                </div>

                {/* 1. Layout Selection */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.16em] text-[#D8CCBA]/80 mb-2 font-medium">
                    1. Kitchen Layout
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {layouts.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setLayout(item.id)}
                        className={`p-2.5 text-left text-xs transition-all cursor-pointer border ${
                          layout === item.id
                            ? 'border-[#C6A875] bg-[#29231F] text-[#F5F1E9]'
                            : 'border-[#29231F] bg-[#1C1816]/60 text-[#D8CCBA]/70 hover:border-[#D8CCBA]/40'
                        }`}
                      >
                        <div className="font-medium text-[11px] truncate">{item.name}</div>
                        <div className="text-[9px] text-[#D8CCBA]/50 truncate mt-0.5">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Cabinet Finish Selection */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.16em] text-[#D8CCBA]/80 mb-2 font-medium">
                    2. Cabinetry Facade
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {cabinetFinishes.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCabinetFinish(item.id)}
                        className={`p-2.5 flex items-center gap-2.5 text-left text-xs transition-all cursor-pointer border ${
                          cabinetFinish === item.id
                            ? 'border-[#C6A875] bg-[#29231F] text-[#F5F1E9]'
                            : 'border-[#29231F] bg-[#1C1816]/60 text-[#D8CCBA]/70 hover:border-[#D8CCBA]/40'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ background: item.color }}
                        />
                        <span className="text-[11px] truncate font-medium">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Countertop Selection */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.16em] text-[#D8CCBA]/80 mb-2 font-medium">
                    3. Countertop & Splashback
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {countertops.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCountertop(item.id)}
                        className={`p-2.5 flex items-center gap-2.5 text-left text-xs transition-all cursor-pointer border ${
                          countertop === item.id
                            ? 'border-[#C6A875] bg-[#29231F] text-[#F5F1E9]'
                            : 'border-[#29231F] bg-[#1C1816]/60 text-[#D8CCBA]/70 hover:border-[#D8CCBA]/40'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ background: item.color }}
                        />
                        <span className="text-[11px] truncate font-medium">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Hardware Finish */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.16em] text-[#D8CCBA]/80 mb-2 font-medium">
                    4. Hardware & Shadow Profiles
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {hardwareFinishes.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setHardware(item.id)}
                        className={`p-2 text-center text-xs transition-all cursor-pointer border ${
                          hardware === item.id
                            ? 'border-[#C6A875] bg-[#29231F] text-[#F5F1E9]'
                            : 'border-[#29231F] bg-[#1C1816]/60 text-[#D8CCBA]/70 hover:border-[#D8CCBA]/40'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full mx-auto mb-1 block border border-white/20"
                          style={{ background: item.color }}
                        />
                        <span className="text-[10px] block truncate font-medium">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start 3D Consultation CTA with Magnetic Effect */}
              <div className="pt-4 border-t border-[#29231F]">
                <MagneticButton
                  onClick={() => onStartDesign(currentStudioConfig)}
                  cursorText="START 3D"
                  className="w-full py-3.5 text-xs uppercase tracking-[0.16em] font-semibold bg-[#C6A875] text-[#171717] hover:bg-[#DFCA9E] shadow-lg group"
                >
                  <Sparkles size={14} />
                  <span>Start Your 3D Kitchen Design</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </MagneticButton>
                <div className="text-[10px] text-[#D8CCBA]/60 text-center mt-2 tracking-wider">
                  Pre-fills your consultation with this custom layout
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Before and After Design Concept Slider */}
        <div className="border border-[#D8CCBA]/50 bg-white p-8 lg:p-12 shadow-sm">
          <div className="max-w-2xl mb-8">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C6A875] font-semibold mb-2">
              Transformational Concepts
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#29231F]">
              Before & After: The Architecture of Transformation
            </h3>
            <p className="text-sm text-[#29231F]/70 font-light mt-2 leading-relaxed">
              Drag the interactive comparison divider below to witness how cramped, standard builder kitchens are re-engineered into spacious, light-flooded Velora sanctuaries.
            </p>
          </div>

          {/* Interactive Split Comparison Component */}
          <div
            data-cursor="DRAG"
            className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden select-none border border-[#D8CCBA]/60 bg-[#171717]"
          >
            {/* "After" - Luxury Velora Kitchen (Full layer beneath) */}
            <img
              src="/images/project_penthouse_kitchen.jpg"
              alt="After: Velora custom luxury architectural kitchen installation"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              onError={(e) => handleImageFallback(e, LUXURY_IMAGE_FALLBACKS.penthouse)}
            />
            <div className="absolute top-4 right-4 bg-[#171717]/85 backdrop-blur-md px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#C6A875] border border-[#C6A875]/40 font-semibold z-10">
              AFTER: VELORA ARCHITECTURE
            </div>

            {/* "Before" - Dated standard kitchen (Clipped layer on top) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="/images/collection_italian_kitchen.jpg"
                alt="Before: Outdated closed-off modular kitchen"
                className="absolute inset-0 w-full h-full object-cover filter sepia-[0.35] contrast-[0.85] brightness-[0.7]"
                style={{
                  width: '100%',
                  minWidth: '1000px',
                  height: '100%'
                }}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                onError={(e) => handleImageFallback(e, LUXURY_IMAGE_FALLBACKS.italian)}
              />
              <div className="absolute top-4 left-4 bg-[#171717]/85 backdrop-blur-md px-3.5 py-1.5 text-xs uppercase tracking-widest text-[#D8CCBA] border border-white/20 font-semibold z-10">
                BEFORE: COMPARTMENTALIZED 1990S
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute inset-y-0 w-1 bg-[#C6A875] cursor-ew-resize flex items-center justify-center z-20 shadow-[0_0_15px_rgba(198,168,117,0.7)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#C6A875] text-[#171717] flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white -ml-3.5">
                ↔
              </div>
            </div>

            {/* Native range input overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              aria-label="Before and after transformation slider"
            />
          </div>

          <div className="flex justify-between items-center text-xs text-[#29231F]/60 mt-4 tracking-wider uppercase font-medium">
            <span>← Slide left to view Velora Transformation</span>
            <span>Slide right to view original space →</span>
          </div>
        </div>
      </div>
    </section>
  );
};

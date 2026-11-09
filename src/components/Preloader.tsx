import React, { useEffect, useState, useRef } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const hasFinishedRef = useRef(false);

  const phrases = [
    "INITIALIZING ATELIER",
    "CALIBRATING TUSCAN MARBLE PROVENANCE",
    "ENGAGING 0.1mm CNC JOINERY TOLERANCE",
    "COMPUTING 3D RAY-TRACED ILLUMINATION",
    "VELORA ARCHITECTURE READY"
  ];

  const handleFinish = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  useEffect(() => {
    const duration = 1800; // 1.8s
    const startTime = performance.now();
    let animId: number;

    const updateCounter = (currentTime: number) => {
      if (hasFinishedRef.current) return;
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(rawProgress);

      const phraseStep = Math.min(
        phrases.length - 1,
        Math.floor((rawProgress / 100) * phrases.length)
      );
      setPhraseIndex(phraseStep);

      if (rawProgress < 100) {
        animId = requestAnimationFrame(updateCounter);
      } else {
        handleFinish();
      }
    };

    animId = requestAnimationFrame(updateCounter);

    // Escape key skips preloader
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      onClick={handleFinish}
      className={`fixed inset-0 z-[10000] flex flex-col justify-between bg-[#14110F] text-[#F5F1E9] p-8 sm:p-12 transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] cursor-pointer ${
        isExiting
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      }`}
      title="Click anywhere to enter atelier immediately"
    >
      {/* Top Brand Line */}
      <div className="flex justify-between items-center text-xs tracking-[0.25em] text-[#C6A875] uppercase font-light">
        <span>MILAN · LONDON · NEW YORK</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          className="text-[10px] text-[#D8CCBA]/60 hover:text-[#C6A875] tracking-widest uppercase transition-colors"
        >
          Skip Intro →
        </button>
      </div>

      {/* Centerpiece Logo & Monogram Animation */}
      <div className="my-auto flex flex-col items-center justify-center text-center space-y-6">
        {/* Monogram Box with Animated Border */}
        <div className="relative w-16 h-16 border border-[#C6A875] flex items-center justify-center overflow-hidden">
          <div className="font-serif text-2xl font-bold tracking-widest text-[#C6A875]">
            VK
          </div>
          {/* Subtle light sweep */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C6A875]/25 to-transparent -translate-x-full transition-transform duration-1000"
            style={{ transform: `translateX(${progress * 2 - 100}%)` }}
          />
        </div>

        <div className="space-y-1">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-[0.3em] font-normal text-[#F5F1E9] uppercase">
            VELORA
          </h1>
          <div className="text-xs tracking-[0.45em] text-[#C6A875] uppercase font-light">
            KITCHENS
          </div>
        </div>

        <div className="h-6 flex items-center justify-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#D8CCBA]/70 font-mono transition-all duration-300">
            {phrases[phraseIndex]}
          </p>
        </div>
      </div>

      {/* Bottom Progress Bar & Percentage */}
      <div className="space-y-3 max-w-xl mx-auto w-full">
        <div className="flex justify-between items-center text-xs text-[#D8CCBA]/80 font-mono">
          <span className="uppercase tracking-widest text-[10px]">Loading Precision Atelier</span>
          <span className="tabular-nums text-sm font-semibold text-[#C6A875]">
            {progress}%
          </span>
        </div>

        <div className="w-full h-[2px] bg-[#29231F] overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#8E7348] via-[#C6A875] to-[#DFCA9E] transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-center text-[10px] text-[#D8CCBA]/40 uppercase tracking-widest">
          Click anywhere or press Esc to enter immediately
        </div>
      </div>
    </div>
  );
};

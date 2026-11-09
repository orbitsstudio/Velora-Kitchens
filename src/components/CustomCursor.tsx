import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [cursorText, setCursorText] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  // Use refs for animation coordinates to avoid re-triggering effects
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHoveredRef = useRef(false);

  useEffect(() => {
    // Check if touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      setIsVisible(true);

      // Direct translate for central point
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check for hovered interactive elements
      try {
        const target = e.target as HTMLElement | null;
        const cursorTarget = target?.closest ? target.closest('[data-cursor]') : null;
        const interactiveTarget = target?.closest ? target.closest('button, a, input, select, textarea, [role="button"]') : null;

        if (cursorTarget) {
          const text = cursorTarget.getAttribute('data-cursor') || '';
          setCursorText(text);
          setIsHovered(true);
          isHoveredRef.current = true;
        } else if (interactiveTarget) {
          setCursorText('');
          setIsHovered(true);
          isHoveredRef.current = true;
        } else {
          setCursorText('');
          setIsHovered(false);
          isHoveredRef.current = false;
        }
      } catch {
        // Fallback for non-standard DOM nodes
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth lerp loop for the trailing ring
    const render = () => {
      const speed = isHoveredRef.current ? 0.25 : 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * speed;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * speed;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []); // Run effect only once on mount

  if (isTouchDevice) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Central precise dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-[#C6A875] shadow-[0_0_8px_rgba(198,168,117,0.8)] pointer-events-none"
        style={{ willChange: 'transform' }}
      />

      {/* Trailing circular ring / badge */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-5 -mt-5 rounded-full flex items-center justify-center transition-all duration-200 pointer-events-none ${
          cursorText
            ? 'w-24 h-24 -ml-12 -mt-12 bg-[#29231F]/90 backdrop-blur-sm border border-[#C6A875]/80 shadow-2xl scale-100'
            : isHovered
            ? 'w-14 h-14 -ml-7 -mt-7 border border-[#C6A875] bg-[#C6A875]/15 scale-100'
            : 'w-10 h-10 border border-[#C6A875]/40 bg-transparent scale-100'
        }`}
        style={{ willChange: 'transform' }}
      >
        {cursorText && (
          <span
            ref={textRef}
            className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#F5F1E9] text-center px-2 animate-fade-in select-none"
          >
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};

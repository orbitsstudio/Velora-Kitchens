/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CollectionsSection } from './components/CollectionsSection';
import { MaterialGallery } from './components/MaterialGallery';
import { Studio3DSection } from './components/Studio3DSection';
import { PortfolioSection } from './components/PortfolioSection';
import { AboutSection } from './components/AboutSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BookingSection } from './components/BookingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { Material, Project, StudioConfig } from './types';
import { api } from './services/api';
import { fallbackMaterials, fallbackProjects } from './data/initialContent';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Dynamic materials & projects from API/DB
  const [materials, setMaterials] = useState<Material[]>(fallbackMaterials);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  // Cross-component booking pre-fill state
  const [selectedStudioConfig, setSelectedStudioConfig] = useState<StudioConfig | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<string>('');

  // 1. Lenis Smooth Scrolling integration synced with GSAP ScrollTrigger
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    (window as any).__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);

    return () => {
      gsap.ticker.remove(tickerCb);
      (window as any).__lenis = null;
      lenis.destroy();
    };
  }, []);

  const loadData = async () => {
    try {
      const [m, p] = await Promise.all([api.getMaterials(), api.getProjects()]);
      if (m && m.length > 0) setMaterials(m);
      if (p && p.length > 0) setProjects(p);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const sectionIds = ['collections', 'materials', '3d-studio', 'portfolio', 'craftsmanship', 'booking', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(el, { offset: -70, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleOpenBooking = (customNote?: string) => {
    if (customNote) {
      setSelectedRequirement(customNote);
    }
    scrollToSection('booking');
  };

  const handleStartDesignFromStudio = (config: StudioConfig) => {
    setSelectedStudioConfig(config);
    scrollToSection('booking');
  };

  const handleSelectForStudio = (_collectionTitle: string) => {
    scrollToSection('3d-studio');
  };

  const handleBookWithStyle = (collectionTitle: string) => {
    setSelectedRequirement(`Inquiry for collection: ${collectionTitle}`);
    scrollToSection('booking');
  };

  const handleConsultFromProject = (projectName: string) => {
    setSelectedRequirement(`Inspiration project: ${projectName}`);
    scrollToSection('booking');
  };

  const handleRequestSample = (materialName: string) => {
    setSelectedRequirement(`Requesting tactile swatch sample: ${materialName}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E9] text-[#171717] font-sans selection:bg-[#C6A875]/30 selection:text-[#29231F] relative">
      {/* 1. Preloader Screen on Entry */}
      {!isPreloaderDone && (
        <Preloader onComplete={() => setIsPreloaderDone(true)} />
      )}

      {/* 2. Custom Desktop Cursor */}
      <CustomCursor />

      {/* 3. Top Navigation (Strict Top Bar Contract & Scroll Progress Indicator) */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main>
        {/* 4. Full-screen Cinematic Hero Section */}
        <Hero
          onExploreKitchens={() => scrollToSection('collections')}
          onBookConsultation={() => handleOpenBooking()}
        />

        {/* 5. Kitchen Collections Showcase with 3D Tilt */}
        <CollectionsSection
          onSelectForStudio={handleSelectForStudio}
          onBookWithStyle={handleBookWithStyle}
        />

        {/* 6. Custom 3D Kitchen Design Studio (Interactive WebGL 3D Island Viewer) */}
        <Studio3DSection
          onStartDesign={handleStartDesignFromStudio}
        />

        {/* 7. Premium Material Gallery with Tactile Inspection */}
        <MaterialGallery
          materials={materials}
          onRequestSample={handleRequestSample}
        />

        {/* 8. Project & Installation Portfolio with Staggered Entrance */}
        <PortfolioSection
          projects={projects}
          onConsultFromProject={handleConsultFromProject}
        />

        {/* 9. About the Brand & Craftsmanship */}
        <AboutSection
          onExploreMaterials={() => scrollToSection('materials')}
        />

        {/* 10. Why Choose Us (Six Tenets) */}
        <WhyChooseUs />

        {/* 11. Client Testimonials Carousel */}
        <TestimonialsSection />

        {/* 12. Professional Design Consultation & Booking System */}
        <BookingSection
          initialStudioConfig={selectedStudioConfig}
          initialRequirement={selectedRequirement}
        />

        {/* 13. Contact & Flagship Enquiries */}
        <ContactSection
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Admin Dashboard Modal */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          onMaterialsUpdated={loadData}
          onProjectsUpdated={loadData}
        />
      )}
    </div>
  );
}

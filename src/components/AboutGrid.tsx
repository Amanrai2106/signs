"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import TransitionLink from "./TransitionLink";

const ScrollRotateCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <div style={{ perspective: "1000px" }} className="w-full">
      <motion.div
        ref={ref}
        style={{ rotateX, scale, opacity }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
};

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const TimeDisplay = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return null;

  return (
    <span suppressHydrationWarning>
      {time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}
    </span>
  );
};

const Clock = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time ? time.getSeconds() : 0;
  const minutes = time ? time.getMinutes() : 0;
  const hours = time ? time.getHours() : 0;

  return (
    <div className="relative w-[clamp(12rem,20vw,16rem)] h-[clamp(12rem,20vw,16rem)] rounded-full border-4 border-gray-200 bg-white shadow-2xl overflow-hidden">
      {/* Clock Face Markers - Responsive */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              transform: `rotate(${i * 30}deg)`,
            }}
          >
             <div className="w-1 h-3 bg-gray-300 mx-auto mt-2" />
          </div>
        ))}
      </div>
      
      {/* Center Dot */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 z-20 shadow-md" />

      {/* Hands Container - ensures centering */}
      <div className="absolute inset-0 z-10" style={{ opacity: time ? 1 : 0, transition: 'opacity 0.2s' }}>
          {/* Hour Hand */}
          <div
            className="absolute w-1.5 bg-black rounded-full"
            style={{
              height: "25%",
              bottom: "50%",
              left: "50%",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`,
            }}
          />
          
          {/* Minute Hand */}
          <div
            className="absolute w-1 bg-gray-600 rounded-full"
            style={{
              height: "35%",
              bottom: "50%",
              left: "50%",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${minutes * 6}deg)`,
            }}
          />
          
          {/* Second Hand */}
          <div
            className="absolute w-0.5 bg-orange-500 rounded-full"
            style={{
              height: "40%",
              bottom: "50%",
              left: "50%",
              transformOrigin: "bottom center",
              transform: `translateX(-50%) rotate(${seconds * 6}deg)`,
            }}
          />
      </div>
    </div>
  );
};

const MapVisualization = React.memo(() => {
  // Memoize the dot generation to prevent recalculation on re-renders
  const dots = React.useMemo(() => {
    // Optimized grid resolution for performance
    const rows = 45;
    const cols = 90;
    const width = 800;
    const height = 400;
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    // Detailed world map approximation
    const continents = [
      // North America
      { x: 150, y: 100, r: 60 }, { x: 100, y: 80, r: 35 }, { x: 200, y: 60, r: 30 },
      { x: 80, y: 70, r: 25 }, { x: 180, y: 160, r: 20 },
      // South America
      { x: 240, y: 280, r: 50 }, { x: 220, y: 220, r: 40 }, { x: 250, y: 340, r: 20 },
      // Europe
      { x: 420, y: 90, r: 30 }, { x: 450, y: 70, r: 25 }, { x: 400, y: 70, r: 15 },
      { x: 430, y: 50, r: 15 }, { x: 390, y: 110, r: 10 },
      // Africa
      { x: 430, y: 200, r: 55 }, { x: 460, y: 260, r: 40 }, { x: 480, y: 180, r: 30 },
      { x: 390, y: 190, r: 25 }, { x: 500, y: 190, r: 20 },
      // Asia
      { x: 580, y: 100, r: 70 }, { x: 650, y: 90, r: 60 }, { x: 620, y: 160, r: 45 }, 
      { x: 700, y: 120, r: 35 }, { x: 520, y: 140, r: 25 }, { x: 660, y: 200, r: 30 },
      // Australia & NZ
      { x: 680, y: 300, r: 35 }, { x: 750, y: 320, r: 10 },
      // Greenland
      { x: 280, y: 40, r: 25 },
      // Japan
      { x: 740, y: 110, r: 12 },
      // UK
      { x: 390, y: 75, r: 10 },
      // Indonesia/Islands
      { x: 630, y: 240, r: 15 }, { x: 660, y: 240, r: 10 },
      // Antarctica (Abstract strip)
      { x: 400, y: 390, r: 100 }, { x: 200, y: 390, r: 60 }, { x: 600, y: 390, r: 80 }
    ];

    const isInLand = (x: number, y: number) => {
      return continents.some(land => {
        const dx = x - land.x;
        const dy = y - land.y;
        return dx * dx + dy * dy <= land.r * land.r;
      });
    };

    const generatedDots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellWidth + cellWidth / 2;
        const y = r * cellHeight + cellHeight / 2;
        
        // Use integer-based deterministic hashing for consistent cross-platform rendering
        // This prevents hydration mismatches caused by floating point differences
        const hash = (r * 53 + c * 101) * 137;
        const pseudoRandom = (hash % 1000) / 1000;
        
        // Less random dropout for a fuller map
        if (isInLand(x, y) && pseudoRandom > 0.15) {
          // Deterministic animation properties
          const animHash = (r * 127 + c * 31) * 73;
          const animationRandom = (animHash % 1000) / 1000;
          
          // Only animate 20% of dots to reduce layout thrashing
          const isAnimated = animationRandom > 0.8;
          
          generatedDots.push({ 
            x, 
            y, 
            isAnimated,
            delay: animationRandom * 3,
            duration: 2 + (animationRandom * 3)
          });
        }
      }
    }
    return generatedDots;
  }, []); // Empty dependency array means this only runs once

  return (
    <div className="relative w-full h-48 md:h-full opacity-60">
        <svg viewBox="0 0 800 400" className="w-full h-full">
            {dots.map((dot, i) => (
              <circle 
                key={i} 
                cx={dot.x} 
                cy={dot.y} 
                r={1.5} 
                className={`fill-orange-500/80 ${dot.isAnimated ? 'animate-pulse' : ''}`}
                style={dot.isAnimated ? { 
                  animationDelay: `${dot.delay.toFixed(2)}s`, 
                  animationDuration: `${dot.duration.toFixed(2)}s` 
                } : undefined}
                suppressHydrationWarning
              />
            ))}
            {/* Gradient Line connecting continents */}
             <path 
               d="M 150 100 Q 300 50 420 90 T 580 100 T 680 300" 
               fill="none" 
               stroke="url(#gradient-line)" 
               strokeWidth="1.5" 
               className="opacity-40"
             />
             <defs>
               <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="transparent" />
                 <stop offset="20%" stopColor="#f97316" />
                 <stop offset="80%" stopColor="#f97316" />
                 <stop offset="100%" stopColor="transparent" />
               </linearGradient>
             </defs>
        </svg>
    </div>
  );
});

MapVisualization.displayName = "MapVisualization";

const AboutGrid = () => {
  return (
    <section id="about-grid" className="bg-white text-black font-sans">
      <div className="w-full flex flex-col">
        <div className="flex flex-col w-full">
          <ScrollRotateCard className="w-full border-b border-black/5 bg-white py-16 md:py-24 px-[5px]">
            <div className="w-full bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)] overflow-hidden flex flex-col md:flex-row">
              <div className="flex-1 px-6 py-10 md:px-12 md:py-16 flex flex-col justify-center gap-6">
                <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-orange-500">
                  Signsol Wayfinding Category
                </p>
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-black">
                    Expert navigation<br />systems.
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                    Wayfinding at Signsol is about creating intuitive paths through complex spaces. 
                    We design strategic navigation systems that guide people seamlessly while 
                    integrating with the architectural character.
                  </p>
                </div>
                <p className="text-xl md:text-2xl text-gray-500 leading-relaxed">
                  Our category expertise spans from master-planning campus navigation to 
                  detailed interior directional systems, ensuring every touchpoint enhances 
                  clarity, safety, and the overall user journey.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <TransitionLink href="/services" className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-base md:text-lg font-medium text-white hover:bg-orange-500 transition-colors">
                    View services
                    <span className="text-lg leading-none">→</span>
                  </TransitionLink>
                  <p className="hidden md:flex items-center gap-2 text-xs text-gray-400 uppercase tracking-[0.2em]">
                    Thane, IN
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <TimeDisplay />
                  </p>
                </div>
              </div>
              <div className="flex-1 relative min-h-[260px] md:min-h-[380px] lg:min-h-[440px] bg-gray-100 overflow-hidden">
                <Image
                  src="/wayfinding-category.jpg"
                  alt="Signage and wayfinding design"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 80vw"
                  priority={false}
                />
              </div>
            </div>
          </ScrollRotateCard>
        </div>

        {/* Card 4: Pan India Presence */}
        <ScrollRotateCard
          className="w-full min-h-[90vh] bg-gray-50 flex flex-col md:flex-row items-center relative overflow-hidden"
        >
          <div className="container-wide z-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
            <div className="flex-1 max-w-3xl">
               <p className="text-base md:text-lg font-bold text-orange-600 mb-6 uppercase tracking-[0.4em]">
                Service Reach
              </p>
              <h3 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-10 leading-[0.9] tracking-tighter">
                Collaborating with <br />
                <span className="text-gray-300 italic">top architects</span>
              </h3>
              <p className="p2 text-gray-600 mb-12 max-w-2xl leading-relaxed opacity-90">
                We provide turn-key signage solutions for projects <span className="text-black font-bold border-b-2 border-orange-500">pan India</span>. From strategy to installation, we ensure your vision is executed flawlessly across any location.
              </p>
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-orange-500/10 text-orange-600 rounded-full border border-orange-500/20 text-lg font-bold uppercase tracking-widest">
                 <span className="w-4 h-4 rounded-full bg-orange-500 animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.5)]"></span>
                 Nationwide Service
              </div>
            </div>
            
            <div className="flex-1 w-full md:w-auto h-[400px] md:h-[600px] relative opacity-40 md:opacity-100 pointer-events-none scale-110 md:scale-125">
               <MapVisualization />
            </div>
          </div>
        </ScrollRotateCard>
      </div>
    </section>
  );
};

export default AboutGrid;

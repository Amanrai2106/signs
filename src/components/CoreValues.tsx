"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { services as staticServices } from "@/data/services";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const CoreValues = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [radius, setRadius] = useState(400);
  const [remoteServices, setRemoteServices] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data?.ok && Array.isArray(data.items)) {
          setRemoteServices(data.items);
        }
      } catch {}
    };
    load();
  }, []);

  const services = useMemo(() => {
    return remoteServices.length > 0 ? remoteServices : staticServices;
  }, [remoteServices]);

  useEffect(() => {
    const handleResize = () => {
      // Increased radius for better spread
      setRadius(window.innerWidth < 768 ? 250 : 550);
    };
    
    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const getCardStyle = (index: number) => {
    const total = services.length;
    let offset = (index - activeIndex + total) % total;
    if (offset > total / 2) offset -= total;

    const isActive = offset === 0;
    
    // Improved 3D spread to prevent overlapping
    const theta = offset * (Math.PI / 4); // Increased angle to 45 degrees
    const x = Math.sin(theta) * radius; 
    const z = (Math.cos(theta) * radius) - radius; 
    const rotateY = -offset * 35; // Sharper rotation for depth
    
    let opacity = 1;
    let scale = 1;
    const zIndex = 10 - Math.abs(offset);
    
    if (isActive) {
        scale = 1.05; // Slightly larger center card
        opacity = 1;
    } else {
        scale = 0.85;
        opacity = Math.max(0, 1 - Math.abs(offset) * 0.4); 
    }

    if (Math.abs(offset) > 1.5) opacity = 0; // Hide more distant cards

    return {
        x,
        z,
        rotateY,
        scale,
        opacity,
        zIndex,
        isActive
    };
  };

  return (
    <section className="bg-white min-h-screen flex flex-col items-center justify-center overflow-hidden py-16 relative perspective-2000">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-50 via-white to-white pointer-events-none" />

      <div className="relative z-10 text-center mb-10 px-4">
        <p className="text-sm font-bold tracking-[0.4em] text-orange-600 uppercase mb-4">
          Our Services
        </p>
        <h2 className="text-4xl md:text-7xl font-bold text-black tracking-tight leading-none">
          Design Solutions
        </h2>
      </div>

      {/* 3D Carousel Container */}
      <div className="relative w-full max-w-7xl h-[650px] flex items-center justify-center perspective-[2000px]">
        <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
            {services.map((service, index) => {
                const { x, z, rotateY, scale, opacity, zIndex, isActive } = getCardStyle(index);
                
                return (
                    <motion.div
                        key={service.id}
                        className="absolute top-1/2 left-1/2 w-[90vw] max-w-[320px] md:max-w-[420px] h-[520px] md:h-[580px] -translate-x-1/2 -translate-y-1/2"
                        initial={false}
                        animate={{
                            x,
                            z,
                            rotateY,
                            scale,
                            opacity,
                            zIndex
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 25,
                            mass: 1
                        }}
                        style={{
                            transformStyle: "preserve-3d"
                        }}
                    >
                        {/* Card Content */}
                        <div 
                            className={`w-full h-full p-8 md:p-12 flex flex-col justify-between transition-all duration-700 rounded-[2.5rem] border ${
                                isActive 
                                    ? "bg-white border-black/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)]" 
                                    : "bg-gray-50/80 border-black/5 shadow-xl brightness-95 blur-[1px]"
                            }`}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <span className={`text-6xl md:text-8xl font-black leading-none ${isActive ? "text-black/5" : "text-black/[0.02]"}`}>
                                    0{service.id}
                                </span>
                                {isActive && (
                                    <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-lg group hover:bg-orange-600 transition-colors duration-300">
                                        <ArrowRight size={24} className="-rotate-45" />
                                    </div>
                                )}
                            </div>

                            {/* Body */}
                            <div className="flex-1 flex flex-col justify-center py-6">
                                <h3 className={`text-3xl md:text-5xl font-bold mb-6 leading-[1.1] ${isActive ? "text-black" : "text-gray-400"}`}>
                                    {service.title}
                                </h3>
                                <p className={`p3 leading-relaxed line-clamp-6 ${isActive ? "text-gray-600" : "text-gray-400"}`}>
                                    {service.description}
                                </p>
                            </div>

                            {/* Action */}
                            <div className="mt-auto">
                                {isActive ? (
                                    <Button 
                                        href={`/services/${service.id}`} 
                                        variant="primary" 
                                        className="w-full py-6 rounded-2xl text-base font-bold uppercase tracking-widest shadow-xl shadow-black/10 hover:shadow-orange-500/20"
                                    >
                                        View Details
                                    </Button>
                                ) : (
                                    <div className="w-full py-5 rounded-2xl font-bold text-xs tracking-[0.2em] uppercase flex items-center justify-center bg-black/5 text-gray-300 border border-black/5">
                                        Locked
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>

        {/* Navigation Buttons (Floating Left/Right) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] flex justify-between z-[100] px-4 md:px-0 pointer-events-none">
            <button
                onClick={prevSlide}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-2xl border border-black/5 text-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500 pointer-events-auto hover:scale-110 active:scale-90 group"
                aria-label="Previous Service"
            >
                <ChevronLeft size={28} />
            </button>

            <button
                onClick={nextSlide}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-2xl border border-black/5 text-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-500 pointer-events-auto hover:scale-110 active:scale-90 group"
                aria-label="Next Service"
            >
                <ChevronRight size={28} />
            </button>
        </div>
      </div>

      <div className="mt-12 flex gap-3">
        {services.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                    idx === activeIndex ? "bg-orange-500 w-10" : "bg-black/10 w-2 hover:bg-black/30"
                }`}
            />
        ))}
      </div>
    </section>
  );
};

export default CoreValues;

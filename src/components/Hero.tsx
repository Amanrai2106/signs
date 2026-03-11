"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const slides = [
  {
    title: "ARCHITECTURAL",
    subtitle: "From Experiential Design to wayfinding"
  },
  {
    title: "GRAPHIC",
    subtitle: "We design meaningful connections"
  },
  {
    title: "DESIGN",
    subtitle: "Bold Ideas. Clean Design."
  }
];

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div
      id="home"
      ref={containerRef}
      className="relative z-10 w-full h-[100dvh] text-black overflow-hidden bg-black"
    >
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          className="w-full h-full object-cover block"
        >
          <source src="/bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to ensure text readability if needed, or just dark bg fallback */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Rotating Content - Bottom Left */}
      <div className="absolute bottom-20 left-0 right-0 px-6 md:px-20 z-20 w-full md:w-auto md:max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-2 md:gap-4"
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-bold leading-none tracking-tighter break-words text-white uppercase whitespace-nowrap overflow-hidden text-ellipsis">
              {slides[currentSlide].title}
            </h1>
            <p className="text-base sm:text-lg md:text-3xl text-gray-200 font-light max-w-2xl">
              {slides[currentSlide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8">
          <Button href="/projects" variant="outline" className="px-8 py-3 w-full sm:w-auto text-center justify-center">
            View Project
          </Button>
          <Button href="/contact" variant="primary" className="px-8 py-3 w-full sm:w-auto text-center justify-center">
            Have a Meeting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

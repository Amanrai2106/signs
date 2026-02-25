"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GetInTouch from "@/components/GetInTouch";
import { ArrowUpRight, Sparkles } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";

interface ServiceSubCategory {
  id: string;
  title: string;
  image: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  details?: string[];
  subCategories?: ServiceSubCategory[];
}

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-200, 200], [15, -15]);
  const rotateY = useTransform(mouseX, [-200, 200], [-15, 15]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        perspective: 1000,
      }}
      className="h-full"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full rounded-3xl bg-white border border-gray-200 p-8 flex flex-col justify-between group cursor-pointer hover:border-orange-500 transition-all duration-500 shadow-xl shadow-gray-200/50 overflow-hidden"
      >
        {/* Hover Gradient Effect */}
        <motion.div
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(249, 115, 22, 0.05),
                transparent 80%
              )
            `,
          }}
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
        />

        <div className="relative z-10" style={{ transformStyle: "preserve-3d" }}>
          <div className="flex justify-between items-start mb-8">
            <span className="text-sm font-mono text-orange-600 border border-orange-500/20 px-3 py-1 rounded-full bg-orange-50">
              0{service.id}
            </span>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 45 }}
              className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-colors duration-300"
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.div>
          </div>

          <h3 
            className="text-3xl font-bold text-black mb-4 group-hover:text-orange-600 transition-colors duration-300 uppercase tracking-tight"
            style={{ transform: "translateZ(20px)" }}
          >
            {service.title}
          </h3>
          
          <p 
            className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base"
            style={{ transform: "translateZ(10px)" }}
          >
            {service.description}
          </p>

          <div 
            className="space-y-3 pt-6 border-t border-gray-100"
            style={{ transform: "translateZ(5px)" }}
          >
            {service.details && service.details.map((detail: string, i: number) => (
              <div key={i} className="flex items-center text-sm text-gray-500 group-hover:text-black transition-colors duration-300">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3" />
                {detail}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-black selection:bg-orange-500/30 overflow-hidden relative">
      <Nav />
      
      <main className="pt-32 pb-20 px-6 md:px-12 w-full relative z-10">
        <div className="mb-24 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-10"
          >
            <div className="max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-2 text-orange-600 font-mono text-sm mb-6 tracking-widest uppercase"
              >
                <Sparkles className="w-4 h-4" />
                <span>What We Do</span>
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-none text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                OUR <br />
                SERVICES
              </motion.h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed font-light">
                We craft immersive physical and digital experiences that elevate brands and connect with people in meaningful ways.
              </p>
            </div>
          </motion.div>
        </div>

        <ServicesGrid />
      </main>

      <GetInTouch />
      <Footer />
    </div>
  );
}

function ServicesGrid() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const safeParseArray = (val: any): string[] | undefined => {
    if (!val) return undefined;
    try {
      const parsed = typeof val === "string" ? JSON.parse(val) : val;
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data?.ok && Array.isArray(data.items)) {
          const mapped: Service[] = data.items.map((s: any) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            details: safeParseArray(s.details),
            subCategories: s.subCategories || [],
          }));
          setItems(mapped);
        } else {
          setError("Failed to load services");
        }
      } catch {
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading services...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!items.length) {
    return <p className="text-gray-500">No services found.</p>;
  }

  return (
    <div className="space-y-10 md:space-y-14">
      {items.map((service, index) => {
        const img =
          service.subCategories && service.subCategories.length
            ? service.subCategories[0].image
            : "/imgs/img-1.png";
        const imageFirst = index % 2 === 0;
        return (
          <motion.section
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/40 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[85vh]">
              {imageFirst && (
                <div className="relative h-64 md:h-full min-h-[280px]">
                  <img
                    src={img}
                    alt={service.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="p-8 md:p-12 flex flex-col justify-center md:h-full">
                <span className="text-sm font-mono text-orange-600 mb-4">0{service.id}</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{service.title}</h2>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 whitespace-pre-line">
                  {service.description}
                </p>
                {service.details && service.details.length > 0 && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                    {service.details.slice(0, 6).map((d, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <span className="mt-2 mr-3 h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div>
                  <TransitionLink
                    href={`/services/${service.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white hover:bg-orange-600 transition-colors"
                  >
                    Read More
                    <span className="inline-block w-4 h-4">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7"></path>
                        <path d="M8 7h9v9"></path>
                      </svg>
                    </span>
                  </TransitionLink>
                </div>
              </div>
              {!imageFirst && (
                <div className="relative h-64 md:h-full min-h-[280px]">
                  <img
                    src={img}
                    alt={service.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}

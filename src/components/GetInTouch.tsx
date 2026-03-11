"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";

const GetInTouch = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  useTransform(scrollYProgress, [0, 1], [-50, 0]);

  return (
    <section ref={containerRef} className="bg-black text-white py-24 md:py-32 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-orange-600 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-900 blur-[150px]" />
        </div>

      <div className="w-full max-w-[95%] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          
          <div className="max-w-3xl">
            <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block text-orange-500 font-mono text-sm tracking-widest uppercase mb-6"
            >
                Start a Conversation
            </motion.span>
            
            <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.85] mb-10 !text-white"
            >
              Have a project <br/>
              <span className="text-white/60 italic">in mind?</span>
            </motion.h2>

            <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p2 !text-gray-300 max-w-2xl leading-relaxed"
            >
              Let&apos;s collaborate to build something exceptional. We help ambitious brands define their physical presence with precision and style.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-6"
          >
            <TransitionLink 
                href="/contact" 
                className="group relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full bg-orange-600 hover:bg-white transition-colors duration-500"
            >
                <div className="relative z-10 flex flex-col items-center gap-2 group-hover:text-black transition-colors duration-500">
                    <span className="text-lg font-medium">Get in Touch</span>
                    <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
                </div>
            </TransitionLink>
          </motion.div>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-orange-500">
                    <Mail className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Email us</p>
                    <a href="mailto:hello@signsol.com" className="text-xl hover:text-orange-500 transition-colors">hello@signsol.com</a>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-orange-500">
                    <Phone className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Call us</p>
                    <a href="tel:+911234567890" className="text-xl hover:text-orange-500 transition-colors">+91 123 456 7890</a>
                </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GetInTouch;

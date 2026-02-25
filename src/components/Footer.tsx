'use client';
import React from "react";
import { motion } from "framer-motion";
import TransitionLink from "@/components/TransitionLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

import { Button } from "@/components/ui/Button";

const Footer = ({ hideContactCta = false }: { hideContactCta?: boolean }) => {
  const pathname = usePathname();

  const getContactHref = () => {
    if (pathname?.startsWith('/projects')) {
      const slug = pathname.split('/')[2];
      const proj = projects.find(p => p.id === slug);
      if (proj) {
        return `/contact?category=Project&subcategory=${encodeURIComponent(proj.title)}`;
      }
      return "/contact?category=Project";
    }
    if (pathname?.startsWith('/services')) {
      const sid = Number(pathname.split('/')[2]);
      const svc = services.find(s => s.id === sid);
      if (svc) {
        return `/contact?category=Services&subcategory=${encodeURIComponent(svc.title)}`;
      }
      return "/contact?category=Services";
    }
    return "/contact";
  };

  return (
    <footer className="bg-gray-100 text-black min-h-screen flex flex-col justify-between px-6 md:px-20 py-10 border-t border-black/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
      
      <div className="max-w-[1920px] mx-auto w-full flex-grow flex flex-col justify-center">
        {!hideContactCta ? (
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16">
            {/* Left Column: CTA */}
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mb-10 relative h-20 w-40"
              >
                 <Image src="/logo-purple.png" alt="Signsol Logo" fill className="object-contain" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
              >
                Let&apos;s build <br />
                <span className="text-gray-500 italic font-serif">something epic.</span>
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button href={getContactHref()} variant="primary" className="text-lg px-10 py-5 hover:bg-orange-500 hover:text-white hover:border-orange-500">
                  Have a Meeting
                </Button>
              </motion.div>
            </div>

            {/* Right Column: Contact Info & Links */}
            <div className="flex flex-col justify-between gap-12 lg:w-1/3 lg:items-end lg:text-right">
              {/* Links Grid */}
              <div className="grid grid-cols-2 gap-10 w-full lg:text-left">
                <div>
                  <h4 className="text-gray-500 font-bold mb-6 uppercase tracking-wider text-sm">Sitemap</h4>
                  <ul className="space-y-4">
                    {[
                      { name: "Home", href: "/#home" },
                      { name: "Services", href: "/services" },
                      { name: "News & Ideas", href: "/news" },
                      { name: "About", href: "/about" },
                      { name: "Work", href: "/projects" },
                      { name: "Contact", href: getContactHref() }
                    ].map((item, i) => (
                      <motion.li 
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <TransitionLink href={item.href} className="text-lg hover:text-orange-500 transition-colors">{item.name}</TransitionLink>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-gray-500 font-bold mb-6 uppercase tracking-wider text-sm">Socials</h4>
                  <ul className="space-y-4">
                    {["Instagram", "Twitter", "LinkedIn", "Behance"].map((item, i) => (
                      <motion.li 
                        key={item}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                      >
                        <a href="#" className="text-lg hover:text-orange-500 transition-colors">{item}</a>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="col-span-2">
                  <h4 className="text-gray-500 font-bold mb-6 uppercase tracking-wider text-sm">Office</h4>
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl leading-relaxed max-w-sm"
                  >
                    Varun Arcade, Ghodbunder Road, <br />
                    Manpada, Thane West, <br />
                    Thane, Maharashtra, India
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Contact Page Footer */
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 pt-10">
            {/* Left: Logo */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="lg:w-1/4"
            >
                <div className="relative h-28 w-auto mb-8">
                  <Image src="/logo.png" alt="Signsol Logo" fill className="object-contain object-left brightness-0 opacity-90 hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-gray-600 text-lg max-w-xs leading-relaxed">
                    Crafting digital experiences that leave a lasting impression.
                </p>
            </motion.div>

            {/* Right: Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-20 lg:w-2/3">
                {/* Sitemap */}
                <div>
                  <h4 className="text-gray-500 font-bold mb-6 uppercase tracking-wider text-sm">Sitemap</h4>
                  <ul className="space-y-4">
                    {[
                      { name: "Home", href: "/#home" },
                      { name: "Services", href: "/services" },
                      { name: "News & Ideas", href: "/news" },
                      { name: "About", href: "/#about-grid" },
                      { name: "Work", href: "/projects" },
                      { name: "Contact", href: getContactHref() }
                    ].map((item, i) => (
                      <motion.li 
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <TransitionLink href={item.href} className="text-lg hover:text-orange-500 transition-colors">{item.name}</TransitionLink>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Socials */}
                <div>
                  <h4 className="text-gray-500 font-bold mb-6 uppercase tracking-wider text-sm">Socials</h4>
                  <ul className="space-y-4">
                    {["Instagram", "Twitter", "LinkedIn", "Behance"].map((item, i) => (
                      <motion.li 
                        key={item}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                      >
                        <a href="#" className="text-lg hover:text-orange-500 transition-colors">{item}</a>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Office */}
                <div>
                  <h4 className="text-gray-500 font-bold mb-6 uppercase tracking-wider text-sm">Office</h4>
                  <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-lg leading-relaxed text-gray-600"
                  >
                      Varun Arcade, Ghodbunder Road, <br />
                      Manpada, Thane West, <br />
                      Thane, Maharashtra, India
                  </motion.p>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Copyright */}
      <div className="w-full relative z-10 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-gray-500">
          <p>© 2026 Signsol Design. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

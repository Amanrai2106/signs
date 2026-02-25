"use client";
import React, { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import TransitionLink from "@/components/TransitionLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { X, ArrowRight, Instagram, Linkedin, Twitter, Dribbble } from "lucide-react";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

const Nav = () => {
  const [hidden, setHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolledPastAbout, setIsScrolledPastAbout] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    // Check if scrolled past "about-grid"
    if (pathname === '/') {
        const aboutSection = document.getElementById("about-grid");
        if (aboutSection) {
            // We use a small offset (e.g., 100px) to trigger it slightly before or after
            if (latest >= aboutSection.offsetTop - 100) {
                setIsScrolledPastAbout(true);
            } else {
                setIsScrolledPastAbout(false);
            }
        }
    } else {
        // On other pages, show background after a small scroll
        setIsScrolledPastAbout(latest > 50);
    }

    // Clear previous timeout to reset the "stop" detection
    if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
    }

    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }

    // Set a timeout to detect when scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
        setHidden(false);
    }, 200); // 200ms delay to consider scrolling "stopped"
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

  const links = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "News & Ideas", href: "/news" },
    { name: "Contact", href: getContactHref() },
  ];

  const menuVariants = {
    initial: { x: "-100%" },
    animate: { 
        x: 0, 
        transition: { 
            duration: 0.8, 
            ease: [0.76, 0, 0.24, 1] as const
        } 
    },
    exit: { 
        x: "-100%", 
        transition: { 
            duration: 0.8, 
            ease: [0.76, 0, 0.24, 1] as const
        } 
    }
  };

  const linkContainerVariants = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
  };

  const linkVariants = {
    initial: { x: -80, opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: { 
            duration: 0.8, 
            ease: [0.76, 0, 0.24, 1] as const
        }
    }
  };

  return (
    <>
        {!isMenuOpen && (
          <motion.nav
            variants={{
              visible: { y: 0 },
              hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 left-0 right-0 z-[9999] transition-colors duration-500 ${isScrolledPastAbout ? "bg-white/90 backdrop-blur-sm border-b border-black/10" : ""}`}
          >
            <div className="mx-auto w-[96vw] max-w-[1600px] px-6 md:px-12 py-5 flex justify-between items-center">
              <div className="flex items-center gap-6">
                  <button 
                    onClick={toggleMenu} 
                    className="group flex items-center gap-3 cursor-pointer outline-none"
                  >
                      <div className="flex flex-col gap-1.5 w-8">
                          <span className={`block w-full h-[2px] transition-colors bg-black group-hover:bg-gray-600`}></span>
                          <span className={`block w-2/3 h-[2px] transition-colors group-hover:w-full bg-black group-hover:bg-gray-600`}></span>
                      </div>
                  </button>
      
                  <TransitionLink href="/">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="cursor-pointer relative h-16 w-44"
                    >
                      <Image 
                        src="/logo-purple.png" 
                        alt="Signsol Logo" 
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 120px, 180px"
                        priority
                      />
                    </motion.div>
                  </TransitionLink>
              </div>
      
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 sm:gap-4"
              >
                <Button 
                    href="/services" 
                    variant="outline"
                    className={`hidden md:inline-flex px-6 py-2.5 text-xs hover:bg-black hover:text-white hover:border-black border-black text-black`}
                >
                    Our Services
                </Button>
                
                <Button 
                    href={getContactHref()} 
                    variant="primary"
                    className={`hidden md:inline-flex px-6 py-2.5 text-xs hover:bg-orange-600 hover:text-white hover:border-orange-600`}
                >
                    Have a Meeting
                </Button>
              </motion.div>
            </div>
          </motion.nav>
        )}

        <AnimatePresence mode="wait">
            {isMenuOpen && (
                <motion.div 
                    variants={menuVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="fixed inset-0 bg-black z-[10000] flex flex-col text-white h-[100dvh] w-full overflow-hidden"
                >
                    {/* Menu Header */}
                    <div className="flex items-center px-6 md:px-12 py-5">
                        <button 
                            onClick={toggleMenu} 
                            className="group flex items-center gap-3 cursor-pointer outline-none"
                        >
                            <X size={32} className="text-white group-hover:text-gray-400 transition-colors" />
                        </button>
                    </div>

                    {/* Menu Content */}
                    <div className="flex-grow flex flex-col md:flex-row relative">
                         {/* Left Side (Desktop) */}
                         <div className="hidden md:flex flex-col justify-between w-1/3 p-12 relative">
                             <div className="mt-8 md:mt-10">
                                <p className="text-gray-400 text-lg mb-2">Follow us on our</p>
                                <p className="text-white font-bold text-xl">Social Media Handles</p>
                                
                                <div className="flex gap-5 md:gap-6 mt-8">
                                    <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Instagram size={20} /></a>
                                    <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Twitter size={20} /></a>
                                    <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Linkedin size={20} /></a>
                                    <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Dribbble size={20} /></a>
                                </div>
                             </div>

                             <div className="w-full mb-32 relative h-48">
                                 <Image 
                                    src="/logo.png" 
                                    alt="Signsol" 
                                    fill
                                    className="object-contain object-left brightness-0 invert"
                                 />
                             </div>
                         </div>

                         {/* Right Side Links */}
                         <div className="flex-grow flex flex-col justify-center items-end px-12 md:px-24 gap-6 md:gap-8">
                             <motion.div 
                                variants={linkContainerVariants}
                                initial="initial"
                                animate="animate"
                                className="flex flex-col items-end gap-4 md:gap-6"
                             >
                                 {links.map((link, i) => (
                                     <motion.div 
                                        key={link.name}
                                        variants={linkVariants}
                                        whileHover={{ scale: 1.05, x: -10 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        custom={i}
                                        className="text-right overflow-hidden"
                                     >
                                        <TransitionLink 
                                            href={link.href} 
                                            onClick={toggleMenu}
                                            className="group relative flex items-center justify-end gap-4 text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white/90 hover:text-white transition-colors uppercase"
                                        >
                                            <ArrowRight className="w-8 h-8 md:w-12 md:h-12 text-orange-600 opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
                                            <span>{link.name}</span>
                                        </TransitionLink>
                                     </motion.div>
                                 ))}
                             </motion.div>
                         </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
  );
};

export default Nav;

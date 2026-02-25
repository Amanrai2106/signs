"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GetInTouch from "@/components/GetInTouch";
import { ArrowUpRight, Sparkles, Plus } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
import Image from "next/image";
import { posts, type Post as PostType } from "@/data/posts";

interface ProjectSubCategory {
  id: string;
  title: string;
  image: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  src: string;
  color?: string;
  subCategories?: ProjectSubCategory[];
  href?: string;
}

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
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
        className="relative h-full w-full rounded-3xl bg-white border border-gray-200 p-8 flex flex-col justify-between group cursor-pointer hover:border-orange-500 transition-all duration-500 shadow-xl shadow-gray-200/50 overflow-hidden min-h-[400px]"
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
              0{index + 1}
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
            {project.title}
          </h3>
          
          <p 
            className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base"
            style={{ transform: "translateZ(10px)" }}
          >
            {project.description}
          </p>

          <div 
            className="relative h-48 w-full rounded-2xl overflow-hidden mb-6"
            style={{ transform: "translateZ(5px)" }}
          >
            <Image 
              src={project.src} 
              alt={project.title} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>

          <div 
            className="space-y-3 pt-6 border-t border-gray-100"
            style={{ transform: "translateZ(5px)" }}
          >
            {project.subCategories && project.subCategories.slice(0, 3).map((sub, i) => (
              <div key={i} className="flex items-center text-sm text-gray-500 group-hover:text-black transition-colors duration-300">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3" />
                {sub.title}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ProjectsPage() {
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
                <span>Selected Works</span>
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-none text-black"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                OUR <br />
                PROJECTS
              </motion.h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed font-light">
                A showcase of our finest signage and branding projects, demonstrating our commitment to excellence and innovation.
              </p>
            </div>
          </motion.div>
        </div>

        <ProjectsGrid />

        {/* Featured Posts Section */}
        <FeaturedPostsGrid />
      </main>

      <GetInTouch />
      <Footer />
    </div>
  );
}

function FeaturedPostsGrid() {
  const [visibleCount, setVisibleCount] = useState(9);
  const [remotePosts, setRemotePosts] = useState<PostType[]>([]);
  
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/posts", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data?.ok) {
          setRemotePosts(data.items.filter((p: any) => p.type === "project"));
        }
      } catch {}
    };
    load();
  }, []);

  const featuredPosts = useMemo(() => {
    const base = remotePosts.length > 0 ? remotePosts : posts.filter(p => p.type === "project");
    return base.slice(0, 27); // 3x9 max
  }, [remotePosts]);

  const displayedPosts = featuredPosts.slice(0, visibleCount);

  return (
    <section className="mt-32 pt-20 border-t border-gray-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-orange-600 font-mono text-xs tracking-[0.2em] uppercase mb-4">
            <Plus className="w-3 h-3" />
            <span>Latest Updates</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">FEATURED POSTS</h2>
        </div>
        <p className="text-gray-500 text-sm md:text-base max-w-md font-light">
          Deep dives into our latest processes, material explorations and project milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <AnimatePresence mode="popLayout">
          {displayedPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: (idx % 9) * 0.05 }}
              className="group"
            >
              <TransitionLink 
                href={`/projects/${post.categoryId}/${post.subCategoryId}/${post.id}`}
                className="block"
              >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 mb-6">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-black shadow-sm">
                      {post.categoryId}
                    </span>
                  </div>
                </div>
                
                <div className="px-2">
                  <div className="flex items-center gap-3 text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-3">
                    <span>{post.subCategoryId}</span>
                    <span className="w-1 h-1 bg-orange-500 rounded-full" />
                    <span>Case Study</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-black group-hover:text-orange-600 transition-colors duration-300 leading-tight">
                    {post.title}
                  </h3>
                </div>
              </TransitionLink>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {visibleCount < featuredPosts.length && (
        <div className="mt-20 flex justify-center">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + 9, 27))}
            className="group relative px-10 py-4 rounded-full bg-black text-white overflow-hidden transition-all duration-300 hover:pr-14 active:scale-95 shadow-xl shadow-black/10"
          >
            <span className="relative z-10 font-bold text-sm uppercase tracking-widest">Load More Posts</span>
            <ArrowUpRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>
        </div>
      )}
    </section>
  );
}

function ProjectsGrid() {
  const items: Project[] = [
    {
      id: "wayfinding",
      title: "Wayfinding",
      description:
        "Campus, healthcare and large-format directional systems that keep people moving confidently through complex spaces.",
      src: "/imgs/img-2.png",
      subCategories: [
        { id: "campus", title: "Campus & Institutions", image: "/dev/p-1.jpeg" },
        { id: "healthcare", title: "Hospitals & Healthcare", image: "/imgs/img-3.png" },
        { id: "infrastructure", title: "Transit & Infrastructure", image: "/imgs/img-4.jpeg" },
      ],
      href: "/services/1",
    },
    {
      id: "experiential",
      title: "Experiential",
      description:
        "Immersive brand environments across retail, workplaces and events that turn visitors into engaged participants.",
      src: "/dev/p-2.jpeg",
      subCategories: [
        { id: "retail", title: "Retail Experiences", image: "/imgs/img-1.png" },
        { id: "workplace", title: "Workplace Branding", image: "/imgs/img-2.png" },
        { id: "events", title: "Exhibits & Events", image: "/imgs/img-3.png" },
      ],
      href: "/services/2",
    },
    {
      id: "art-installation",
      title: "Art Installations",
      description:
        "Signature public art, murals and sculptural installations that transform everyday spaces into destinations.",
      src: "/dev/p-1.jpeg",
      subCategories: [
        { id: "public-art", title: "Public Art & Sculptures", image: "/dev/p-1.jpeg" },
        { id: "murals", title: "Murals & Supergraphics", image: "/imgs/img-1.png" },
        { id: "light-art", title: "Light & Interactive Art", image: "/imgs/img-4.jpeg" },
      ],
      href: "/services/3",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {items.map((project, index) => (
        <TransitionLink
          href={project.href ?? `/projects/${project.id}`}
          key={project.id}
          className="block h-full"
        >
          <ProjectCard project={project} index={index} />
        </TransitionLink>
      ))}
    </div>
  );
}

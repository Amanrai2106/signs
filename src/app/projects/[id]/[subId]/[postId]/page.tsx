"use client";
import React, { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GetInTouch from "@/components/GetInTouch";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Calendar, Building2, Layers } from "lucide-react";
import { posts as staticPosts } from "@/data/posts";
import { projects as staticProjects } from "@/data/projects";

type ProjectSubCategory = { id: string; title: string; image: string };

type Project = {
  id: string;
  title: string;
  subCategories?: ProjectSubCategory[];
};

type Post = {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryId: string;
  subCategoryId: string;
  type: "project" | "service";
  client?: string;
  location?: string;
  year?: string;
  scope?: string;
  challengeTitle?: string;
  challengeDescription?: string;
  challengeItems?: string; // JSON string
  solutionTitle?: string;
  solutionDescription?: string;
  solutionItems?: string; // JSON string
  galleryImages?: string; // JSON string
};

export default function ProjectPostPage({ params }: { params: Promise<{ id: string; subId: string; postId: string }> }) {
  const { id, subId, postId } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [subCategory, setSubCategory] = useState<ProjectSubCategory | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        
        // 1. Try fetching post from API first
        let currentPost: Post | null = null;
        try {
          const res = await fetch(`/api/posts/${postId}`, { cache: "no-store" });
          const data = await res.json();
          if (res.ok && data?.ok) {
            currentPost = data.item;
          }
        } catch {}

        const fromStatic = staticProjects.find((p) => p.id === id) as any | undefined;
        
        let mappedProject: Project | null = null;
        let foundSub: ProjectSubCategory | null = null;

        if (fromStatic) {
          const p = fromStatic;
          mappedProject = {
            id: p.id,
            title: p.title,
            subCategories: p.subCategories || [],
          };
          foundSub = mappedProject.subCategories?.find((sc) => sc.id === subId) || null;
        }

        // If post came from API, we can derive project/subCategory info if missing from static
        if (currentPost && (!mappedProject || !foundSub)) {
          if (!mappedProject) {
            mappedProject = {
              id: currentPost.categoryId,
              title: currentPost.categoryId.charAt(0).toUpperCase() + currentPost.categoryId.slice(1),
              subCategories: []
            };
          }
          if (!foundSub) {
            foundSub = {
              id: currentPost.subCategoryId,
              title: currentPost.subCategoryId.charAt(0).toUpperCase() + currentPost.subCategoryId.slice(1),
              image: currentPost.image
            };
          }
        }

        const allPosts = (staticPosts as Post[]).filter((pp) => pp.type === "project");
        
        // If not from API, use static
        if (!currentPost) {
          currentPost = allPosts.find(
            (pp) => pp.id === postId && pp.categoryId === id && pp.subCategoryId === subId
          ) || null;
        }

        if (!mappedProject || !foundSub || !currentPost) {
          setError("Project or Subcategory or Post not found");
          setLoading(false);
          return;
        }

        setProject(mappedProject);
        setSubCategory(foundSub);
        setPost(currentPost);
        const related = allPosts
          .filter((pp) => pp.subCategoryId === subId && pp.id !== postId)
          .slice(0, 2);
        setRelatedPosts(related);

        setError("");
      } catch {
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, subId, postId]);

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Animation Variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const stagger: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  if (loading) {
    return (
      <main
        ref={containerRef}
        className="bg-[#f7f9fc] min-h-screen flex items-center justify-center text-black"
      >
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (error || !project || !subCategory || !post) {
    return (
      <main
        ref={containerRef}
        className="bg-[#f7f9fc] min-h-screen flex flex-col items-center justify-center text-black"
      >
        <Nav />
        <p className="mt-10 text-gray-500">This project post could not be found.</p>
      </main>
    );
  }

  return (
    <main
      ref={containerRef}
      className="bg-[#f7f9fc] min-h-screen text-black selection:bg-orange-500/30 overflow-hidden relative"
    >
      <Nav />

      {/* Hero Section - Full Screen & Immersive */}
      <section className="relative w-full h-screen flex items-end pb-20 px-6 md:px-12 overflow-hidden">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </motion.div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <TransitionLink 
            href={`/projects/${id}/${subId}`} 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 backdrop-blur-md w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-medium uppercase tracking-widest">Back to {subCategory.title}</span>
          </TransitionLink>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            style={{ y: textY }}
            className="max-w-5xl"
          >
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 mb-6">
                 <span className="px-4 py-1.5 rounded-full bg-orange-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-600/20 border border-orange-500/50">
                  {project.title}
                </span>
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                <span className="text-white/90 text-sm font-medium uppercase tracking-widest">
                  {subCategory.title}
                </span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1] text-white">
              {post.title}
            </motion.h1>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 right-10 z-10 hidden md:flex flex-col items-center gap-2 text-white/50"
        >
            <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white/50 to-transparent relative overflow-hidden">
                <motion.div 
                    animate={{ y: [-20, 20] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-1/2 bg-white"
                />
            </div>
        </motion.div>
      </section>

      {/* Project Stats Bar - Properly Divided */}
      <section className="relative z-20 -mt-10 mx-6 md:mx-12">
        <div className="w-full max-w-[95%] mx-auto bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <Building2 className="w-4 h-4 text-orange-500" />
                        <span>Client</span>
                    </div>
                    <p className="text-xl font-serif text-gray-900">{post.client || "Confidential"}</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span>Location</span>
                    </div>
                    <p className="text-xl font-serif text-gray-900">{post.location || "New Delhi"}</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span>Year</span>
                    </div>
                    <p className="text-xl font-serif text-gray-900">{post.year || "2024"}</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <Layers className="w-4 h-4 text-orange-500" />
                        <span>Scope</span>
                    </div>
                    <p className="text-xl font-serif text-gray-900">{post.scope || "End-to-End"}</p>
                </div>
            </div>
        </div>
      </section>

      {/* Detailed Content Sections */}
      <section className="py-24 md:py-32 px-6 md:px-12 w-full max-w-[95%] mx-auto bg-white rounded-[3rem] shadow-lg">
        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
            <div className="lg:col-span-4 sticky top-32">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Project Overview</h2>
                <div className="h-1 w-20 bg-orange-500 mb-6" />
            </div>
            <div className="lg:col-span-8">
                <div className="text-lg md:text-xl leading-relaxed text-gray-600 whitespace-pre-wrap">
                    {post.description}
                </div>
            </div>
        </div>

        {/* The Challenge - Split Layout */}
        <div className="bg-gray-50 rounded-[3rem] overflow-hidden mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 md:p-20 flex flex-col justify-center">
                    <span className="text-orange-600 font-mono text-sm tracking-widest uppercase mb-4">01. The Challenge</span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 text-black">{post.challengeTitle || "Navigating Complexity"}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {post.challengeDescription || `Every project comes with its unique set of constraints. For ${post.title}, the main challenge was balancing the architectural integrity with the need for clear, functional signage and branding elements.`}
                    </p>
                    <ul className="space-y-4">
                        {(post.challengeItems ? JSON.parse(post.challengeItems) : ['Strict architectural guidelines', 'High-traffic durability requirements', 'Complex wayfinding needs']).map((item: string, i: number) => (
                            <li key={i} className="flex items-center gap-3 text-gray-700">
                                <span className="w-2 h-2 rounded-full bg-orange-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="relative h-[400px] lg:h-auto min-h-[500px]">
                    <Image
                        src={post.image}
                        alt="Challenge visual"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                </div>
            </div>
        </div>

        {/* Full Width Parallax Image */}
        <div className="w-full h-[60vh] md:h-[80vh] relative rounded-3xl overflow-hidden mb-32 group">
             <Image
                src={post.image}
                alt="Immersive View"
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-700">
                <div className="bg-white/90 backdrop-blur-md px-10 py-6 rounded-full transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                    <span className="text-black font-bold tracking-widest uppercase text-sm">Immersive Experience</span>
                </div>
            </div>
        </div>

        {/* The Solution - Split Layout Reversed */}
        <div className="bg-black text-white rounded-[3rem] overflow-hidden mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[400px] lg:h-auto min-h-[500px] order-2 lg:order-1">
                    <Image
                        src={post.galleryImages && JSON.parse(post.galleryImages).length > 0 ? JSON.parse(post.galleryImages)[0] : post.image}
                        alt="Solution visual"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                </div>
                <div className="p-12 md:p-20 flex flex-col justify-center order-1 lg:order-2">
                    <span className="text-orange-500 font-mono text-sm tracking-widest uppercase mb-4">02. The Solution</span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6">{post.solutionTitle || "Precision & Elegance"}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                        {post.solutionDescription || "We developed a comprehensive design language that utilizes premium materials and clean lines. The result is a system that not only guides users effectively but also enhances the overall aesthetic of the space."}
                    </p>
                    <div className="grid grid-cols-2 gap-8 mt-4">
                        {(post.solutionItems ? JSON.parse(post.solutionItems) : [{label: 'Custom Made', value: '100%'}, {label: 'Turnaround', value: '4 Weeks'}]).map((item: any, i: number) => (
                            <div key={i}>
                                <span className="block text-3xl font-bold text-orange-500 mb-2">{item.value}</span>
                                <span className="text-sm text-gray-400 uppercase tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Gallery Grid */}
        {post.galleryImages && JSON.parse(post.galleryImages).length > 0 && (
          <div className="mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-2 block">Visual Journey</span>
                <h2 className="text-4xl md:text-6xl font-bold text-black tracking-tighter">PROJECT GALLERY</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {JSON.parse(post.galleryImages).map((img: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-100 group ${i % 4 === 0 ? 'md:col-span-2 md:aspect-[16/9]' : ''}`}
                >
                  <Image src={img} alt={`Gallery ${i}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Related Projects */}
      {relatedPosts.length > 0 && (
        <section className="py-24 px-6 md:px-12 bg-gray-50 border-t border-gray-200">
            <div className="w-full max-w-[95%] mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-2 block">More Projects</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-black">Explore {subCategory.title}</h2>
                    </div>
                    <TransitionLink href={`/projects/${id}/${subId}`} className="hidden md:flex items-center gap-2 text-black font-bold hover:text-orange-600 transition-colors group">
                        View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </TransitionLink>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {relatedPosts.map((related) => (
                        <TransitionLink key={related.id} href={`/projects/${id}/${subId}/${related.id}`}>
                            <motion.div 
                                whileHover={{ y: -10 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-6 shadow-md group-hover:shadow-2xl transition-all duration-500">
                                    <Image
                                        src={related.image}
                                        alt={related.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                    
                                    <div className="absolute bottom-6 left-6 right-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-black">
                                            View Project
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-black group-hover:text-orange-600 transition-colors mb-2">{related.title}</h3>
                                <p className="text-gray-500 line-clamp-2">{related.description}</p>
                            </motion.div>
                        </TransitionLink>
                    ))}
                </div>
            </div>
        </section>
      )}

      <GetInTouch />
      <Footer hideContactCta={true} />
    </main>
  );
}

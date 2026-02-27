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
import { services as staticServices } from "@/data/services";

type ServiceSubCategory = { id: string; title: string; image: string };

type Service = {
  id: number;
  title: string;
  subCategories?: ServiceSubCategory[];
};

type Post = {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryId: string;
  subCategoryId: string;
  type: "project" | "service";
};

export default function ServicePostPage({ params }: { params: Promise<{ id: string; subId: string; postId: string }> }) {
  const { id, subId, postId } = use(params);
  const [service, setService] = useState<Service | null>(null);
  const [subCategory, setSubCategory] = useState<ServiceSubCategory | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const fromStatic = staticServices.find((s) => s.id === Number(id)) as any | undefined;
        if (!fromStatic) {
          setError("Service not found");
          setLoading(false);
          return;
        }

        const s = fromStatic;
        const mappedService: Service = {
          id: s.id,
          title: s.title,
          subCategories: s.subCategories || [],
        };
        setService(mappedService);
        const foundSub = mappedService.subCategories?.find((sc) => sc.id === subId) || null;
        setSubCategory(foundSub);

        // 1. Try fetching post from API first
        let currentPost: Post | null = null;
        try {
          const res = await fetch(`/api/posts/${postId}`, { cache: "no-store" });
          const data = await res.json();
          if (res.ok && data?.ok) {
            currentPost = data.item;
          }
        } catch {}

        // 2. Load all posts to find related ones from database too
        let dbPosts: Post[] = [];
        try {
          const res = await fetch("/api/posts", { cache: "no-store" });
          const data = await res.json();
          if (res.ok && data?.ok) {
            dbPosts = (data.items || []).filter((p: any) => p.type === "service" && p.categoryId === String(id));
          }
        } catch {}

        // Combine static and db posts
        const allPosts = [...dbPosts];
        (staticPosts as Post[]).filter((p) => p.type === "service" && p.categoryId === String(id)).forEach(sp => {
          if (!allPosts.find(ap => ap.id === sp.id)) {
            allPosts.push(sp);
          }
        });

        const current = currentPost || allPosts.find((p) => p.id === postId) || null;
        setPost(current);
        const related = allPosts
          .filter((p) => p.subCategoryId === subId && p.id !== postId)
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
      <main ref={containerRef} className="bg-[#f7f9fc] min-h-screen flex items-center justify-center text-black">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (error || !service || !subCategory || !post) {
    return (
      <main ref={containerRef} className="bg-[#f7f9fc] min-h-screen flex flex-col items-center justify-center text-black">
        <Nav />
        <p className="mt-10 text-gray-500">This service post could not be found.</p>
      </main>
    );
  }

  return (
    <main ref={containerRef} className="bg-[#f7f9fc] min-h-screen text-black selection:bg-orange-500/30 overflow-hidden relative">
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
            href={`/services/${id}/${subId}`} 
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
                  {service.title}
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

      {/* Service Stats Bar - Properly Divided */}
      <section className="relative z-20 -mt-10 mx-6 md:mx-12">
        <div className="w-full max-w-[95%] mx-auto bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <Building2 className="w-4 h-4 text-orange-500" />
                        <span>Client</span>
                    </div>
                    <p className="text-xl font-serif text-gray-900">Confidential</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span>Location</span>
                    </div>
                    <p className="text-xl font-serif text-gray-900">New Delhi</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span>Year</span>
                    </div>
                    <p className="text-xl font-serif text-gray-900">2024</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                        <Layers className="w-4 h-4 text-orange-500" />
                        <span>Scope</span>
                    </div>
                    <p className="text-xl font-serif text-gray-900">End-to-End</p>
                </div>
            </div>
        </div>
      </section>

      {/* Detailed Content Sections */}
      <section className="py-24 md:py-32 px-6 md:px-12 w-full max-w-[95%] mx-auto bg-white rounded-[3rem] shadow-lg">
        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
            <div className="lg:col-span-4 sticky top-32">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Service Overview</h2>
                <div className="h-1 w-20 bg-orange-500 mb-6" />
                <p className="text-gray-500 text-lg">
                    An in-depth look at how we deliver excellence in {subCategory.title}, focusing on quality and innovation.
                </p>
            </div>
            <div className="lg:col-span-8">
                <p className="text-2xl md:text-3xl font-light leading-relaxed text-gray-800 mb-10">
                    {post.description}
                </p>
                <div className="prose prose-lg prose-gray max-w-none text-gray-600 leading-loose">
                    <p>
                        This project represents a prime example of our capabilities in {subCategory.title.toLowerCase()}. 
                        Our team worked diligently to understand the specific requirements and deliver a solution 
                        that not only meets but exceeds expectations.
                    </p>
                    <p>
                        By leveraging our expertise in the field and utilizing state-of-the-art technology, 
                        we ensured that every aspect of the project was executed with precision and care.
                    </p>
                </div>
            </div>
        </div>

        {/* The Challenge - Split Layout */}
        <div className="bg-gray-50 rounded-[3rem] overflow-hidden mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 md:p-20 flex flex-col justify-center">
                    <span className="text-orange-600 font-mono text-sm tracking-widest uppercase mb-4">01. The Challenge</span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 text-black">Addressing Needs</h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        Every service engagement presents unique challenges. For {post.title}, we focused on 
                        overcoming specific obstacles to deliver a seamless experience.
                    </p>
                    <ul className="space-y-4">
                        {['Custom requirements analysis', 'Tight timeline management', 'Quality assurance protocols'].map((item, i) => (
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
                    <span className="text-black font-bold tracking-widest uppercase text-sm">Service Excellence</span>
                </div>
            </div>
        </div>

        {/* The Solution - Split Layout Reversed */}
        <div className="bg-black text-white rounded-[3rem] overflow-hidden mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[400px] lg:h-auto min-h-[500px] order-2 lg:order-1">
                    <Image
                        src={post.image}
                        alt="Solution visual"
                        fill
                        className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                </div>
                <div className="p-12 md:p-20 flex flex-col justify-center order-1 lg:order-2">
                    <span className="text-orange-500 font-mono text-sm tracking-widest uppercase mb-4">02. The Outcome</span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-6">Delivering Value</h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                        Our comprehensive approach resulted in a solution that integrates perfectly with the client&apos;s operations. 
                        We pride ourselves on delivering results that are both functional and visually impressive.
                    </p>
                    <div className="grid grid-cols-2 gap-8 mt-4">
                        <div>
                            <span className="block text-3xl font-bold text-orange-500 mb-2">100%</span>
                            <span className="text-sm text-gray-400 uppercase tracking-widest">Satisfaction</span>
                        </div>
                        <div>
                            <span className="block text-3xl font-bold text-orange-500 mb-2">On Time</span>
                            <span className="text-sm text-gray-400 uppercase tracking-widest">Delivery</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-24 px-6 md:px-12 bg-gray-50 border-t border-gray-200">
            <div className="w-full max-w-[95%] mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="text-orange-600 font-bold uppercase tracking-widest text-sm mb-2 block">More Services</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-black">Explore {subCategory.title}</h2>
                    </div>
                    <TransitionLink href={`/services/${id}/${subId}`} className="hidden md:flex items-center gap-2 text-black font-bold hover:text-orange-600 transition-colors group">
                        View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </TransitionLink>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {relatedPosts.map((related) => (
                        <TransitionLink key={related.id} href={`/services/${id}/${subId}/${related.id}`}>
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
                                            View Service
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

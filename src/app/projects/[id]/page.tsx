"use client";

import React, { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GetInTouch from "@/components/GetInTouch";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
import Image from "next/image";
import { projects as staticProjects } from "@/data/projects";

type ProjectSubCategory = { id: string; title: string; image: string };

type Project = {
  id: string;
  title: string;
  description: string;
  src: string;
  color?: string;
  subCategories?: ProjectSubCategory[];
  relatedServiceIds?: number[];
};

type Service = {
  id: number;
  title: string;
  description: string;
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

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [projectRes, postsRes] = await Promise.all([
          fetch(`/api/projects/${id}`, { cache: "no-store" }),
          fetch("/api/posts", { cache: "no-store" }),
        ]);
        const projectData = await projectRes.json();
        const postsData = await postsRes.json();

        const safeParseIds = (val: any): number[] | undefined => {
          if (!val) return undefined;
          try {
            const parsed = typeof val === "string" ? JSON.parse(val) : val;
            if (Array.isArray(parsed)) {
              return parsed.map((x: any) => Number(x)).filter((n: any) => Number.isFinite(n));
            }
            return undefined;
          } catch {
            return undefined;
          }
        };

        let sourceProject: any | null = null;
        if (projectRes.ok && projectData?.ok && projectData.item) {
          sourceProject = projectData.item;
        } else {
          const fallback = staticProjects.find((sp) => sp.id === id);
          if (fallback) {
            sourceProject = {
              id: fallback.id,
              title: fallback.title,
              description: fallback.description,
              src: fallback.src,
              color: fallback.color ?? null,
              relatedServiceIds: fallback.relatedServiceIds ?? null,
              subCategories: fallback.subCategories || [],
            };
          }
        }

        if (!sourceProject) {
          setError("Project not found");
          setLoading(false);
          return;
        }

        const p = sourceProject;
        const mappedProject: Project = {
          id: p.id,
          title: p.title,
          description: p.description,
          src: p.src,
          color: p.color ?? undefined,
          subCategories: p.subCategories || [],
          relatedServiceIds: safeParseIds(p.relatedServiceIds),
        };
        setProject(mappedProject);

        if (postsRes.ok && postsData?.ok && Array.isArray(postsData.items)) {
          setPosts(postsData.items);
        } else {
          setPosts([]);
        }

        if (mappedProject.relatedServiceIds && mappedProject.relatedServiceIds.length) {
          const servicesRes = await fetch("/api/services", { cache: "no-store" });
          const servicesData = await servicesRes.json();
          if (servicesRes.ok && servicesData?.ok && Array.isArray(servicesData.items)) {
            const mappedServices: Service[] = servicesData.items
              .filter((s: any) => mappedProject.relatedServiceIds?.includes(s.id))
              .map((s: any) => ({
                id: s.id,
                title: s.title,
                description: s.description,
              }));
            setRelatedServices(mappedServices);
          }
        } else {
          setRelatedServices([]);
        }

        setError("");
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Nav />
        <p className="mt-10 text-gray-500">Project not found.</p>
      </div>
    );
  }

  const projectPosts = posts.filter((p) => p.type === "project" && p.categoryId === project.id);

  const filteredPosts =
    activeFilter === "all" ? projectPosts : projectPosts.filter((p) => p.subCategoryId === activeFilter);

  const layoutSpans = [
    "lg:col-span-2 lg:row-span-2",
    "lg:row-span-1",
    "lg:row-span-1",
    "lg:row-span-2",
    "lg:col-span-2 lg:row-span-1",
    "lg:row-span-1",
    "lg:row-span-1",
    "lg:row-span-2",
    "lg:row-span-1",
  ];

  return (
    <div className="min-h-screen text-black selection:bg-orange-500/30 overflow-x-hidden relative">
      <Nav />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 bg-white rounded-3xl shadow-sm">
          
          {/* Header & Filter Section */}
          <div className="mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter"
            >
              {project.title}
            </motion.h1>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3 md:gap-4 pb-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                        activeFilter === 'all' 
                        ? 'bg-black text-white border-black' 
                        : 'bg-transparent text-gray-500 border-gray-300 hover:border-black hover:text-black'
                    }`}
                >
                    All
                </button>
                {project.subCategories?.map((sub) => (
                    <button
                        key={sub.id}
                        onClick={() => setActiveFilter(sub.id)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                            activeFilter === sub.id 
                            ? 'bg-black text-white border-black' 
                            : 'bg-transparent text-gray-500 border-gray-300 hover:border-black hover:text-black'
                        }`}
                    >
                        {sub.title}
                    </button>
                ))}
            </div>
          </div>

          {/* Posts Grid - Bento layout */}
          <section className="mt-10">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[220px] md:auto-rows-[260px] lg:auto-rows-[280px] gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post, index) => {
                    const subCategoryTitle = project.subCategories?.find(
                      (s) => s.id === post.subCategoryId
                    )?.title;

                    return (
                      <TransitionLink
                        key={post.id}
                        href={`/projects/${id}/${post.subCategoryId}/${post.id}`}
                        className={`group relative overflow-hidden rounded-3xl bg-gray-200 ${layoutSpans[index] || ""}`}
                      >
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="relative w-full h-full"
                        >
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            {subCategoryTitle && (
                              <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">
                                {subCategoryTitle}
                              </p>
                            )}
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                              {post.title}
                            </h3>
                            <div className="flex items-center justify-between mt-3 border-t border-white/20 pt-3">
                              <span className="text-gray-200 text-xs md:text-sm line-clamp-1">
                                {post.description}
                              </span>
                              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md group-hover:bg-white group-hover:text-black transition-colors">
                                <ArrowUpRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </TransitionLink>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-20 text-center text-gray-500">
                <p>No projects found in this category yet.</p>
              </div>
            )}
          </section>

          {/* Related Services Section */}
          {relatedServices.length > 0 && (
            <section className="mt-32">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 uppercase">
                    Our Specialized Services
                  </h2>
                  <p className="text-gray-600 text-lg">
                    We offer a range of specialized services tailored for {project.title.toLowerCase()} environments.
                  </p>
                </div>
                <TransitionLink 
                  href="/services" 
                  className="group flex items-center gap-2 text-black font-bold uppercase tracking-widest text-sm"
                >
                  Explore All Services
                  <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </TransitionLink>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedServices.map((service, idx) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <TransitionLink 
                      href={`/services/${service.id}`}
                      className="group block relative aspect-[4/3] overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 p-8"
                    >
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                          <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">Service {service.id}</p>
                          <h3 className="text-black text-2xl font-bold mb-4">{service.title}</h3>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                            {service.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                          Learn More
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                      
                      {/* Background hover effect */}
                      <div className="absolute inset-0 bg-gray-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </TransitionLink>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          

        </div>
      </main>
      <GetInTouch />
      <Footer />
    </div>
  );
}

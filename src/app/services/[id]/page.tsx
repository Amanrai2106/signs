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
import { services as staticServices } from "@/data/services";

type ServiceSubCategory = { id: string; title: string; image: string };

type Service = {
  id: number;
  title: string;
  description: string;
  details?: string[];
  subCategories?: ServiceSubCategory[];
  relatedProjectIds?: string[];
};

type Project = {
  id: string;
  title: string;
  description: string;
  src: string;
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

export default function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [service, setService] = useState<Service | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [serviceRes, postsRes] = await Promise.all([
          fetch(`/api/services/${id}`, { cache: "no-store" }),
          fetch("/api/posts", { cache: "no-store" }),
        ]);
        const serviceData = await serviceRes.json();
        const postsData = await postsRes.json();

        const safeParseArray = (val: any): any[] | undefined => {
          if (!val) return undefined;
          try {
            const parsed = typeof val === "string" ? JSON.parse(val) : val;
            return Array.isArray(parsed) ? parsed : undefined;
          } catch {
            return undefined;
          }
        };

        let sourceService: any | null = null;
        if (serviceRes.ok && serviceData?.ok && serviceData.item) {
          sourceService = serviceData.item;
        } else {
          const numericId = Number(id);
          const fallback = staticServices.find((svc) => svc.id === numericId);
          if (fallback) {
            sourceService = {
              id: fallback.id,
              title: fallback.title,
              description: fallback.description,
              details: fallback.details ?? null,
              relatedProjectIds: fallback.relatedProjectIds ?? null,
              subCategories: fallback.subCategories || [],
            };
          }
        }

        if (!sourceService) {
          setError("Service not found");
          setLoading(false);
          return;
        }

        const s = sourceService;
        const mappedService: Service = {
          id: s.id,
          title: s.title,
          description: s.description,
          details: safeParseArray(s.details),
          subCategories: s.subCategories || [],
          relatedProjectIds: safeParseArray(s.relatedProjectIds) as string[] | undefined,
        };
        setService(mappedService);

        if (postsRes.ok && postsData?.ok && Array.isArray(postsData.items)) {
          setPosts(postsData.items);
        } else {
          setPosts([]);
        }

        if (mappedService.relatedProjectIds && mappedService.relatedProjectIds.length) {
          const projectsRes = await fetch("/api/projects", { cache: "no-store" });
          const projectsData = await projectsRes.json();
          if (projectsRes.ok && projectsData?.ok && Array.isArray(projectsData.items)) {
            const mappedProjects: Project[] = projectsData.items
              .filter((p: any) => mappedService.relatedProjectIds?.includes(p.id))
              .map((p: any) => ({
                id: p.id,
                title: p.title,
                description: p.description,
                src: p.src,
              }));
            setRelatedProjects(mappedProjects);
          }
        } else {
          setRelatedProjects([]);
        }

        setError("");
      } catch {
        setError("Failed to load service");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading service...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Nav />
        <p className="mt-10 text-gray-500">Service not found.</p>
      </div>
    );
  }

  const servicePosts = posts.filter((p) => p.type === "service" && p.categoryId === String(service.id));

  const getFilterSubcategories = (filterId: string): string[] | null => {
    if (filterId === "all") return null;

    if (service.id === 1) {
      if (filterId === "residential") return ["lobby", "ada"];
      if (filterId === "commercial") return ["lobby", "wayfinding"];
      if (filterId === "plotting") return ["wayfinding"];
      if (filterId === "office") return ["lobby", "wayfinding", "ada"];
      if (filterId === "educational") return ["wayfinding", "ada"];
      if (filterId === "retail") return ["lobby"];
    }

    if (service.id === 2) {
      if (filterId === "residential") return ["office-branding"];
      if (filterId === "commercial") return ["retail-displays", "office-branding"];
      if (filterId === "plotting") return ["exhibits"];
      if (filterId === "office") return ["office-branding"];
      if (filterId === "educational") return ["exhibits"];
      if (filterId === "retail") return ["retail-displays"];
    }

    if (service.id === 3) {
      if (filterId === "residential") return ["murals"];
      if (filterId === "commercial") return ["monument", "sculptures"];
      if (filterId === "plotting") return ["monument"];
      if (filterId === "office") return ["sculptures"];
      if (filterId === "educational") return ["murals"];
      if (filterId === "retail") return ["murals", "sculptures"];
    }

    return null;
  };

  const activeSubcategories = getFilterSubcategories(activeFilter);

  const filteredPosts =
    activeSubcategories && activeSubcategories.length > 0
      ? servicePosts.filter((p) => activeSubcategories.includes(p.subCategoryId))
      : servicePosts;

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
              {service.title}
            </motion.h1>

            {/* Category Selection Pills */}
            <div className="flex flex-wrap gap-3 md:gap-4 pb-4 border-b border-gray-200 justify-center md:justify-start">
              {[
                { id: "all", label: "All" },
                { id: "residential", label: "Residential" },
                { id: "commercial", label: "Commercial" },
                { id: "plotting", label: "Plotting" },
                { id: "office", label: "Office" },
                { id: "educational", label: "Educational" },
                { id: "retail", label: "Retail" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveFilter(item.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                    activeFilter === item.id
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-gray-500 border-gray-300 hover:border-black hover:text-black"
                  }`}
                >
                  {item.label}
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
                    const subCategoryTitle = service.subCategories?.find(
                      (s) => s.id === post.subCategoryId
                    )?.title;

                    return (
                      <TransitionLink
                        key={post.id}
                        href={`/services/${id}/${post.subCategoryId}/${post.id}`}
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

          {/* Related Projects Section */}
          {relatedProjects.length > 0 && (
            <section className="mt-32">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                    FEATURED PROJECTS
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Discover how we apply our {service.title.toLowerCase()} expertise across different sectors.
                  </p>
                </div>
                <TransitionLink 
                  href="/projects" 
                  className="group flex items-center gap-2 text-black font-bold uppercase tracking-widest text-sm"
                >
                  View All Projects
                  <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </TransitionLink>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <TransitionLink 
                      href={`/projects/${project.id}`}
                      className="group block relative aspect-square overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                      <Image
                        src={project.src}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
                      
                      <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <h3 className="text-white text-2xl font-bold mb-2">{project.title}</h3>
                        <p className="text-white/70 text-sm line-clamp-2 mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
                          View Details
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
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

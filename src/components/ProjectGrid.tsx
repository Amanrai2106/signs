"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { posts } from "@/data/posts";
import { Button } from "@/components/ui/Button";
import TransitionLink from "./TransitionLink";

const ProjectGrid = () => {
  const [remotePosts, setRemotePosts] = React.useState<any[]>([]);
  
  React.useEffect(() => {
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

  const gridPosts = React.useMemo(() => {
    const base = remotePosts.length > 0 ? remotePosts : posts.filter((p) => p.type === "project");
    return base.slice(0, 7);
  }, [remotePosts]);

  const layoutSpans = [
    "lg:col-span-2 lg:row-span-2", // 1
    "lg:col-span-1 lg:row-span-1", // 2
    "lg:col-span-1 lg:row-span-1", // 3
    "lg:col-span-1 lg:row-span-2", // 4
    "lg:col-span-2 lg:row-span-1", // 5
    "lg:col-span-1 lg:row-span-1", // 6
    "lg:col-span-1 lg:row-span-1", // 7
  ];

  return (
    <section id="project-grid" className="bg-white min-h-screen flex flex-col justify-center py-20">
      <div className="container-wide w-full">
        <div className="flex flex-col items-center mb-24 text-center">
          <div className="max-w-5xl w-full">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-base md:text-lg font-bold tracking-[0.5em] uppercase text-orange-600 mb-8"
            >
              Our Portfolio
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] mb-12 font-black tracking-tighter whitespace-nowrap"
            >
              CRAFTING DIGITAL <br />
              <span className="text-gray-200 italic">EXCELLENCE</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p2 text-gray-400 leading-relaxed max-w-3xl mx-auto opacity-80"
            >
              We blend innovation with precision to transform spaces through 
              thoughtful wayfinding and high-impact design solutions.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] md:auto-rows-[350px] lg:auto-rows-[400px] gap-8 mb-20">
          {gridPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.8 }}
              className={`group relative overflow-hidden rounded-2xl bg-gray-50 ${layoutSpans[idx] || ""}`}
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-orange-500 text-sm font-bold uppercase tracking-[0.2em] mb-3 text-left">
                    {post.subCategoryId}
                  </p>
                  <h3 className="text-white text-3xl font-bold mb-6 text-left leading-tight">
                    {post.title}
                  </h3>
                  <TransitionLink 
                    href={`/projects/${post.categoryId}/${post.subCategoryId}/${post.id}`}
                    className="inline-flex items-center text-white text-base font-bold uppercase tracking-widest group/link"
                  >
                    View Case Study
                    <span className="ml-3 w-8 h-px bg-white/50 transition-all duration-300 group-hover/link:w-12 group-hover/link:bg-white" />
                  </TransitionLink>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button href="/projects" variant="outline" className="px-12 py-4 text-sm font-bold uppercase tracking-widest border-black/20 hover:bg-black hover:text-white transition-all">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectGrid;

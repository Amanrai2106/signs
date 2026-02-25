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
    <section className="py-24 bg-white px-[5px] overflow-hidden">
      <div className="w-full max-w-none mx-auto text-center">
        <div className="flex flex-col items-center mb-16 gap-8">
          <div className="max-w-3xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black mb-8 leading-none"
            >
              CRAFTING DIGITAL <br />
              <span className="text-gray-400 italic font-serif">EXCELLENCE</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-600 leading-relaxed mx-auto max-w-2xl mb-10"
            >
              Explore our latest architectural and design projects where innovation meets precision. 
              We transform spaces through thoughtful wayfinding.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[220px] md:auto-rows-[260px] lg:auto-rows-[280px] gap-4 md:gap-6 mb-12">
          {gridPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl bg-gray-100 ${layoutSpans[idx] || ""}`}
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-2 text-left">
                  {post.subCategoryId}
                </p>
                <h3 className="text-white text-2xl font-bold mb-4 text-left">
                  {post.title}
                </h3>
                <TransitionLink 
                  href={`/projects/${post.categoryId}/${post.subCategoryId}/${post.id}`}
                  className="inline-flex items-center text-white font-semibold group/link"
                >
                  View Case Study
                  <div className="ml-2 w-8 h-[1px] bg-white transition-all duration-300 group-hover/link:w-12" />
                </TransitionLink>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-end"
        >
          <Button href="/projects" variant="primary" className="px-10 py-5 text-lg">
            View All Work
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectGrid;

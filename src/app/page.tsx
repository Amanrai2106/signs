"use client";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import dynamic from "next/dynamic";
import TransitionLink from "@/components/TransitionLink";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import type { Post } from "@/data/posts";

// const SelectedProjects = dynamic(() => import("@/components/SelectedProjects"), {
//   ssr: false,
// });
// const ProjectStack = dynamic(() => import("@/components/ProjectStack"), {
//   ssr: false,
// });
const AboutGrid = dynamic(() => import("@/components/AboutGrid"), {
  ssr: false,
});
const CoreValues = dynamic(() => import("@/components/CoreValues"), {
  ssr: false,
});
const BrandShowcase = dynamic(() => import("@/components/BrandShowcase"), {
  ssr: false,
});
const ProjectGrid = dynamic(() => import("@/components/ProjectGrid"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});
const GetInTouch = dynamic(() => import("@/components/GetInTouch"), {
  ssr: false,
});

const InProgressWork = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const inProgressPosts = posts.filter((p) => p.type === "project").slice(0, 3);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/posts", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data?.ok && Array.isArray(data.items)) {
          setPosts(data.items);
        }
      } catch {
      }
    };
    load();
  }, []);

  return (
    <section className="bg-[#f7f9fc] py-20 px-6 md:px-12 lg:px-20">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-orange-500">
              In progress
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-black mt-2">
              Work in progress
            </h2>
          </div>
          <TransitionLink
            href="/projects"
            className="hidden md:inline-flex items-center gap-2 text-sm md:text-base font-medium text-black border border-black/10 rounded-full px-5 py-2.5 hover:bg-black hover:text-white transition-colors"
          >
            View all work
            <span className="text-lg leading-none">→</span>
          </TransitionLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {inProgressPosts.map((post, index) => (
            <TransitionLink
              key={post.id}
              href={`/projects/${post.categoryId}/${post.subCategoryId}/${post.id}`}
              className="group rounded-3xl border border-black/5 bg-gray-50 overflow-hidden flex flex-col"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-black/80 text-white text-[11px] uppercase tracking-[0.2em] px-3 py-1">
                    In progress
                  </span>
                </div>
                <div className="flex-1 px-5 py-5 flex flex-col gap-3">
                  <p className="text-xs text-gray-500 uppercase tracking-[0.2em]">
                    {post.subCategoryId}
                  </p>
                  <h3 className="text-base md:text-lg font-semibold text-black line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="mt-3">
                    <span className="inline-flex items-center text-xs md:text-sm font-medium text-black/80 group/link">
                      View details
                      <span className="ml-2 h-px w-6 bg-black/60 transition-all duration-300 group-hover/link:w-10" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </TransitionLink>
          ))}
        </div>

        <div className="md:hidden">
          <TransitionLink
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-black border border-black/10 rounded-full px-5 py-2.5 w-full justify-center hover:bg-black hover:text-white transition-colors"
          >
            View all work
            <span className="text-lg leading-none">→</span>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main>
      <Nav />
      <Loader />
      <Hero />
      <div className="mx-auto w-[96vw] max-w-[1600px] bg-[#f7f9fc]">
        <ProjectGrid />
        <AboutGrid />
        {/* <SelectedProjects /> */}
        {/* <ProjectStack /> */}
        <CoreValues />
        <BrandShowcase />
        <InProgressWork />
        <GetInTouch />
        <Footer />
      </div>
    </main>
  );
}

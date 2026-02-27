"use client";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GetInTouch from "@/components/GetInTouch";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";

type ServiceSubCategory = { id: string; title: string; image: string };

type Service = {
  id: number;
  title: string;
  description: string;
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

import { posts as staticPosts } from "@/data/posts";
import { services as staticServices } from "@/data/services";

export default function ServiceSubCategoryPage({
  params,
}: {
  params: Promise<{ id: string; subId: string }>;
}) {
  const { id, subId } = use(params);
  const [service, setService] = useState<Service | null>(null);
  const [subCategory, setSubCategory] = useState<ServiceSubCategory | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
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
          description: s.description,
          subCategories: s.subCategories || [],
        };
        setService(mappedService);
        const foundSub = mappedService.subCategories?.find((sc) => sc.id === subId) || null;
        setSubCategory(foundSub);

        // Fetch all posts including remote ones
        let dbPosts: Post[] = [];
        try {
          const res = await fetch("/api/posts", { cache: "no-store" });
          const data = await res.json();
          if (res.ok && data?.ok) {
            dbPosts = (data.items || []).filter((p: any) => p.type === "service" && p.categoryId === String(id));
          }
        } catch {}

        const allPosts = [...dbPosts];
        (staticPosts as Post[]).filter((p) => p.type === "service" && p.categoryId === String(id)).forEach(sp => {
          if (!allPosts.find(ap => ap.id === sp.id)) {
            allPosts.push(sp);
          }
        });

        setPosts(allPosts);

        setError("");
      } catch {
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, subId]);

  if (loading) {
    return (
      <main className="bg-[#f7f9fc] min-h-screen flex items-center justify-center text-black">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (error || !service || !subCategory) {
    return (
      <main className="bg-[#f7f9fc] min-h-screen flex flex-col items-center justify-center text-black">
        <Nav />
        <p className="mt-10 text-gray-500">This service category could not be found.</p>
      </main>
    );
  }

  const subCategoryPosts = posts.filter(
    (p) => p.type === "service" && p.categoryId === String(service.id) && p.subCategoryId === subId
  );

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
    <main className="bg-[#f7f9fc] min-h-screen text-black selection:bg-orange-500/30">
      <Nav />
      
      {/* Header */}
      <section className="pt-40 pb-20 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full max-w-[95%] mx-auto">
             <TransitionLink href={`/services/${id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wider">Back to {service.title}</span>
             </TransitionLink>

             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-6 text-sm font-bold uppercase tracking-widest text-orange-600">
                <span>{service.title}</span>
                <span className="text-gray-300">/</span>
                <span>{subCategory.title}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-black tracking-tight">
                {subCategory.title}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                Explore our projects and solutions for {subCategory.title}.
              </p>
            </motion.div>
        </div>
      </section>

      {/* Posts Grid - Bento layout */}
      <section className="py-20 px-[5px]">
        <div className="w-full max-w-none mx-auto">
          {subCategoryPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[220px] md:auto-rows-[260px] lg:auto-rows-[280px] gap-4 md:gap-6">
              {subCategoryPosts.map((post, index) => (
                <TransitionLink
                  key={post.id}
                  href={`/services/${id}/${subId}/${post.id}`}
                  className={`group relative overflow-hidden rounded-3xl bg-gray-100 ${layoutSpans[index] || ""}`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
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
                      <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                        {post.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-200 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                  </motion.div>
                </TransitionLink>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-xl text-gray-400 mb-4">Coming Soon</p>
              <p className="text-gray-500">
                We are currently curating projects for this category.
              </p>
            </div>
          )}
        </div>
      </section>
      <GetInTouch />
      <Footer />
    </main>
  );
}

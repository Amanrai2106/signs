"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TransitionLink from "@/components/TransitionLink";
import Image from "next/image";
import { posts } from "@/data/news";

export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const post = useMemo(() => posts.find((p) => p.id === id), [id]);
  const [remote, setRemote] = useState<any | null>(null);
  const [allNews, setAllNews] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        // 1. Load the specific article
        const res = await fetch(`/api/news/${id}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json?.ok && json.item) {
            const n = json.item;
            let parsedTags = [];
            try {
              parsedTags = typeof n.tags === 'string' ? JSON.parse(n.tags) : (n.tags || []);
            } catch {
              parsedTags = [];
            }
            setRemote({
              id: n.id,
              title: n.title,
              excerpt: n.excerpt,
              image: n.cover,
              date: new Date(n.createdAt).toLocaleDateString(),
              reading: "5 min read",
              type: n.type || "news",
              category: n.category,
              tags: parsedTags,
              content: n.content || "",
            });
          }
        }

        // 2. Load all news for "Related" section
        const listRes = await fetch("/api/news", { cache: "no-store" });
        if (listRes.ok) {
          const listJson = await listRes.json();
          if (listJson?.ok) {
            const mapped = (listJson.items || []).map((n: any) => ({
              ...n,
              image: n.cover, // Map cover to image for frontend consistency
            }));
            setAllNews(mapped);
          }
        }
      } catch {}
    };
    load();
  }, [id]);

  const effectivePosts = useMemo(() => {
    const combined = [...allNews];
    posts.forEach(sp => {
      if (!combined.find(cp => cp.id === sp.id)) {
        combined.push(sp);
      }
    });
    return combined;
  }, [allNews]);

  const currentPost = remote ?? post;

  const related = useMemo(
    () => effectivePosts.filter((p) => 
      p.id !== currentPost?.id && 
      p.status !== 'draft' &&
      (p.category === currentPost?.category || p.type === currentPost?.type)
    ).slice(0, 3),
    [currentPost, effectivePosts]
  );

  return (
    <div className="min-h-screen text-black selection:bg-orange-500/30 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-orange-100/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-purple-100/40 rounded-full blur-[150px]" />
      </div>
      <Nav />
      <main className="relative z-10 pt-28 md:pt-36 pb-24 px-6 md:px-12 w-full">
        {!post && !remote ? (
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Article not found</h1>
            <p className="mt-4 text-gray-600">The article you are looking for doesn&apos;t exist.</p>
            <div className="mt-6">
              <TransitionLink href="/news" className="underline hover:text-orange-600">Back to News & Ideas</TransitionLink>
            </div>
          </div>
        ) : (
          <>
            <header className="max-w-5xl mx-auto">
              <p className="text-xs md:text-sm uppercase tracking-widest text-orange-600">{(remote ?? post)?.category}</p>
              <h1 className="mt-4 text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">{(remote ?? post)?.title}</h1>
              <p className="mt-6 text-gray-600">{(remote ?? post)?.excerpt}</p>
              <div className="mt-4 text-xs uppercase tracking-widest text-gray-500">
                <span>{(remote ?? post)?.date}</span>
                <span className="mx-2">•</span>
                <span>{(remote ?? post)?.reading}</span>
              </div>
            </header>

            <div className="mt-10 max-w-6xl mx-auto rounded-3xl overflow-hidden border border-black/5 bg-gray-100">
              <div className="relative w-full aspect-[16/8]">
                <Image src={(remote ?? post)?.image} alt={(remote ?? post)?.title} fill className="object-cover" />
              </div>
            </div>

            <article className="prose prose-lg md:prose-xl max-w-3xl mx-auto mt-12 prose-p:my-5 prose-p:text-gray-700 prose-headings:font-bold prose-headings:tracking-tight prose-img:rounded-2xl prose-img:shadow-2xl">
              {remote?.content ? (
                <div 
                  className="editor-content-display"
                  dangerouslySetInnerHTML={{ __html: remote.content }} 
                />
              ) : (
                <p>{post?.excerpt}</p>
              )}
            </article>

            <section className="max-w-6xl mx-auto mt-16">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Related</h2>
                <TransitionLink href="/news" className="text-sm underline hover:text-orange-600">View all</TransitionLink>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((p) => (
                  <TransitionLink key={p.id} href={`/news/${p.id}`} className="group rounded-2xl overflow-hidden border border-black/5 bg-white hover:border-black/15 hover:shadow-lg transition-all">
                    <div className="relative w-full aspect-[16/10] bg-gray-100">
                      <Image src={p.image} alt={p.title} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-widest text-gray-500">{p.category}</p>
                      <h3 className="mt-1 text-lg font-semibold group-hover:text-orange-600">{p.title}</h3>
                    </div>
                  </TransitionLink>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

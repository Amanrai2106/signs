"use client";
import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TransitionLink from "@/components/TransitionLink";
import Image from "next/image";
import { posts as seedPosts } from "@/data/news";

const titleMap: Record<
  string,
  { heading: string; match: (p: any) => boolean }
> = {
  education: { heading: "Education", match: (p) => p.category === "Education" },
  "press-studio": {
    heading: "Press & Studio",
    match: (p) => p.category === "Press" || p.category === "Studio",
  },
  media: { heading: "Media", match: (p) => p.category === "Media" },
  wayfinding: { 
    heading: "Wayfinding Design", 
    match: (p) => p.topic === "wayfinding" || p.tags?.includes("Wayfinding") 
  },
  placemaking: { 
    heading: "Placemaking Design", 
    match: (p) => p.topic === "placemaking" || p.tags?.includes("Placemaking") 
  },
  "environmental-graphics": {
    heading: "Environmental Graphics",
    match: (p) => p.topic === "environmental-graphics" || p.tags?.includes("Environmental Graphics") || p.tags?.includes("EGD"),
  },
};

export default function TopicPage() {
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const cfg = titleMap[slug ?? ""] ?? titleMap["education"];

  const [remotePosts, setRemotePosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json?.ok) {
            const mapped = (json.items as any[]).map((n) => ({
              id: n.id,
              title: n.title,
              excerpt: n.excerpt,
              image: n.cover,
              date: new Date(n.createdAt).toLocaleDateString(),
              reading: "5 min read",
              type: "news",
              category: n.category,
              tags: n.tags || [],
              topic: n.topic || "none",
              status: n.status || "published",
            }));
            setRemotePosts(mapped.filter(p => p.status === 'published'));
          }
        }
      } catch {}
    };
    load();
  }, []);

  const effectivePosts = useMemo(() => {
    const combined = [...remotePosts];
    seedPosts.forEach(sp => {
      if (!combined.find(cp => cp.id === sp.id)) {
        combined.push(sp);
      }
    });
    return combined;
  }, [remotePosts]);

  const list = useMemo(
    () => effectivePosts.filter((p) => cfg.match(p)),
    [cfg, effectivePosts]
  );

  return (
    <div className="min-h-screen text-black selection:bg-orange-500/30 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-orange-100/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-purple-100/40 rounded-full blur-[150px]" />
      </div>
      <Nav />
      <main className="relative z-10 pt-32 pb-24 px-6 md:px-12 w-full max-w-[120rem] mx-auto">
        <header className="mb-10">
          <p className="text-xs md:text-sm uppercase tracking-widest text-orange-600">Topic Series</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">{cfg.heading}</h1>
          <p className="mt-4 text-gray-600 max-w-2xl">
            Curated articles from our {cfg.heading.toLowerCase()} series.
          </p>
        </header>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="group rounded-3xl overflow-hidden border border-black/5 bg-white hover:shadow-xl hover:border-black/15 transition-all"
              >
                <div className="relative w-full aspect-[16/10] bg-gray-100">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500">
                    <span>{p.category}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{p.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{p.reading}</span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold leading-snug group-hover:text-orange-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-gray-600 line-clamp-3">{p.excerpt}</p>
                  <div className="mt-3">
                    <TransitionLink href={`/news/${p.id}`} className="text-sm font-semibold">
                      Read more →
                    </TransitionLink>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

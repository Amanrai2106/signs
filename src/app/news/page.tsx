"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TransitionLink from "@/components/TransitionLink";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Search } from "lucide-react";
import { posts as seedPosts, type Post } from "@/data/news";

export default function NewsIdeasPage() {
  const [filter, setFilter] = useState<"all" | "news" | "ideas">("all");
  const [topic, setTopic] = useState<"All" | "Education" | "Press & Studio" | "Media">("All");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(6);
  const [hideTopics, setHideTopics] = useState(false);

  const [remotePosts, setRemotePosts] = useState<any[] | null>(null);
  useEffect(() => {
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
              featured: Boolean(n.featured),
              status: n.status || "published",
            }));
            setRemotePosts(mapped);
          }
        }
      } catch {}
    };
    load();
  }, []);

  const effectivePosts = useMemo(() => {
    const combined = remotePosts ? [...remotePosts.filter((p: any) => p.status === 'published')] : [];
    seedPosts.forEach((sp: Post) => {
      if (!combined.find((cp: any) => cp.id === sp.id)) {
        combined.push(sp as any);
      }
    });
    return combined;
  }, [remotePosts]);

  const featured = useMemo(
    () => effectivePosts.find((p: any) => p.featured) || effectivePosts[0],
    [effectivePosts]
  );
  const list = useMemo(() => {
    return effectivePosts
      .filter((p: any) => (featured ? p.id !== featured.id : true))
      .filter((p: any) => {
        if (filter === "all") return true;
        if (filter === "news") return p.type === "news";
        return p.type === "idea";
      })
      .filter((p: any) => {
        if (topic === "All") return true;
        if (topic === "Media") return p.category === "Media";
        if (topic === "Education") return p.category === "Education";
        // Press & Studio groups both
        return p.category === "Press" || p.category === "Studio";
      })
      .filter((p: any) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t: string) => t.toLowerCase().includes(q))
        );
      });
  }, [filter, topic, query, featured?.id, effectivePosts]);

  const tags = useMemo(() => Array.from(new Set(effectivePosts.flatMap((p: any) => p.tags))), [effectivePosts]);

  return (
    <div className="min-h-screen text-black selection:bg-orange-500/30 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-orange-100/40 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-purple-100/40 rounded-full blur-[150px]" />
      </div>
      <Nav />
      <main className="relative z-10 pt-32 pb-24 px-6 md:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-mono text-sm tracking-widest uppercase mb-6">
              <Sparkles className="w-4 h-4" />
              <span>News & Ideas</span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none text-black">
              NEWS & IDEAS
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed font-light mt-6">
              Research notes, process highlights and announcements that shape our practice.
            </p>
          </div>
          {/* Right-side filter buttons removed as requested */}
        </motion.div>

        <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(["All", "Education", "Press & Studio", "Media"] as const).map((t: "All" | "Education" | "Press & Studio" | "Media") => (
              <button
                key={t}
                onClick={() => {
                  setTopic(t);
                  setHideTopics(true);
                }}
                className={`px-4 py-2 rounded-full text-xs md:text-sm border transition-colors ${
                  topic === t
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, tags…"
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-black/10 bg-white text-sm outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        {/* Topic Series Section (visible until a topic button is clicked) */}
        {!hideTopics && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-6">Topic Series</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  slug: "wayfinding",
                  title: "Wayfinding Design",
                  href: "/news/topics/wayfinding",
                },
                {
                  slug: "placemaking",
                  title: "Placemaking Design",
                  href: "/news/topics/placemaking",
                },
                {
                  slug: "environmental-graphics",
                  title: "Environmental Graphics",
                  href: "/news/topics/environmental-graphics",
                },
              ].map((t) => (
                <TransitionLink
                  key={t.slug}
                  href={t.href}
                  className="group relative rounded-3xl border border-black/10 bg-white overflow-hidden p-8 flex flex-col justify-between h-56"
                >
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute right-[-10%] top-[-20%] w-72 h-72 rounded-full bg-orange-100/60 blur-3xl" />
                    <div className="absolute left-[-15%] bottom-[-25%] w-80 h-80 rounded-full bg-purple-100/50 blur-3xl" />
                  </div>
                  <div className="relative">
                    <p className="text-sm uppercase tracking-widest text-gray-500">Topic</p>
                    <h3 className="mt-2 text-2xl md:text-3xl font-semibold">{t.title}</h3>
                  </div>
                  <div className="relative">
                    <span className="inline-flex text-sm font-semibold group-hover:underline">
                      {t.title} Articles →
                    </span>
                  </div>
                </TransitionLink>
              ))}
            </div>
          </section>
        )}

        {/* Category Section (adapts to selected topic) */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-widest text-gray-500">Articles</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {topic === "All" ? "Educational" : topic}
          </h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {effectivePosts
              .filter((p) =>
                topic === "All"
                  ? p.category === "Education"
                  : topic === "Press & Studio"
                  ? p.category === "Press" || p.category === "Studio"
                  : p.category === topic
              )
              .slice(0, 6)
              .map((p) => (
                <TransitionLink
                  href={`/news/${p.id}`}
                  key={p.id}
                  className="group rounded-3xl overflow-hidden border border-black/5 bg-white hover:shadow-xl hover:border-black/15 transition-all"
                >
                  <div className="relative w-full aspect-[16/10] bg-gray-100">
                    <Image src={p.image} alt={p.title} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold group-hover:text-orange-600">{p.title}</h3>
                    <p className="mt-1 text-gray-600 line-clamp-2">{p.excerpt}</p>
                  </div>
                </TransitionLink>
              ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <TransitionLink
              href={`/news/${featured.id}`}
              className="group relative overflow-hidden rounded-3xl bg-gray-100 lg:col-span-2 border border-black/5"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative w-full aspect-[16/9]"
              >
                <Image src={featured.image} alt={featured.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </motion.div>
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                <div className="flex items-center gap-3 text-white/80 text-xs uppercase tracking-widest mb-3">
                  <span>{featured.type}</span>
                  <span className="w-1 h-1 bg-white/50 rounded-full" />
                  <span>{featured.date}</span>
                  <span className="w-1 h-1 bg-white/50 rounded-full" />
                  <span>{featured.reading}</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-2xl">
                  {featured.title}
                </h3>
                <p className="text-white/80 mt-4 max-w-2xl hidden md:block">{featured.excerpt}</p>
                <div className="mt-6">
                  <span className="inline-flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-sm font-semibold group-hover:bg-black group-hover:text-white transition-colors">
                    Read <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </TransitionLink>
            <div className="bg-white border border-black/5 rounded-3xl p-6 lg:p-8 flex flex-col gap-6">
              <h4 className="text-lg font-bold tracking-tight">Trending</h4>
              <div className="space-y-5">
                {effectivePosts.filter((p: Post) => p.id !== featured.id).slice(0, 4).map((p) => (
                  <TransitionLink key={p.id} href={`/news/${p.id}`} className="group flex items-start gap-4">
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 border border-black/5">
                      <Image src={p.image} alt={p.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                        {p.category}
                      </p>
                      <p className="text-sm font-medium text-black group-hover:text-orange-600 transition-colors">
                        {p.title}
                      </p>
                    </div>
                  </TransitionLink>
                ))}
              </div>
              <div>
                <h5 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Tags</h5>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 12).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs border border-black/10 bg-gray-50 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-black/5">
                <h5 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-3">Press & Studio</h5>
                <div className="space-y-4">
                  {effectivePosts.filter((p: Post) => p.category === "Press" || p.category === "Studio").slice(0, 3).map((p) => (
                    <TransitionLink key={p.id} href={`/news/${p.id}`} className="group flex items-start gap-3">
                      <div className="relative w-16 h-12 rounded-md overflow-hidden bg-gray-100 border border-black/5">
                        <Image src={p.image} alt={p.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-widest text-gray-500">{p.category}</p>
                        <p className="text-sm font-medium text-black group-hover:text-orange-600 transition-colors line-clamp-2">
                          {p.title}
                        </p>
                      </div>
                    </TransitionLink>
                  ))}
                  <TransitionLink href="/news/topics/press-studio" className="text-sm underline hover:text-orange-600">
                    View all Press & Studio →
                  </TransitionLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight">All Articles</h2>
            <p className="text-sm text-gray-500">
              {list.length} result{list.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.slice(0, visible).map((p, i) => (
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
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500">
                    <span>{p.category}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{p.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{p.reading}</span>
                  </div>
                  <h3 className="text-xl font-semibold leading-snug group-hover:text-orange-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">{p.excerpt}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {p.tags.map((t: string) => (
                      <span key={t} className="px-2.5 py-1 rounded-full text-xs bg-black/5 text-gray-700">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2">
                    <TransitionLink
                      href={`/news/${p.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold"
                    >
                      Read article <ArrowUpRight className="w-4 h-4" />
                    </TransitionLink>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {visible < list.length && (
            <div className="flex justify-center">
              <button
                onClick={() => setVisible((v) => v + 6)}
                className="mt-10 px-6 py-3 rounded-full border border-black/10 bg-white text-sm hover:border-black transition-colors"
              >
                Load more
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

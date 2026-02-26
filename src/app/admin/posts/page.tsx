"use client";
import React, { useEffect, useState, useMemo } from "react";
import TransitionLink from "@/components/TransitionLink";
import { Plus, Trash2, X, Upload, Link as LinkIcon, ExternalLink } from "lucide-react";
import { projects as projectData } from "@/data/projects";

const CATEGORIES = [
  { id: "wayfinding", title: "Wayfinding" },
  { id: "experiential", title: "Experiential" },
  { id: "art-installation", title: "Art Installation" },
];

const SUBCATEGORIES = [
  { id: "residential", title: "Residential" },
  { id: "commercial", title: "Commercial" },
  { id: "plotting", title: "Plotting" },
  { id: "office", title: "Office" },
  { id: "educational", title: "Educational" },
  { id: "retail", title: "Retail" },
];

type Post = { 
  id: string; 
  title: string; 
  description: string; 
  image: string; 
  categoryId: string; 
  subCategoryId: string; 
  type: "project" | "service" 
};

export default function AdminPosts() {
  const [items, setItems] = useState<Post[]>([]);
  const [form, setForm] = useState<any>({ 
    id: "", 
    title: "", 
    description: "", 
    image: "", 
    categoryId: CATEGORIES[0].id, 
    subCategoryId: SUBCATEGORIES[0].id, 
    type: "project",
    client: "",
    location: "",
    year: "",
    scope: "",
    challengeTitle: "",
    challengeDescription: "",
    solutionTitle: "",
    solutionDescription: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [challengeItems, setChallengeItems] = useState<string[]>([]);
  const [solutionItems, setSolutionItems] = useState<{ label: string, value: string }[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const load = async () => {
    const res = await fetch("/api/posts", { cache: "no-store" });
    const data = await res.json();
    if (res.ok && data?.ok) setItems(data.items);
  };

  useEffect(() => { load(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.ok) callback(data.url);
      else alert("Upload failed: " + (data.error || "Unknown error"));
    } catch {
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) {
      setError("Please provide a unique ID");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        challengeItems: JSON.stringify(challengeItems),
        solutionItems: JSON.stringify(solutionItems),
        galleryImages: JSON.stringify(galleryImages),
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Create failed. Make sure DB is synced (npx prisma db push)");
      setSaving(false);
      return;
    }
    
    // Clear everything AFTER successful creation
    setForm({ 
      id: "", 
      title: "", 
      description: "", 
      image: "", 
      categoryId: CATEGORIES[0].id, 
      subCategoryId: SUBCATEGORIES[0].id, 
      type: "project", 
      client: "", 
      location: "", 
      year: "", 
      scope: "", 
      challengeTitle: "", 
      challengeDescription: "", 
      solutionTitle: "", 
      solutionDescription: "" 
    });
    setChallengeItems([]);
    setSolutionItems([]);
    setGalleryImages([]);
    setSaving(false);
    
    // Reload the list immediately
    await load();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.ok) {
        await load();
      } else {
        alert(`Delete failed: ${data.error || "Unknown error"}`);
      }
    } catch {
      alert("Error deleting post");
    }
  };

  return (
    <main className="min-h-[100dvh] px-6 py-12">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-black">Posts</h1>
            <p className="text-gray-600 text-sm">Manage project/service posts</p>
          </div>
          <a href="/admin" className="rounded-full bg-black text-white px-5 py-2 font-bold uppercase tracking-widest hover:bg-orange-500 transition-colors">Back</a>
        </div>

        <form onSubmit={onCreate} className="mb-12 bg-white border border-black/10 p-8 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-2 text-orange-600 font-mono text-xs tracking-widest uppercase mb-6">
            <Plus className="w-4 h-4" />
            <span>Create New Post</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Post ID (Unique slug)</label>
              <input 
                value={form.id} 
                onChange={(e) => setForm({ ...form, id: e.target.value })} 
                placeholder="e.g. airport-wayfinding" 
                className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all" 
                required 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Title</label>
              <input 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                placeholder="Project Name" 
                className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all" 
                required 
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Short Description</label>
              <textarea 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                placeholder="A brief overview of the project..." 
                className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all resize-none" 
                rows={2}
                required 
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Main Hero Image (URL or Upload)</label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    value={form.image} 
                    onChange={(e) => setForm({ ...form, image: e.target.value })} 
                    placeholder="https://..." 
                    className="w-full border border-black/5 bg-gray-50 rounded-xl pl-10 pr-4 py-3 focus:border-orange-500 outline-none transition-all" 
                  />
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    id="hero-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, (url) => setForm({ ...form, image: url }))}
                  />
                  <label 
                    htmlFor="hero-upload" 
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border border-black/5 bg-gray-50 hover:bg-white hover:border-orange-500 cursor-pointer transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-widest">{uploading ? '...' : 'Upload'}</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Post Type</label>
              <select 
                value={form.type} 
                onChange={(e) => setForm({ ...form, type: e.target.value as "project" | "service" })} 
                className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="project">Project</option>
                <option value="service">Service</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</label>
              <select 
                value={form.categoryId} 
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })} 
                className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subcategory</label>
              <select 
                value={form.subCategoryId} 
                onChange={(e) => setForm({ ...form, subCategoryId: e.target.value })} 
                className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
              >
                {SUBCATEGORIES.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.title}</option>
                ))}
              </select>
            </div>

            {/* DESIGN SYNC FIELDS */}
            <div className="md:col-span-3 pt-6 border-t border-black/5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-black mb-6">Project Design Details (Stats & Sections)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Client</label>
                  <input value={form.client} onChange={e => setForm({...form, client: e.target.value})} placeholder="Confidential" className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-2 text-sm focus:border-orange-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Location</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="New Delhi" className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-2 text-sm focus:border-orange-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Year</label>
                  <input value={form.year} onChange={e => setForm({...form, year: e.target.value})} placeholder="2024" className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-2 text-sm focus:border-orange-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Scope</label>
                  <input value={form.scope} onChange={e => setForm({...form, scope: e.target.value})} placeholder="End-to-End" className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-2 text-sm focus:border-orange-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Challenge */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase text-orange-600">01. Challenge Section</h4>
                  <input value={form.challengeTitle} onChange={e => setForm({...form, challengeTitle: e.target.value})} placeholder="Challenge Title" className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-2 text-sm outline-none" />
                  <textarea value={form.challengeDescription} onChange={e => setForm({...form, challengeDescription: e.target.value})} placeholder="Challenge Description" className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-2 text-sm outline-none h-20 resize-none" />
                  <div className="space-y-2">
                    {challengeItems.map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={item} onChange={e => {
                          const ni = [...challengeItems]; ni[i] = e.target.value; setChallengeItems(ni);
                        }} className="flex-1 border border-black/5 bg-gray-50 rounded-xl px-4 py-2 text-xs" />
                        <button type="button" onClick={() => setChallengeItems(challengeItems.filter((_, idx) => idx !== i))} className="text-red-400"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setChallengeItems([...challengeItems, ""])} className="text-[10px] font-bold text-orange-600 uppercase">+ Add Point</button>
                  </div>
                </div>

                {/* Solution */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase text-orange-600">02. Solution Section</h4>
                  <input value={form.solutionTitle} onChange={e => setForm({...form, solutionTitle: e.target.value})} placeholder="Solution Title" className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-2 text-sm outline-none" />
                  <textarea value={form.solutionDescription} onChange={e => setForm({...form, solutionDescription: e.target.value})} placeholder="Solution Description" className="w-full border border-black/5 bg-gray-50 rounded-xl px-4 py-2 text-sm outline-none h-20 resize-none" />
                  <div className="space-y-2">
                    {solutionItems.map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <input value={item.label} onChange={e => {
                          const ni = [...solutionItems]; ni[i].label = e.target.value; setSolutionItems(ni);
                        }} placeholder="Label" className="flex-1 border border-black/5 bg-gray-50 rounded-xl px-4 py-2 text-xs" />
                        <input value={item.value} onChange={e => {
                          const ni = [...solutionItems]; ni[i].value = e.target.value; setSolutionItems(ni);
                        }} placeholder="Value" className="flex-1 border border-black/5 bg-gray-50 rounded-xl px-4 py-2 text-xs" />
                        <button type="button" onClick={() => setSolutionItems(solutionItems.filter((_, idx) => idx !== i))} className="text-red-400"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setSolutionItems([...solutionItems, {label: "", value: ""}])} className="text-[10px] font-bold text-orange-600 uppercase">+ Add Metric</button>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className="mt-8">
                <h4 className="text-[10px] font-bold uppercase text-orange-600 mb-4">Project Gallery (URL or Upload)</h4>
                <div className="flex flex-wrap gap-4">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="relative w-32 h-24 border rounded-xl overflow-hidden group bg-gray-50">
                      {img ? (
                        <img src={img} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                        <button type="button" onClick={() => {
                          const url = prompt("Enter Image URL", img);
                          if (url !== null) {
                            const ni = [...galleryImages]; ni[i] = url; setGalleryImages(ni);
                          }
                        }} className="p-1.5 bg-white rounded-full text-black hover:bg-orange-500 hover:text-white transition-colors">
                          <LinkIcon className="w-3 h-3" />
                        </button>
                        <input 
                          type="file" 
                          id={`gallery-upload-new-${i}`} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, (url) => {
                            const ni = [...galleryImages]; ni[i] = url; setGalleryImages(ni);
                          })}
                        />
                        <label htmlFor={`gallery-upload-new-${i}`} className="p-1.5 bg-white rounded-full text-black hover:bg-orange-500 hover:text-white transition-colors cursor-pointer">
                          <Upload className="w-3 h-3" />
                        </label>
                        <button type="button" onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))} className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => setGalleryImages([...galleryImages, ""])} className="w-32 h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all">
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-[8px] font-bold uppercase">Add Image</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between">
            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            <button 
              disabled={saving} 
              className="ml-auto rounded-full bg-black text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-orange-600 disabled:opacity-50 transition-all shadow-lg shadow-black/10"
            >
              {saving ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((p: any) => {
            const isDbPost = (p as any).createdAt !== undefined;
            return (
              <div key={p.id} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow group/card relative">
                {!isDbPost && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-blue-50 text-blue-600 text-[8px] font-bold uppercase tracking-widest rounded-md z-10">
                    Static Data
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-gray-100 rounded-md mb-2 inline-block">{p.type}</span>
                    <h3 className="font-bold text-xl">{p.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    {isDbPost && (
                      <button 
                        onClick={() => onDelete(p.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/card:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <TransitionLink 
                      href={`/admin/posts/${p.id}`} 
                      className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-orange-600 transition-colors"
                    >
                      {isDbPost ? "Edit" : "View / Customize"}
                    </TransitionLink>
                    <a 
                      href={`/projects/${p.categoryId}/${p.subCategoryId}/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      title="Preview Live"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4 font-mono">{p.id}</p>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gray-50">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{p.description}</p>
                <div className="pt-4 border-t border-gray-100 flex gap-4">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Category: <span className="text-black">{p.categoryId}</span></div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Sub: <span className="text-black">{p.subCategoryId}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, Save, Trash2, Plus, X, Upload, Link as LinkIcon, ExternalLink } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";

type Post = {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryId: string;
  subCategoryId: string;
  type: "project" | "service";
  client?: string;
  location?: string;
  year?: string;
  scope?: string;
  challengeTitle?: string;
  challengeDescription?: string;
  challengeItems?: string; // JSON
  solutionTitle?: string;
  solutionDescription?: string;
  solutionItems?: string; // JSON of { label: string, value: string }[]
  galleryImages?: string; // JSON
};

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

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [challengeItems, setChallengeItems] = useState<string[]>([]);
  const [solutionItems, setSolutionItems] = useState<{ label: string, value: string }[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/uploads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, data: base64 }),
        });
        const data = await res.json();
        if (data.ok) callback(data.url);
        else alert("Upload failed");
      };
      reader.readAsDataURL(file);
    } catch {
      alert("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data?.ok) {
          setPost(data.item);
          try {
            setChallengeItems(JSON.parse(data.item.challengeItems || "[]"));
            setSolutionItems(JSON.parse(data.item.solutionItems || "[]"));
            setGalleryImages(JSON.parse(data.item.galleryImages || "[]"));
          } catch {
            setChallengeItems([]);
            setSolutionItems([]);
            setGalleryImages([]);
          }
        } else {
          setError("Post not found");
        }
      } catch {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onSave = async () => {
    if (!post) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...post,
          challengeItems: JSON.stringify(challengeItems),
          solutionItems: JSON.stringify(solutionItems),
          galleryImages: JSON.stringify(galleryImages),
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/posts");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) router.push("/admin/posts");
    } catch {}
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading editor...</div>;
  if (error || !post) return <div className="min-h-screen flex items-center justify-center text-red-600">{error || "Post not found"}</div>;

  return (
    <main className="min-h-screen bg-[#fcfcfc] text-black">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <TransitionLink href="/admin/posts" className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Posts</span>
          </TransitionLink>
          <div className="flex gap-4">
            <a 
              href={`/projects/${post.categoryId}/${post.subCategoryId}/${post.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-orange-600 transition-colors font-bold uppercase text-xs tracking-widest"
            >
              <ExternalLink className="w-4 h-4" />
              Preview Live
            </a>
            <button onClick={onDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onSave} 
              disabled={saving}
              className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest hover:bg-orange-600 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Basic Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold border-b pb-4">Basic Information</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Project Title</label>
              <input 
                value={post.title} 
                onChange={e => setPost({...post, title: e.target.value})}
                className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Overview Description</label>
              <textarea 
                value={post.description} 
                onChange={e => setPost({...post, description: e.target.value})}
                rows={5}
                className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Main Hero Image (URL or Upload)</label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    value={post.image} 
                    onChange={e => setPost({...post, image: e.target.value})}
                    className="w-full bg-white border border-black/10 rounded-xl pl-10 pr-4 py-3 focus:border-orange-500 outline-none transition-colors"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    id="hero-upload-edit" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, (url) => setPost({ ...post, image: url }))}
                  />
                  <label 
                    htmlFor="hero-upload-edit" 
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border border-black/10 bg-white hover:border-orange-500 cursor-pointer transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-widest">{uploading ? '...' : 'Upload'}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Category</label>
                <select 
                  value={post.categoryId} 
                  onChange={e => setPost({...post, categoryId: e.target.value})}
                  className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-colors appearance-none cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Sub-Category</label>
                <select 
                  value={post.subCategoryId} 
                  onChange={e => setPost({...post, subCategoryId: e.target.value})}
                  className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-colors appearance-none cursor-pointer"
                >
                  {SUBCATEGORIES.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Project Details / Stats */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold border-b pb-4">Project Stats</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Client</label>
                <input 
                  value={post.client || ""} 
                  onChange={e => setPost({...post, client: e.target.value})}
                  placeholder="e.g. Confidential"
                  className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Location</label>
                <input 
                  value={post.location || ""} 
                  onChange={e => setPost({...post, location: e.target.value})}
                  placeholder="e.g. New Delhi"
                  className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Year</label>
                <input 
                  value={post.year || ""} 
                  onChange={e => setPost({...post, year: e.target.value})}
                  placeholder="e.g. 2024"
                  className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Scope</label>
                <input 
                  value={post.scope || ""} 
                  onChange={e => setPost({...post, scope: e.target.value})}
                  placeholder="e.g. End-to-End"
                  className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-colors"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold border-b pb-4 pt-4">Challenge & Solution</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Challenge Title</label>
              <input 
                value={post.challengeTitle || ""} 
                onChange={e => setPost({...post, challengeTitle: e.target.value})}
                placeholder="e.g. Navigating Complexity"
                className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Challenge Description</label>
              <textarea 
                value={post.challengeDescription || ""} 
                onChange={e => setPost({...post, challengeDescription: e.target.value})}
                rows={3}
                className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Solution Title</label>
              <input 
                value={post.solutionTitle || ""} 
                onChange={e => setPost({...post, solutionTitle: e.target.value})}
                placeholder="e.g. Precision & Elegance"
                className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400">Solution Description</label>
              <textarea 
                value={post.solutionDescription || ""} 
                onChange={e => setPost({...post, solutionDescription: e.target.value})}
                rows={3}
                className="w-full bg-white border border-black/10 rounded-xl px-4 py-3 focus:border-orange-500 outline-none transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Lists Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 pt-8 border-t">
          {/* Challenge Points */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-gray-400 block">Challenge Key Points</label>
            {challengeItems.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  value={item} 
                  onChange={e => {
                    const newItems = [...challengeItems];
                    newItems[i] = e.target.value;
                    setChallengeItems(newItems);
                  }}
                  className="flex-1 bg-white border border-black/10 rounded-xl px-4 py-2 focus:border-orange-500 outline-none"
                />
                <button onClick={() => setChallengeItems(challengeItems.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => setChallengeItems([...challengeItems, ""])} className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700">
              <Plus className="w-4 h-4" />
              Add Point
            </button>
          </div>

          {/* Solution Stats */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-gray-400 block">Solution Metrics</label>
            {solutionItems.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  value={item.label} 
                  onChange={e => {
                    const newItems = [...solutionItems];
                    newItems[i].label = e.target.value;
                    setSolutionItems(newItems);
                  }}
                  placeholder="Label (e.g. Turnaround)"
                  className="flex-1 bg-white border border-black/10 rounded-xl px-4 py-2 focus:border-orange-500 outline-none"
                />
                <input 
                  value={item.value} 
                  onChange={e => {
                    const newItems = [...solutionItems];
                    newItems[i].value = e.target.value;
                    setSolutionItems(newItems);
                  }}
                  placeholder="Value (e.g. 4 Weeks)"
                  className="flex-1 bg-white border border-black/10 rounded-xl px-4 py-2 focus:border-orange-500 outline-none"
                />
                <button onClick={() => setSolutionItems(solutionItems.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => setSolutionItems([...solutionItems, { label: "", value: "" }])} className="flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700">
              <Plus className="w-4 h-4" />
              Add Metric
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-8">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, i) => (
              <div key={i} className="space-y-2">
                <div className="relative aspect-video rounded-xl bg-gray-100 overflow-hidden border border-black/5">
                  {img ? <img src={img} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 italic">No image</div>}
                  <button onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-md text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input 
                      value={img} 
                      onChange={e => {
                        const newImgs = [...galleryImages];
                        newImgs[i] = e.target.value;
                        setGalleryImages(newImgs);
                      }}
                      placeholder="Image URL"
                      className="w-full bg-white border border-black/10 rounded-xl pl-8 pr-4 py-2 text-[10px] outline-none"
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type="file" 
                      id={`gallery-upload-${i}`} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, (url) => {
                        const newImgs = [...galleryImages];
                        newImgs[i] = url;
                        setGalleryImages(newImgs);
                      })}
                    />
                    <label 
                      htmlFor={`gallery-upload-${i}`} 
                      className="p-2 bg-gray-50 border border-black/10 rounded-xl hover:border-orange-500 transition-all cursor-pointer block"
                    >
                      <Upload className="w-3 h-3" />
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => setGalleryImages([...galleryImages, ""])}
              className="aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-all"
            >
              <Plus className="w-8 h-8 mb-2" />
              <span className="font-bold text-sm uppercase tracking-widest">Add Gallery Image</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

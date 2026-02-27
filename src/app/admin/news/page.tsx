"use client";
import React, { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Type, 
  Image as ImageIcon, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Quote, 
  Minus, 
  Layout, 
  Settings, 
  Eye, 
  Save, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  X,
  Check,
  Video
} from "lucide-react";

type Category = "Education" | "Press" | "Studio" | "Media";
type Topic = "none" | "wayfinding" | "placemaking" | "environmental-graphics";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover: string;
  category: Category;
  type: "news" | "idea";
  tags: string[];
  topic: Topic;
  content: string;
  status: "draft" | "published";
  featured?: boolean;
  updatedAt: string;
}

export default function AdminNewsEditor() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<Category>("Education");
  const [type, setType] = useState<"news" | "idea">("news");
  const [topic, setTopic] = useState<Topic>("none");
  const [tags, setTags] = useState<string>("");
  const [cover, setCover] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pubStatus, setPubStatus] = useState<"draft" | "published">("published");
  const [featured, setFeatured] = useState<boolean>(false);
  
  // UI States
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<"settings" | "list">("settings");
  const [sidebarFilter, setSidebarFilter] = useState<"all" | "published" | "draft">("all");
  const [saving, setSaving] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRange.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRange.current);
      }
    }
  };

  useEffect(() => {
    const handleSelection = () => {
      saveSelection();
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0 && editorRef.current?.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setToolbarPos({
          top: rect.top + window.scrollY - 50,
          left: rect.left + rect.width / 2
        });
        setSelectedText(selection.toString());
        setShowFloatingToolbar(true);
      } else {
        setShowFloatingToolbar(false);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    return () => document.removeEventListener("mouseup", handleSelection);
  }, []);

  const onUploadCover = async (file: File) => {
    setSaving(true);
    setStatus("Uploading cover...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json?.ok) {
        setCover(json.url);
        setStatus("Cover uploaded");
      }
    } catch (err) {
      console.error(err);
      setStatus("Upload failed");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(""), 2000);
    }
  };

  useEffect(() => {
    if (!slug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      );
    }
  }, [title]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news", { cache: "no-store" });
      const json = await res.json();
      if (res.ok && json?.ok) setItems(json.items || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const exec = (cmd: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(cmd, false, value);
  };

  const insertHTML = (html: string) => {
    if (typeof window === "undefined") return;
    
    restoreSelection();
    const sel = window.getSelection();
    
    if (!sel || sel.rangeCount === 0 || !editorRef.current?.contains(sel.anchorNode)) {
      if (editorRef.current) {
        editorRef.current.focus();
        // If no selection, append to the end
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }

    const range = window.getSelection()?.getRangeAt(0);
    if (!range) return;

    range.deleteContents();
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node: ChildNode | null = null;
    while ((node = temp.firstChild)) {
      frag.appendChild(node);
    }
    range.insertNode(frag);
    range.collapse(false);
    const newSel = window.getSelection();
    newSel?.removeAllRanges();
    newSel?.addRange(range);
    editorRef.current?.focus();
    saveSelection();
  };

  const onInsertImage = async (file: File) => {
    try {
      setStatus("Uploading image...");
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json?.ok) {
        const imgId = `img-${Date.now()}`;
        const wrapperId = `wrapper-${Date.now()}`;
        insertHTML(`
          <div id="${wrapperId}" class="editor-block-image group relative my-12" contenteditable="false">
            <img src="${json.url}" id="${imgId}" class="rounded-2xl w-full h-auto shadow-2xl transition-all" style="display: block; margin: 0 auto;" />
            <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
              <button onclick="event.preventDefault(); event.stopPropagation(); document.getElementById('${imgId}').style.width='50%'" class="bg-white/90 backdrop-blur p-2 rounded-lg text-xs font-bold shadow-xl hover:bg-orange-500 hover:text-white">50%</button>
              <button onclick="event.preventDefault(); event.stopPropagation(); document.getElementById('${imgId}').style.width='100%'" class="bg-white/90 backdrop-blur p-2 rounded-lg text-xs font-bold shadow-xl hover:bg-orange-500 hover:text-white">100%</button>
              <button onclick="event.preventDefault(); event.stopPropagation(); if(confirm('Delete this image?')) document.getElementById('${wrapperId}').remove()" class="bg-white/90 backdrop-blur p-2 rounded-lg text-xs font-bold shadow-xl hover:bg-red-500 hover:text-white">
                Delete
              </button>
            </div>
          </div>
          <p><br></p>
        `);
        setShowBlockMenu(false);
        setStatus("Image inserted");
        setTimeout(() => setStatus(""), 2000);
      } else {
        alert("Upload failed: " + (json.error || "Unknown error"));
        setStatus("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
      setStatus("Error");
    }
  };

  const onInsertVideo = async (file: File) => {
    try {
      setStatus("Uploading video...");
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json?.ok) {
        const vidId = `vid-${Date.now()}`;
        const wrapperId = `wrapper-${Date.now()}`;
        insertHTML(`
          <div id="${wrapperId}" class="editor-block-video group relative my-12" contenteditable="false">
            <video 
              src="${json.url}" 
              id="${vidId}" 
              class="rounded-2xl w-full h-auto shadow-2xl transition-all" 
              autoplay 
              loop 
              muted 
              playsinline
              style="display: block; margin: 0 auto;"
            ></video>
            <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
              <button onclick="event.preventDefault(); event.stopPropagation(); document.getElementById('${vidId}').style.width='50%'" class="bg-white/90 backdrop-blur p-2 rounded-lg text-xs font-bold shadow-xl hover:bg-orange-500 hover:text-white">50%</button>
              <button onclick="event.preventDefault(); event.stopPropagation(); document.getElementById('${vidId}').style.width='100%'" class="bg-white/90 backdrop-blur p-2 rounded-lg text-xs font-bold shadow-xl hover:bg-orange-500 hover:text-white">100%</button>
              <button onclick="event.preventDefault(); event.stopPropagation(); if(confirm('Delete this video?')) document.getElementById('${wrapperId}').remove()" class="bg-white/90 backdrop-blur p-2 rounded-lg text-xs font-bold shadow-xl hover:bg-red-500 hover:text-white">
                Delete
              </button>
            </div>
          </div>
          <p><br></p>
        `);
        setShowBlockMenu(false);
        setStatus("Video inserted");
        setTimeout(() => setStatus(""), 2000);
      } else {
        alert("Upload failed: " + (json.error || "Unknown error"));
        setStatus("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading video");
      setStatus("Error");
    }
  };

  const onSave = async (overrideStatus?: "draft" | "published") => {
    const finalStatus = overrideStatus || pubStatus;
    const content = editorRef.current?.innerHTML?.trim() || "";
    if (!title || !slug || !excerpt || !cover || !content) {
      alert("Please fill required fields (Title, Slug, Excerpt, Cover, Content)");
      return;
    }
    setSaving(true);
    setStatus("Saving...");
    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: slug,
        title, slug, excerpt, cover, category, type, topic,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        content,
        status: finalStatus,
        featured,
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (json?.ok) {
      setStatus(finalStatus === 'published' ? "Published Successfully" : "Draft Saved");
      setPubStatus(finalStatus);
      await loadItems();
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const loadToEditor = (n: any) => {
    setTitle(n.title || "");
    setSlug(n.slug || n.id || "");
    setExcerpt(n.excerpt || "");
    setCover(n.cover || "");
    setCategory(n.category || "Education");
    setType(n.type || "news");
    setTopic(n.topic || "none");
    setTags(Array.isArray(n.tags) ? n.tags.join(", ") : "");
    setPubStatus(n.status || "published");
    setFeatured(Boolean(n.featured));
    if (editorRef.current) editorRef.current.innerHTML = n.content || "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
    if (res.ok) await loadItems();
  };

  const addLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-orange-500/20">
      {/* Floating Toolbar */}
      <AnimatePresence>
        {showFloatingToolbar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={{ 
              position: 'absolute', 
              top: toolbarPos.top, 
              left: toolbarPos.left,
              transform: 'translateX(-50%)',
            }}
            className="z-[200] flex items-center bg-black text-white rounded-full px-2 py-1 shadow-2xl border border-white/10"
          >
            <button onClick={() => exec("bold")} className="p-2 hover:bg-white/20 rounded-full transition-colors"><Bold className="w-4 h-4" /></button>
            <button onClick={() => exec("italic")} className="p-2 hover:bg-white/20 rounded-full transition-colors"><Italic className="w-4 h-4" /></button>
            <button onClick={addLink} className="p-2 hover:bg-white/20 rounded-full transition-colors"><LinkIcon className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button onClick={() => { exec("formatBlock", "H2"); setShowFloatingToolbar(false); }} className="p-2 hover:bg-white/20 rounded-full transition-colors"><Type className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WordPress Style Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-black/5 z-[100] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button onClick={() => window.location.href='/admin'} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Layout className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setShowBlockMenu(!showBlockMenu)}
              className={`p-2 rounded-lg transition-all ${showBlockMenu ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {status && <span className="text-xs font-medium text-orange-600 animate-pulse">{status}</span>}
          <button 
            onClick={() => onSave('draft')} 
            disabled={saving}
            className="px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Save draft
          </button>
          {slug && (
            <a href={`/news/${slug}`} target="_blank" className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors">
              Preview <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button 
            onClick={() => onSave('published')}
            disabled={saving}
            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Publish'}
          </button>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <button 
            onClick={() => setActiveSidebar(activeSidebar === 'settings' ? 'list' : 'settings')}
            className={`p-2 rounded-lg transition-colors ${activeSidebar === 'settings' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="pt-32 pb-40 flex">
        {/* BLOCK MENU POPUP */}
        <AnimatePresence>
          {showBlockMenu && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed left-4 top-20 w-72 bg-white border border-black/10 rounded-2xl shadow-2xl z-[90] p-4 overflow-y-auto max-h-[70vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-sm uppercase tracking-widest">Blocks</h3>
                <button onClick={() => setShowBlockMenu(false)}><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <BlockButton icon={<Type />} label="Heading" onClick={() => { exec("formatBlock", "H2"); setShowBlockMenu(false); }} />
                <BlockButton icon={<Quote />} label="Quote" onClick={() => { exec("formatBlock", "BLOCKQUOTE"); setShowBlockMenu(false); }} />
                <BlockButton icon={<List />} label="Bullets" onClick={() => { exec("insertUnorderedList"); setShowBlockMenu(false); }} />
                <BlockButton icon={<ListOrdered />} label="Numbers" onClick={() => { exec("insertOrderedList"); setShowBlockMenu(false); }} />
                <BlockButton icon={<Bold />} label="Bold" onClick={() => { exec("bold"); setShowBlockMenu(false); }} />
                <BlockButton icon={<LinkIcon />} label="Link" onClick={() => { addLink(); setShowBlockMenu(false); }} />
                <BlockButton icon={<Minus />} label="Divider" onClick={() => { addHr(); setShowBlockMenu(false); }} />
                <label className="flex flex-col items-center justify-center p-4 border border-black/5 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer group">
                  <ImageIcon className="w-6 h-6 mb-2 group-hover:text-orange-600" />
                  <span className="text-[10px] font-bold uppercase">Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onInsertImage(e.target.files[0])} />
                </label>
                <label className="flex flex-col items-center justify-center p-4 border border-black/5 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer group">
                  <Video className="w-6 h-6 mb-2 group-hover:text-orange-600" />
                  <span className="text-[10px] font-bold uppercase">Video</span>
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && onInsertVideo(e.target.files[0])} />
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EDITOR AREA */}
        <div className="flex-1 max-w-4xl mx-auto px-6">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add title"
            className="w-full text-5xl md:text-7xl font-bold tracking-tighter bg-transparent border-none focus:outline-none placeholder:text-gray-100 mb-12 resize-none overflow-hidden"
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
          
          <div
            ref={editorRef}
            contentEditable
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            onBlur={saveSelection}
            className="min-h-[600px] focus:outline-none prose prose-xl md:prose-2xl max-w-none placeholder:text-gray-300 leading-relaxed relative before:content-[attr(data-placeholder)] before:absolute before:text-gray-300 before:pointer-events-none empty:before:block before:hidden"
            suppressContentEditableWarning
            data-placeholder="Start writing or type / to choose a block"
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-black/5 overflow-y-auto p-6 hidden lg:block">
          {activeSidebar === 'settings' ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                  <Settings className="w-3 h-3" /> Post Settings
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500">Summary (Excerpt)</label>
                    <textarea 
                      value={excerpt} 
                      onChange={e => setExcerpt(e.target.value)}
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 ring-orange-500 outline-none h-24 resize-none"
                      placeholder="Write a brief summary..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500">Post Type</label>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      {(["news", "idea"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setType(t)}
                          className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${type === t ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Education", "Press", "Studio", "Media"].map((c) => (
                        <button
                          key={c}
                          onClick={() => setCategory(c as Category)}
                          className={`py-2 px-3 rounded-lg text-[10px] font-bold uppercase border transition-all ${category === c ? 'bg-black text-white border-black' : 'border-black/5 hover:border-black'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500">Topic Series</label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value as Topic)}
                      className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 ring-orange-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="none">None</option>
                      <option value="wayfinding">Wayfinding Design</option>
                      <option value="placemaking">Placemaking Design</option>
                      <option value="environmental-graphics">Environmental Graphics</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-500">Featured Image</label>
                    {cover ? (
                      <div className="relative aspect-video rounded-xl overflow-hidden group">
                        <img src={cover} className="w-full h-full object-cover" />
                        <button onClick={() => setCover('')} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><X className="w-5 h-5" /></button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer">
                        <ImageIcon className="w-6 h-6 text-gray-300 mb-2" />
                        <span className="text-[10px] font-bold text-gray-400">Set featured image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUploadCover(e.target.files[0])} />
                      </label>
                    )}
                  </div>

                  <div className="pt-6 border-t border-black/5">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${featured ? 'bg-orange-500' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${featured ? 'translate-x-4' : ''}`} />
                      </div>
                      <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="hidden" />
                      <span className="text-xs font-bold uppercase tracking-wider group-hover:text-orange-600 transition-colors">Featured Post</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Manage Posts</h3>
                <button onClick={loadItems} className="text-[10px] font-bold text-orange-600 uppercase">Refresh</button>
              </div>

              <div className="flex bg-gray-100 p-1 rounded-xl">
                {(["all", "published", "draft"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setSidebarFilter(f)}
                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${sidebarFilter === f ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {items
                  .filter(n => sidebarFilter === 'all' || n.status === sidebarFilter)
                  .map((n) => (
                  <div key={n.id} className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all group border border-transparent hover:border-black/5">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-bold text-sm line-clamp-2 flex-1">{n.title}</p>
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full ml-2 ${n.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                        {n.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mb-3">{new Date(n.updatedAt).toLocaleDateString()}</p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => loadToEditor(n)} className="p-1.5 bg-white rounded-lg shadow-sm hover:text-orange-600" title="Edit"><Settings className="w-3.5 h-3.5" /></button>
                      <a href={`/news/${n.slug}`} target="_blank" className="p-1.5 bg-white rounded-lg shadow-sm hover:text-blue-600" title="Preview"><ExternalLink className="w-3.5 h-3.5" /></a>
                      <button onClick={() => onDelete(n.id)} className="p-1.5 bg-white rounded-lg shadow-sm hover:text-red-600" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <p className="text-center py-10 text-xs text-gray-400">No posts found.</p>}
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

function BlockButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 border border-black/5 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
    >
      <div className="w-6 h-6 mb-2 group-hover:text-orange-600">{icon}</div>
      <span className="text-[10px] font-bold uppercase">{label}</span>
    </button>
  );
}

function addHr() {
  const hr = `<hr style="border:none;height:1px;background:#e5e7eb;margin:48px 0"/>`;
  document.execCommand("insertHTML", false, hr);
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

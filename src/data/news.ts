export type Post = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  reading: string;
  type: "news" | "idea";
  category: "Education" | "Press" | "Studio" | "Media";
  tags: string[];
  featured?: boolean;
};

export const posts: Post[] = [
  {
    id: "brand-wayfinding-2026",
    title: "Designing Human-Centric Wayfinding for Complex Campuses",
    excerpt:
      "Principles and patterns that reduce cognitive load and create calm navigation across large sites.",
    image: "/dev/p-1.jpeg",
    date: "Feb 2026",
    reading: "6 min read",
    type: "idea",
    category: "Education",
    tags: ["Wayfinding", "UX", "Strategy"],
    featured: true,
  },
  {
    id: "material-futures",
    title: "Material Futures: Low-VOC Coatings and Recycled Aluminum",
    excerpt:
      "A quick field guide to durable, maintainable and lower-impact assemblies for signage systems.",
    image: "/dev/p-2.jpeg",
    date: "Jan 2026",
    reading: "4 min read",
    type: "news",
    category: "Education",
    tags: ["Sustainability", "Fabrication"],
  },
  {
    id: "retail-rhythm",
    title: "Retail Rhythm: Building Impact and Flow",
    excerpt:
      "How spatial pacing, focal hierarchies and light shape memorable store journeys.",
    image: "/imgs/img-2.png",
    date: "Dec 2025",
    reading: "5 min read",
    type: "idea",
    category: "Education",
    tags: ["Retail", "Lighting", "Placemaking"],
  },
  {
    id: "hospitality-poise",
    title: "Hospitality Poise: Calm, Warmth and Clear Signals",
    excerpt:
      "Balancing mood and clarity in hotels and resorts through typography and light.",
    image: "/imgs/img-1.png",
    date: "Nov 2025",
    reading: "7 min read",
    type: "idea",
    category: "Education",
    tags: ["Hospitality", "Typography"],
  },
  {
    id: "prototype-to-field",
    title: "From Prototype to Field: Mockups That Save Time",
    excerpt:
      "When scaled models and full-size assemblies de-risk installations and maintenance.",
    image: "/dev/p-3.jpeg",
    date: "Oct 2025",
    reading: "3 min read",
    type: "news",
    category: "Studio",
    tags: ["Prototyping", "Ops"],
  },
  {
    id: "digital-layers",
    title: "Digital Layers in Physical Spaces",
    excerpt:
      "QR micro-interactions, AR previews and live directories that keep spaces current.",
    image: "/dev/p-4.jpeg",
    date: "Sep 2025",
    reading: "4 min read",
    type: "idea",
    category: "Media",
    tags: ["Digital", "CX", "Environmental Graphics"],
  },
  {
    id: "healthcare-wayfinding-brand",
    title: "Healthcare Wayfinding & The Brand Promise",
    excerpt:
      "Identifying experience points along the patient and visitor journey for clarity and care.",
    image: "/imgs/img-3.png",
    date: "Aug 2025",
    reading: "6 min read",
    type: "idea",
    category: "Education",
    tags: ["Healthcare", "Wayfinding", "Experience"],
  },
  {
    id: "design-trends-places",
    title: "Design Trends for Places We Love",
    excerpt:
      "Future-focused thinking on how we engage with communities through brand and place.",
    image: "/imgs/img-4.jpeg",
    date: "Jul 2025",
    reading: "5 min read",
    type: "news",
    category: "Press",
    tags: ["Trends", "Community", "EGD", "Placemaking"],
  },
  {
    id: "experience-first-venues",
    title: "Experience-First Design in Sports & Entertainment",
    excerpt:
      "Why experience now drives end-to-end decision-making for destinations.",
    image: "/dev/p-1.jpeg",
    date: "Jun 2025",
    reading: "7 min read",
    type: "idea",
    category: "Education",
    tags: ["Experience", "Entertainment", "Strategy", "Environmental Graphics"],
  },
  {
    id: "studio-growth",
    title: "Studio Growth and Experience",
    excerpt:
      "Celebrating team leadership and craft as we scale our culture and work.",
    image: "/dev/p-2.jpeg",
    date: "May 2025",
    reading: "3 min read",
    type: "news",
    category: "Studio",
    tags: ["Culture", "Studio"],
  },
];

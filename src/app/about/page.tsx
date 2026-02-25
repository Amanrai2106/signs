"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Target, Lightbulb, Sparkles } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Image from "next/image";

const teamMembers = [
  { id: 1, name: "Aman Sharma", role: "Creative Director", image: "/imgs/img-1.png" },
  { id: 2, name: "Neha Singh", role: "Lead Designer", image: "/imgs/img-2.png" },
  { id: 3, name: "Rahul Verma", role: "UX Architect", image: "/imgs/img-3.png" },
  { id: 4, name: "Simran Kaur", role: "Brand Strategist", image: "/imgs/img-4.jpeg" },
  { id: 5, name: "Karan Patel", role: "Project Manager", image: "/dev/p-1.jpeg" },
  { id: 6, name: "Priya Desai", role: "3D Visualizer", image: "/dev/p-2.jpeg" },
  { id: 7, name: "Ankit Rao", role: "Wayfinding Specialist", image: "/dev/p-3.jpeg" },
  { id: 8, name: "Meera Joshi", role: "Graphic Designer", image: "/dev/p-4.jpeg" },
  { id: 9, name: "Vikram Nair", role: "Signage Engineer", image: "/imgs/img-1.png" },
  { id: 10, name: "Suresh Kumar", role: "Fabrication Head", image: "/imgs/img-2.png" },
  { id: 11, name: "Anita Raj", role: "Industrial Designer", image: "/imgs/img-3.png" },
  { id: 12, name: "David Wilson", role: "Environmental Designer", image: "/imgs/img-4.jpeg" },
  { id: 13, name: "Elena Gilbert", role: "Project Coordinator", image: "/dev/p-1.jpeg" },
  { id: 14, name: "Stefan Salvatore", role: "Visual Communication", image: "/dev/p-2.jpeg" },
  { id: 15, name: "Bonnie Bennett", role: "Design Strategist", image: "/dev/p-3.jpeg" },
  { id: 16, name: "Caroline Forbes", role: "Account Manager", image: "/dev/p-4.jpeg" },
];

const designPrinciples = [
  {
    title: "Connection",
    description: "Creating meaningful links between architecture, brand, and the human experience.",
    icon: <Users className="w-6 h-6" />
  },
  {
    title: "Clarity",
    description: "Reducing cognitive load through intuitive navigation and functional typography.",
    icon: <Target className="w-6 h-6" />
  },
  {
    title: "Context",
    description: "Designing with respect for local culture, environment, and architectural intent.",
    icon: <Lightbulb className="w-6 h-6" />
  },
  {
    title: "Craft",
    description: "Obsessing over every detail, from material joints to the precision of type.",
    icon: <Sparkles className="w-6 h-6" />
  }
];

const sectors = [
  {
    title: "Corporate & Workplace",
    items: ["Global Headquarters", "Co-working Hubs", "Financial Centers", "Tech Campuses"]
  },
  {
    title: "Retail & Entertainment",
    items: ["Shopping Centers", "Flagship Stores", "Cinema Complexes", "Mixed-Use Hubs"]
  },
  {
    title: "Arts & Culture",
    items: ["Museums", "Galleries", "Performing Arts Centers", "Historic Sites"]
  },
  {
    title: "Hospitality",
    items: ["Luxury Resorts", "Boutique Hotels", "Urban Retreats", "Spas & Wellness"]
  },
  {
    title: "Healthcare",
    items: ["Hospitals", "Medical Centers", "Wellness Clinics", "Senior Living"]
  },
  {
    title: "Institutional & Civic",
    items: ["University Campuses", "Public Libraries", "Transit Hubs", "Civic Centers"]
  }
];

const awards = [
  {
    year: "2026",
    items: [
      {
        project: "Toyota Music Factory · Irving, TX",
        award: "Graphis Design Awards, Silver",
      },
      {
        project: "Bel Air Village · Sherman, TX",
        award: "Graphis Design Awards, Silver",
      },
    ],
  },
  {
    year: "2025",
    items: [
      {
        project: "New York Studio Mailer · New York, NY",
        award: "GDUSA Inhouse Design Awards, Announcements + Invitations",
      },
      {
        project: "CW Prime at St. Regis Longboat Resort · Longboat Key, FL",
        award: "GDUSA Inhouse Design Awards, Branding + Identity Programs",
      },
    ],
  },
  {
    year: "2024",
    items: [
      {
        project: "Post District · Salt Lake City, UT",
        award: "Mixed-Use Community of the Year, Golden Nugget Award",
      },
      {
        project: "Omni PGA Frisco Resort · Frisco, TX",
        award: "ICSC Excellence in Community Advancement Award",
      },
    ],
  },
];

const AboutPage = () => {
  return (
    <main className="min-h-screen text-black overflow-hidden bg-[#fcfcfc]">
      <Nav />

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-6 md:px-12 relative">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="flex items-center gap-2 text-orange-600 font-mono text-sm tracking-widest uppercase mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Our Story</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter leading-[0.9] mb-12">
                GRAPHICS <br />
                <span className="text-gray-400 italic font-serif">MEET</span> <br />
                ARCHITECTURE
              </h1>
              <div className="space-y-8 text-gray-700 text-xl md:text-2xl leading-relaxed font-light max-w-2xl">
                <p>
                  For over a decade, <span className="text-black font-semibold">Signsol</span> has created award-winning graphic connections with architecture. We seamlessly combine branding, wayfinding, and art into the built environment.
                </p>
                <p>
                  Our studio works at the intersection of design and the physical world, creating unique experiences through the lens of environmental graphics and human-centric navigation.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-5 relative mt-12 lg:mt-0"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-white border border-black/5 shadow-2xl relative group">
                <Image 
                  src="https://cdn.pixabay.com/photo/2017/08/06/01/43/architecture-2597991_1280.jpg" 
                  alt="Architectural connection" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              
              {/* Stats Overlay - Adjusted positioning to avoid overlap */}
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[2rem] border border-black/5 shadow-2xl hidden 2xl:block z-20">
                <div className="flex gap-12">
                  <div>
                    <p className="text-4xl font-bold tracking-tighter">12+</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Years of Craft</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold tracking-tighter">200+</p>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Collaborations</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Design Principles Section */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Design Principles</h2>
            <div className="h-1 w-20 bg-orange-500" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {designPrinciples.map((principle, i) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-orange-600 border border-black/5">
                  {principle.icon}
                </div>
                <h3 className="text-2xl font-bold">{principle.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview Prose Section */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="prose prose-2xl max-w-none prose-p:text-gray-700 prose-p:font-light prose-p:leading-[1.8] prose-strong:text-black prose-strong:font-semibold"
          >
            <p className="text-3xl md:text-4xl text-black font-medium mb-16 leading-tight">
              We operate in a space where a brand is more than a logo—it is an atmosphere you step into.
            </p>
            <p className="mb-8">At Signsol, we treat design as something you experience: light traveling across walls, wayfinding that reduces cognitive load, and a brand narrative that connects all the touchpoints across a site.</p>
            <p className="mb-8">We began as a small studio with a simple belief—do the work honestly and let the outcomes speak. We have grown in size, but tightened our standards. Every sign face, type treatment, and material joint is part of a coherent system so the brand feels consistent from entrance to exit.</p>
            
            <div className="my-24 relative aspect-video rounded-[2.5rem] overflow-hidden border border-black/5 shadow-2xl z-10">
              <Image 
                src="https://cdn.pixabay.com/photo/2015/01/08/18/30/office-593370_1280.jpg" 
                alt="Studio focus" 
                fill 
                className="object-cover"
              />
            </div>

            <p className="mb-8">Our process is research-led. We map user flows to understand entry points and focal hierarchies. We test lighting and specify materials that look great and endure heavy use. The result is not just attractive surfaces, but durable systems.</p>
            <p className="mb-8 text-black/80 font-normal">Sustainability is non‑negotiable. We prioritize recycled materials and modular assemblies that allow repair and repurposing. Prototyping lets us verify visibility and safety before we go on site.</p>
          </motion.div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="py-32 px-6 md:px-12 bg-black text-white">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-5">
              <h2 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tighter mb-8 leading-[0.9]">
                OUR <br /> COLLABORATORS
              </h2>
              <p className="text-gray-400 text-xl font-light leading-relaxed max-w-sm">
                We work across scales and project types to create unique experiences through environmental graphics.
              </p>
              <div className="mt-12 h-px w-full bg-white/20" />
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-12 xl:gap-x-16 gap-y-16">
              {sectors.map((sector) => (
                <div key={sector.title}>
                  <h3 className="text-orange-500 font-mono text-sm tracking-widest uppercase mb-8">
                    {sector.title}
                  </h3>
                  <ul className="space-y-4">
                    {sector.items.map((item) => (
                      <li key={item} className="text-2xl md:text-3xl font-bold tracking-tight hover:text-orange-500 transition-colors cursor-default leading-tight">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-white">
        <div className="w-full max-w-none mx-auto">
          <div className="px-6 md:px-12 mb-16 flex justify-between items-end">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-black">Meet Our Team</h2>
              <p className="text-gray-600 text-xl font-light leading-relaxed">
                A multidisciplinary group of designers, architects, and strategists.
              </p>
            </div>
          </div>

          {/* Dense Team Grid inspired by RSM Design */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-[2px] bg-gray-200 border-y border-gray-200">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className="group relative aspect-square bg-white overflow-hidden cursor-pointer"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-[1.01] group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
                />
                
                {/* Clean Text Overlay without dark tint to keep image colourful */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <p className="text-white font-bold text-sm leading-tight">{member.name}</p>
                  <p className="text-white/70 text-[10px] uppercase tracking-widest mt-1">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="px-6 md:px-12 mt-8 flex justify-end">
            <TransitionLink href="/about" className="group inline-flex items-center gap-2 text-black font-bold text-sm uppercase tracking-widest hover:text-orange-600 transition-colors">
              Meet Our Team
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-32 px-6 md:px-12 bg-[#fcfcfc]">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2 text-orange-600 font-mono text-sm tracking-widest uppercase mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Recognition</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-8">
                AWARDS & <br /> HONORS
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-20">
              {awards.map((group) => (
                <div key={group.year} className="space-y-10">
                  <div className="flex items-center gap-6">
                    <span className="text-2xl font-bold text-gray-300 font-mono">{group.year}</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 xl:gap-x-20 gap-y-12">
                    {group.items.map((item, idx) => (
                      <motion.div
                        key={item.project + idx}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <p className="text-2xl font-bold mb-3 leading-tight text-black">{item.project}</p>
                        <p className="text-gray-500 text-lg leading-relaxed font-light">{item.award}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutPage;

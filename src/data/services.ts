export const services = [
  {
    id: 1,
    title: "Wayfinding Design",
    description: "Human‑centred navigation for campuses, hospitals and large sites.\nUnified maps, directories and signs with consistent type and icons.\nBuilt‑in accessibility with tactile, Braille and high‑contrast cues.\nDigital touchpoints and smart placement keep people moving confidently.\nFrom strategy to install, complete sign families delivered end‑to‑end.",
    details: [
      "Directional & Wayfinding Systems",
      "Lobby & Reception Branding",
      "ADA Compliant Signage",
      "Room Identification",
      "Digital Signage Integration",
      "Campus & Healthcare Wayfinding"
    ],
    subCategories: [
      { id: "lobby", title: "Lobby & Reception", image: "/imgs/img-1.png" },
      { id: "wayfinding", title: "Wayfinding Systems", image: "/imgs/img-2.png" },
      { id: "ada", title: "ADA Compliant", image: "/imgs/img-3.png" },
    ],
    relatedProjectIds: ["office", "commercial", "educational"]
  },
  {
    id: 2,
    title: "Experiential Design",
    description: "Immersive brand moments across retail, events and workplaces.\nStory‑led environments shape journeys through graphics, materials and light.\nModular systems support quick campaigns and lasting brand zones.\nInteractive and digital surfaces turn visitors into participants.\nConcept to deployment—design, prototyping, production and rollout.",
    details: [
      "Retail Displays & POP",
      "Exhibits & Events",
      "Office & Culture Branding",
      "Digital/Interactive Touchpoints",
      "Environmental Graphics",
      "Customer Journey Mapping"
    ],
    subCategories: [
      { id: "retail-displays", title: "Retail Displays", image: "/imgs/img-2.png" },
      { id: "exhibits", title: "Exhibits & Events", image: "/imgs/img-3.png" },
      { id: "office-branding", title: "Office Branding", image: "/imgs/img-1.png" },
    ],
    relatedProjectIds: ["commercial", "retail", "office"]
  },
  {
    id: 3,
    title: "Art Installations",
    description: "Signature public art that transforms spaces and sparks emotion.\nSculptures, murals and site‑specific works tailored to context.\nArtist, engineering and fabrication collaboration from start to finish.\nMaterials and finishes chosen for safety, durability and upkeep.\nPermits, logistics and installation managed smoothly on site.",
    details: [
      "Public Art & Sculptures",
      "Murals & Supergraphics",
      "Site-Specific Installations",
      "Light & Interactive Art",
      "Fabrication & Engineering",
      "Permits & Installation"
    ],
    subCategories: [
      { id: "monument", title: "Monuments & Pylons", image: "/dev/p-1.jpeg" },
      { id: "murals", title: "Murals & Supergraphics", image: "/imgs/img-1.png" },
      { id: "sculptures", title: "Sculptural Installations", image: "/imgs/img-4.jpeg" },
    ],
    relatedProjectIds: ["retail", "commercial", "educational"]
  }
];

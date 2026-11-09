import { KitchenCollection, Material, Project } from '../types';

export const collectionsData: KitchenCollection[] = [
  {
    id: "modern-minimalist",
    title: "Modern Minimalist",
    category: "Minimalist",
    tagline: "Pure Architectural Restraint & Seamless Lines",
    description: "Conceived for spaces where purity of form commands presence. Monolithic volumes, continuous shadow lines, and whisper-quiet touch-to-open mechanics redefine the cooking space as an art gallery.",
    materialsHighlight: [
      "Fenix NTM Super-Matte Ingot",
      "Honed Calacatta Marble",
      "Smoked Bronze Glass Pocket Doors"
    ],
    specs: {
      islandFootprint: "4.8m Monolithic Block with 45° Chamfered Edges",
      cabinetryStyle: "Flush-Face Zero-Gap with Integrated LED Shadow Gaps",
      fittings: "Blum Legrabox Pure Inox with Servo-Drive Motorization",
      applianceIntegration: "Concealed Motorized Pocket Door Galley"
    },
    image: "/images/hero_luxury_kitchen.jpg",
    galleryImages: [
      "/images/hero_luxury_kitchen.jpg",
      "/images/material_marble_detail.jpg",
      "/images/collection_italian_kitchen.jpg"
    ]
  },
  {
    id: "contemporary-luxury",
    title: "Contemporary Luxury",
    category: "Contemporary",
    tagline: "Sensory Warmth Meets Monolithic Grandeur",
    description: "An intentional contrast of warm tactile fluted timber and dramatic stone slabs. Designed for lavish entertaining with multi-tiered island dining, integrated wine temples, and recessed lighting.",
    materialsHighlight: [
      "Fluted Smoked European Oak",
      "Bookmatched Arabescato Marble",
      "PVD Champagne Gold Profiles"
    ],
    specs: {
      islandFootprint: "5.2m Dual-Level Cantilever with Bar Seating",
      cabinetryStyle: "Micro-Fluted 3mm Vertical Relief Joinery",
      fittings: "Grass Nova Pro Scala with Soft-Close Hydraulic Buffers",
      applianceIntegration: "Gaggenau 400 Series Flush Induction & Dual Wine Cellars"
    },
    image: "/images/project_penthouse_kitchen.jpg",
    galleryImages: [
      "/images/project_penthouse_kitchen.jpg",
      "/images/collection_island_kitchen.jpg",
      "/images/material_marble_detail.jpg"
    ]
  },
  {
    id: "italian-inspired",
    title: "Italian-Inspired",
    category: "Italian Design",
    tagline: "Milanese Haute Couture for the Culinary Connoisseur",
    description: "Infused with Milanese architectural discipline. Dramatic Calacatta Viola veins framed in deep matte anthracite cabinetry and champagne bronze accents capture the unmistakable soul of Italian luxury.",
    materialsHighlight: [
      "Calacatta Viola Brecciated Marble",
      "Lacquered Matte Nero Charcoal",
      "Burnished Brass Suspended Light Gantry"
    ],
    specs: {
      islandFootprint: "4.2m Monolith with Integrated Prep Sink & Downdraft",
      cabinetryStyle: "30° Beveled Ergonomic Grip Edges",
      fittings: "Salice Air Concealed 3D Adjustable Hinges",
      applianceIntegration: "Bora Professional 3.0 Surface Induction with Teppanyaki"
    },
    image: "/images/collection_italian_kitchen.jpg",
    galleryImages: [
      "/images/collection_italian_kitchen.jpg",
      "/images/material_marble_detail.jpg",
      "/images/hero_luxury_kitchen.jpg"
    ]
  },
  {
    id: "bespoke-island",
    title: "Bespoke Island Kitchens",
    category: "Island Focus",
    tagline: "Sculptural Centerpieces Tailored for Social Living",
    description: "The island is elevated from a functional worktop to a private architectural sculpture. Hand-finished natural stone waterfalls wrap generous prep surfaces, wine refrigeration, and social bar seating.",
    materialsHighlight: [
      "Arabescato Corchia Natural Stone",
      "Cognac Leather Seating Accents",
      "Acoustic Slatted Walnut Timber"
    ],
    specs: {
      islandFootprint: "6.0m Sculptural Island with Floating Breakfast Banquette",
      cabinetryStyle: "Frameless Minimalist Inset with Internal Solid Walnut Organizers",
      fittings: "Blum Aventos Bi-Fold Electronic Lift Systems",
      applianceIntegration: "Miele Generation 7000 Smart Sensor Cooking Suite"
    },
    image: "/images/collection_island_kitchen.jpg",
    galleryImages: [
      "/images/collection_island_kitchen.jpg",
      "/images/project_penthouse_kitchen.jpg",
      "/images/collection_italian_kitchen.jpg"
    ]
  },
  {
    id: "handleless-modular",
    title: "Handleless Modular",
    category: "Handleless",
    tagline: "Continuous Planar Geometry & Ergonomic Precision",
    description: "Eliminating visual interruptions, this system utilizes recessed horizontal and vertical Gola channel profiles milled in aircraft-grade aluminium and champagne brass for effortless finger-glide access.",
    materialsHighlight: [
      "Taj Mahal Leathered Quartzite",
      "Cashmere Matte Lacquer",
      "Anodized Champagne Gola Profiles"
    ],
    specs: {
      islandFootprint: "4.5m Continuous Perimeter with Flush Flushboard Return",
      cabinetryStyle: "Continuous C-Channel and L-Channel Aluminum Extrusions",
      fittings: "Grass Tipmatic Soft-Close Mechanical Push Ejection",
      applianceIntegration: "Knock-to-Open Fully Integrated Dishwashing & Cooling"
    },
    image: "/images/hero_luxury_kitchen.jpg",
    galleryImages: [
      "/images/hero_luxury_kitchen.jpg",
      "/images/material_marble_detail.jpg",
      "/images/collection_italian_kitchen.jpg"
    ]
  },
  {
    id: "classic-european",
    title: "Classic European",
    category: "European Classic",
    tagline: "Timeless Heritage Reimagined for Modern Living",
    description: "A refined interpretation of classic European manor proportions. Subtle micro-shaker profiles, solid oak internal dovetail drawers, and hand-patinated hardware meet state-of-the-art smart cooking technology.",
    materialsHighlight: [
      "Carrara Statuario Marble",
      "Smoked Slate & Soft Biscuit Lacquer",
      "Hand-Turned Knurled Bronze Hardware"
    ],
    specs: {
      islandFootprint: "4.0m Furniture-Style Island with Carved Plinth Details",
      cabinetryStyle: "Ultra-Slim 12mm Contemporary Slimline Shaker",
      fittings: "Solid Dovetail European Oak Drawer Boxes with Concealed Runners",
      applianceIntegration: "La Cornue Château Range with Custom Hood Canopy"
    },
    image: "/images/project_penthouse_kitchen.jpg",
    galleryImages: [
      "/images/project_penthouse_kitchen.jpg",
      "/images/collection_island_kitchen.jpg",
      "/images/material_marble_detail.jpg"
    ]
  }
];

export const fallbackMaterials: Material[] = [
  {
    id: "mat-1",
    name: "Calacatta Viola",
    category: "Natural Marble",
    origin: "Carrara, Tuscany, Italy",
    description: "Iconic brecciated Italian marble featuring dramatic deep cabernet and purple veining against a creamy white crystalline background.",
    finish: "Honed Tactile Velvet",
    durabilityRating: "High Thermal Endurance, Sealed Anti-Stain",
    recommendedUse: "Waterfall Islands, Full-Height Bookmatched Splashbacks",
    image: "/images/material_marble_detail.jpg",
    featured: true
  },
  {
    id: "mat-2",
    name: "Arabescato Corchia",
    category: "Natural Marble",
    origin: "Apuan Alps, Italy",
    description: "Classical marble characterized by rounded dark charcoal breccia ovules interlocked across fine crystalline ivory stone.",
    finish: "Silk Satin Matte",
    durabilityRating: "Architectural Grade Calcite",
    recommendedUse: "Centerpiece Cantilevered Islands, Integrated Stone Sinks",
    image: "/images/collection_island_kitchen.jpg",
    featured: true
  },
  {
    id: "mat-3",
    name: "Pietra Grey",
    category: "Natural Marble",
    origin: "Isfahan Province",
    description: "Seductive uniform charcoal-slate limestone with delicate linear calcite striations and velvety visual depth.",
    finish: "Leathered Flamed",
    durabilityRating: "High Density, Low Porosity",
    recommendedUse: "Monolithic Prep Counters & Butler Pantries",
    image: "/images/collection_italian_kitchen.jpg",
    featured: false
  },
  {
    id: "mat-4",
    name: "Taj Mahal Quartzite",
    category: "Quartz Surfaces",
    origin: "Ceará, Brazil",
    description: "Exotic metamorphic quartzite displaying translucent pearl, soft beige, and warm gold ribbons with diamond-grade structural hardness.",
    finish: "Diamond Honed",
    durabilityRating: "Mohs Hardness 7, Scratch & Acid Proof",
    recommendedUse: "High-Traffic Culinary Worktops & Island Tops",
    image: "/images/hero_luxury_kitchen.jpg",
    featured: true
  },
  {
    id: "mat-5",
    name: "Fluted Canaletto Walnut",
    category: "Natural Wood Veneers",
    origin: "Veneto, Italy",
    description: "Precision-milled architectural timber featuring micro-ribbed 3mm acoustic fluting with rich warm mocha grain.",
    finish: "Ultra-Matte Natural Polyurethane 0-Sheen",
    durabilityRating: "FSC-Certified Grade A Core, Humidity Stabilized",
    recommendedUse: "Tall Larder Facades, Island Cladding, Concealed Bar Units",
    image: "/images/project_penthouse_kitchen.jpg",
    featured: true
  },
  {
    id: "mat-6",
    name: "Smoked Crown Cut Oak",
    category: "Natural Wood Veneers",
    origin: "Black Forest, Germany",
    description: "Deep thermo-treated rustic European oak boasting natural cathedral grain patterns, subtle charcoal undertones, and warm tactile relief.",
    finish: "Brushed Open-Pore Oil",
    durabilityRating: "High Impact Resistant Core",
    recommendedUse: "Architectural Cabinetry & Integrated Floating Shelves",
    image: "/images/hero_luxury_kitchen.jpg",
    featured: false
  },
  {
    id: "mat-7",
    name: "Fenix NTM Nero Ingot",
    category: "Italian Laminates",
    origin: "Lombardy, Italy",
    description: "Nanotech smart surface with extremely low light reflectivity, soft-touch micro-texture, and thermal healing of superficial micro-scratches.",
    finish: "Super-Matte Anti-Fingerprint",
    durabilityRating: "Thermal Healing, Anti-Bacterial",
    recommendedUse: "Handleless Cabinet Doors & Touch-To-Open Drawers",
    image: "/images/collection_italian_kitchen.jpg",
    featured: true
  },
  {
    id: "mat-8",
    name: "Brushed Champagne Brass",
    category: "Luxury Hardware",
    origin: "Vienna, Austria",
    description: "Precision CNC milled solid architectural brass with an artisanal longitudinal satin brush and PVD micro-coating.",
    finish: "PVD Champagne Satin",
    durabilityRating: "Wear-Resistant PVD Coating, Zero Tarnish",
    recommendedUse: "Integrated Pocket Handles, Gola Profiles & Shadow Gaps",
    image: "/images/material_marble_detail.jpg",
    featured: true
  },
  {
    id: "mat-9",
    name: "Cashmere Pure Acrylic",
    category: "Premium Acrylic Finishes",
    origin: "Bavaria, Germany",
    description: "Optically pure, mirror-flat 1.2mm solid co-extruded acrylic with UV stabilized pigmenting and warm stone undertone.",
    finish: "Anti-Scratch Velvet Silk",
    durabilityRating: "Zero Yellowing UV Guarantee, Moisture Sealed",
    recommendedUse: "Upper Larder Columns & Clean Wall Runs",
    image: "/images/hero_luxury_kitchen.jpg",
    featured: false
  },
  {
    id: "mat-10",
    name: "Deep Espresso Lacquer",
    category: "Matte Lacquer Finishes",
    origin: "Florence, Italy",
    description: "Nine-coat hand-sanded Italian polyurethane lacquer baked in sterile cleanrooms to achieve a tactile silk feel.",
    finish: "Dead-Flat 5% Gloss",
    durabilityRating: "Impact Hardened, Formaldehyde Free",
    recommendedUse: "Tall Storage Monoliths & Appliance Banks",
    image: "/images/collection_italian_kitchen.jpg",
    featured: true
  },
  {
    id: "mat-11",
    name: "Fluted Bronze Glass Frame",
    category: "Designer Cabinet Finishes",
    origin: "Venice, Italy",
    description: "Slimline anodized champagne bronze frame enclosing acoustic fluted reeded glass with integrated 2700K perimeter LED edge lighting.",
    finish: "Micro-Ribbed Fluted Bronze",
    durabilityRating: "Tempered Safety Glass, Structural Aluminium",
    recommendedUse: "Display Cabinets, Sommelier Storage, Vitrines",
    image: "/images/collection_italian_kitchen.jpg",
    featured: true
  }
];

export const fallbackProjects: Project[] = [
  {
    id: "proj-1",
    name: "The Bellair Penthouse",
    location: "Belgravia, London",
    style: "Contemporary Luxury",
    materialsUsed: "Calacatta Viola, Smoked Crown Oak, Champagne Brass",
    overview: "A 450 sq m duplex penthouse overlooking Hyde Park. Designed with a continuous 5.2-meter cantilevered marble island, motorized pocket doors concealing the chef's preparation galley, and bespoke Sub-Zero refrigeration columns.",
    year: "2026",
    image: "/images/project_penthouse_kitchen.jpg",
    clientQuote: "Velora transformed our space into an architectural sculpture. The joinery precision and stone selection are beyond peer.",
    featured: true
  },
  {
    id: "proj-2",
    name: "Villa Sereno",
    location: "Lake Como, Italy",
    style: "Italian-Inspired Minimalist",
    materialsUsed: "Pietra Grey Marble, Matte Nero Fenix, Fluted Walnut",
    overview: "Lakeside estate kitchen engineered to harmonise with panoramic alpine views. Features dual parallel monolith islands, ceiling-recessed flush induction extraction, and floor-to-ceiling climate-controlled sommelier displays.",
    year: "2025",
    image: "/images/collection_italian_kitchen.jpg",
    clientQuote: "Every drawer glides with silent authority. It is truly the heart of our villa.",
    featured: true
  },
  {
    id: "proj-3",
    name: "The Mercer Loft",
    location: "SoHo, New York",
    style: "Bespoke Island Architecture",
    materialsUsed: "Arabescato Corchia, Burnished Gunmetal, Cashmere Lacquer",
    overview: "Historic cast-iron loft conversion featuring a sculptural curved island with bookmatched marble waterfall edges, integrated banquette breakfast lounge, and concealed appliance garaging.",
    year: "2026",
    image: "/images/collection_island_kitchen.jpg",
    clientQuote: "The 3D design studio accurately predicted every proportion before a single slab was cut.",
    featured: true
  },
  {
    id: "proj-4",
    name: "Palais Vendôme Residence",
    location: "Paris, France",
    style: "Modern Minimalist",
    materialsUsed: "Taj Mahal Quartzite, Fluted Smoked Oak, Brushed Bronze",
    overview: "An opulent Haussmannian salon turned culinary sanctuary. Retains 19th-century gilded cornices while incorporating ultra-minimalist handleless titanium-trimmed cabinetry.",
    year: "2025",
    image: "/images/hero_luxury_kitchen.jpg",
    clientQuote: "A seamless synthesis of historic Parisian grandeur and contemporary culinary tech.",
    featured: true
  }
];

export const clientTestimonials = [
  {
    quote: "Velora’s architectural approach sets them apart from every other kitchen maker in Europe. The bookmatched Calacatta Viola waterfall island was executed to within a fraction of a millimetre.",
    author: "Elena von Stauffenberg",
    role: "Private Homeowner",
    residence: "Belgravia Penthouse, London",
    projectRef: "The Bellair Penthouse"
  },
  {
    quote: "As an architect specializing in high-end Alpine estates, finding a modular manufacturer with this level of custom flexibility and CNC joinery fidelity has been a revelation.",
    author: "Matteo Bellini",
    role: "Principal, Studio Bellini Architettura",
    residence: "Lake Como Villa, Italy",
    projectRef: "Villa Sereno"
  },
  {
    quote: "Cooking in our Velora kitchen feels effortless. The Blum motorized servo drawers, concealed prep bays, and silent downdraft extraction make hosting twenty guests feel intimate and calm.",
    author: "Chef Christian Vance",
    role: "Michelin-Starred Consultant Chef",
    residence: "SoHo Loft, New York",
    projectRef: "The Mercer Loft"
  }
];

export const brandPillars = [
  {
    number: "01",
    title: "Bespoke Custom Designs",
    description: "Every millimeter of your culinary space is modeled around your domestic rhythms, ceiling heights, and entertaining habits. No standardized modular filler panels; only tailor-made perfection."
  },
  {
    number: "02",
    title: "International Quality Materials",
    description: "Direct quarry allocation from Carrara and Tuscany, FSC-certified Black Forest oaks, Italian smart nanotech surfaces, and Austrian PVD-coated architectural brass fittings."
  },
  {
    number: "03",
    title: "Advanced 3D Visualization",
    description: "Photorealistic spatial ray-tracing allows you to step inside your kitchen, audit lighting temperatures, and test ergonomic clearances months before physical manufacture commences."
  },
  {
    number: "04",
    title: "Precision Manufacturing",
    description: "Crafted in our state-of-the-art facility operating to an uncompromising 0.1mm CNC tolerance with hand-sanded Italian lacquers and 100% moisture-sealed PUR edge bonding."
  },
  {
    number: "05",
    title: "White-Glove Installation",
    description: "Installed exclusively by Velora master guild joiners and stone masons. Leveling, laser alignment, appliance calibration, and stone polish are completed under rigorous senior supervision."
  },
  {
    number: "06",
    title: "Dedicated Client Concierge",
    description: "A single senior interior architect guides you from first sketch to culinary handover, backed by our comprehensive 15-year structural warranty and annual maintenance audit."
  }
];

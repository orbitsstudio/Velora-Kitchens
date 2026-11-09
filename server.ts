import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Persistent database file path
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'velora-db.json');

// Initial seed data
const initialData = {
  bookings: [
    {
      id: "VK-2026-7841",
      fullName: "Lady Eleanor Kensington",
      email: "eleanor.kensington@mayfair-estates.co.uk",
      phone: "+44 20 7946 0912",
      city: "Mayfair, London",
      propertyType: "Penthouse",
      kitchenSize: "Grand (250 - 400 sq ft)",
      preferredDate: "2026-11-18",
      preferredTime: "10:00 AM - 12:00 PM",
      consultationType: "3D Kitchen Design Consultation",
      additionalRequirements: "Triple-height atrium ceiling integration with bookmatched Arabescato marble waterfall island and Gaggenau 400-series induction.",
      status: "Confirmed",
      createdAt: "2026-11-05T14:22:10Z",
      adminNotes: "Client requested private viewing at Mayfair Flagship studio. Architectural blueprints pre-loaded.",
      customStudioConfig: {
        layout: "Island Parallel",
        finish: "Smoked Crown Oak",
        countertop: "Calacatta Viola",
        hardware: "Brushed Champagne Brass"
      }
    },
    {
      id: "VK-2026-8192",
      fullName: "Arch. Matteo Bellini",
      email: "m.bellini@studio-bellini.it",
      phone: "+39 02 8739 4410",
      city: "Lake Como, Italy",
      propertyType: "Luxury Villa",
      kitchenSize: "Estate Master (> 400 sq ft)",
      preferredDate: "2026-11-22",
      preferredTime: "02:00 PM - 04:00 PM",
      consultationType: "Material Selection Consultation",
      additionalRequirements: "Selecting custom fluted canaletto walnut veneers and honed titanium-edge finishes for a 600m² lakeside residence.",
      status: "Pending Review",
      createdAt: "2026-11-06T09:15:30Z",
      adminNotes: "Project architect for private international client. Requires physical stone sample box dispatch.",
      customStudioConfig: {
        layout: "Double Island",
        finish: "Fluted Canaletto Walnut",
        countertop: "Pietra Grey Marble",
        hardware: "Burnished Gunmetal"
      }
    }
  ],
  enquiries: [
    {
      id: "ENQ-104",
      name: "Jean-Pierre Laurent",
      email: "jp.laurent@residence-paris.fr",
      phone: "+33 1 42 68 55 00",
      subject: "Bespoke Wine Cellar & Kitchen Integration",
      message: "We are renovating a historic Haussmannian apartment near Place Vendôme and wish to combine a 120-bottle climate cabinet with the Velora Handleless line.",
      status: "Responded",
      createdAt: "2026-11-04T16:40:00Z"
    },
    {
      id: "ENQ-105",
      name: "Marcus Sterling",
      email: "sterling@tribecadevelopments.com",
      phone: "+1 212 555 0198",
      subject: "TriBeCa Multi-Unit Luxury Development",
      message: "Inquiring about master specification packages for 8 luxury full-floor condominiums in downtown Manhattan.",
      status: "Unread",
      createdAt: "2026-11-07T08:12:00Z"
    }
  ],
  materials: [
    {
      id: "mat-1",
      name: "Calacatta Viola",
      category: "Natural Marble",
      origin: "Carrara, Tuscany, Italy",
      description: "Iconic brecciated Italian marble featuring dramatic deep cabernet and purple veining against a creamy white crystalline background.",
      finish: "Honed Tactile Velvet",
      durabilityRating: "High Thermal Endurance, Sealed Anti-Stain",
      recommendedUse: "Waterfall Islands, Full-Height Bookmatched Splashbacks",
      image: "/src/assets/images/material_marble_detail_1794074100264.jpg",
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
      image: "/src/assets/images/collection_island_kitchen_1794074099657.jpg",
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
      image: "/src/assets/images/collection_italian_kitchen_1794074099328.jpg",
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
      image: "/src/assets/images/hero_luxury_kitchen_1794074099834.jpg",
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
      image: "/src/assets/images/project_penthouse_kitchen_1794074100537.jpg",
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
      image: "/src/assets/images/hero_luxury_kitchen_1794074099834.jpg",
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
      image: "/src/assets/images/collection_italian_kitchen_1794074099328.jpg",
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
      image: "/src/assets/images/material_marble_detail_1794074100264.jpg",
      featured: true
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "The Bellair Penthouse",
      location: "Belgravia, London",
      style: "Contemporary Luxury",
      materialsUsed: "Calacatta Viola, Smoked Crown Oak, Champagne Brass",
      overview: "A 450 sq m duplex penthouse overlooking Hyde Park. Designed with a continuous 5.2-meter cantilevered marble island, motorized pocket doors concealing the chef's preparation galley, and bespoke Sub-Zero refrigeration columns.",
      year: "2026",
      image: "/src/assets/images/project_penthouse_kitchen_1794074100537.jpg",
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
      image: "/src/assets/images/collection_italian_kitchen_1794074099328.jpg",
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
      image: "/src/assets/images/collection_island_kitchen_1794074099657.jpg",
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
      image: "/src/assets/images/hero_luxury_kitchen_1794074099834.jpg",
      clientQuote: "A seamless synthesis of historic Parisian grandeur and contemporary culinary tech.",
      featured: true
    }
  ]
};

// Ensure data folder and file exist
function initDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

function readDb() {
  try {
    initDb();
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db:', err);
    return initialData;
  }
}

function writeDb(data: any) {
  try {
    initDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db:', err);
    return false;
  }
}

// REST API Endpoints

// 1. Get all consultation bookings
app.get('/api/bookings', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ success: true, bookings: db.bookings || [] });
});

// 2. Create a new consultation booking
app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    fullName,
    email,
    phone,
    city,
    propertyType,
    kitchenSize,
    preferredDate,
    preferredTime,
    consultationType,
    additionalRequirements,
    customStudioConfig
  } = req.body;

  if (!fullName || !email || !phone || !preferredDate) {
    return res.status(400).json({ success: false, error: 'Required fields missing' });
  }

  const db = readDb();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newBooking = {
    id: `VK-${new Date().getFullYear()}-${randomSuffix}`,
    fullName,
    email,
    phone,
    city: city || 'Not specified',
    propertyType: propertyType || 'Luxury Residence',
    kitchenSize: kitchenSize || 'Grand (250 - 400 sq ft)',
    preferredDate,
    preferredTime: preferredTime || '10:00 AM - 12:00 PM',
    consultationType: consultationType || 'Initial Design Consultation',
    additionalRequirements: additionalRequirements || '',
    status: 'Pending Review',
    createdAt: new Date().toISOString(),
    adminNotes: 'Booking submitted via Velora Online Concierge.',
    customStudioConfig: customStudioConfig || null
  };

  db.bookings.unshift(newBooking);
  writeDb(db);

  res.status(201).json({ success: true, booking: newBooking });
});

// 3. Update booking status or admin notes
app.patch('/api/bookings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const db = readDb();
  const index = db.bookings.findIndex((b: any) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Booking reference not found' });
  }

  if (status) db.bookings[index].status = status;
  if (adminNotes !== undefined) db.bookings[index].adminNotes = adminNotes;
  writeDb(db);

  res.json({ success: true, booking: db.bookings[index] });
});

// 4. Client Enquiries
app.get('/api/enquiries', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ success: true, enquiries: db.enquiries || [] });
});

app.post('/api/enquiries', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
  }

  const db = readDb();
  const newEnquiry = {
    id: `ENQ-${Math.floor(100 + Math.random() * 900)}`,
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Design Enquiry',
    message,
    status: 'Unread',
    createdAt: new Date().toISOString()
  };

  db.enquiries.unshift(newEnquiry);
  writeDb(db);

  res.status(201).json({ success: true, enquiry: newEnquiry });
});

app.patch('/api/enquiries/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const db = readDb();
  const index = db.enquiries.findIndex((e: any) => e.id === id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Enquiry not found' });

  if (status) db.enquiries[index].status = status;
  writeDb(db);
  res.json({ success: true, enquiry: db.enquiries[index] });
});

// 5. Materials catalog endpoints
app.get('/api/materials', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ success: true, materials: db.materials || [] });
});

app.post('/api/materials', (req: Request, res: Response) => {
  const material = req.body;
  if (!material.name || !material.category) {
    return res.status(400).json({ success: false, error: 'Name and category are required' });
  }

  const db = readDb();
  const newMaterial = {
    id: `mat-${Date.now()}`,
    ...material,
    image: material.image || '/src/assets/images/material_marble_detail_1794074100264.jpg'
  };
  db.materials.push(newMaterial);
  writeDb(db);

  res.status(201).json({ success: true, material: newMaterial });
});

// 6. Projects endpoints
app.get('/api/projects', (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ success: true, projects: db.projects || [] });
});

app.post('/api/projects', (req: Request, res: Response) => {
  const project = req.body;
  if (!project.name || !project.location) {
    return res.status(400).json({ success: false, error: 'Name and location are required' });
  }

  const db = readDb();
  const newProject = {
    id: `proj-${Date.now()}`,
    ...project,
    image: project.image || '/src/assets/images/project_penthouse_kitchen_1794074100537.jpg'
  };
  db.projects.push(newProject);
  writeDb(db);

  res.status(201).json({ success: true, project: newProject });
});

// Admin authentication route
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { passkey } = req.body;
  // Secure luxury studio administrative passkey
  if (passkey === 'velora2026' || passkey === 'admin' || passkey === 'luxury') {
    return res.json({ success: true, token: 'velora-auth-session-tok' });
  }
  return res.status(401).json({ success: false, error: 'Invalid studio passkey' });
});

// Mount Vite or static server
async function startServer() {
  initDb();

  if (process.env.NODE_ENV === 'production') {
    // Serve production build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Dev mode with Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`VELORA KITCHENS server operational on http://localhost:${PORT}`);
  });
}

startServer();

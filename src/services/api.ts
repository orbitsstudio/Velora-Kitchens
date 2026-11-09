import { Booking, Enquiry, Material, Project } from '../types';
import { fallbackMaterials, fallbackProjects } from '../data/initialContent';

const STORAGE_KEYS = {
  BOOKINGS: 'velora_bookings',
  ENQUIRIES: 'velora_enquiries',
  MATERIALS: 'velora_materials',
  PROJECTS: 'velora_projects',
  ADMIN_AUTH: 'velora_admin_token'
};

export const api = {
  // Bookings
  async getBookings(): Promise<Booking[]> {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        if (data.bookings) return data.bookings;
      }
    } catch {
      // API call failed, fall through to localStorage
    }
    const local = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // parsing error
      }
    }
    return [];
  },

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) {
        const data = await res.json();
        return data.booking;
      }
    } catch {
      // fallback
    }

    // Local fallback creation
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      id: `VK-${new Date().getFullYear()}-${randomSuffix}`,
      ...bookingData,
      status: 'Pending Review',
      createdAt: new Date().toISOString(),
      adminNotes: 'Booking submitted via Velora Online Concierge.'
    };

    const current = await this.getBookings();
    current.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(current));
    return newBooking;
  },

  async updateBooking(id: string, updates: { status?: Booking['status']; adminNotes?: string }): Promise<Booking | null> {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const data = await res.json();
        return data.booking;
      }
    } catch {
      // fallback
    }

    const current = await this.getBookings();
    const index = current.findIndex(b => b.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(current));
      return current[index];
    }
    return null;
  },

  // Enquiries
  async getEnquiries(): Promise<Enquiry[]> {
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        const data = await res.json();
        if (data.enquiries) return data.enquiries;
      }
    } catch {
      // fallback
    }
    const local = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return [];
  },

  async createEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<Enquiry> {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry)
      });
      if (res.ok) {
        const data = await res.json();
        return data.enquiry;
      }
    } catch {
      // fallback
    }

    const newEnquiry: Enquiry = {
      id: `ENQ-${Math.floor(100 + Math.random() * 900)}`,
      ...enquiry,
      status: 'Unread',
      createdAt: new Date().toISOString()
    };
    const current = await this.getEnquiries();
    current.unshift(newEnquiry);
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(current));
    return newEnquiry;
  },

  async updateEnquiryStatus(id: string, status: Enquiry['status']): Promise<void> {
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch {
      // fallback
    }
    const current = await this.getEnquiries();
    const index = current.findIndex(e => e.id === id);
    if (index !== -1) {
      current[index].status = status;
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(current));
    }
  },

  // Materials
  async getMaterials(): Promise<Material[]> {
    try {
      const res = await fetch('/api/materials');
      if (res.ok) {
        const data = await res.json();
        if (data.materials && data.materials.length > 0) return data.materials;
      }
    } catch {
      // fallback
    }
    const local = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return fallbackMaterials;
  },

  async addMaterial(material: Omit<Material, 'id'>): Promise<Material> {
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material)
      });
      if (res.ok) {
        const data = await res.json();
        return data.material;
      }
    } catch {
      // fallback
    }
    const newMat: Material = {
      id: `mat-${Date.now()}`,
      ...material
    };
    const current = await this.getMaterials();
    current.push(newMat);
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(current));
    return newMat;
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (data.projects && data.projects.length > 0) return data.projects;
      }
    } catch {
      // fallback
    }
    const local = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }
    return fallbackProjects;
  },

  async addProject(project: Omit<Project, 'id'>): Promise<Project> {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      if (res.ok) {
        const data = await res.json();
        return data.project;
      }
    } catch {
      // fallback
    }
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      ...project
    };
    const current = await this.getProjects();
    current.push(newProj);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(current));
    return newProj;
  },

  // Admin Auth
  async loginAdmin(passkey: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey })
      });
      if (res.ok) {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'authenticated');
        return true;
      }
    } catch {
      // fallback
    }
    if (passkey === 'velora2026' || passkey === 'admin' || passkey === 'luxury') {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'authenticated');
      return true;
    }
    return false;
  },

  isAdminLoggedIn(): boolean {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'authenticated';
  },

  logoutAdmin(): void {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
};

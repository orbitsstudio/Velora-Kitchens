export type ConsultationType =
  | 'Initial Design Consultation'
  | '3D Kitchen Design Consultation'
  | 'Material Selection Consultation'
  | 'Installation Consultation';

export type PropertyType =
  | 'Penthouse'
  | 'Luxury Villa'
  | 'Contemporary Apartment'
  | 'Private Estate'
  | 'Architect / Developer Project';

export type KitchenSize =
  | 'Compact (< 150 sq ft)'
  | 'Executive (150 - 250 sq ft)'
  | 'Grand (250 - 400 sq ft)'
  | 'Estate Master (> 400 sq ft)';

export interface StudioConfig {
  layout: string;
  finish: string;
  countertop: string;
  hardware: string;
  lighting?: string;
}

export interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  propertyType: PropertyType | string;
  kitchenSize: KitchenSize | string;
  preferredDate: string;
  preferredTime: string;
  consultationType: ConsultationType | string;
  additionalRequirements: string;
  status: 'Pending Review' | 'Confirmed' | 'Completed' | 'Rescheduled' | 'Declined';
  createdAt: string;
  adminNotes?: string;
  customStudioConfig?: StudioConfig | null;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Responded' | 'Archived';
  createdAt: string;
}

export interface Material {
  id: string;
  name: string;
  category:
    | 'Natural Marble'
    | 'Quartz Surfaces'
    | 'Italian Laminates'
    | 'Premium Acrylic Finishes'
    | 'Natural Wood Veneers'
    | 'Matte Lacquer Finishes'
    | 'Luxury Hardware'
    | 'Designer Cabinet Finishes';
  origin: string;
  description: string;
  finish: string;
  durabilityRating: string;
  recommendedUse: string;
  image: string;
  featured?: boolean;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  style: string;
  materialsUsed: string;
  overview: string;
  year: string;
  image: string;
  clientQuote?: string;
  featured?: boolean;
}

export interface KitchenCollection {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  materialsHighlight: string[];
  specs: {
    islandFootprint: string;
    cabinetryStyle: string;
    fittings: string;
    applianceIntegration: string;
  };
  image: string;
  galleryImages: string[];
}

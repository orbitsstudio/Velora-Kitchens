/**
 * Image resolution & graceful fallback utilities for VELORA KITCHENS
 * Ensures zero broken images across dev, preview, and production (Render) environments.
 */

export const LUXURY_IMAGE_FALLBACKS = {
  hero: '/images/hero_luxury_kitchen.jpg',
  penthouse: '/images/project_penthouse_kitchen.jpg',
  italian: '/images/collection_italian_kitchen.jpg',
  island: '/images/collection_island_kitchen.jpg',
  marble: '/images/material_marble_detail.jpg'
};

export const DEFAULT_IMAGE = LUXURY_IMAGE_FALLBACKS.hero;

/**
 * Normalizes legacy paths (like /src/assets/images/...) into standard production-safe public paths (/images/...).
 */
export function getOptimizedImageUrl(url?: string | null, fallback = DEFAULT_IMAGE): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const clean = url.trim();

  // If path is already /images/..., return it
  if (clean.startsWith('/images/')) {
    return clean;
  }

  // If path points to /src/assets/images/, convert to /images/
  if (clean.startsWith('/src/assets/images/')) {
    const filename = clean.replace('/src/assets/images/', '');
    // Check if filename maps directly to clean or timestamped file
    return `/images/${filename}`;
  }

  return clean;
}

/**
 * Robust image error handler to prevent broken image icons on production deployments.
 */
export function handleImageFallback(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  customFallback: string = DEFAULT_IMAGE
) {
  const img = event.currentTarget;
  if (!img) return;

  // Prevent infinite loops if fallback fails
  const attemptCount = Number(img.dataset.fallbackAttempts || '0');

  if (attemptCount === 0) {
    img.dataset.fallbackAttempts = '1';
    img.src = customFallback;
  } else if (attemptCount === 1) {
    img.dataset.fallbackAttempts = '2';
    // Fall back to hero image
    img.src = LUXURY_IMAGE_FALLBACKS.hero;
  } else {
    // Ultimate SVG fallback with luxury Velora styling so layout never shifts or breaks
    img.dataset.fallbackAttempts = '3';
    img.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%231E1B18"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="%23C6A875" font-family="serif" font-size="24" letter-spacing="4">VELORA KITCHENS</text><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%23D8CCBA" font-family="sans-serif" font-size="12" letter-spacing="2">ARCHITECTURAL BESPOKE JOINERY</text></svg>`;
  }
}

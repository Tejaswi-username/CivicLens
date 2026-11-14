/**
 * Image handling utilities for CivicLens
 * Handles compression for local uploads, authentic web hazard images, and safe SVG fallbacks.
 */

export const WEB_HAZARD_IMAGES = {
  pothole: [
    '/images/sample/pothole1.jpg',
    '/images/sample/pothole2.jpg',
    '/images/sample/pothole3.jpg'
  ],
  streetlight: [
    '/images/sample/streetlight1.jpg',
    '/images/sample/streetlight2.jpg'
  ],
  openDrain: [
    '/images/sample/openDrain1.jpg',
    '/images/sample/openDrain2.jpg'
  ],
  waterlogging: [
    '/images/sample/waterlogging1.jpg',
    '/images/sample/waterlogging2.jpg'
  ],
  footpath: [
    '/images/sample/footpath1.jpg',
    '/images/sample/footpath2.jpg'
  ],
  unsafeCrossing: [
    '/images/sample/unsafeCrossing1.jpg',
    '/images/sample/unsafeCrossing2.jpg'
  ],
  garbage: [
    '/images/sample/garbage1.jpg',
    '/images/sample/garbage2.jpg'
  ],
  fixed: [
    '/images/sample/resolvedRoad1.jpg',
    '/images/sample/resolvedStreetlight1.jpg'
  ]
};

/**
 * Returns the most appropriate real photograph from the web matching
 * the defect category and text description keywords.
 */
export function getAppropriateWebImage(category?: string, description?: string): string {
  const text = `${category || ''} ${description || ''}`.toLowerCase();

  // Contextual matching from text keywords
  if (
    text.includes('pothole') ||
    text.includes('crater') ||
    text.includes('asphalt') ||
    text.includes('road hole') ||
    text.includes('depression')
  ) {
    return WEB_HAZARD_IMAGES.pothole[0];
  }
  if (
    text.includes('streetlight') ||
    text.includes('street light') ||
    text.includes('lamp') ||
    text.includes('dark') ||
    text.includes('unlit') ||
    text.includes('flicker') ||
    text.includes('pole')
  ) {
    return WEB_HAZARD_IMAGES.streetlight[0];
  }
  if (
    text.includes('drain') ||
    text.includes('manhole') ||
    text.includes('sewer') ||
    text.includes('gutter') ||
    text.includes('culvert')
  ) {
    return WEB_HAZARD_IMAGES.openDrain[0];
  }
  if (
    text.includes('water') ||
    text.includes('flood') ||
    text.includes('rain') ||
    text.includes('stagnant') ||
    text.includes('logging') ||
    text.includes('puddle')
  ) {
    return WEB_HAZARD_IMAGES.waterlogging[0];
  }
  if (
    text.includes('footpath') ||
    text.includes('sidewalk') ||
    text.includes('paver') ||
    text.includes('pavement') ||
    text.includes('curb') ||
    text.includes('walkway')
  ) {
    return WEB_HAZARD_IMAGES.footpath[0];
  }
  if (
    text.includes('crossing') ||
    text.includes('zebra') ||
    text.includes('pedestrian') ||
    text.includes('signal') ||
    text.includes('intersection')
  ) {
    return WEB_HAZARD_IMAGES.unsafeCrossing[0];
  }
  if (
    text.includes('garbage') ||
    text.includes('trash') ||
    text.includes('waste') ||
    text.includes('dump') ||
    text.includes('litter') ||
    text.includes('debris')
  ) {
    return WEB_HAZARD_IMAGES.garbage[0];
  }
  if (
    text.includes('fixed') ||
    text.includes('repaired') ||
    text.includes('resolved') ||
    text.includes('completed')
  ) {
    return WEB_HAZARD_IMAGES.fixed[0];
  }

  // Category fallback matching
  switch (category) {
    case 'Pothole':
      return WEB_HAZARD_IMAGES.pothole[0];
    case 'Broken Streetlight':
      return WEB_HAZARD_IMAGES.streetlight[0];
    case 'Open Drain':
      return WEB_HAZARD_IMAGES.openDrain[0];
    case 'Waterlogging':
      return WEB_HAZARD_IMAGES.waterlogging[0];
    case 'Damaged Footpath':
      return WEB_HAZARD_IMAGES.footpath[0];
    case 'Unsafe Crossing':
      return WEB_HAZARD_IMAGES.unsafeCrossing[0];
    case 'Garbage Dumping':
      return WEB_HAZARD_IMAGES.garbage[0];
    default:
      return WEB_HAZARD_IMAGES.pothole[1];
  }
}

/**
 * Compresses and resizes an uploaded image file before storing as a data URL.
 * Reduces 2MB-8MB images down to ~50KB-90KB so they fit reliably inside localStorage
 * and persist across page refreshes without QuotaExceededError.
 */
export async function compressImage(
  file: File,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/') || file.size < 30 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        resolve(event.target?.result as string);
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Generates a clean inline SVG fallback graphic tailored to civic infrastructure categories.
 */
export function getCategoryFallbackSvg(category?: string): string {
  const label = category || 'Civic Infrastructure';
  const bgColor = '#0f172a';
  const accentColor = '#3b82f6';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="${bgColor}" />
      </linearGradient>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#334155" stroke-width="0.5" stroke-opacity="0.4"/>
      </pattern>
    </defs>
    <rect width="600" height="400" fill="url(#g)" />
    <rect width="600" height="400" fill="url(#grid)" />
    <circle cx="300" cy="170" r="54" fill="#1e293b" stroke="${accentColor}" stroke-width="2.5" />
    <path d="M285 185 L300 155 L315 185 Z" fill="none" stroke="${accentColor}" stroke-width="3" stroke-linejoin="round" />
    <circle cx="300" cy="180" r="2" fill="${accentColor}" />
    <line x1="300" y1="165" x2="300" y2="174" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round" />
    <text x="300" y="260" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="#f8fafc" text-anchor="middle">
      ${label}
    </text>
    <text x="300" y="285" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">
      CivicLens Infrastructure Record
    </text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

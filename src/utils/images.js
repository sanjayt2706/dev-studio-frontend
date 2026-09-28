/**
 * Centralized image paths and fallback utility.
 * Every image-consuming component should use getImageUrl() 
 * to resolve the correct source, placeholder, or broken-image fallback.
 */

export const PLACEHOLDERS = {
  member: '/assets/team/member-placeholder.svg',
  event: '/assets/events/poster-placeholder.svg',
  project: '/assets/projects/project-placeholder.svg',
  resource: '/assets/projects/project-placeholder.svg',
  announcement: '/assets/gallery/gallery-placeholder.svg',
  gallery: '/assets/gallery/gallery-placeholder.svg',
  logo: '/assets/brand/dev-studio-logo.png',
};

/**
 * Returns the image URL or the appropriate placeholder.
 * @param {string|null|undefined} url - The real image URL (can be null).
 * @param {'member'|'event'|'project'|'gallery'} type - The placeholder category.
 * @returns {string} A valid image src.
 */
export const getImageUrl = (url, type = 'project') => {
  if (url && typeof url === 'string' && url.trim() !== '') {
    if (url.startsWith('/uploads/')) {
      const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
        .trim()
        .replace(/\/api\/?$/, '')
        .replace(/\/+$/, '');
      return `${backendBase}${url}`;
    }
    return url;
  }
  return PLACEHOLDERS[type] || PLACEHOLDERS.project;
};

/**
 * onError handler for <img> tags — swaps in the placeholder if the image breaks.
 * Usage: <img onError={handleImageError('member')} />
 */
export const handleImageError = (type = 'project') => (e) => {
  e.target.onerror = null; // prevent infinite loop
  e.target.src = PLACEHOLDERS[type] || PLACEHOLDERS.project;
};

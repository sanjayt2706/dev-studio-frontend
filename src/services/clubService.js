import api from './api';
import teamData from '../data/team';
import projectsData from '../data/projects';
import announcementsData from '../data/announcements';
import eventsData from '../data/events';
import resourcesData from '../data/resources';

/**
 * Normalizes member data from either Mongo backend or static mock.
 */
export const normalizeMember = (m) => ({
  id: m._id || m.id,
  _id: m._id || m.id,
  name: m.name || 'Member',
  role: m.role || 'Contributor',
  team: m.team || 'Core',
  year: m.year || '1st Year',
  branch: m.branch || 'Engineering',
  image: m.profileImage || m.image || '/assets/team/member-placeholder.svg',
  profileImage: m.profileImage || m.image || '/assets/team/member-placeholder.svg',
  bio: m.shortBio || m.bio || '',
  shortBio: m.shortBio || m.bio || '',
  skills: Array.isArray(m.skills) ? m.skills : (m.skills ? m.skills.split(',').map(s => s.trim()) : []),
  github: m.github || '',
  linkedin: m.linkedin || '',
  portfolio: m.portfolio || '',
  active: m.isActive !== undefined ? m.isActive : (m.active !== undefined ? m.active : true),
  isActive: m.isActive !== undefined ? m.isActive : (m.active !== undefined ? m.active : true),
});

export const normalizeProject = (p) => ({
  ...p,
  id: p._id || p.id,
  _id: p._id || p.id,
  title: p.title || 'Untitled Project',
  slug: p.slug || '',
  subtitle: p.subtitle || '',
  description: p.description || '',
  year: p.year || '2026',
  category: p.category || 'Web Application',
  badge: p.badge || '',
  technologies: Array.isArray(p.technologies)
    ? p.technologies
    : (p.technologies ? p.technologies.split(',').map(s => s.trim()) : []),
  coverImage: p.coverImage || p.image || '/assets/projects/project-placeholder.svg',
  githubUrl: p.githubUrl || p.github || '',
  github: p.githubUrl || p.github || '',
  liveDemoUrl: p.liveDemoUrl || p.liveDemo || '',
  liveDemo: p.liveDemoUrl || p.liveDemo || '',
  featured: p.featured !== undefined ? p.featured : true,
});

export const normalizeEvent = (e) => {
  const today = new Date().toISOString().split('T')[0];
  const dateStr = e.date ? (typeof e.date === 'string' ? e.date.split('T')[0] : new Date(e.date).toISOString().split('T')[0]) : today;
  const isPast = dateStr < today;
  return {
    ...e,
    id: e._id || e.id,
    _id: e._id || e.id,
    title: e.title || '',
    description: e.description || '',
    date: e.date,
    time: e.time || '10:00 AM — 01:00 PM',
    location: e.location || 'MITE Seminar Hall',
    category: e.category || 'Workshop',
    organizer: e.organizer || 'Dev Studio Core Team',
    poster: e.poster || '/assets/events/poster-placeholder.svg',
    registrationUrl: e.registrationUrl || '',
    featured: e.featured !== undefined ? e.featured : false,
    status: e.status || (isPast ? 'completed' : 'upcoming'),
  };
};

export const normalizeAnnouncement = (a) => ({
  ...a,
  id: a._id || a.id,
  _id: a._id || a.id,
  title: a.title || '',
  category: a.category || 'Update',
  content: a.content || '',
  author: a.author || 'Dev Studio Core Team',
  publishedAt: a.publishedAt || (a.publishDate ? new Date(a.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
  pinned: a.pinned !== undefined ? a.pinned : false,
  featured: a.featured !== undefined ? a.featured : false,
  active: a.active !== undefined ? a.active : true,
});

export const normalizeResource = (r) => ({
  ...r,
  id: r._id || r.id,
  _id: r._id || r.id,
  title: r.title || 'Untitled Resource',
  category: r.category || 'Development',
  description: r.description || '',
  thumbnail: r.thumbnail || r.image || '/assets/projects/project-placeholder.svg',
  image: r.thumbnail || r.image || '/assets/projects/project-placeholder.svg',
  externalUrl: r.externalUrl || r.url || '',
  author: r.author || 'Dev Studio Lead',
  date: r.date || new Date().toISOString().split('T')[0],
});

export const clubService = {
  // Members
  getMembers: async (useFallback = false) => {
    try {
      const res = await api.get('/members');
      if (Array.isArray(res.data)) {
        return res.data.map(normalizeMember);
      }
      return useFallback ? teamData.map(normalizeMember) : [];
    } catch (err) {
      console.warn('API error fetching members:', err.message);
      if (useFallback) return teamData.map(normalizeMember);
      throw err;
    }
  },
  createMember: async (data) => {
    const res = await api.post('/members', data);
    return res.data;
  },
  updateMember: async (id, data) => {
    const res = await api.put(`/members/${id}`, data);
    return res.data;
  },
  deleteMember: async (id) => {
    const res = await api.delete(`/members/${id}`);
    return res.data;
  },

  // Projects
  getProjects: async (useFallback = false) => {
    try {
      const res = await api.get('/projects');
      if (Array.isArray(res.data)) {
        return res.data.map(normalizeProject);
      }
      return useFallback ? projectsData.map(normalizeProject) : [];
    } catch (err) {
      console.warn('API error fetching projects:', err.message);
      if (useFallback) return projectsData.map(normalizeProject);
      throw err;
    }
  },
  createProject: async (data) => {
    const res = await api.post('/projects', data);
    return res.data;
  },
  updateProject: async (id, data) => {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },
  deleteProject: async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },

  // Announcements
  getAnnouncements: async (useFallback = false) => {
    try {
      const res = await api.get('/announcements');
      if (Array.isArray(res.data)) {
        return res.data.map(normalizeAnnouncement);
      }
      return useFallback ? announcementsData.map(normalizeAnnouncement) : [];
    } catch (err) {
      console.warn('API error fetching announcements:', err.message);
      if (useFallback) return announcementsData.map(normalizeAnnouncement);
      throw err;
    }
  },
  createAnnouncement: async (data) => {
    const res = await api.post('/announcements', data);
    return res.data;
  },
  updateAnnouncement: async (id, data) => {
    const res = await api.put(`/announcements/${id}`, data);
    return res.data;
  },
  deleteAnnouncement: async (id) => {
    const res = await api.delete(`/announcements/${id}`);
    return res.data;
  },

  // Events
  getEvents: async (useFallback = false) => {
    try {
      const res = await api.get('/events');
      if (Array.isArray(res.data)) {
        return res.data.map(normalizeEvent);
      }
      return useFallback ? eventsData.map(normalizeEvent) : [];
    } catch (err) {
      console.warn('API error fetching events:', err.message);
      if (useFallback) return eventsData.map(normalizeEvent);
      throw err;
    }
  },
  createEvent: async (data) => {
    const res = await api.post('/events', data);
    return res.data;
  },
  updateEvent: async (id, data) => {
    const res = await api.put(`/events/${id}`, data);
    return res.data;
  },
  deleteEvent: async (id) => {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  },

  // Resources
  getResources: async (useFallback = false) => {
    try {
      const res = await api.get('/resources');
      if (Array.isArray(res.data)) {
        return res.data.map(normalizeResource);
      }
      return useFallback ? resourcesData.map(normalizeResource) : [];
    } catch (err) {
      console.warn('API error fetching resources:', err.message);
      if (useFallback) return resourcesData.map(normalizeResource);
      throw err;
    }
  },
  createResource: async (data) => {
    const res = await api.post('/resources', data);
    return res.data;
  },
  updateResource: async (id, data) => {
    const res = await api.put(`/resources/${id}`, data);
    return res.data;
  },
  deleteResource: async (id) => {
    const res = await api.delete(`/resources/${id}`);
    return res.data;
  },

  // Gallery
  getGallery: async () => {
    try {
      const res = await api.get('/gallery');
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.warn('API error fetching gallery:', err.message);
      return [];
    }
  },
  createGalleryItem: async (data) => {
    const res = await api.post('/gallery', data);
    return res.data;
  },
  updateGalleryItem: async (id, data) => {
    const res = await api.put(`/gallery/${id}`, data);
    return res.data;
  },
  deleteGalleryItem: async (id) => {
    const res = await api.delete(`/gallery/${id}`);
    return res.data;
  },
};

export default clubService;

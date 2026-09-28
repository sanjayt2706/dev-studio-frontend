import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, ExternalLink, AlertCircle, X } from 'lucide-react';
import api from '../../services/api';
import SmartImage from '../../components/common/SmartImage';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { SkeletonTable, ButtonLoader } from '../../components/common/LoadingSystem';

const CATEGORIES = ['All', 'Web Application', 'Full-Stack Platform', 'Machine Learning', 'Developer Tool', 'Spatial Computing', 'Analytics Dashboard', 'Open Source Hub', 'Mobile App', 'Internal Tool', 'Other'];

const initialForm = {
  title: '',
  slug: '',
  subtitle: '',
  badge: '',
  description: '',
  year: new Date().getFullYear().toString(),
  category: 'Web Application',
  technologies: '',
  coverImage: '',
  githubUrl: '',
  liveDemoUrl: '',
  caseStudyContent: '',
  featured: false,
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/projects');
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects from server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const techStr = Array.isArray(p.technologies) ? p.technologies.join(' ') : (p.technologies || '');
      const matchSearch =
        search === '' ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        techStr.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [projects, search, categoryFilter]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingId(project._id || project.id);
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      subtitle: project.subtitle || '',
      badge: project.badge || '',
      description: project.description || '',
      year: project.year || '',
      category: project.category || 'Web Application',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : (project.technologies || ''),
      coverImage: project.coverImage || project.image || '',
      githubUrl: project.githubUrl || project.github || '',
      liveDemoUrl: project.liveDemoUrl || project.liveDemo || '',
      caseStudyContent: project.caseStudyContent || '',
      featured: !!project.featured,
    });
    setIsModalOpen(true);
  };

  const handleRequestDelete = (id, title) => {
    setDeleteTarget({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !deleteTarget.id) return;
    const targetId = deleteTarget.id;
    setIsDeleting(true);
    try {
      setProjects(prev => prev.filter(p => p._id !== targetId && p.id !== targetId));
      await api.delete(`/projects/${targetId}`);
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting project');
      fetchProjects();
    } finally {
      setIsDeleting(false);
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        image: formData.coverImage,
        github: formData.githubUrl,
        liveDemo: formData.liveDemoUrl,
        slug: formData.slug || generateSlug(formData.title),
        technologies: typeof formData.technologies === 'string'
          ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
          : (Array.isArray(formData.technologies) ? formData.technologies : []),
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error('Save project error:', err);
      alert(err.response?.data?.message || 'Error saving project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-primary block mb-2">Management Suite</span>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">Manage project archive, open source repositories, and case studies</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-mono text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-colors cursor-pointer shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs mb-6">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-surface border border-white/5 rounded-xl p-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search projects by title, description, or technologies..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white font-sans focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          className="bg-background border border-white/10 rounded-lg px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-white focus:outline-none focus:border-primary cursor-pointer"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-background border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-surface/80">
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Project</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Category</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Year</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Featured</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <SkeletonTable rows={5} cols={5} />
              ) : paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    <p className="font-mono text-xs uppercase tracking-widest mb-1">No projects found</p>
                    <p className="text-xs text-gray-600">Create a project or adjust your filter.</p>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((p) => (
                  <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <SmartImage
                          src={p.coverImage}
                          alt={p.title}
                          type="project"
                          className="w-12 h-8 rounded shrink-0 border border-white/10"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{p.title}</div>
                          {p.subtitle ? (
                            <div className="text-[10px] text-primary/80 font-mono truncate max-w-[280px]">
                              {p.subtitle}
                            </div>
                          ) : (
                            <div className="text-[11px] text-gray-500 truncate max-w-[280px]">
                              {p.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-primary uppercase">{p.category}</td>
                    <td className="p-4 text-xs font-mono text-gray-400">{p.year}</td>
                    <td className="p-4">
                      {p.featured ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 rounded">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-gray-600 uppercase">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {p.liveDemoUrl && (
                          <a
                            href={p.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-white"
                            title="Live demo"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          title="Edit project"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleRequestDelete(p._id || p.id, p.title)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 bg-surface/50 flex justify-between items-center text-xs font-mono">
            <span className="text-gray-500">
              Page {currentPage} of {totalPages} ({filteredProjects.length} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-background border border-white/10 rounded text-gray-400 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-background border border-white/10 rounded text-gray-400 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-background/50">
              <h2 className="text-lg font-display font-bold text-white uppercase tracking-tight">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Project Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({
                        ...formData,
                        title,
                        slug: editingId ? formData.slug : generateSlug(title)
                      });
                    }}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    URL Slug *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Subtitle / Architecture Highlight
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Real-time WebSocket Campus Network"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PRODUCTION LIVE, AI RESEARCH"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Year *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of the project purpose and architectural design..."
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, GSAP, MongoDB"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.liveDemoUrl}
                    onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Case Study Content (Markdown / Detailed overview)
                </label>
                <textarea
                  rows={3}
                  value={formData.caseStudyContent}
                  onChange={(e) => setFormData({ ...formData, caseStudyContent: e.target.value })}
                  placeholder="Detailed breakdown of challenges, architecture, and results..."
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
                <label htmlFor="featured" className="text-xs font-mono uppercase text-gray-300 cursor-pointer">
                  Feature on Landing Page ("Selected Work" hero section)
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-mono text-xs uppercase tracking-wider rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <ButtonLoader
                    text={editingId ? 'Update Project' : 'Create Project'}
                    loadingText="Saving..."
                    isLoading={saving}
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project"
        itemName={deleteTarget?.title}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminProjects;

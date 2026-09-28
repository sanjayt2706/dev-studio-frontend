import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, Pin, AlertCircle, X } from 'lucide-react';
import api from '../../services/api';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { SkeletonTable, ButtonLoader } from '../../components/common/LoadingSystem';

const CATEGORIES = ['All', 'General', 'Event', 'Update', 'Recruitment', 'Initiative', 'Resources'];

const initialForm = {
  title: '',
  category: 'General',
  content: '',
  coverImage: '',
  author: 'Dev Studio Core',
  publishDate: new Date().toISOString().split('T')[0],
  featured: false,
  pinned: false,
  active: true,
  externalLink: '',
};

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
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

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/announcements');
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
      setError('Failed to load announcements from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      const matchCat = categoryFilter === 'All' || a.category === categoryFilter;
      const matchSearch =
        search === '' ||
        a.title?.toLowerCase().includes(search.toLowerCase()) ||
        a.content?.toLowerCase().includes(search.toLowerCase()) ||
        a.author?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [announcements, search, categoryFilter]);

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage) || 1;
  const paginatedAnnouncements = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAnnouncements.slice(start, start + itemsPerPage);
  }, [filteredAnnouncements, currentPage]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a) => {
    setEditingId(a._id || a.id);
    let dateStr = '';
    if (a.publishDate || a.publishedAt || a.createdAt) {
      try {
        const d = new Date(a.publishDate || a.publishedAt || a.createdAt);
        if (!isNaN(d.getTime())) {
          dateStr = d.toISOString().split('T')[0];
        } else {
          dateStr = typeof a.publishDate === 'string' ? a.publishDate : '';
        }
      } catch {
        dateStr = '';
      }
    }
    setFormData({
      title: a.title || '',
      category: a.category || 'General',
      content: a.content || '',
      coverImage: a.coverImage || a.image || '',
      author: a.author || 'Dev Studio Core',
      publishDate: dateStr,
      featured: !!a.featured,
      pinned: !!a.pinned,
      active: a.active !== undefined ? a.active : true,
      externalLink: a.externalLink || '',
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
      setAnnouncements(prev => prev.filter(a => a._id !== targetId && a.id !== targetId));
      await api.delete(`/announcements/${targetId}`);
      setDeleteTarget(null);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting announcement');
      fetchAnnouncements();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        image: formData.coverImage,
      };

      if (editingId) {
        await api.put(`/announcements/${editingId}`, payload);
      } else {
        await api.post('/announcements', payload);
      }

      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (err) {
      console.error('Save announcement error:', err);
      alert(err.response?.data?.message || 'Error saving announcement');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-primary block mb-1">Management Suite</span>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">Announcements</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Broadcast official news, hackathon announcements, and community updates</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 active:scale-95 text-white font-mono text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-all cursor-pointer shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> New Announcement
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
            placeholder="Search announcements by title, content, or author..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white font-sans focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          className="w-full sm:w-auto bg-background border border-white/10 rounded-lg px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-white focus:outline-none focus:border-primary cursor-pointer"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Desktop Table (Visible on md and up) */}
      <div className="hidden md:block bg-background border border-white/10 rounded-xl overflow-hidden shadow-xl mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-surface/80">
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Announcement</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Category</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Date / Author</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Status</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <SkeletonTable rows={5} cols={5} />
              ) : paginatedAnnouncements.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    <p className="font-mono text-xs uppercase tracking-widest mb-1">No announcements found</p>
                    <p className="text-xs text-gray-600">Create an announcement to keep members updated.</p>
                  </td>
                </tr>
              ) : (
                paginatedAnnouncements.map((a) => (
                  <tr key={a._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-start gap-2">
                        {a.pinned && (
                          <span className="text-yellow-400 shrink-0 mt-0.5" title="Pinned Announcement">
                            <Pin size={14} />
                          </span>
                        )}
                        <div>
                          <div className="font-bold text-white text-sm">{a.title}</div>
                          <div className="text-[11px] text-gray-500 truncate max-w-[320px]">{a.content}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-primary uppercase">{a.category}</td>
                    <td className="p-4 text-xs text-gray-400">
                      <div>{formatDate(a.publishDate || a.publishedAt)}</div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[150px]">{a.author}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        a.active !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {a.active !== false ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(a)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          title="Edit announcement"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleRequestDelete(a._id || a.id, a.title)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete announcement"
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
      </div>

      {/* Mobile Card List (Visible below md) */}
      <div className="block md:hidden space-y-3 mb-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-surface border border-white/5 rounded-xl p-4 animate-pulse h-28" />
            ))}
          </div>
        ) : paginatedAnnouncements.length === 0 ? (
          <div className="bg-background border border-white/10 rounded-xl p-8 text-center text-gray-500">
            <p className="font-mono text-xs uppercase tracking-widest mb-1">No announcements found</p>
            <p className="text-xs text-gray-600">Create an announcement to keep members updated.</p>
          </div>
        ) : (
          paginatedAnnouncements.map((a) => (
            <div
              key={a._id || a.id}
              className="bg-surface/90 border border-white/10 rounded-xl p-4 flex flex-col gap-3 shadow-lg"
            >
              <div className="flex items-start gap-2 justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {a.pinned && (
                    <span className="text-yellow-400 shrink-0" title="Pinned">
                      <Pin size={14} />
                    </span>
                  )}
                  <h4 className="font-bold text-white text-sm truncate">{a.title}</h4>
                </div>
                <span className={`shrink-0 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                  a.active !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400'
                }`}>
                  {a.active !== false ? 'Live' : 'Draft'}
                </span>
              </div>

              <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{a.content}</p>

              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-2 border-t border-white/5">
                <span className="text-primary uppercase">{a.category}</span>
                <span>{formatDate(a.publishDate || a.publishedAt)}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => handleOpenEdit(a)}
                  className="px-3 py-1.5 text-xs text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 rounded-lg flex items-center gap-1.5 font-mono cursor-pointer"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleRequestDelete(a._id || a.id, a.title)}
                  className="px-3 py-1.5 text-xs text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center gap-1.5 font-mono cursor-pointer"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-4 border border-white/10 rounded-xl bg-surface/50 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono mb-8">
          <span className="text-gray-400">
            Page {currentPage} of {totalPages} ({filteredAnnouncements.length} total)
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-background/50">
              <h2 className="text-lg font-display font-bold text-white uppercase tracking-tight">
                {editingId ? 'Edit Announcement' : 'Post New Announcement'}
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
                    Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
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
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Content / Body *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed announcement text..."
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Author Attribution
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Cover Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    External Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.externalLink}
                    onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono uppercase text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.pinned}
                    onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <span>Pin to Top of Feed</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono uppercase text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <span>Featured Announcement</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono uppercase text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                  <span>Active (Visible publicly)</span>
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
                    text={editingId ? 'Update Announcement' : 'Post Announcement'}
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
        title="Delete Announcement"
        itemName={deleteTarget?.title}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminAnnouncements;

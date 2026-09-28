import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, ExternalLink, AlertCircle, X, Download } from 'lucide-react';
import api from '../../services/api';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { SkeletonTable, ButtonLoader } from '../../components/common/LoadingSystem';

const CATEGORIES = ['All', 'Web Development', 'Design & Interaction', 'DevOps & Cloud', 'AI & ML', 'Mobile Development', 'Algorithms', 'Open Source', 'General'];

const initialForm = {
  title: '',
  description: '',
  category: 'Web Development',
  thumbnail: '',
  externalUrl: '',
  downloadableFileUrl: '',
  author: 'Dev Studio Team',
  date: new Date().toISOString().split('T')[0],
};

const AdminResources = () => {
  const [resources, setResources] = useState([]);
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

  const fetchResources = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/resources');
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
      setError('Failed to load resources from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      const matchCat = categoryFilter === 'All' || r.category === categoryFilter;
      const matchSearch =
        search === '' ||
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase()) ||
        r.author?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [resources, search, categoryFilter]);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage) || 1;
  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredResources.slice(start, start + itemsPerPage);
  }, [filteredResources, currentPage]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (res) => {
    setEditingId(res._id || res.id);
    let dateStr = '';
    if (res.date) {
      try {
        const d = new Date(res.date);
        if (!isNaN(d.getTime())) {
          dateStr = d.toISOString().split('T')[0];
        } else if (typeof res.date === 'string') {
          dateStr = res.date;
        }
      } catch {
        dateStr = typeof res.date === 'string' ? res.date : '';
      }
    }
    setFormData({
      title: res.title || '',
      description: res.description || '',
      category: res.category || 'Web Development',
      thumbnail: res.thumbnail || res.image || '',
      externalUrl: res.externalUrl || '',
      downloadableFileUrl: res.downloadableFileUrl || '',
      author: res.author || 'Dev Studio Team',
      date: dateStr,
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
      setResources(prev => prev.filter(r => r._id !== targetId && r.id !== targetId));
      await api.delete(`/resources/${targetId}`);
      setDeleteTarget(null);
      fetchResources();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting resource');
      fetchResources();
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
        image: formData.thumbnail,
      };

      if (editingId) {
        await api.put(`/resources/${editingId}`, payload);
      } else {
        await api.post('/resources', payload);
      }

      setIsModalOpen(false);
      fetchResources();
    } catch (err) {
      console.error('Save resource error:', err);
      alert(err.response?.data?.message || 'Error saving resource');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-primary block mb-2">Management Suite</span>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">Resources</h1>
          <p className="text-gray-400 text-sm mt-1">Curate roadmaps, technical guides, cheat sheets, and toolkits</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-mono text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-colors cursor-pointer shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> Add Resource
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
            placeholder="Search resources by title, topic, or author..."
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
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Resource</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Category</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Author</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Links</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <SkeletonTable rows={5} cols={5} />
              ) : paginatedResources.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    <p className="font-mono text-xs uppercase tracking-widest mb-1">No resources found</p>
                    <p className="text-xs text-gray-600">Add a resource link or guide for members.</p>
                  </td>
                </tr>
              ) : (
                paginatedResources.map((res) => (
                  <tr key={res._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-white text-sm">{res.title}</div>
                        <div className="text-[11px] text-gray-500 truncate max-w-[320px]">{res.description}</div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-primary uppercase">{res.category}</td>
                    <td className="p-4 text-xs text-gray-400">{res.author}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {res.externalUrl && (
                          <a
                            href={res.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded"
                            title="Visit external URL"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                        {res.downloadableFileUrl && (
                          <a
                            href={res.downloadableFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded"
                            title="Download file"
                          >
                            <Download size={13} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(res)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          title="Edit resource"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleRequestDelete(res._id || res.id, res.title)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete resource"
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
              Page {currentPage} of {totalPages} ({filteredResources.length} total)
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
                {editingId ? 'Edit Resource' : 'Add New Resource'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Resource Title *
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
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
                    Author / Curator
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of resource contents, key topics covered, or target skill level..."
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    External Documentation URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.externalUrl}
                    onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Downloadable File / PDF URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://.../handbook.pdf"
                    value={formData.downloadableFileUrl}
                    onChange={(e) => setFormData({ ...formData, downloadableFileUrl: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
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
                    text={editingId ? 'Update Resource' : 'Add Resource'}
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
        title="Delete Resource"
        itemName={deleteTarget?.title}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminResources;

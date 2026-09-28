import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle, X, Image as ImageIcon, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { getImageUrl, handleImageError } from '../../utils/images';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { SkeletonCard, ButtonLoader } from '../../components/common/LoadingSystem';

const CATEGORIES = ['All', 'Hackathons', 'Workshops', 'Team Sprints', 'Campus Meets', 'Projects', 'Other'];

const initialForm = {
  title: '',
  imageUrl: '',
  category: 'Hackathons',
};

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/gallery');
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
      setError('Failed to load gallery from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
      const matchSearch =
        search === '' ||
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, search, categoryFilter]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title || '',
      imageUrl: item.imageUrl || '',
      category: item.category || 'Hackathons',
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
      setItems(prev => prev.filter(i => i._id !== targetId && i.id !== targetId));
      await api.delete(`/gallery/${targetId}`);
      setDeleteTarget(null);
      fetchGallery();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting photo');
      fetchGallery();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/gallery/${editingId}`, formData);
      } else {
        await api.post('/gallery', formData);
      }

      setIsModalOpen(false);
      fetchGallery();
    } catch (err) {
      console.error('Save gallery error:', err);
      alert(err.response?.data?.message || 'Error saving photo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-primary block mb-1">Management Suite</span>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">Gallery</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage photo memories from hackathons, workshops, and team sprints</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 active:scale-95 text-white font-mono text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-all cursor-pointer shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> Add Photo
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
            placeholder="Search gallery photos..."
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

      {/* Grid */}
      {loading ? (
        <SkeletonCard type="gallery" count={8} />
      ) : paginatedItems.length === 0 ? (
        <div className="bg-background border border-white/10 rounded-xl p-12 text-center text-gray-500">
          <ImageIcon size={32} className="mx-auto mb-3 opacity-40" />
          <p className="font-mono text-xs uppercase tracking-widest mb-1">No photos in gallery</p>
          <p className="text-xs text-gray-600">Upload a photo to build the club memory wall.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedItems.map((item) => (
            <div
              key={item._id}
              className="group bg-surface border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-background relative">
                <img
                  src={getImageUrl(item.imageUrl, 'gallery')}
                  alt={item.title || 'Gallery item'}
                  onError={handleImageError('gallery')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-primary text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex items-center justify-between gap-2 border-t border-white/5">
                <div className="font-bold text-white text-xs truncate">
                  {item.title || 'Untitled Photo'}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded"
                    title="Edit"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleRequestDelete(item._id || item.id, item.title)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 p-4 bg-surface border border-white/5 rounded-xl flex justify-between items-center text-xs font-mono">
          <span className="text-gray-500">
            Page {currentPage} of {totalPages} ({filteredItems.length} total)
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-background/50">
              <h2 className="text-lg font-display font-bold text-white uppercase tracking-tight">
                {editingId ? 'Edit Gallery Photo' : 'Add Photo to Gallery'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Photo Caption / Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. HackStorm 2025 Opening Ceremony"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Image URL *
                </label>
                <input
                  required
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Event Category *
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
                    text={editingId ? 'Update Photo' : 'Save Photo'}
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
        title="Delete Photo"
        itemName={deleteTarget?.title}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminGallery;

import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, AlertCircle, X, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import SmartImage from '../../components/common/SmartImage';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { SkeletonTable, ButtonLoader } from '../../components/common/LoadingSystem';

const EVENT_CATEGORIES = ['Workshop', 'Hackathon', 'Bootcamp', 'Competition', 'General'];
const EVENT_STATUSES = ['upcoming', 'completed', 'cancelled'];

const initialForm = {
  title: '',
  date: new Date().toISOString().split('T')[0],
  time: '10:00 AM — 01:00 PM',
  location: 'MITE Seminar Hall',
  description: '',
  category: 'Workshop',
  organizer: 'Dev Studio Core Team',
  poster: '',
  registrationUrl: '',
  recap: '',
  featured: false,
  status: 'upcoming',
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/events');
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return events.filter((e) => {
      const isPast = e.date && new Date(e.date).toISOString().split('T')[0] < today;
      if (statusFilter === 'Upcoming' && isPast) return false;
      if (statusFilter === 'Past' && !isPast) return false;

      const matchSearch =
        search === '' ||
        e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.location?.toLowerCase().includes(search.toLowerCase()) ||
        e.organizer?.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [events, search, statusFilter]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingId(evt._id || evt.id);
    let dateStr = '';
    if (evt.date) {
      try {
        const d = new Date(evt.date);
        if (!isNaN(d.getTime())) {
          dateStr = d.toISOString().split('T')[0];
        } else if (typeof evt.date === 'string') {
          dateStr = evt.date;
        }
      } catch {
        dateStr = typeof evt.date === 'string' ? evt.date : '';
      }
    }
    setFormData({
      title: evt.title || '',
      date: dateStr,
      time: evt.time || '',
      location: evt.location || '',
      description: evt.description || '',
      category: evt.category || 'Workshop',
      organizer: evt.organizer || '',
      poster: evt.poster || evt.image || '',
      registrationUrl: evt.registrationUrl || '',
      recap: evt.recap || '',
      featured: Boolean(evt.featured),
      status: evt.status || 'upcoming',
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
      setEvents(prev => prev.filter(e => e._id !== targetId && e.id !== targetId));
      await api.delete(`/events/${targetId}`);
      setDeleteTarget(null);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting event');
      fetchEvents();
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
        image: formData.poster,
      };

      if (editingId) {
        await api.put(`/events/${editingId}`, payload);
      } else {
        await api.post('/events', payload);
      }

      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error('Save event error:', err);
      alert(err.response?.data?.message || 'Error saving event');
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
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">Events</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Organize hackathons, guest lectures, bootcamps, and workshops</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 active:scale-95 text-white font-mono text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-all cursor-pointer shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> New Event
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
            placeholder="Search events by title, venue, or organizer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white font-sans focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="w-full sm:w-auto bg-background border border-white/10 rounded-lg px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-white focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="All">All Schedules</option>
          <option value="Upcoming">Upcoming Only</option>
          <option value="Past">Past / Completed</option>
        </select>
      </div>

      {/* Desktop Table (Visible on md and up) */}
      <div className="hidden md:block bg-background border border-white/10 rounded-xl overflow-hidden shadow-xl mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-surface/80">
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Event</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Date & Time</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Location</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Organizer</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <SkeletonTable rows={5} cols={5} />
              ) : paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    <p className="font-mono text-xs uppercase tracking-widest mb-1">No events found</p>
                    <p className="text-xs text-gray-600">Schedule an upcoming event for club members.</p>
                  </td>
                </tr>
              ) : (
                paginatedEvents.map((evt) => (
                  <tr key={evt._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <SmartImage
                          src={evt.poster}
                          alt={evt.title}
                          type="event"
                          className="w-10 h-10 rounded shrink-0 border border-white/10"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{evt.title}</span>
                            {evt.featured && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-primary/20 text-primary border border-primary/30 rounded">
                                FEATURED
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono text-primary/80 uppercase">
                              {evt.category || 'Event'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className={`text-[10px] font-mono uppercase ${
                              evt.status === 'completed' ? 'text-gray-500' : 'text-emerald-400'
                            }`}>
                              {evt.status || 'upcoming'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-gray-300">
                      <div className="font-mono text-white">{formatDate(evt.date)}</div>
                      <div className="text-[11px] text-gray-500">{evt.time}</div>
                    </td>
                    <td className="p-4 text-xs text-gray-400">{evt.location}</td>
                    <td className="p-4 text-xs text-gray-400">{evt.organizer}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {evt.registrationUrl && (
                          <a
                            href={evt.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-white"
                            title="Registration link"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenEdit(evt)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          title="Edit event"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleRequestDelete(evt._id || evt.id, evt.title)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete event"
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
        ) : paginatedEvents.length === 0 ? (
          <div className="bg-background border border-white/10 rounded-xl p-8 text-center text-gray-500">
            <p className="font-mono text-xs uppercase tracking-widest mb-1">No events found</p>
            <p className="text-xs text-gray-600">Schedule an upcoming event for club members.</p>
          </div>
        ) : (
          paginatedEvents.map((evt) => (
            <div
              key={evt._id || evt.id}
              className="bg-surface/90 border border-white/10 rounded-xl p-4 flex flex-col gap-3 shadow-lg"
            >
              <div className="flex items-start gap-3">
                <SmartImage
                  src={evt.poster}
                  alt={evt.title}
                  type="event"
                  className="w-16 h-16 rounded-xl shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-white text-sm truncate">{evt.title}</h4>
                    {evt.featured && (
                      <span className="shrink-0 px-2 py-0.5 text-[9px] font-mono uppercase bg-primary/20 text-primary border border-primary/30 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
                    <span className="text-primary uppercase">{evt.category || 'Event'}</span>
                    <span className="text-gray-500">·</span>
                    <span className={evt.status === 'completed' ? 'text-gray-500' : 'text-emerald-400'}>
                      {evt.status || 'upcoming'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 font-mono">{formatDate(evt.date)} {evt.time ? `· ${evt.time}` : ''}</p>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">📍 {evt.location || 'Online'}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                {evt.registrationUrl && (
                  <a
                    href={evt.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 text-xs text-gray-300 hover:text-white bg-white/5 rounded-lg flex items-center gap-1 font-mono"
                  >
                    <ExternalLink size={13} /> Link
                  </a>
                )}
                <button
                  onClick={() => handleOpenEdit(evt)}
                  className="px-3 py-1.5 text-xs text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 rounded-lg flex items-center gap-1.5 font-mono cursor-pointer"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleRequestDelete(evt._id || evt.id, evt.title)}
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
            Page {currentPage} of {totalPages} ({filteredEvents.length} total)
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
                {editingId ? 'Edit Event' : 'Create New Event'}
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
                  Event Title *
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
                    Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Time / Duration *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. 09:00 AM — 05:00 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Location / Venue *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Organizer *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    {EVENT_STATUSES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono uppercase text-gray-300">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded bg-background border-white/20 text-primary"
                    />
                    <span>Featured Event</span>
                  </label>
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
                  placeholder="Overview of event agenda, workshops, and participation requirements..."
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Poster Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.poster}
                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Registration URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://forms.gle/... or https://unstop.com/..."
                    value={formData.registrationUrl}
                    onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Post-Event Recap / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.recap}
                  onChange={(e) => setFormData({ ...formData, recap: e.target.value })}
                  placeholder="Summary of winners, attendance figures, and photos..."
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
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
                    text={editingId ? 'Update Event' : 'Create Event'}
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
        title="Delete Event"
        itemName={deleteTarget?.title}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminEvents;

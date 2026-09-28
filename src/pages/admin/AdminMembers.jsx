import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, X, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import SmartImage from '../../components/common/SmartImage';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { SkeletonTable, ButtonLoader } from '../../components/common/LoadingSystem';

const TEAMS = ['Core', 'Advanced', 'Web', 'Mobile', 'Design', 'Operations'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const initialForm = {
  name: '',
  role: '',
  team: 'Core',
  year: '1st Year',
  branch: 'Computer Science & Engineering',
  profileImage: '',
  shortBio: '',
  skills: '',
  github: '',
  linkedin: '',
  portfolio: '',
  isActive: true,
};

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/members');
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch members:', err);
      setError('Failed to load members from server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchTeam = teamFilter === 'All' || m.team === teamFilter;
      const skillsStr = Array.isArray(m.skills) ? m.skills.join(' ') : (m.skills || '');
      const matchSearch =
        search === '' ||
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.role?.toLowerCase().includes(search.toLowerCase()) ||
        skillsStr.toLowerCase().includes(search.toLowerCase());
      return matchTeam && matchSearch;
    });
  }, [members, search, teamFilter]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(start, start + itemsPerPage);
  }, [filteredMembers, currentPage]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingId(member._id || member.id);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      team: member.team || 'Core',
      year: member.year || '1st Year',
      branch: member.branch || '',
      profileImage: member.profileImage || member.image || '',
      shortBio: member.shortBio || member.bio || '',
      skills: Array.isArray(member.skills) ? member.skills.join(', ') : (member.skills || ''),
      github: member.github || '',
      linkedin: member.linkedin || '',
      portfolio: member.portfolio || '',
      isActive: member.isActive !== undefined ? member.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleRequestDelete = (id, name) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !deleteTarget.id) return;
    const targetId = deleteTarget.id;
    setIsDeleting(true);
    try {
      setMembers(prev => prev.filter(m => m._id !== targetId && m.id !== targetId));
      await api.delete(`/members/${targetId}`);
      setDeleteTarget(null);
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error deleting member');
      fetchMembers();
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
        image: formData.profileImage,
        bio: formData.shortBio,
        skills: typeof formData.skills === 'string'
          ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : (Array.isArray(formData.skills) ? formData.skills : []),
      };

      if (editingId) {
        await api.put(`/members/${editingId}`, payload);
      } else {
        await api.post('/members', payload);
      }

      setIsModalOpen(false);
      fetchMembers();
    } catch (err) {
      console.error('Save member error:', err);
      alert(err.response?.data?.message || 'Error saving member');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-primary block mb-1">Management Suite</span>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">Members</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Directory of club leaders, core team, and active collective members</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 active:scale-95 text-white font-mono text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-all cursor-pointer shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Error alert */}
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
            placeholder="Search by name, role, or skills..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white font-sans focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={teamFilter}
          onChange={(e) => { setTeamFilter(e.target.value); setCurrentPage(1); }}
          className="w-full sm:w-auto bg-background border border-white/10 rounded-lg px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-white focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="All">All Teams</option>
          {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Desktop Table (Visible on md and up) */}
      <div className="hidden md:block bg-background border border-white/10 rounded-xl overflow-hidden shadow-xl mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-surface/80">
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Member</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Role</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Team</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Year / Branch</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400">Status</th>
                <th className="p-4 text-xs font-mono uppercase tracking-wider text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <SkeletonTable rows={5} cols={6} />
              ) : paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500">
                    <p className="font-mono text-xs uppercase tracking-widest mb-1">No members found</p>
                    <p className="text-xs text-gray-600">Add a new member or adjust your filter.</p>
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <SmartImage
                          src={member.profileImage || member.image}
                          alt={member.name}
                          type="member"
                          className="w-10 h-10 rounded-lg shrink-0 border border-white/10"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{member.name}</div>
                          {member.skills && member.skills.length > 0 && (
                            <div className="text-[11px] text-gray-500 truncate max-w-[200px]">
                              {Array.isArray(member.skills) ? member.skills.slice(0, 3).join(', ') : member.skills}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-primary uppercase">{member.role}</td>
                    <td className="p-4 text-xs font-mono text-gray-300 uppercase">{member.team}</td>
                    <td className="p-4 text-xs text-gray-400">
                      <div>{member.year}</div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[150px]">{member.branch}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        member.isActive !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {member.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          title="Edit member"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleRequestDelete(member._id || member.id, member.name)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete member"
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
        ) : paginatedMembers.length === 0 ? (
          <div className="bg-background border border-white/10 rounded-xl p-8 text-center text-gray-500">
            <p className="font-mono text-xs uppercase tracking-widest mb-1">No members found</p>
            <p className="text-xs text-gray-600">Add a new member or adjust your filter.</p>
          </div>
        ) : (
          paginatedMembers.map((member) => (
            <div
              key={member._id || member.id}
              className="bg-surface/90 border border-white/10 rounded-xl p-4 flex flex-col gap-3 shadow-lg"
            >
              <div className="flex items-start gap-3">
                <SmartImage
                  src={member.profileImage || member.image}
                  alt={member.name}
                  type="member"
                  className="w-14 h-14 rounded-xl shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-white text-sm truncate">{member.name}</h4>
                    <span className={`shrink-0 inline-flex items-center text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      member.isActive !== false ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400'
                    }`}>
                      {member.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-primary uppercase mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-gray-400 mt-1 font-mono">{member.team} · {member.year} {member.branch ? `(${member.branch})` : ''}</p>
                </div>
              </div>

              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                  {(Array.isArray(member.skills) ? member.skills : []).slice(0, 3).map((s, i) => (
                    <span key={i} className="text-[9px] font-mono px-2 py-0.5 bg-white/5 text-gray-400 rounded">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="px-3 py-1.5 text-xs text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 rounded-lg flex items-center gap-1.5 font-mono cursor-pointer"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleRequestDelete(member._id || member.id, member.name)}
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
            Page {currentPage} of {totalPages} ({filteredMembers.length} total)
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

      {/* Member Modal (Create & Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-background/50">
              <h2 className="text-lg font-display font-bold text-white uppercase tracking-tight">
                {editingId ? 'Edit Member' : 'Add New Member'}
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
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Club Role *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. President, Tech Lead, Member"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Team Track *
                  </label>
                  <select
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Academic Year *
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Branch *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Profile Photo URL (or Leave blank for default branded avatar)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.profileImage}
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, GSAP, Docker"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Short Bio / Responsibilities
                </label>
                <textarea
                  rows={2}
                  value={formData.shortBio}
                  onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                  placeholder="Brief 1-2 sentence description of background or club duties..."
                  className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Portfolio / Website
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-mono uppercase text-gray-300 cursor-pointer">
                  Active Member (Visible in Collective Directory)
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
                    text={editingId ? 'Update Member' : 'Create Member'}
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
        title="Remove Member"
        itemName={deleteTarget?.name}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminMembers;
import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  Filter,
  ExternalLink,
  GitBranch,
  Globe,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  X,
  AlertCircle,
  FileText
} from 'lucide-react';
import clubService from '../../services/clubService';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { SkeletonTable } from '../../components/common/LoadingSystem';
import audioManager from '../../audio/AudioManager';

const STATUS_CONFIG = {
  PENDING_REVIEW: {
    label: 'Pending Review',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/30',
    icon: Clock,
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10 border-purple-400/30',
    icon: Award,
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/30',
    icon: CheckCircle,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/30',
    icon: XCircle,
  },
};

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected application for detail modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await clubService.getApplications();
      const list = res?.data || res || [];
      setApplications(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to load applications. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter & Search
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchStatus = statusFilter === 'ALL' || app.status === statusFilter;
      const skillsStr = Array.isArray(app.skills)
        ? app.skills.join(' ')
        : (app.skills || '');
      const domainsStr = Array.isArray(app.domains)
        ? app.domains.join(' ')
        : (app.domains || '');
      const searchTarget = `${app.fullName || ''} ${app.name || ''} ${app.email || ''} ${app.referenceNumber || ''} ${app.branch || ''} ${skillsStr} ${domainsStr}`.toLowerCase();
      const matchSearch = search === '' || searchTarget.includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [applications, search, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === 'PENDING_REVIEW').length;
    const shortlisted = applications.filter((a) => a.status === 'SHORTLISTED').length;
    const accepted = applications.filter((a) => a.status === 'ACCEPTED').length;
    return { total, pending, shortlisted, accepted };
  }, [applications]);

  // Pagination
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage) || 1;
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApps.slice(start, start + itemsPerPage);
  }, [filteredApps, currentPage]);

  // Open details
  const handleOpenDetail = (app) => {
    setSelectedApp(app);
    setReviewNotes(app.reviewNotes || '');
    audioManager.play('button-click');
  };

  // Close details
  const handleCloseDetail = () => {
    setSelectedApp(null);
  };

  // Update status
  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await clubService.updateApplicationStatus(appId, newStatus, reviewNotes);
      const updated = res?.data || res;

      // Update in state
      setApplications((prev) =>
        prev.map((a) => (a._id === appId || a.id === appId ? { ...a, ...updated, status: newStatus } : a))
      );

      if (selectedApp && (selectedApp._id === appId || selectedApp.id === appId)) {
        setSelectedApp((prev) => ({ ...prev, ...updated, status: newStatus }));
      }

      audioManager.play('success');
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update application status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const id = deleteTarget._id || deleteTarget.id;
      await clubService.deleteApplication(id);
      setApplications((prev) => prev.filter((a) => (a._id || a.id) !== id));
      if (selectedApp && (selectedApp._id === id || selectedApp.id === id)) {
        setSelectedApp(null);
      }
      setDeleteTarget(null);
      audioManager.play('menu-close');
    } catch (err) {
      console.error('Failed to delete application:', err);
      alert('Failed to delete application.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-primary uppercase block mb-1">
            Recruitment Suite
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
            Admissions & Applications
          </h1>
          <p className="text-sm text-gray-400 font-sans mt-1">
            Review incoming candidate profiles, verify credentials, and manage recruitment pipeline.
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.03] text-xs font-mono uppercase tracking-wider text-white transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Telemetry Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-white/5 rounded-xl p-4 sm:p-5">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest block mb-1">
            Total Submissions
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-white tabular-nums">
            {metrics.total}
          </div>
        </div>
        <div className="bg-surface border border-white/5 rounded-xl p-4 sm:p-5">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-1">
            Pending Review
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-amber-300 tabular-nums">
            {metrics.pending}
          </div>
        </div>
        <div className="bg-surface border border-white/5 rounded-xl p-4 sm:p-5">
          <span className="text-xs font-mono text-purple-400 uppercase tracking-widest block mb-1">
            Shortlisted
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-purple-300 tabular-nums">
            {metrics.shortlisted}
          </div>
        </div>
        <div className="bg-surface border border-white/5 rounded-xl p-4 sm:p-5">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">
            Accepted
          </span>
          <div className="text-2xl sm:text-3xl font-display font-black text-emerald-300 tabular-nums">
            {metrics.accepted}
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, ref number, branch..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors font-sans"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter size={14} className="text-gray-400 shrink-0 hidden sm:inline" />
          {['ALL', 'PENDING_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map((st) => {
            const active = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors shrink-0 ${
                  active
                    ? 'bg-primary text-white font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                {st === 'ALL' ? 'All' : (STATUS_CONFIG[st]?.label || st)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table / Cards List */}
      <div className="bg-surface border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <SkeletonTable rows={6} cols={5} />
        ) : filteredApps.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-base font-display text-gray-300 font-bold uppercase">No Applications Found</p>
            <p className="text-xs text-gray-500 font-sans mt-1">
              {search || statusFilter !== 'ALL'
                ? 'Try adjusting your search criteria or status filter.'
                : 'New submissions from the Join Us page will appear here.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    <th className="py-4 px-6">Reference</th>
                    <th className="py-4 px-6">Candidate</th>
                    <th className="py-4 px-6">Branch & Year</th>
                    <th className="py-4 px-6">Tracks / Domains</th>
                    <th className="py-4 px-6">Submitted</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm font-sans">
                  {paginatedApps.map((app) => {
                    const st = STATUS_CONFIG[app.status] || STATUS_CONFIG.PENDING_REVIEW;
                    const StatusIcon = st.icon;
                    const dateStr = app.submittedAt || app.createdAt;
                    const formattedDate = dateStr
                      ? new Date(dateStr).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recently';

                    return (
                      <tr key={app._id || app.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 px-6 font-mono text-xs font-bold text-primary">
                          {app.referenceNumber || 'DS-XXXXXX'}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white">{app.fullName || app.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{app.email}</div>
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-300">
                          <div>{app.branch}</div>
                          <div className="text-[11px] text-gray-400 font-mono">{app.year}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {((app.domains && app.domains.length > 0 ? app.domains : app.skills) || []).slice(0, 2).map((d, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300"
                              >
                                {d}
                              </span>
                            ))}
                            {((app.domains && app.domains.length > 0 ? app.domains : app.skills) || []).length > 2 && (
                              <span className="text-[10px] text-gray-400 font-mono self-center">
                                +{((app.domains && app.domains.length > 0 ? app.domains : app.skills) || []).length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-gray-400">
                          {formattedDate}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${st.bg} ${st.color}`}
                          >
                            <StatusIcon size={12} />
                            <span>{st.label}</span>
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenDetail(app)}
                              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                              title="Inspect Application Details"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(app)}
                              className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-red-500/20 hover:border-red-500/40 text-gray-400 hover:text-red-400 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards View */}
            <div className="lg:hidden divide-y divide-white/5">
              {paginatedApps.map((app) => {
                const st = STATUS_CONFIG[app.status] || STATUS_CONFIG.PENDING_REVIEW;
                const StatusIcon = st.icon;
                const dateStr = app.submittedAt || app.createdAt;
                const formattedDate = dateStr
                  ? new Date(dateStr).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recently';

                return (
                  <div key={app._id || app.id} className="p-4 sm:p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-primary block">
                          {app.referenceNumber || 'DS-XXXXXX'}
                        </span>
                        <h3 className="text-base font-bold text-white mt-0.5">{app.fullName || app.name}</h3>
                        <p className="text-xs text-gray-400 font-mono">{app.email}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border ${st.bg} ${st.color} shrink-0`}
                      >
                        <StatusIcon size={11} />
                        <span>{st.label}</span>
                      </span>
                    </div>

                    <div className="text-xs text-gray-300 font-sans flex items-center gap-2">
                      <span>{app.branch}</span>
                      <span>•</span>
                      <span className="text-gray-400 font-mono">{app.year}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <span className="font-mono text-[11px] text-gray-400">{formattedDate}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenDetail(app)}
                          className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-mono uppercase text-white hover:bg-white/10 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => setDeleteTarget(app)}
                          className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-red-400 hover:bg-red-500/20 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
                <span>
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredApps.length)} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredApps.length)} of {filteredApps.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded border border-white/10 disabled:opacity-30 hover:bg-white/5 text-white"
                  >
                    Prev
                  </button>
                  <span className="text-white px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded border border-white/10 disabled:opacity-30 hover:bg-white/5 text-white"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* =====================================================================
          APPLICATION DETAIL DRAWER / MODAL
          ===================================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-[#0D0F18] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseDetail}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header info */}
            <div className="pr-10 mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
                  {selectedApp.referenceNumber || 'DS-XXXXXX'}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                    STATUS_CONFIG[selectedApp.status]?.bg || STATUS_CONFIG.PENDING_REVIEW.bg
                  } ${STATUS_CONFIG[selectedApp.status]?.color || STATUS_CONFIG.PENDING_REVIEW.color}`}
                >
                  {STATUS_CONFIG[selectedApp.status]?.label || selectedApp.status}
                </span>
              </div>
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                {selectedApp.fullName || selectedApp.name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-primary" />
                  {selectedApp.email}
                </span>
                {selectedApp.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={13} className="text-primary" />
                    {selectedApp.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-primary" />
                  {new Date(selectedApp.submittedAt || selectedApp.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Candidate Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                  Academic Profile
                </span>
                <p className="text-sm font-semibold text-white">{selectedApp.branch}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedApp.year}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1">
                  External Profiles
                </span>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  {selectedApp.github ? (
                    <a
                      href={selectedApp.github.startsWith('http') ? selectedApp.github : `https://${selectedApp.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-primary transition-colors font-mono"
                    >
                      <GitBranch size={13} />
                      <span>GitHub</span>
                      <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-600 font-mono">No GitHub</span>
                  )}

                  {selectedApp.linkedin ? (
                    <a
                      href={selectedApp.linkedin.startsWith('http') ? selectedApp.linkedin : `https://${selectedApp.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-primary transition-colors font-mono"
                    >
                      <ExternalLink size={13} />
                      <span>LinkedIn</span>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-600 font-mono">No LinkedIn</span>
                  )}

                  {selectedApp.portfolio && (
                    <a
                      href={selectedApp.portfolio.startsWith('http') ? selectedApp.portfolio : `https://${selectedApp.portfolio}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-primary transition-colors font-mono"
                    >
                      <Globe size={13} />
                      <span>Portfolio</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Domains / Skills */}
            <div className="mb-6">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-2">
                Specializations & Focus Areas
              </span>
              <div className="flex flex-wrap gap-2">
                {((selectedApp.domains && selectedApp.domains.length > 0 ? selectedApp.domains : selectedApp.skills) || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Motivation Statement */}
            <div className="mb-6">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-2">
                Candidate Statement / Motivation
              </span>
              <div className="p-4 rounded-xl bg-background/80 border border-white/5 text-sm text-gray-200 font-sans leading-relaxed whitespace-pre-wrap">
                {selectedApp.motivation || 'No motivation provided.'}
              </div>
            </div>

            {/* Action Bar: Change Status */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-1.5">
                  Update Application Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {['PENDING_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map((stKey) => {
                    const cfg = STATUS_CONFIG[stKey];
                    const isCurrent = selectedApp.status === stKey;
                    return (
                      <button
                        key={stKey}
                        disabled={updatingStatus || isCurrent}
                        onClick={() => handleUpdateStatus(selectedApp._id || selectedApp.id, stKey)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-40 ${
                          isCurrent
                            ? `${cfg.bg} ${cfg.color} border font-bold shadow-sm`
                            : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-transparent'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setDeleteTarget(selectedApp)}
                  className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Delete Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Candidate Application"
        itemName={deleteTarget ? `${deleteTarget.fullName || deleteTarget.name} (${deleteTarget.referenceNumber})` : ''}
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminApplications;

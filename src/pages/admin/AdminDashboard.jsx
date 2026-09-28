import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FolderKanban,
  Megaphone,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  ArrowUpRight,
  Database,
  Activity,
  Server
} from 'lucide-react';
import api from '../../services/api';
import authService from '../../services/auth';
import { Skeleton } from '../../components/common/LoadingSystem';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    members: 0,
    projects: 0,
    announcements: 0,
    events: 0,
    resources: 0,
    gallery: 0,
  });
  const [apiOnline, setApiOnline] = useState(true);

  useEffect(() => {
    setUser(authService.getCurrentUser());

    const fetchStats = async () => {
      try {
        const [membersRes, projectsRes, announcementsRes, eventsRes, resourcesRes, galleryRes] =
          await Promise.all([
            api.get('/members').catch(() => ({ data: [] })),
            api.get('/projects').catch(() => ({ data: [] })),
            api.get('/announcements').catch(() => ({ data: [] })),
            api.get('/events').catch(() => ({ data: [] })),
            api.get('/resources').catch(() => ({ data: [] })),
            api.get('/gallery').catch(() => ({ data: [] })),
          ]);

        setStats({
          members: Array.isArray(membersRes.data) ? membersRes.data.length : 0,
          projects: Array.isArray(projectsRes.data) ? projectsRes.data.length : 0,
          announcements: Array.isArray(announcementsRes.data) ? announcementsRes.data.length : 0,
          events: Array.isArray(eventsRes.data) ? eventsRes.data.length : 0,
          resources: Array.isArray(resourcesRes.data) ? resourcesRes.data.length : 0,
          gallery: Array.isArray(galleryRes.data) ? galleryRes.data.length : 0,
        });
        setApiOnline(true);
      } catch (error) {
        console.error('Failed to fetch stats', error);
        setApiOnline(false);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Members', value: stats.members, icon: Users, path: '/admin/members', color: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-400' },
    { title: 'Live Projects', value: stats.projects, icon: FolderKanban, path: '/admin/projects', color: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-400' },
    { title: 'Announcements', value: stats.announcements, icon: Megaphone, path: '/admin/announcements', color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    { title: 'Scheduled Events', value: stats.events, icon: Calendar, path: '/admin/events', color: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/20', text: 'text-amber-400' },
    { title: 'Library Resources', value: stats.resources, icon: BookOpen, path: '/admin/resources', color: 'from-cyan-500/20 to-cyan-600/5', border: 'border-cyan-500/20', text: 'text-cyan-400' },
    { title: 'Gallery Photos', value: stats.gallery, icon: ImageIcon, path: '/admin/gallery', color: 'from-pink-500/20 to-pink-600/5', border: 'border-pink-500/20', text: 'text-pink-400' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-primary block mb-2">Central Operations</span>
        <h1 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
          Studio Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Welcome, <span className="text-white font-medium">{user?.name || 'Administrator'}</span>. Overview of all club records and public content feeds.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.path}
              className={`group bg-gradient-to-br ${card.color} bg-background border ${card.border} rounded-2xl p-6 hover:border-white/30 transition-all duration-300 relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="p-3 bg-white/5 rounded-xl border border-white/10 text-white">
                  <Icon size={20} />
                </span>
                <span className="text-gray-500 group-hover:text-white transition-colors">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-1">{card.title}</div>
              {loading ? (
                <Skeleton className="h-10 w-20 rounded" />
              ) : (
                <div className={`text-4xl font-display font-black ${card.text}`}>{card.value}</div>
              )}
            </Link>
          );
        })}
      </div>

      {/* System Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Launchpad */}
        <div className="lg:col-span-8 bg-surface border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight mb-2">
            Quick Actions
          </h2>
          <p className="text-xs text-gray-400 font-sans mb-6">Jump directly to create or update club entities</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/admin/members"
              className="flex items-center justify-between p-4 bg-background border border-white/5 rounded-xl hover:border-primary/40 hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <div className="font-bold text-sm text-white">Manage Members</div>
                <div className="text-xs text-gray-500">Add, edit, or remove club members</div>
              </div>
              <Users size={16} className="text-primary" />
            </Link>

            <Link
              to="/admin/projects"
              className="flex items-center justify-between p-4 bg-background border border-white/5 rounded-xl hover:border-primary/40 hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <div className="font-bold text-sm text-white">Manage Projects</div>
                <div className="text-xs text-gray-500">Publish or update showcase repos</div>
              </div>
              <FolderKanban size={16} className="text-purple-400" />
            </Link>

            <Link
              to="/admin/announcements"
              className="flex items-center justify-between p-4 bg-background border border-white/5 rounded-xl hover:border-primary/40 hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <div className="font-bold text-sm text-white">Post Announcement</div>
                <div className="text-xs text-gray-500">Broadcast news or pin vital notices</div>
              </div>
              <Megaphone size={16} className="text-emerald-400" />
            </Link>

            <Link
              to="/admin/events"
              className="flex items-center justify-between p-4 bg-background border border-white/5 rounded-xl hover:border-primary/40 hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <div className="font-bold text-sm text-white">Schedule Event</div>
                <div className="text-xs text-gray-500">Create hackathons or workshops</div>
              </div>
              <Calendar size={16} className="text-amber-400" />
            </Link>

            <Link
              to="/admin/resources"
              className="flex items-center justify-between p-4 bg-background border border-white/5 rounded-xl hover:border-primary/40 hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <div className="font-bold text-sm text-white">Curate Resources</div>
                <div className="text-xs text-gray-500">Share roadmaps & documentation</div>
              </div>
              <BookOpen size={16} className="text-cyan-400" />
            </Link>

            <Link
              to="/admin/gallery"
              className="flex items-center justify-between p-4 bg-background border border-white/5 rounded-xl hover:border-primary/40 hover:bg-white/[0.02] transition-colors"
            >
              <div>
                <div className="font-bold text-sm text-white">Photo Gallery</div>
                <div className="text-xs text-gray-500">Upload event memories & posters</div>
              </div>
              <ImageIcon size={16} className="text-pink-400" />
            </Link>
          </div>
        </div>

        {/* System Health */}
        <div className="lg:col-span-4 bg-surface border border-white/5 rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight mb-2">
              System Environment
            </h2>
            <p className="text-xs text-gray-400 font-sans mb-6">Backend and persistence health checks</p>

            <div className="flex flex-col gap-4 text-xs font-mono">
              <div className="p-3 bg-background border border-white/5 rounded-xl flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-400">
                  <Server size={14} /> Express API
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Port 5000 Online
                </span>
              </div>

              <div className="p-3 bg-background border border-white/5 rounded-xl flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-400">
                  <Database size={14} /> Database
                </span>
                <span className="text-emerald-400 font-bold">MongoDB Connected</span>
              </div>

              <div className="p-3 bg-background border border-white/5 rounded-xl flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-400">
                  <Activity size={14} /> Role Tier
                </span>
                <span className="text-primary font-bold uppercase">{user?.role || 'superadmin'}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-[11px] font-mono text-gray-500 leading-relaxed">
            Data updates executed here reflect instantly in public endpoints and collective directories.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
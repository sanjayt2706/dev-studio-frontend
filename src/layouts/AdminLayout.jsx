import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Megaphone,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  FileText
} from 'lucide-react';
import authService from '../services/auth';
import { PLACEHOLDERS } from '../utils/images';
import audioManager from '../audio/AudioManager';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = () => {
    audioManager.play('menu-close');
    authService.logout();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Applications', path: '/admin/applications', icon: FileText },
    { label: 'Members', path: '/admin/members', icon: Users },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { label: 'Events', path: '/admin/events', icon: Calendar },
    { label: 'Resources', path: '/admin/resources', icon: BookOpen },
    { label: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  ];

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 hidden md:flex flex-col justify-between shrink-0">
        <div>
          {/* Studio Brand */}
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <img
              src={PLACEHOLDERS.logo}
              alt="Dev Studio"
              className="h-7 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h2 className="text-base font-display font-black tracking-tight text-white uppercase leading-none">
                Dev Studio
              </h2>
              <span className="text-[10px] text-primary font-mono tracking-widest uppercase">Admin Suite</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-3">
          {user && (
            <div className="p-3 bg-white/[0.03] rounded-lg border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={14} className="text-primary" />
                <span className="text-xs font-bold text-white truncate">{user.name || 'Admin'}</span>
              </div>
              <p className="text-[11px] font-mono text-gray-400 truncate">{user.email}</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink size={14} /> Live Website
              </span>
              <span>&rarr;</span>
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left cursor-pointer"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={PLACEHOLDERS.logo}
            alt="Dev Studio"
            className="h-6 w-auto"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="flex flex-col">
            <span className="font-display font-black text-white text-xs sm:text-sm tracking-tight leading-none uppercase">DEV STUDIO ADMIN</span>
            <span className="text-[9px] font-mono text-primary uppercase tracking-widest">MANAGEMENT SUITE</span>
          </div>
        </div>
        <button
          onClick={() => {
            const next = !mobileSidebarOpen;
            setMobileSidebarOpen(next);
            audioManager.play(next ? 'menu-open' : 'menu-close');
          }}
          className="text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay (Solid opaque background, no collisions) */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col justify-between p-6 pt-6 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <img
                  src={PLACEHOLDERS.logo}
                  alt="Dev Studio"
                  className="h-6 w-auto"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="font-display font-black text-white text-sm uppercase">DEV STUDIO ADMIN</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-white p-2 rounded-lg bg-white/5"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-mono uppercase tracking-wider transition-colors ${
                      isActive ? 'bg-primary text-white font-bold shadow-lg shadow-primary/25' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-white/10 mt-8">
            <a href="/" className="text-xs font-mono uppercase tracking-widest text-gray-400 py-2.5 px-3 bg-white/5 rounded-lg flex items-center justify-between">
              <span>&larr; Back to Live Site</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400 py-2.5 px-3 bg-red-500/10 rounded-lg text-left"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 pt-20 md:pt-10 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

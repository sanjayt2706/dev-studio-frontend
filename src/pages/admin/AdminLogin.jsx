import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import authService from '../../services/auth';
import { PLACEHOLDERS } from '../../utils/images';
import audioManager from '../../audio/AudioManager';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email.trim(), password);
      audioManager.play('success');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Invalid email or password. Please verify credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@devstudio.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to website
        </Link>

        {/* Card */}
        <div className="bg-surface border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          {/* Brand header */}
          <div className="flex flex-col items-center text-center mb-8">
            <img
              src={PLACEHOLDERS.logo}
              alt="Dev Studio"
              className="h-9 w-auto object-contain mb-4"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest mb-1">
              <Shield size={14} />
              <span>Studio Command</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white uppercase">
              Admin Portal
            </h1>
            <p className="text-xs text-gray-400 font-sans mt-1">
              Authorized club administrators and leads only
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs mb-6">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-300 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@devstudio.com"
                  className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-11 py-3 text-white font-sans text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-widest py-3.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Authenticate & Enter'}
            </button>
          </form>

          {/* Demo credential helper */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center">
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mb-2">Development Seed Credentials</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-mono text-primary/80 hover:text-primary transition-colors underline"
            >
              Autofill admin@devstudio.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
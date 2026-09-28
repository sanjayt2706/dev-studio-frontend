import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { PLACEHOLDERS } from '../utils/images';
import audioManager from '../audio/AudioManager';
import SoundToggle from './common/SoundToggle';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(currentY > 40);
          if (currentY < 60) {
            setIsVisible(true);
          } else if (currentY > lastY + 8) {
            setIsVisible(false);
          } else if (currentY < lastY - 8) {
            setIsVisible(true);
          }
          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'Team', path: '/team' },
    { name: 'Events', path: '/events' },
    { name: 'News', path: '/announcements' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      {/* Navbar bar */}
      <nav
        className={`fixed top-0 left-0 w-full z-[9000] transition-all duration-300 ease-out ${
          isVisible || mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } ${
          isScrolled || mobileMenuOpen
            ? 'bg-[#090A0F]/95 border-b border-white/[0.03] py-3 shadow-xl shadow-black/70'
            : 'bg-transparent py-4 md:py-6 border-b border-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="z-[9001] flex items-center gap-2.5 group flex-shrink-0">
            <img
              src={PLACEHOLDERS.logo}
              alt="Dev Studio"
              className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 object-cover rounded-lg border border-white/10 group-hover:border-primary/50 transition-colors shadow-sm flex-shrink-0"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base md:text-lg font-display font-black tracking-tight text-white leading-none">
                DEV <span className="text-primary group-hover:text-white transition-colors duration-300">STUDIO</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-white/50 uppercase mt-0.5">
                MITE
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-9">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  data-cursor="nav"
                  className={`group/nav relative text-xs font-mono uppercase tracking-widest py-1 flex items-center transition-colors duration-300 hover:text-white ${
                    isActive ? 'text-white font-bold' : 'text-gray-400'
                  }`}
                >
                  <span>{link.name}</span>
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300 origin-left ${
                      isActive ? 'scale-x-100 opacity-100 shadow-[0_0_8px_#38bdf8]' : 'scale-x-0 opacity-0 group-hover/nav:scale-x-100 group-hover/nav:opacity-100'
                    }`}
                  />
                </Link>
              );
            })}
            <Link
              to="/join"
              data-cursor="button"
              className="ml-2 px-5 py-2.5 bg-white text-black text-xs font-mono font-bold uppercase tracking-widest rounded-full hover:bg-gradient-to-r hover:from-purple-600 hover:to-primary hover:text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.45)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-sm"
            >
              Join Us
            </Link>
            <SoundToggle className="ml-1" />
          </div>

          {/* Mobile Right Controls: Sound Toggle + Hamburger */}
          <div className="md:hidden z-[9001] flex items-center gap-2">
            <SoundToggle />
            <button
              className="text-white w-10 h-10 flex items-center justify-center rounded-lg active:bg-white/10 transition-colors"
              onClick={() => {
                const nextState = !mobileMenuOpen;
                setMobileMenuOpen(nextState);
                audioManager.play(nextState ? 'menu-open' : 'menu-close');
              }}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu — separate from navbar so it sits over everything */}
      <div
        className={`fixed inset-0 z-[8999] md:hidden transition-all duration-500 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(9,10,15,0.98)', backdropFilter: 'blur(20px)' }}
      >
        {/* Content — shifted down to clear the navbar */}
        <div className="flex flex-col h-full pt-24 pb-10 px-8 justify-between">
          <div className="flex flex-col gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-3xl sm:text-4xl font-display font-black uppercase tracking-tight py-3 border-b border-white/5 transition-all duration-200 active:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-white'
                }`}
                style={{
                  transitionDelay: mobileMenuOpen ? `${i * 40}ms` : '0ms',
                  transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  opacity: mobileMenuOpen ? 1 : 0,
                  transition: `transform 0.4s ease ${i * 40}ms, opacity 0.4s ease ${i * 40}ms, color 0.2s ease`,
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <Link
              to="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-4 bg-primary text-white text-sm font-mono font-bold uppercase tracking-widest rounded-full active:bg-blue-600 transition-colors shadow-lg shadow-primary/30"
            >
              Join Us
            </Link>
            <p className="text-center font-mono text-[10px] tracking-widest text-white/30 uppercase">
              MITE · Dev Studio · 2026
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

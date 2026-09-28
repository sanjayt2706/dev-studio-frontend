import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { PLACEHOLDERS } from '../utils/images';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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

          // Show if near top
          if (currentY < 60) {
            setIsVisible(true);
          } else if (currentY > lastY + 8) {
            // Scrolling down — hide
            setIsVisible(false);
          } else if (currentY < lastY - 8) {
            // Scrolling up — show
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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
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
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-out ${
        isVisible || mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-[#090A0F]/90 backdrop-blur-md border-b border-white/10 py-3.5 shadow-lg shadow-black/50'
          : 'bg-transparent py-5 md:py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="z-50 flex items-center gap-3 group">
          <img
            src={PLACEHOLDERS.logo}
            alt="Dev Studio"
            className="h-8 md:h-9 w-8 md:w-9 object-cover rounded-lg border border-white/10 group-hover:border-primary/50 transition-colors shadow-sm"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-display font-black tracking-tight text-white leading-none">
              DEV <span className="text-primary group-hover:text-white transition-colors duration-300">STUDIO</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase mt-0.5">
              MITE
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7 lg:gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative text-xs font-mono uppercase tracking-widest transition-colors duration-300 hover:text-white py-1 flex items-center ${
                location.pathname === link.path ? 'text-white font-bold' : 'text-gray-400'
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 origin-left ${
                  location.pathname === link.path ? 'w-full scale-x-100 opacity-100' : 'w-full scale-x-0 opacity-0'
                }`}
              ></span>
            </Link>
          ))}
          <Link
            to="/join"
            className="ml-2 px-5 py-2.5 bg-white text-black text-xs font-mono font-bold uppercase tracking-widest rounded-full hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-primary/25"
          >
            Join Us
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 text-white w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Nav */}
        <div
          className={`fixed inset-0 bg-background/98 backdrop-blur-xl flex flex-col items-start justify-center px-12 gap-6 transition-all duration-500 ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-4xl font-display font-black uppercase tracking-tight transition-colors ${
                location.pathname === link.path ? 'text-primary' : 'text-white hover:text-primary'
              }`}
              style={{ transitionDelay: mobileMenuOpen ? `${i * 50}ms` : '0ms' }}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/join"
            className="mt-6 px-8 py-3.5 bg-primary text-white text-sm font-mono font-bold uppercase tracking-widest rounded-full hover:bg-blue-600 transition-colors shadow-lg shadow-primary/30"
          >
            Join Us
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { Link } from 'react-router-dom';

const GithubIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'Work', path: '/work' },
    { name: 'Team', path: '/team' },
    { name: 'Events', path: '/events' },
    { name: 'News', path: '/announcements' },
    { name: 'About', path: '/about' },
    { name: 'Join Us', path: '/join' },
  ];

  const socials = [
    { name: 'GitHub', icon: GithubIcon, href: 'https://github.com' },
    { name: 'LinkedIn', icon: LinkedinIcon, href: 'https://linkedin.com' },
    { name: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
    { name: 'Twitter', icon: TwitterIcon, href: 'https://twitter.com' },
  ];

  return (
    <footer className="bg-surface border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white uppercase mb-6">
              Dev <span className="text-primary">Studio</span>
            </h2>
            <p className="text-gray-400 max-w-sm font-sans leading-relaxed text-sm">
              A student-led technology community at MITE Mangalore building real-world projects and exploring the future of tech through code, design, and collaboration.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-6">Navigation</h4>
            <ul className="flex flex-col gap-3">
              {links.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm text-gray-400 hover:text-white transition-colors duration-300 font-sans">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white mb-6">Connect</h4>
            <div className="flex gap-4">
              {socials.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary transition-all duration-300"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">
            &copy; {currentYear} Dev Studio MITE. All rights reserved.
          </p>
          <Link to="/admin" className="text-xs font-mono text-gray-600 hover:text-gray-400 transition-colors tracking-widest uppercase">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

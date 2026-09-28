import { useState, useRef, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Terminal, Code2, Cpu, Smartphone, Palette, Shield } from 'lucide-react';
import { gsap } from 'gsap';

const DOMAINS = [
  { id: 'web', name: 'Web Development', icon: Code2, desc: 'Frontend, backend, real-time distributed web systems' },
  { id: 'mobile', name: 'Mobile Apps', icon: Smartphone, desc: 'Cross-platform native iOS & Android applications' },
  { id: 'ai', name: 'AI & Machine Learning', icon: Cpu, desc: 'Computer vision, deep learning models, data analytics' },
  { id: 'devops', name: 'DevOps & Systems', icon: Terminal, desc: 'Cloud infrastructure, CI/CD pipelines, Docker & Linux' },
  { id: 'design', name: 'UI/UX & Product Design', icon: Palette, desc: 'Interaction design, Figma prototypes, design systems' },
  { id: 'operations', name: 'Events & Operations', icon: Shield, desc: 'Hackathon management, technical writing, community outreach' },
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const BRANCHES = [
  'Computer Science & Engineering',
  'Information Science & Engineering',
  'Electronics & Communication Engineering',
  'Artificial Intelligence & Data Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Mechatronics',
  'Other'
];

const Join = () => {
  const headerRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    year: '1st Year',
    branch: 'Computer Science & Engineering',
    domains: [],
    github: '',
    linkedin: '',
    portfolio: '',
    motivation: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.1 }
      );
      gsap.fromTo(formRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleDomainToggle = (domainId) => {
    setFormData(prev => {
      const exists = prev.domains.includes(domainId);
      return {
        ...prev,
        domains: exists
          ? prev.domains.filter(d => d !== domainId)
          : [...prev.domains, domainId]
      };
    });
    if (errors.domains) {
      setErrors(prev => ({ ...prev, domains: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (formData.domains.length === 0) {
      newErrors.domains = 'Select at least one track of interest';
    }
    if (!formData.motivation.trim() || formData.motivation.trim().length < 30) {
      newErrors.motivation = 'Please share a brief statement (at least 30 characters)';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: formRef.current?.offsetTop - 100, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    // Simulate submission or dispatch event
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-28 md:pt-32 pb-20 md:pb-32 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <span className="text-xs font-mono tracking-widest text-primary uppercase mb-6 block">[ 06 / ADMISSIONS ]</span>
          <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-[10vw] font-display font-black tracking-tighter text-white uppercase leading-[0.85] mb-6 md:mb-8">
            Join The<br/>Collective
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl font-sans leading-relaxed">
            We are looking for self-driven makers, inquisitive thinkers, and craft-oriented builders. No prior professional pedigree required — only passion, commitment, and desire to engineer the future.
          </p>
        </div>

        {submitted ? (
          <div className="bg-surface border border-primary/40 rounded-xl p-12 md:p-16 text-center max-w-2xl mx-auto shadow-2xl shadow-primary/10">
            <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-8 border border-primary/30">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-white uppercase mb-4">
              Application Received
            </h2>
            <p className="text-gray-300 font-sans leading-relaxed mb-8">
              Thank you, <span className="text-white font-semibold">{formData.name}</span>. Your application for Dev Studio membership has been recorded. Our core committee reviews submissions weekly and will reach out to you via <span className="text-primary">{formData.email}</span>.
            </p>
            <div className="p-4 bg-background/60 rounded-lg border border-white/5 text-xs font-mono text-gray-400 mb-8">
              Application Reference: DS-{Math.floor(100000 + Math.random() * 900000)}
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  year: '1st Year',
                  branch: 'Computer Science & Engineering',
                  domains: [],
                  github: '',
                  linkedin: '',
                  portfolio: '',
                  motivation: ''
                });
              }}
              className="px-8 py-4 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest rounded-full hover:bg-primary hover:text-white transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Info Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-10">
              <div className="bg-surface border border-white/5 rounded-xl p-8">
                <div className="flex items-center gap-3 text-primary mb-4">
                  <Sparkles size={18} />
                  <span className="font-mono text-xs uppercase tracking-widest font-bold">Why Dev Studio</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-4">What we build together</h3>
                <ul className="flex flex-col gap-4 text-sm text-gray-400 font-sans leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">&rarr;</span>
                    Real production products used by thousands across campus and beyond.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">&rarr;</span>
                    Peer review, pair programming, and architectural mentorship from senior members.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">&rarr;</span>
                    High-octane hackathon squads and open-source fellowship initiatives.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">&rarr;</span>
                    Access to exclusive lab resources, hardware kits, and server environments.
                  </li>
                </ul>
              </div>

              <div className="bg-surface/50 border border-white/5 rounded-xl p-8">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500 block mb-2">Recruitment Cycle</span>
                <p className="text-sm text-gray-300 font-sans">
                  Applications are accepted on a rolling basis. Candidate interviews and onboarding occur at the start of each semester.
                </p>
              </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 flex flex-col gap-8 md:gap-10 bg-surface border border-white/5 rounded-xl p-6 md:p-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight mb-2">
                  Candidate Profile
                </h2>
                <p className="text-sm text-gray-400 font-sans">
                  Tell us who you are and where you want to grow.
                </p>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-300 mb-2">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                    }}
                    placeholder="e.g. Rahul Shenoy"
                    className={`w-full bg-background border rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none transition-colors ${
                      errors.name ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-primary'
                    }`}
                  />
                  {errors.name && <span className="text-xs text-red-400 mt-1 block font-mono">{errors.name}</span>}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-300 mb-2">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                    }}
                    placeholder="e.g. rahul@mite.ac.in"
                    className={`w-full bg-background border rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-primary'
                    }`}
                  />
                  {errors.email && <span className="text-xs text-red-400 mt-1 block font-mono">{errors.email}</span>}
                </div>
              </div>

              {/* Year & Branch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-300 mb-2">
                    Academic Year <span className="text-primary">*</span>
                  </label>
                  <select
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-300 mb-2">
                    Branch of Study <span className="text-primary">*</span>
                  </label>
                  <select
                    value={formData.branch}
                    onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-primary cursor-pointer"
                  >
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              {/* Domains / Tracks Selection */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-300 mb-2">
                  Select Tracks of Interest <span className="text-primary">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-4">Choose one or more domains you want to build in:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DOMAINS.map(domain => {
                    const isSelected = formData.domains.includes(domain.id);
                    const Icon = domain.icon;
                    return (
                      <button
                        type="button"
                        key={domain.id}
                        onClick={() => handleDomainToggle(domain.id)}
                        className={`text-left p-4 rounded-lg border transition-all duration-300 flex items-start gap-3 touch-manipulation ${
                          isSelected
                            ? 'bg-primary/10 border-primary text-white'
                            : 'bg-background/80 border-white/5 text-gray-400 hover:border-white/20 hover:text-white active:border-white/20 active:text-white'
                        }`}
                      >
                        <div className={`p-2 rounded-md ${isSelected ? 'bg-primary text-white' : 'bg-white/5 text-gray-400'}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="font-display font-bold text-sm text-white mb-0.5">{domain.name}</div>
                          <div className="text-[11px] text-gray-500 leading-snug">{domain.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.domains && <span className="text-xs text-red-400 mt-2 block font-mono">{errors.domains}</span>}
              </div>

              {/* Links */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-300 mb-4">
                  Work Links & Handles (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="url"
                    value={formData.github}
                    onChange={e => setFormData({ ...formData, github: e.target.value })}
                    placeholder="GitHub URL"
                    className="bg-background border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-xs focus:outline-none focus:border-primary"
                  />
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="LinkedIn URL"
                    className="bg-background border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-xs focus:outline-none focus:border-primary"
                  />
                  <input
                    type="url"
                    value={formData.portfolio}
                    onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="Portfolio / Personal site"
                    className="bg-background border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-300 mb-2">
                  Why do you want to join Dev Studio? <span className="text-primary">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.motivation}
                  onChange={e => {
                    setFormData({ ...formData, motivation: e.target.value });
                    if (errors.motivation) setErrors(prev => ({ ...prev, motivation: null }));
                  }}
                  placeholder="Share a recent project you built, a problem you want to solve, or what motivates you to write code / design interfaces..."
                  className={`w-full bg-background border rounded-lg p-4 text-white font-sans text-sm focus:outline-none transition-colors ${
                    errors.motivation ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-primary'
                  }`}
                />
                {errors.motivation && <span className="text-xs text-red-400 mt-1 block font-mono">{errors.motivation}</span>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full group inline-flex items-center justify-center gap-3 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest py-5 rounded-full hover:bg-primary hover:text-white active:bg-primary active:text-white transition-all duration-300 disabled:opacity-50 cursor-pointer touch-manipulation"
              >
                {submitting ? (
                  <span>Processing Application...</span>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Join;
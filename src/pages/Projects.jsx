import { useState, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../components/common/Icons';
import { clubService } from '../services/clubService';
import SmartImage from '../components/common/SmartImage';
import { SkeletonCard, ErrorState, EmptyState } from '../components/common/LoadingSystem';

const Projects = () => {
  const headerRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await clubService.getProjects(false);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Unable to load projects from the database. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.1 }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  // Dynamic categories
  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [projects]);

  // Filtered list
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter(p => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-28 md:pt-32 pb-20 md:pb-32 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <span className="text-xs font-mono tracking-widest text-primary uppercase mb-6 block">[ 02 / WORK ]</span>
          <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-[10vw] font-display font-black tracking-tighter text-white uppercase leading-[0.85] mb-6 md:mb-8">
            The<br/>Archive
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl font-sans leading-relaxed">
            {projects.length} club projects and counting. Real-world solutions, experimental interactions, and community-built tools.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-16 pb-6 border-b border-white/5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full transition-all cursor-pointer touch-manipulation ${
                  selectedCategory === cat
                    ? 'bg-primary text-white font-bold'
                    : 'bg-surface text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/10 active:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Feedback states */}
        {loading && <SkeletonCard type="project" count={4} />}
        {error && <ErrorState message={error} onRetry={fetchProjects} />}

        {!loading && !error && filteredProjects.length === 0 && (
          <EmptyState
            title="No projects found"
            description="There are currently no projects in this category."
          />
        )}

        {/* Project Grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-12 md:gap-y-20">
            {filteredProjects.map((project, idx) => {
              const techList = Array.isArray(project.technologies) ? project.technologies : [];
              const demoUrl = project.liveDemoUrl || project.liveDemo;
              const repoUrl = project.githubUrl || project.github;

              return (
                <div
                  key={project.id || project._id || idx}
                  className="group flex flex-col bg-surface/30 border border-white/5 rounded-sm p-5 md:p-8 hover:border-white/15 active:border-white/15 transition-all duration-300"
                >
                  {/* Media */}
                  <div className="aspect-[16/9] w-full rounded-sm overflow-hidden mb-6 relative">
                    <SmartImage
                      src={project.coverImage}
                      alt={project.title}
                      type="project"
                      className="w-full h-full"
                      imgClassName="transition-transform duration-700 group-hover:scale-105"
                    >
                      {project.badge && (
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded">
                          {project.badge}
                        </div>
                      )}
                    </SmartImage>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono tracking-widest uppercase text-primary font-bold">
                      {project.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                      {project.year}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white group-hover:text-primary transition-colors duration-300 mb-2">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-4">
                      {project.subtitle}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-gray-400 mb-6 font-sans leading-relaxed text-sm">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {techList.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2.5 py-1 bg-white/5 text-gray-400 rounded-sm border border-white/5 tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Links */}
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-4">
                    {demoUrl && (
                      <a
                        href={demoUrl.startsWith('http') ? demoUrl : `https://${demoUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-white hover:text-primary transition-colors"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                    {repoUrl && (
                      <a
                        href={repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                      >
                        <GithubIcon size={13} />
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
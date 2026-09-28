import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/common/Icons';
import { gsap } from 'gsap';
import { clubService } from '../services/clubService';
import SmartImage from '../components/common/SmartImage';
import { SkeletonCard, ErrorState, EmptyState } from '../components/common/LoadingSystem';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const headerRef = useRef(null);

  const fetchMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await clubService.getMembers(false);
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch team members:', err);
      setError('Unable to load team members from the club database. Please ensure backend connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
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

  // Filter options derived dynamically from live data
  const teams = useMemo(() => {
    const set = new Set(members.map(m => m.team).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [members]);

  const years = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'];

  // Active filtered members
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const isActive = m.active !== undefined ? m.active : m.isActive !== false;
      if (!isActive) return false;

      const skillList = Array.isArray(m.skills) ? m.skills : [];
      const matchSearch = search.trim() === '' ||
        (m.name && m.name.toLowerCase().includes(search.toLowerCase())) ||
        (m.role && m.role.toLowerCase().includes(search.toLowerCase())) ||
        skillList.some(s => s && s.toLowerCase().includes(search.toLowerCase()));

      const matchTeam = teamFilter === 'All' || m.team === teamFilter;
      const matchYear = yearFilter === 'All' || m.year === yearFilter;

      return matchSearch && matchTeam && matchYear;
    });
  }, [members, search, teamFilter, yearFilter]);

  // Hierarchical categorization
  const isFiltering = search.trim() !== '' || teamFilter !== 'All' || yearFilter !== 'All';

  const { coreTeam, domainLeads, generalMembers, alumni } = useMemo(() => {
    const core = [];
    const leads = [];
    const general = [];
    const alums = [];

    filteredMembers.forEach(m => {
      const roleLower = (m.role || '').toLowerCase();
      const teamLower = (m.team || '').toLowerCase();
      const yearLower = (m.year || '').toLowerCase();

      if (yearLower.includes('alumni') || teamLower.includes('alumni')) {
        alums.push(m);
      } else if (teamLower === 'core' || roleLower.includes('president') || roleLower.includes('founder') || roleLower.includes('convenor')) {
        core.push(m);
      } else if (roleLower.includes('lead') || roleLower.includes('head')) {
        leads.push(m);
      } else {
        general.push(m);
      }
    });

    return {
      coreTeam: core,
      domainLeads: leads,
      generalMembers: general,
      alumni: alums,
    };
  }, [filteredMembers]);

  // Render Core Team Card (High-Impact Tier)
  const renderCoreCard = (member) => (
    <div
      key={member.id || member._id}
      className="group relative bg-surface border border-white/10 rounded-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-start hover:border-primary/40 transition-all duration-500 shadow-xl overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all"></div>

      {/* Portrait */}
      <div className="w-full md:w-48 lg:w-56 aspect-[3/4] shrink-0 rounded-sm overflow-hidden bg-background relative border border-white/5">
        <SmartImage
          src={member.image || member.profileImage}
          alt={member.name}
          type="member"
          className="w-full h-full"
          imgClassName="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-primary/90 text-white font-mono text-[9px] uppercase px-2 py-0.5 rounded tracking-widest backdrop-blur-md">
          {member.team || 'Core'}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono tracking-widest uppercase text-primary font-bold">
            {member.role}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
            {member.year} {member.branch ? `· ${member.branch}` : ''}
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
          {member.name}
        </h3>

        <p className="text-gray-400 font-sans text-sm leading-relaxed mb-6 line-clamp-3">
          {member.bio || member.shortBio || 'Driving the club vision, engineering standards, and technical initiatives.'}
        </p>

        {/* Skills */}
        {Array.isArray(member.skills) && member.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {member.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono tracking-wider px-2.5 py-1 bg-white/5 text-gray-300 rounded border border-white/5"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Social Links */}
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-3">
          {member.github && (
            <a
              href={member.github.startsWith('http') ? member.github : `https://${member.github}`}
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors p-1"
              title="GitHub"
            >
              <GithubIcon size={16} />
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors p-1"
              title="LinkedIn"
            >
              <LinkedinIcon size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  // Render Domain Lead Card (Medium Tier)
  const renderLeadCard = (member) => (
    <div
      key={member.id || member._id}
      className="group bg-surface border border-white/5 rounded-sm p-5 md:p-6 flex flex-col hover:border-white/20 transition-all duration-300"
    >
      <div className="aspect-[4/5] w-full rounded-sm overflow-hidden bg-background mb-4 relative border border-white/5">
        <SmartImage
          src={member.image || member.profileImage}
          alt={member.name}
          type="member"
          className="w-full h-full"
          imgClassName="grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono uppercase text-gray-300 tracking-wider">
          {member.team}
        </div>
      </div>

      <span className="text-[10px] font-mono tracking-widest uppercase text-primary mb-1">
        {member.role}
      </span>
      <h4 className="text-lg md:text-xl font-display font-bold text-white uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">
        {member.name}
      </h4>

      <p className="text-gray-400 text-xs font-sans leading-relaxed mb-4 line-clamp-2">
        {member.bio || member.shortBio || `${member.year} · ${member.branch}`}
      </p>

      {/* Skills */}
      {Array.isArray(member.skills) && member.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-white/5">
          {member.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="text-[9px] font-mono px-2 py-0.5 bg-white/5 text-gray-400 rounded">
              {skill}
            </span>
          ))}
          {member.skills.length > 3 && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 text-gray-500 rounded">
              +{member.skills.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );

  // Render Member Card (Compact Grid Tier)
  const renderMemberCard = (member) => (
    <div
      key={member.id || member._id}
      className="group bg-surface/60 border border-white/5 rounded-sm p-4 flex flex-col hover:border-white/15 transition-all"
    >
      <div className="aspect-square w-full rounded-sm overflow-hidden bg-background mb-3 relative">
        <SmartImage
          src={member.image || member.profileImage}
          alt={member.name}
          type="member"
          className="w-full h-full"
          imgClassName="grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
        />
      </div>

      <h5 className="font-display font-bold text-sm text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors">
        {member.name}
      </h5>

      <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mt-1">
        <span>{member.team}</span>
        <span className="text-gray-600">{member.year}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-28 md:pt-32 pb-20 md:pb-32 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <span className="text-xs font-mono tracking-widest text-primary uppercase mb-6 block">[ 03 / PEOPLE ]</span>
          <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-[10vw] font-display font-black tracking-tighter text-white uppercase leading-[0.85] mb-6 md:mb-8">
            The<br/>Collective
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl font-sans leading-relaxed">
            {members.length} members strong. Developers, designers, and innovators driving Dev Studio forward.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-12 md:mb-16 bg-surface/50 backdrop-blur-sm p-2 rounded-lg border border-white/5">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="SEARCH BY NAME, ROLE, OR SKILL..."
              className="w-full bg-transparent border-none pl-11 pr-4 py-3.5 text-white font-mono text-xs tracking-widest focus:outline-none placeholder:text-gray-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="flex-1 bg-background border border-white/10 rounded-sm px-3 py-3 text-white focus:outline-none font-mono text-xs tracking-widest uppercase cursor-pointer touch-manipulation"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
            >
              {teams.map(t => <option key={t} value={t}>{t === 'All' ? 'ALL TEAMS' : t.toUpperCase()}</option>)}
            </select>
            <select
              className="flex-1 bg-background border border-white/10 rounded-sm px-3 py-3 text-white focus:outline-none font-mono text-xs tracking-widest uppercase cursor-pointer touch-manipulation"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              {years.map(y => <option key={y} value={y}>{y === 'All' ? 'ALL YEARS' : y.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        {/* Status Feedback */}
        {loading && <SkeletonCard type="member" count={4} />}
        {error && <ErrorState message={error} onRetry={fetchMembers} />}

        {!loading && !error && filteredMembers.length === 0 && (
          <EmptyState
            title="No members match your criteria"
            description="Try changing your search terms or resetting the team and year filters."
          />
        )}

        {/* Content Display */}
        {!loading && !error && filteredMembers.length > 0 && (
          <div>
            {/* If filtering, show unified results */}
            {isFiltering ? (
              <div>
                <div className="mb-8 pb-4 border-b border-white/10 flex justify-between items-center text-xs font-mono text-gray-400">
                  <span>SHOWING {filteredMembers.length} MATCHING MEMBERS</span>
                  <button
                    onClick={() => { setSearch(''); setTeamFilter('All'); setYearFilter('All'); }}
                    className="text-primary hover:underline cursor-pointer"
                  >
                    RESET FILTERS
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMembers.map(renderLeadCard)}
                </div>
              </div>
            ) : (
              /* Structured Hierarchy: Core -> Domain Leads -> Members -> Alumni */
              <div className="flex flex-col gap-28">
                {/* 1. Core Team */}
                {coreTeam.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/10">
                      <span className="text-xs font-mono tracking-widest text-primary uppercase font-bold">[ 01 ]</span>
                      <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight">
                        Core Leadership
                      </h2>
                      <div className="flex-1"></div>
                      <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{coreTeam.length} Leads</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {coreTeam.map(renderCoreCard)}
                    </div>
                  </section>
                )}

                {/* 2. Domain Leads */}
                {domainLeads.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/10">
                      <span className="text-xs font-mono tracking-widest text-primary uppercase font-bold">[ 02 ]</span>
                      <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight">
                        Domain Leads
                      </h2>
                      <div className="flex-1"></div>
                      <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{domainLeads.length} Leads</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {domainLeads.map(renderLeadCard)}
                    </div>
                  </section>
                )}

                {/* 3. General Members */}
                {generalMembers.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/10">
                      <span className="text-xs font-mono tracking-widest text-primary uppercase font-bold">[ 03 ]</span>
                      <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight">
                        Club Members & Contributors
                      </h2>
                      <div className="flex-1"></div>
                      <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{generalMembers.length} Members</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {generalMembers.map(renderMemberCard)}
                    </div>
                  </section>
                )}

                {/* 4. Alumni (if present) */}
                {alumni.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/10">
                      <span className="text-xs font-mono tracking-widest text-primary uppercase font-bold">[ 04 ]</span>
                      <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-tight">
                        Alumni Network
                      </h2>
                      <div className="flex-1"></div>
                      <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{alumni.length} Alumni</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {alumni.map(renderLeadCard)}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-[#07080D] text-white min-h-screen pt-28 sm:pt-36 pb-24 px-4 sm:px-6 md:px-14">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb & Navigation */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-white/50 hover:text-white uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-white/10 pb-8 mb-12">
          <div className="flex items-center gap-2.5 mb-3">
            <FileText size={18} className="text-primary" />
            <span className="font-mono text-xs tracking-[0.25em] text-white/70 uppercase">
              GOVERNANCE · DEV STUDIO MITE
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-editorial font-bold tracking-tight text-white uppercase leading-none">
            TERMS & <span className="stroke-text">CONDITIONS</span><span className="text-primary">.</span>
          </h1>
          <p className="font-mono text-xs text-white/40 tracking-widest uppercase mt-4">
            LAST REVISED: OCTOBER 2026 · MANGALORE, INDIA
          </p>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col gap-12 font-sans text-sm sm:text-base text-zinc-300 leading-relaxed">
          {/* Section 01 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              01 // ACCEPTANCE OF TERMS
            </h2>
            <p>
              By accessing the Dev Studio web platform, attending community workshops, participating in code sprints, or submitting membership applications, you agree to comply with and be bound by these Terms & Conditions. If you disagree with any portion of these terms, you should discontinue participation in studio activities.
            </p>
          </section>

          {/* Section 02 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              02 // COMMUNITY MEMBERSHIP & ELIGIBILITY
            </h2>
            <p className="mb-3">
              Dev Studio operates as a student-governed technology community at MITE Mangalore:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 font-normal">
              <li><strong className="text-white">Student Eligibility:</strong> Active membership is open to enrolled undergraduate and postgraduate students of MITE across all academic departments.</li>
              <li><strong className="text-white">Application Integrity:</strong> All credentials, GitHub links, and project portfolios submitted via recruitment forms must accurately represent your own authentic work.</li>
              <li><strong className="text-white">Active Participation:</strong> Squad members are expected to contribute to assigned open-source repositories and participate in technical mentoring sessions.</li>
            </ul>
          </section>

          {/* Section 03 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              03 // CODE OF CONDUCT & ETHICAL STANDARDS
            </h2>
            <p className="mb-3">
              We uphold a strict standard of professional respect and psychological safety. All contributors must adhere to our zero-tolerance policy regarding:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 font-normal">
              <li>Harassment, discrimination, or offensive behavior of any form across digital channels, campus labs, or hackathons.</li>
              <li>Malicious cyber activity, intentional code sabotage, or unauthorized testing against college networks and institutional infrastructure.</li>
              <li>Plagiarism of code, design mockups, or intellectual property without proper attribution or open-source licensing compliance.</li>
            </ul>
          </section>

          {/* Section 04 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              04 // OPEN SOURCE & INTELLECTUAL PROPERTY
            </h2>
            <p className="mb-3">
              We champion the ethos of open collaboration and permissive open-source licensing:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 font-normal">
              <li><strong className="text-white">Student Ownership:</strong> Students retain original copyright to the code and design systems they author within Dev Studio projects.</li>
              <li><strong className="text-white">Studio Repositories:</strong> Projects published under official Dev Studio organizations are distributed under permissive open licenses (MIT, Apache 2.0, or GPL) unless explicitly stated otherwise.</li>
              <li><strong className="text-white">Attribution:</strong> You are free to showcase project contributions in personal portfolios, resumes, and technical presentations with appropriate attribution.</li>
            </ul>
          </section>

          {/* Section 05 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              05 // WORKSHOPS, HACKATHONS & CAMPUS EVENTS
            </h2>
            <p>
              Registrations for Dev Studio events, hackathons, and guest seminars are subject to capacity limits. We reserve the right to revoke registration or event badges in cases of disruptive conduct or failure to adhere to event safety guidelines.
            </p>
          </section>

          {/* Section 06 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              06 // DISCLAIMERS & LIMITATION OF LIABILITY
            </h2>
            <p>
              Software systems, APIs, and project templates published by Dev Studio are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis for educational and non-commercial research purposes. Dev Studio and MITE provide no express warranties regarding uptime, data loss, or suitability for critical commercial production.
            </p>
          </section>

          {/* Section 07 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              07 // REVISIONS & COMMUNITY GOVERNANCE
            </h2>
            <p className="mb-4">
              These terms are reviewed annually by the student executive committee and faculty coordinators. Continued participation in community activities following published updates constitutes agreement with revised terms.
            </p>
            <div className="font-mono text-xs text-zinc-400 space-y-1">
              <p><strong className="text-white">Organization:</strong> Dev Studio MITE</p>
              <p><strong className="text-white">Campus:</strong> Mangalore Institute of Technology & Engineering, Moodabidri, Mangalore - 574225</p>
              <p><strong className="text-white">Questions:</strong> devstudioclub@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;

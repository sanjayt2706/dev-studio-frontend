import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const Privacy = () => {
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
            <ShieldCheck size={18} className="text-primary" />
            <span className="font-mono text-xs tracking-[0.25em] text-white/70 uppercase">
              LEGAL · DEV STUDIO MITE
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-editorial font-bold tracking-tight text-white uppercase leading-none">
            PRIVACY <span className="stroke-text">POLICY</span><span className="text-primary">.</span>
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
              01 // OVERVIEW & COMMUNITY ETHOS
            </h2>
            <p className="mb-4">
              Dev Studio is an autonomous, student-led engineering collective based at Mangalore Institute of Technology & Engineering (MITE). We are dedicated to building open-source projects, hosting technical symposiums, and fostering software craftsmanship.
            </p>
            <p>
              We treat user privacy with the same rigor we apply to software architecture. We collect only what is strictly necessary to evaluate membership applications and host student events. We do not sell data, run commercial advertising trackers, or monetize student information.
            </p>
          </section>

          {/* Section 02 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              02 // INFORMATION WE COLLECT
            </h2>
            <p className="mb-3">
              When you submit a recruitment application or register for a studio hackathon through our platform, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 font-normal">
              <li><strong className="text-white">Identity & Contact:</strong> Full name, institutional or personal email address, and optional phone number.</li>
              <li><strong className="text-white">Academic Credentials:</strong> Academic department/branch and current year of study at MITE.</li>
              <li><strong className="text-white">Technical Background:</strong> Primary domains (Frontend, Backend, AI/ML, DevOps, UI/UX), portfolio links, and GitHub/LinkedIn profiles.</li>
              <li><strong className="text-white">Statement of Intent:</strong> Your personal motivation and project ideas submitted with your application.</li>
            </ul>
          </section>

          {/* Section 03 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              03 // HOW WE USE YOUR DATA
            </h2>
            <p className="mb-3">
              Information collected is utilized exclusively for community operations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-400 font-normal">
              <li>Reviewing cohort applications and assigning domain squads during recruitment cycles.</li>
              <li>Issuing persistent reference tracking codes (e.g., <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-white">DS-XXXXXX</code>) for candidate verification.</li>
              <li>Communicating official technical announcements, hackathon schedules, and interview invites.</li>
              <li>Maintaining an internal directory of active squad contributors and repository maintainers.</li>
            </ul>
          </section>

          {/* Section 04 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              04 // DATA STORAGE & ACCESS SECURITY
            </h2>
            <p className="mb-3">
              Application submissions and community records are stored in production MongoDB Atlas databases with TLS/SSL encryption in transit and AES-256 encryption at rest.
            </p>
            <p>
              Administrative dashboard endpoints are secured behind role-based JWT authentication. Only verified Dev Studio executive leads have credentialed authorization to review candidate applications.
            </p>
          </section>

          {/* Section 05 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              05 // COOKIES & CLIENT STORAGE
            </h2>
            <p>
              Our website uses client-side <code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-white">localStorage</code> solely to remember your audio sound toggle preference (<code className="font-mono text-xs bg-white/10 px-1.5 py-0.5 rounded text-white">devstudio_audio_muted</code>) and preserve administrative session tokens. We do not use third-party analytics pixels, remarketing trackers, or invasive tracking scripts.
            </p>
          </section>

          {/* Section 06 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              06 // DATA RETENTION & REMOVAL
            </h2>
            <p>
              You retain full ownership of your personal data. If at any point you wish to withdraw an application or request the permanent deletion of your profile from our records, contact the Dev Studio core team directly. Your record will be permanently purged within 7 business days.
            </p>
          </section>

          {/* Section 07 */}
          <section className="border-l border-white/10 pl-6">
            <h2 className="font-mono text-xs text-white uppercase tracking-[0.2em] mb-3">
              07 // CONTACT & GOVERNANCE
            </h2>
            <p className="mb-4">
              For privacy queries, recruitment inquiries, or data access requests, please reach out through our official channels:
            </p>
            <div className="font-mono text-xs text-zinc-400 space-y-1">
              <p><strong className="text-white">Organization:</strong> Dev Studio MITE</p>
              <p><strong className="text-white">Campus:</strong> Mangalore Institute of Technology & Engineering, Moodabidri, Mangalore - 574225</p>
              <p><strong className="text-white">Inquiries:</strong> devstudioclub@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

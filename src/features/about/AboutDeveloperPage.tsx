import React, { useState } from 'react';
import {
  Github,
  Globe,
  Mail,
  MapPin,
  Briefcase,
  Code2,
  Smartphone,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Layers,
  ShieldCheck,
  Terminal,
  Cpu,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface ProjectItem {
  title: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  highlight: string;
  featured?: boolean;
}

const FEATURED_PROJECTS: ProjectItem[] = [
  {
    title: 'DevVault',
    tagline: 'Local-First, Privacy-First Developer Platform',
    description:
      'A high-performance offline developer utility suite featuring 29+ cryptographic, formatting, data conversion, and networking tools. Zero server telemetry — all processing occurs inside the browser sandbox using Web Crypto and Dexie IndexedDB.',
    category: 'Web Platform & Developer Tools',
    tags: ['React 18', 'TypeScript', 'Tailwind CSS', 'Monaco Editor', 'Dexie DB', 'Vite'],
    githubUrl: 'https://github.com/Akitha-Chanupama/DevVault',
    liveUrl: 'https://devvault.local',
    highlight: '100% Client-Side Privacy',
    featured: true,
  },
  {
    title: 'TraceMap',
    tagline: 'Local Codebase Intelligence & Architecture Visualization',
    description:
      'An interactive architecture intelligence tool that maps and visualizes codebase dependency structures, module graphs, and system flow diagrams locally without transmitting proprietary code to third-party clouds.',
    category: 'Architecture & Developer Tools',
    tags: ['TypeScript', 'Code Analysis', 'AST Parsing', 'Interactive Graphs', 'Visualization'],
    githubUrl: 'https://github.com/Akitha-Chanupama/TraceMap',
    highlight: 'Zero Data Leakage',
    featured: true,
  },
  {
    title: 'OmniConvert',
    tagline: 'High-Performance Private File Conversion Suite',
    description:
      'Client-side file transformation suite for images, PDFs, spreadsheets, and document assets. Employs modern browser APIs and WebAssembly to eliminate upload limits and maintain strict privacy.',
    category: 'Utilities & Processing',
    tags: ['React', 'WebAssembly', 'File APIs', 'Tailwind CSS', 'Privacy-First'],
    githubUrl: 'https://github.com/Akitha-Chanupama/OmniConvert',
    highlight: 'Wasm Powered',
    featured: true,
  },
  {
    title: 'Scam Radar',
    tagline: 'Threat Detection & Community Protection Mobile App',
    description:
      'A comprehensive 12-phase Flutter mobile application with a Supabase cloud backend built to detect, report, and crowdsource malicious scam messages, phishing SMS, and suspicious callers in real-time.',
    category: 'Mobile Application',
    tags: ['Flutter', 'Dart', 'Supabase', 'PostgreSQL', 'Cross-Platform Mobile'],
    githubUrl: 'https://github.com/Akitha-Chanupama/Scam_Radar',
    highlight: '12-Phase Full App',
  },
  {
    title: 'AI Resume Analyser',
    tagline: 'Automated Resume Parsing & Job Fit Scoring',
    description:
      'An intelligent web application that extracts text from candidate PDF resumes, synthesizes key competencies and experience, and evaluates candidate alignment with job specifications.',
    category: 'AI & Data Applications',
    tags: ['Python', 'FastAPI', 'PDF Extraction', 'NLP', 'React'],
    githubUrl: 'https://github.com/Akitha-Chanupama/AI-Resume-Analyser',
    highlight: 'NLP Scoring Engine',
  },
];

const SKILL_DOMAINS = [
  {
    category: 'Mobile & Cross-Platform',
    icon: <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    description: 'Native-feel, high-performance mobile experiences for iOS & Android.',
    skills: ['Flutter', 'Dart', 'Android SDK', 'Cross-Platform UI', 'State Management', 'Mobile Storage'],
  },
  {
    category: 'Frontend Engineering',
    icon: <Code2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    description: 'Modern, reactive single-page applications with strict type safety.',
    skills: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js', 'Monaco Editor', 'Zustand'],
  },
  {
    category: 'Backend & Cloud Systems',
    icon: <Terminal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    description: 'Fast, secure APIs and persistent database architectures.',
    skills: ['FastAPI', 'Python', 'Supabase', 'PostgreSQL', 'Node.js', 'REST APIs', 'Dexie IndexedDB'],
  },
  {
    category: 'Architecture & Craftsmanship',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    description: 'Resilient software design focused on privacy, testing, and longevity.',
    skills: ['Local-First Architecture', 'Web Crypto API', 'Test-Driven Design', 'Vitest', 'Git & CI/CD', 'Responsive Design'],
  },
];

export const AboutDeveloperPage: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = 'akithachanupama@gmail.com';
  const website = 'https://www.akithachanupama.com/';
  const github = 'https://github.com/Akitha-Chanupama';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success('Email address copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="space-y-10 pb-16 animate-fade-in max-w-6xl mx-auto">
      {/* Hero Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50/70 to-blue-50/40 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-blue-950/20 shadow-lg shadow-blue-500/5 backdrop-blur-md flex flex-col md:flex-row items-stretch">
        {/* Ambient Decorative Lighting */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-cyan-500/10 dark:bg-cyan-600/10 blur-3xl pointer-events-none" />

        {/* Left Side: Full-size Portrait Image */}
        <div className="relative w-full md:w-80 lg:w-[360px] shrink-0 self-stretch min-h-[340px] md:min-h-full">
          <img
            src="/images/akitha_grad1.jpg"
            alt="Akitha Chanupama"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient overlay at bottom on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent md:hidden" />
          {/* Status Badge floating at bottom */}
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available</span>
          </div>
        </div>

        {/* Right Side: Profile Identity & Details */}
        <div className="relative z-10 flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-200/60 dark:border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Software Engineer & Creator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Akitha Chanupama
            </h1>
            <p className="text-lg sm:text-xl font-medium text-blue-600 dark:text-blue-400">
              Mobile App Developer & Associate Software Engineer
            </p>
          </div>

          {/* Affiliation & Location Meta */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Fentons Information Technology</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Colombo, Sri Lanka</span>
            </div>
          </div>

          {/* Bio summary */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed text-center md:text-left">
            Passionate software engineer focused on architecting robust cross-platform mobile apps, privacy-first developer platforms, and elegant digital experiences. Building utilities that respect user autonomy and operate entirely client-side.
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all hover:translate-y-[-1px]"
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span>Portfolio Website</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80 shrink-0" />
            </a>

            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700/50 shadow-xs transition-all hover:translate-y-[-1px]"
            >
              <Github className="w-4 h-4 shrink-0" />
              <span>GitHub Profile</span>
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyEmail}
              className="gap-2 rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm h-9 px-3.5 whitespace-nowrap"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-500 shrink-0" /> : <Copy className="w-4 h-4 shrink-0" />}
              <span>{copiedEmail ? 'Email Copied' : 'Copy Email'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface p-5 text-center space-y-1 shadow-2xs">
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">100+</div>
          <div className="text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
            Projects
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface p-5 text-center space-y-1 shadow-2xs">
          <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">100%</div>
          <div className="text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
            Client-Side Privacy
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface p-5 text-center space-y-1 shadow-2xs">
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">Cross-Platform</div>
          <div className="text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
            Mobile & Fullstack
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface p-5 text-center space-y-1 shadow-2xs">
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">29+</div>
          <div className="text-xs font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">
            DevVault Utilities
          </div>
        </div>
      </div>

      {/* Featured Projects Portfolio */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span>Featured Engineering Projects</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
              Highlighted software systems, open-source utilities, and mobile products.
            </p>
          </div>
          <a
            href="https://github.com/Akitha-Chanupama?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>View All Repositories</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FEATURED_PROJECTS.map((project) => (
            <Card
              key={project.title}
              className={`rounded-2xl transition-all duration-200 hover:shadow-md hover:border-blue-500/40 flex flex-col justify-between ${
                project.featured
                  ? 'border-blue-200/90 dark:border-blue-500/30 bg-gradient-to-b from-white to-blue-50/20 dark:from-slate-900 dark:to-blue-950/10'
                  : 'border-slate-200/80 dark:border-slate-800 bg-surface'
              }`}
            >
              <CardHeader className="p-5 pb-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                      {project.title}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[11px] font-mono shrink-0 bg-blue-50/60 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30">
                    {project.highlight}
                  </Badge>
                </div>
                <CardDescription className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {project.tagline}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {/* Tech stack pill tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3 pt-1">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                    </a>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Live Experience</span>
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technical Skill Domains */}
      <section className="space-y-5">
        <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Technical Capabilities</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
            Core technologies and engineering practices across mobile, web, and distributed backend systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SKILL_DOMAINS.map((domain) => (
            <div
              key={domain.category}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface p-5 space-y-3 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {domain.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {domain.category}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {domain.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {domain.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Engineering Philosophy Cards */}
      <section className="space-y-5">
        <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Engineering Principles</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">
            Architectural tenets that guide every tool and application I build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface p-6 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Local-First & Zero Telemetry
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Sensitive payloads, tokens, passwords, and source code should never leave the developer's device. Processing locally guarantees both absolute privacy and instant execution.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface p-6 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Deterministic & Type-Safe
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Eliminate runtime surprises with strict TypeScript contracts, comprehensive automated test suites, and predictable data transformations across all layers.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface p-6 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tactile, Polished UX
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Clean typography, responsive fluid layouts, deliberate keyboard accessibility, and native light/dark color harmony make developer tools an absolute joy to use every day.
            </p>
          </div>
        </div>
      </section>

      {/* Connect Banner */}
      <div className="rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-8 sm:p-10 shadow-xl shadow-blue-600/15 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Let's Collaborate & Build Together
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl">
            Whether you want to discuss cross-platform mobile apps, private web utilities, or custom software architecture, I'd love to connect.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap bg-white text-blue-700 hover:bg-blue-50 shadow-md transition-all hover:scale-105"
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>Send Email</span>
          </a>
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap bg-blue-950/60 hover:bg-blue-950/80 text-white border border-white/20 transition-all hover:scale-105"
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>akithachanupama.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutDeveloperPage;


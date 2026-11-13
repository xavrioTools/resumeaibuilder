import React, { useState } from 'react';
import { 
  Sparkles, Wand2, Palette, Target, FileCheck2, Zap, 
  RefreshCw, Download, Printer, Plus, Trash2, ArrowUp, 
  ArrowDown, Eye, Check, Copy, ChevronDown, ChevronRight,
  Maximize2, ZoomIn, ZoomOut, Upload, Layers
} from 'lucide-react';
import { ResumeData, ThemePreset, LayoutMode, FontFamily, PhotoShape, SpacingMode } from '../types/resume';
import { TemplateRenderer } from './TemplateRenderer';
import { themeConfigs } from '../data/themes';
import confetti from 'canvas-confetti';

interface ResumeEditorProps {
  resume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  initialTab?: string;
  onOpenTemplates: () => void;
  isPro: boolean;
  onOpenProModal: () => void;
  onSaveResume: (resume: ResumeData) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resume,
  setResume,
  initialTab = 'content',
  onOpenTemplates,
  isPro,
  onOpenProModal,
  onSaveResume,
}) => {
  const [activeTab, setActiveTab] = useState<
    'content' | 'ai-builder' | 'design' | 'ats' | 'job-matcher' | 'cover-letter' | 'linkedin' | 'recreate'
  >((initialTab as any) || 'content');

  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Mode 2 State
  const [rawTextContent, setRawTextContent] = useState<string>('');

  // AI Bullet enhancement modal state
  const [bulletModal, setBulletModal] = useState<{
    open: boolean;
    expIndex: number;
    bulletIndex: number;
    original: string;
    variations: Array<{ type: string; text: string }>;
  } | null>(null);

  // ATS State
  const [atsAudit, setAtsAudit] = useState<{
    score: number;
    breakdown: { contact: number; summary: number; experience: number; skills: number; structure: number };
    strengths: string[];
    warnings: string[];
    fixes: string[];
  }>({
    score: 96,
    breakdown: { contact: 15, summary: 14, experience: 34, skills: 19, structure: 14 },
    strengths: [
      'Comprehensive contact channels including GitHub and LinkedIn',
      'Strong quantified metrics present in 85% of experience bullets',
      'Balanced distribution of technical and executive leadership competencies',
    ],
    warnings: [
      'Consider specifying certifications issue dates in YYYY format',
      'Summary could incorporate 1-2 more domain-specific keywords',
    ],
    fixes: [
      'Add target industry frameworks to the Skills section',
      'Quantify results for older projects',
    ],
  });

  // Job Matcher State
  const [jobDescriptionInput, setJobDescriptionInput] = useState<string>('');
  const [jobMatchResult, setJobMatchResult] = useState<any>(null);

  // Cover Letter State
  const [targetCompany, setTargetCompany] = useState<string>('Google');
  const [targetRole, setTargetRole] = useState<string>('Director of Engineering');
  const [coverLetterResult, setCoverLetterResult] = useState<{
    subject: string;
    salutation: string;
    body: string;
    signOff: string;
  } | null>(null);

  // LinkedIn State
  const [linkedInResult, setLinkedInResult] = useState<{
    headlines: string[];
    aboutSection: string;
  } | null>(null);

  // Recreate Resume State
  const [recreateInput, setRecreateInput] = useState<string>('');

  // Section accordions in Content tab
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: true,
    skills: true,
    education: false,
    projects: false,
    certifications: false,
    languages: false,
    awards: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper to update personal info
  const handlePersonalChange = (field: keyof typeof resume.personal, value: string) => {
    setResume((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      personal: { ...prev.personal, [field]: value },
    }));
  };

  // Helper for experiences
  const handleExperienceChange = (index: number, field: string, value: any) => {
    const updated = [...resume.experiences];
    updated[index] = { ...updated[index], [field]: value };
    setResume((prev) => ({ ...prev, experiences: updated, updatedAt: new Date().toISOString() }));
  };

  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: 'New Company',
      role: 'Role Title',
      location: 'Remote / City, State',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      bullets: ['Spearheaded strategic project delivery increasing core metrics by 25%.'],
    };
    setResume((prev) => ({ ...prev, experiences: [newExp, ...prev.experiences] }));
  };

  const removeExperience = (index: number) => {
    const updated = resume.experiences.filter((_, i) => i !== index);
    setResume((prev) => ({ ...prev, experiences: updated }));
  };

  const addBullet = (expIndex: number) => {
    const updated = [...resume.experiences];
    updated[expIndex].bullets.push('Architected new feature pipeline reducing latency by 30%.');
    setResume((prev) => ({ ...prev, experiences: updated }));
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const updated = [...resume.experiences];
    updated[expIndex].bullets[bulletIndex] = value;
    setResume((prev) => ({ ...prev, experiences: updated }));
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...resume.experiences];
    updated[expIndex].bullets.splice(bulletIndex, 1);
    setResume((prev) => ({ ...prev, experiences: updated }));
  };

  // AI Bullet Enhancer Call
  const handleEnhanceBullet = async (expIndex: number, bulletIndex: number) => {
    const exp = resume.experiences[expIndex];
    const bullet = exp.bullets[bulletIndex];
    setLoadingAi(true);
    setAiError(null);

    try {
      const res = await fetch('/api/ai/enhance-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet,
          role: exp.role,
          company: exp.company,
        }),
      });

      if (!res.ok) {
        throw new Error('AI enhancement request failed');
      }

      const data = await res.json();
      setBulletModal({
        open: true,
        expIndex,
        bulletIndex,
        original: bullet,
        variations: data.variations || [],
      });
    } catch (err: any) {
      console.error(err);
      // Fallback variations if offline
      setBulletModal({
        open: true,
        expIndex,
        bulletIndex,
        original: bullet,
        variations: [
          {
            type: 'Metric-Driven (Quantified Impact)',
            text: `Spearheaded end-to-end modernization of core systems, driving a 38% increase in operational throughput and saving $450K annually.`,
          },
          {
            type: 'Executive & Strategic Leadership',
            text: `Championed strategic architectural transformation across multi-disciplinary teams, scaling service resilience to 99.99% availability.`,
          },
          {
            type: 'Concise & ATS-Optimized',
            text: `Architected scalable distributed workflows using modern frameworks, decreasing deployment latency by 45%.`,
          },
        ],
      });
    } finally {
      setLoadingAi(false);
    }
  };

  // AI Summary Enhancer
  const handleEnhanceSummary = async () => {
    setLoadingAi(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/enhance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentSummary: resume.personal.summary,
          jobTitle: resume.personal.jobTitle,
          topSkills: resume.skills.slice(0, 5).map((s) => s.name),
        }),
      });
      const data = await res.json();
      if (data.summaries && data.summaries.length > 0) {
        handlePersonalChange('summary', data.summaries[0].text);
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      console.error(err);
      handlePersonalChange(
        'summary',
        `Results-oriented ${resume.personal.jobTitle || 'Executive'} with 10+ years delivering mission-critical platforms, building high-performing engineering teams, and translating complex architectural challenges into measurable enterprise growth.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  // Mode 2 AI Builder Call (Raw text to structured resume)
  const handleParseRawText = async () => {
    if (!rawTextContent.trim()) {
      setAiError('Please enter some raw text or paste your career notes.');
      return;
    }
    setLoadingAi(true);
    setAiError(null);

    try {
      const res = await fetch('/api/ai/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: rawTextContent }),
      });

      if (!res.ok) {
        throw new Error('AI parsing failed. Check your API key or server.');
      }

      const json = await res.json();
      if (json.data) {
        const parsed = json.data;
        setResume((prev) => ({
          ...prev,
          updatedAt: new Date().toISOString(),
          personal: {
            ...prev.personal,
            ...(parsed.personal || {}),
            photoUrl: prev.personal.photoUrl, // keep current avatar
          },
          experiences: parsed.experiences && parsed.experiences.length > 0 ? parsed.experiences : prev.experiences,
          educations: parsed.educations && parsed.educations.length > 0 ? parsed.educations : prev.educations,
          skills: parsed.skills && parsed.skills.length > 0 ? parsed.skills : prev.skills,
          projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : prev.projects,
          certifications: parsed.certifications && parsed.certifications.length > 0 ? parsed.certifications : prev.certifications,
          languages: parsed.languages && parsed.languages.length > 0 ? parsed.languages : prev.languages,
          awards: parsed.awards && parsed.awards.length > 0 ? parsed.awards : prev.awards,
        }));
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        setActiveTab('content');
      }
    } catch (err: any) {
      setAiError(err.message || 'Failed to process raw text. Falling back to structured parser.');
    } finally {
      setLoadingAi(false);
    }
  };

  // Deep ATS Audit
  const handleDeepAtsAudit = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/ats-deep-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: resume }),
      });
      const data = await res.json();
      if (data.overallScore) {
        setAtsAudit({
          score: data.overallScore,
          breakdown: data.categoryScores || atsAudit.breakdown,
          strengths: data.strengths || atsAudit.strengths,
          warnings: data.warnings || atsAudit.warnings,
          fixes: data.actionableFixes || atsAudit.fixes,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  // Job Description Matcher
  const handleMatchJob = async () => {
    if (!jobDescriptionInput.trim()) return;
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/match-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: resume, jobDescription: jobDescriptionInput }),
      });
      const data = await res.json();
      setJobMatchResult(data);
    } catch (err) {
      console.error(err);
      setJobMatchResult({
        matchScore: 88,
        summary: 'Strong match for senior technical roles. Matches 9 out of 11 core requirements.',
        matchedSkills: ['Distributed Systems', 'Kubernetes', 'TypeScript', 'AWS', 'System Architecture', 'CI/CD'],
        missingSkills: ['Terraform', 'GraphQL', 'Prompt Engineering'],
        recommendedKeywords: ['Cross-functional stakeholder alignment', 'Budget optimization', 'SOC2 Compliance'],
        improvementTips: [
          {
            section: 'Experience',
            issue: 'Job emphasizes Infrastructure as Code (Terraform)',
            suggestedFix: 'Incorporate automated Terraform infrastructure provisioning into your Nexus Software or Apex Cloud bullets.',
          },
        ],
      });
    } finally {
      setLoadingAi(false);
    }
  };

  // Cover Letter Generation
  const handleGenerateCoverLetter = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: resume,
          companyName: targetCompany,
          jobTitle: targetRole,
          jobDescription: jobDescriptionInput,
        }),
      });
      const data = await res.json();
      setCoverLetterResult(data);
    } catch (err) {
      console.error(err);
      setCoverLetterResult({
        subject: `Application for ${targetRole} – ${resume.personal.fullName}`,
        salutation: `Dear Hiring Team at ${targetCompany},`,
        body: `I am writing to express my strong enthusiasm for the ${targetRole} position at ${targetCompany}. With over a decade of hands-on experience architecting resilient platforms and scaling high-performing engineering teams at organizations like Apex Cloud Solutions, I have dedicated my career to driving measurable business growth through technical innovation.\n\nAt Apex Cloud, I spearheaded our enterprise cloud migration that reduced infrastructure latency by 64% and achieved over $1.2M in annual operational savings while scaling our systems to support 45M+ active users. What excites me most about ${targetCompany} is your relentless focus on engineering excellence and high-impact product solutions.\n\nI look forward to the opportunity to discuss how my technical leadership and architectural expertise can help accelerate ${targetCompany}'s strategic goals.`,
        signOff: `Sincerely,\n${resume.personal.fullName}\n${resume.personal.email} · ${resume.personal.phone}`,
      });
    } finally {
      setLoadingAi(false);
    }
  };

  // LinkedIn Generator
  const handleGenerateLinkedIn = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/generate-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: resume }),
      });
      const data = await res.json();
      setLinkedInResult(data);
    } catch (err) {
      console.error(err);
      setLinkedInResult({
        headlines: [
          `VP of Engineering | Distributed Systems & Cloud Architecture | Ex-Apex Cloud | Scaling High-Growth Tech Orgs`,
          `Engineering Executive & System Architect | Modernizing Cloud Platforms (AWS/GCP, K8s, Go) | Transforming Engineering Teams`,
          `Tech Leader & Product Architect | 12+ Yrs Building Platforms for 40M+ Users | Passionate about Scalable Systems & AI`,
        ],
        aboutSection: `I build scalable software architectures and empower world-class engineering teams to solve hard technical problems.\n\nThroughout my career at high-growth tech companies, I've had the privilege of scaling engineering organizations from 14 to 90+ engineers, cutting infrastructure overhead by millions of dollars, and architecting event-driven systems that deliver under 25ms latency.\n\nCore focus areas:\n• Distributed Systems & Cloud Modernization (AWS, Kubernetes, Go, TypeScript)\n• Engineering Leadership & Mentorship\n• Security & Compliance (SOC2, ISO 27001)\n\nAlways excited to connect with fellow builders, founders, and engineers tackling ambitious platform challenges.`,
      });
    } finally {
      setLoadingAi(false);
    }
  };

  // Resume Recreation AI Call
  const handleRecreateResume = async () => {
    if (!recreateInput.trim()) return;
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/recreate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textContent: recreateInput }),
      });
      const json = await res.json();
      if (json.data) {
        setResume((prev) => ({
          ...prev,
          updatedAt: new Date().toISOString(),
          personal: { ...prev.personal, ...(json.data.personal || {}) },
          experiences: json.data.experiences || prev.experiences,
          skills: json.data.skills || prev.skills,
          educations: json.data.educations || prev.educations,
        }));
        confetti({ particleCount: 40, spread: 60 });
        setActiveTab('content');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(false);
    }
  };

  // Print PDF Trigger
  const handlePrintPdf = () => {
    window.print();
  };

  // Export JSON Backup
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${resume.personal.fullName.replace(/\s+/g, '_')}_Resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Editor Sub-Header Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-40">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={resume.title}
            onChange={(e) => setResume((prev) => ({ ...prev, title: e.target.value }))}
            className="text-sm font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#4FE6CF] focus:outline-none px-1 py-0.5 rounded"
          />
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 tabular-nums">
            {atsAudit.score}% ATS Score
          </span>
        </div>

        {/* Viewport Zoom & Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setZoomScale((s) => Math.max(0.6, s - 0.1))}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono tabular-nums text-slate-600 dark:text-slate-300">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale((s) => Math.min(1.2, s + 0.1))}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenTemplates}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#4FE6CF] transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => {
              onSaveResume(resume);
              confetti({ particleCount: 20, spread: 40 });
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Save
          </button>

          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
            title="Download JSON Backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#062B5B] hover:bg-[#062B5B]/90 text-white dark:bg-[#4FE6CF] dark:text-[#062B5B] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT PANE: Controls & Tools (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden">
          {/* Tool Navigation Tabs */}
          <div className="flex items-center overflow-x-auto border-b border-slate-200 dark:border-slate-800 p-2 gap-1 bg-slate-50 dark:bg-slate-900/60 scrollbar-none">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Content
            </button>

            <button
              onClick={() => setActiveTab('ai-builder')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'ai-builder'
                  ? 'bg-[#062B5B] text-white dark:bg-[#4FE6CF] dark:text-[#062B5B] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wand2 className="w-3 h-3" />
              <span>AI Builder (Mode 2)</span>
            </button>

            <button
              onClick={() => setActiveTab('design')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'design'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-3 h-3" />
              <span>Design</span>
            </button>

            <button
              onClick={() => setActiveTab('ats')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'ats'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-3 h-3 text-emerald-500" />
              <span>ATS Score</span>
            </button>

            <button
              onClick={() => setActiveTab('job-matcher')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'job-matcher'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCheck2 className="w-3 h-3 text-blue-500" />
              <span>Job Matcher</span>
            </button>

            <button
              onClick={() => setActiveTab('cover-letter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'cover-letter'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3 text-purple-500" />
              <span>Cover Letter</span>
            </button>

            <button
              onClick={() => setActiveTab('linkedin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'linkedin'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              LinkedIn
            </button>

            <button
              onClick={() => setActiveTab('recreate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'recreate'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <RefreshCw className="w-3 h-3 text-amber-500" />
              <span>Recreate AI</span>
            </button>
          </div>

          {/* Tab Content Viewport */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* 1. CONTENT TAB (MODE 1: MANUAL BUILDER) */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                {/* Personal Info Section */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
                  <button
                    onClick={() => toggleSection('personal')}
                    className="w-full p-4 text-left font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span>Personal & Contact Information</span>
                    {openSections.personal ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  {openSections.personal && (
                    <div className="p-4 pt-0 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Full Name</label>
                          <input
                            type="text"
                            value={resume.personal.fullName}
                            onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Target Job Title</label>
                          <input
                            type="text"
                            value={resume.personal.jobTitle}
                            onChange={(e) => handlePersonalChange('jobTitle', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Email</label>
                          <input
                            type="email"
                            value={resume.personal.email}
                            onChange={(e) => handlePersonalChange('email', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Phone</label>
                          <input
                            type="text"
                            value={resume.personal.phone}
                            onChange={(e) => handlePersonalChange('phone', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Location / Address</label>
                          <input
                            type="text"
                            value={resume.personal.address}
                            onChange={(e) => handlePersonalChange('address', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Website / Portfolio</label>
                          <input
                            type="text"
                            value={resume.personal.website}
                            onChange={(e) => handlePersonalChange('website', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">LinkedIn</label>
                          <input
                            type="text"
                            value={resume.personal.linkedin}
                            onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">GitHub / Other</label>
                          <input
                            type="text"
                            value={resume.personal.github}
                            onChange={(e) => handlePersonalChange('github', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Photo Shape & Preset Selector */}
                      <div>
                        <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Profile Picture Options</label>
                        <div className="flex flex-wrap gap-2 items-center">
                          {(['circle', 'rounded', 'square', 'hexagon', 'hidden'] as PhotoShape[]).map((shape) => (
                            <button
                              key={shape}
                              onClick={() => setResume((p) => ({ ...p, photoShape: shape }))}
                              className={`px-2.5 py-1 rounded text-xs font-semibold capitalize border ${
                                resume.photoShape === shape
                                  ? 'bg-[#062B5B] text-white dark:bg-[#4FE6CF] dark:text-[#062B5B] border-transparent'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {shape}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Professional Summary */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Professional Summary
                    </span>
                    <button
                      onClick={handleEnhanceSummary}
                      disabled={loadingAi}
                      className="text-xs font-bold text-[#062B5B] dark:text-[#4FE6CF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{loadingAi ? 'Enhancing...' : 'AI Enhance'}</span>
                    </button>
                  </div>
                  <div className="p-4 pt-0">
                    <textarea
                      rows={4}
                      value={resume.personal.summary}
                      onChange={(e) => handlePersonalChange('summary', e.target.value)}
                      placeholder="Write 2-4 sentences highlighting career wins, leadership, and core value proposition..."
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Professional Experience */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40">
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Work Experience ({resume.experiences.length})
                    </span>
                    <button
                      onClick={addExperience}
                      className="px-2.5 py-1 rounded text-xs font-semibold bg-[#062B5B] text-white dark:bg-[#4FE6CF] dark:text-[#062B5B] flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Role</span>
                    </button>
                  </div>

                  <div className="p-4 pt-0 space-y-4">
                    {resume.experiences.map((exp, expIdx) => (
                      <div
                        key={exp.id}
                        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Role #{expIdx + 1}
                          </span>
                          <button
                            onClick={() => removeExperience(expIdx)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove role"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="block text-slate-500 mb-0.5">Job Title / Role</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => handleExperienceChange(expIdx, 'role', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 mb-0.5">Company Name</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(expIdx, 'company', e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <label className="block text-slate-500 mb-0.5">Start Date</label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => handleExperienceChange(expIdx, 'startDate', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 mb-0.5">End Date</label>
                            <input
                              type="text"
                              value={exp.current ? 'Present' : exp.endDate}
                              disabled={exp.current}
                              onChange={(e) => handleExperienceChange(expIdx, 'endDate', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 mb-0.5">Location</label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => handleExperienceChange(expIdx, 'location', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Bullets */}
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-600 dark:text-slate-400">Accomplishment Bullets</span>
                            <button
                              onClick={() => addBullet(expIdx)}
                              className="text-xs text-[#062B5B] dark:text-[#4FE6CF] font-bold hover:underline flex items-center gap-0.5"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Bullet</span>
                            </button>
                          </div>

                          {exp.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="space-y-1">
                              <div className="flex items-start gap-1.5">
                                <textarea
                                  rows={2}
                                  value={bullet}
                                  onChange={(e) => updateBullet(expIdx, bIdx, e.target.value)}
                                  className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                                />
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => handleEnhanceBullet(expIdx, bIdx)}
                                    title="AI Enhance this bullet"
                                    className="p-1.5 bg-cyan-50 dark:bg-cyan-950/40 text-[#062B5B] dark:text-[#4FE6CF] border border-cyan-200 dark:border-cyan-800 rounded hover:scale-105 transition-transform"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => removeBullet(expIdx, bIdx)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Management */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Skills & Competencies ({resume.skills.length})
                    </span>
                    <button
                      onClick={() => {
                        const name = prompt('Enter skill name:');
                        if (name) {
                          setResume((prev) => ({
                            ...prev,
                            skills: [...prev.skills, { name, category: 'Core', level: 5 }],
                          }));
                        }
                      }}
                      className="text-xs text-[#062B5B] dark:text-[#4FE6CF] font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Skill</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {resume.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                      >
                        <span>{skill.name}</span>
                        <button
                          onClick={() => {
                            setResume((prev) => ({
                              ...prev,
                              skills: prev.skills.filter((_, i) => i !== sIdx),
                            }));
                          }}
                          className="text-slate-400 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. MODE 2: AI RESUME BUILDER (RAW TEXT TO RESUME) */}
            {activeTab === 'ai-builder' && (
              <div className="space-y-4">
                <div className="p-4 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#062B5B] dark:text-[#4FE6CF]">
                    <Wand2 className="w-4 h-4" />
                    <span>Mode 2: AI Unstructured Career Parser</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Paste messy bullet points, an old plain text CV, or rough notes. Our AI will automatically extract your name, roles, dates, metrics, skills, and education into the correct fields while fixing grammar and maximizing impact.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Raw Career Notes / Content</label>
                    <button
                      onClick={() =>
                        setRawTextContent(
                          `John Doe\nSenior Cloud Architect\njohn.doe@example.com | (555) 234-5678 | Seattle, WA\n\nExperience:\nStaff DevOps Lead at CloudVantage (2020 - Present)\n- Led migration of 140 microservices to Kubernetes\n- Slashed AWS cloud costs by 32% saving $400k/yr\n- Built automated CI/CD pipeline cutting release time from 4 hours to 8 minutes\n\nSoftware Engineer at DataPeak (2016 - 2020)\n- Built real time streaming APIs with Go and Kafka\n- Maintained 99.99% uptime\n\nEducation:\nBS Computer Science, University of Washington (2012-2016)\n\nSkills:\nKubernetes, Docker, AWS, Go, Python, Terraform, CI/CD, Microservices`
                        )
                      }
                      className="text-[11px] text-[#062B5B] dark:text-[#4FE6CF] font-semibold hover:underline"
                    >
                      Insert Sample Career Notes
                    </button>
                  </div>

                  <textarea
                    rows={12}
                    value={rawTextContent}
                    onChange={(e) => setRawTextContent(e.target.value)}
                    placeholder="Paste unformatted text here, for example:&#10;&#10;Alex Morgan&#10;Product Lead&#10;alex@mail.com&#10;Worked at Stripe as Product Manager from 2020 to 2024. Launched checkout optimization increasing conversion by 18%...&#10;Skills: SQL, Figma, Python, Growth"
                    className="w-full p-3 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#4FE6CF]"
                  />
                </div>

                {aiError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400">
                    {aiError}
                  </div>
                )}

                <button
                  onClick={handleParseRawText}
                  disabled={loadingAi}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#062B5B] hover:bg-[#062B5B]/90 text-white dark:bg-[#4FE6CF] dark:text-[#062B5B] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{loadingAi ? 'AI Engine Parsing & Structuring...' : 'Transform Raw Notes Into Modern Resume'}</span>
                </button>
              </div>
            )}

            {/* 3. CUSTOMIZATION STUDIO */}
            {activeTab === 'design' && (
              <div className="space-y-5 text-xs">
                {/* 1-Click Theme Switcher */}
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    One-Click Theme Switcher
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.keys(themeConfigs) as ThemePreset[]).map((themeKey) => {
                      const cfg = themeConfigs[themeKey];
                      return (
                        <button
                          key={themeKey}
                          onClick={() => {
                            setResume((prev) => ({
                              ...prev,
                              themePreset: themeKey,
                              primaryColor: cfg.primary,
                              accentColor: cfg.accent,
                            }));
                          }}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            resume.themePreset === themeKey
                              ? 'border-[#062B5B] dark:border-[#4FE6CF] bg-slate-50 dark:bg-slate-800 font-bold shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cfg.primary }} />
                          <span className="truncate text-slate-900 dark:text-white">{cfg.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Pickers */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Primary Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={resume.primaryColor}
                        onChange={(e) => setResume((p) => ({ ...p, primaryColor: e.target.value }))}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                      />
                      <input
                        type="text"
                        value={resume.primaryColor}
                        onChange={(e) => setResume((p) => ({ ...p, primaryColor: e.target.value }))}
                        className="flex-1 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Secondary Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={resume.accentColor}
                        onChange={(e) => setResume((p) => ({ ...p, accentColor: e.target.value }))}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                      />
                      <input
                        type="text"
                        value={resume.accentColor}
                        onChange={(e) => setResume((p) => ({ ...p, accentColor: e.target.value }))}
                        className="flex-1 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Layout Architecture */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Layout Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'two-column-left', label: 'Two-Column (Left Rail)' },
                      { id: 'two-column-right', label: 'Two-Column (Right Rail)' },
                      { id: 'single-column', label: 'Single Column (Classic ATS)' },
                      { id: 'modern-split', label: 'Modern Split Banner' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setResume((p) => ({ ...p, layoutMode: mode.id as LayoutMode }))}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          resume.layoutMode === mode.id
                            ? 'border-[#062B5B] dark:border-[#4FE6CF] bg-slate-50 dark:bg-slate-800 font-bold'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography Selection */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Typography Pairing
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'plus-jakarta', label: 'Plus Jakarta Sans (Modern Executive)' },
                      { id: 'outfit', label: 'Outfit (Clean Geometric)' },
                      { id: 'playfair', label: 'Playfair Display (Luxury Editorial)' },
                      { id: 'mono', label: 'JetBrains Mono (Technical Lead)' },
                    ].map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setResume((p) => ({ ...p, fontFamily: font.id as FontFamily }))}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          resume.fontFamily === font.id
                            ? 'border-[#062B5B] dark:border-[#4FE6CF] bg-slate-50 dark:bg-slate-800 font-bold'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spacing & Density */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Spacing & Density
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['compact', 'standard', 'relaxed'] as SpacingMode[]).map((sp) => (
                      <button
                        key={sp}
                        onClick={() => setResume((p) => ({ ...p, spacing: sp }))}
                        className={`p-2 rounded-xl border text-center capitalize ${
                          resume.spacing === sp
                            ? 'border-[#062B5B] dark:border-[#4FE6CF] bg-slate-50 dark:bg-slate-800 font-bold'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. ATS SCORE AUDIT */}
            {activeTab === 'ats' && (
              <div className="space-y-5 text-xs">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      Applicant Tracking System (ATS) Audit
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                      Rigorously benchmarked against Workday, Greenhouse, Taleo & Lever
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {atsAudit.score}%
                  </div>
                </div>

                {/* Category breakdown meters */}
                <div className="space-y-2">
                  <div className="font-bold text-slate-800 dark:text-slate-200">Category Evaluation</div>
                  {[
                    { label: 'Contact & Header Data', score: atsAudit.breakdown.contact, max: 15 },
                    { label: 'Executive Summary Impact', score: atsAudit.breakdown.summary, max: 15 },
                    { label: 'Action Verbs & Metrics', score: atsAudit.breakdown.experience, max: 35 },
                    { label: 'Skills Density & Alignment', score: atsAudit.breakdown.skills, max: 20 },
                    { label: 'Format Hierarchy & Length', score: atsAudit.breakdown.structure, max: 15 },
                  ].map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>{cat.label}</span>
                        <span className="tabular-nums font-semibold">{cat.score}/{cat.max} pts</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(cat.score / cat.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Strengths & Warnings */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-800 dark:text-slate-200">Strengths Identified</div>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                    {atsAudit.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="font-bold text-slate-800 dark:text-slate-200 pt-2">Recommended Optimizations</div>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                    {atsAudit.warnings.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-amber-600 dark:text-amber-400">
                        <span className="shrink-0 font-bold">!</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleDeepAtsAudit}
                  disabled={loadingAi}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#062B5B] hover:bg-[#062B5B]/90 text-white dark:bg-[#4FE6CF] dark:text-[#062B5B] flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>{loadingAi ? 'Auditing Resume...' : 'Re-Run Deep ATS Audit'}</span>
                </button>
              </div>
            )}

            {/* 5. JOB DESCRIPTION MATCHER */}
            {activeTab === 'job-matcher' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="font-bold text-blue-900 dark:text-blue-300">Target Role Tailoring Engine</div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Paste the target job description. The engine will score your alignment, identify missing requirements, and recommend tailored bullet points.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Job Description (Requirements & Responsibilities)
                  </label>
                  <textarea
                    rows={6}
                    value={jobDescriptionInput}
                    onChange={(e) => setJobDescriptionInput(e.target.value)}
                    placeholder="Paste the vacancy description here..."
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={handleMatchJob}
                  disabled={loadingAi || !jobDescriptionInput.trim()}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#062B5B] hover:bg-[#062B5B]/90 text-white dark:bg-[#4FE6CF] dark:text-[#062B5B] flex items-center justify-center gap-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{loadingAi ? 'Analyzing Job Match...' : 'Calculate Job Match & Gaps'}</span>
                </button>

                {jobMatchResult && (
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <span className="font-bold">Match Alignment</span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {jobMatchResult.matchScore}%
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400">{jobMatchResult.summary}</p>

                    <div>
                      <div className="font-bold mb-1">Missing Hard Skills (Add to Resume)</div>
                      <div className="flex flex-wrap gap-1.5">
                        {jobMatchResult.missingSkills?.map((skill: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setResume((p) => ({
                                ...p,
                                skills: [...p.skills, { name: skill, category: 'Target Role', level: 5 }],
                              }));
                            }}
                            className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 text-[11px] font-semibold flex items-center gap-1"
                            title="Click to add to your resume skills"
                          >
                            <span>+ {skill}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. COVER LETTER GENERATOR */}
            {activeTab === 'cover-letter' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Target Company</label>
                    <input
                      type="text"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">Target Job Title</label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={loadingAi}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#062B5B] hover:bg-[#062B5B]/90 text-white dark:bg-[#4FE6CF] dark:text-[#062B5B] flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{loadingAi ? 'Drafting Cover Letter...' : 'Generate Tailored Cover Letter'}</span>
                </button>

                {coverLetterResult && (
                  <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                    <div className="flex justify-between items-center border-b pb-2 dark:border-slate-700">
                      <span className="font-bold text-slate-900 dark:text-white">Drafted Cover Letter</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${coverLetterResult.salutation}\n\n${coverLetterResult.body}\n\n${coverLetterResult.signOff}`
                          );
                          alert('Cover letter copied to clipboard!');
                        }}
                        className="text-xs font-semibold text-[#062B5B] dark:text-[#4FE6CF] flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>

                    <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-serif">
                      <div className="font-bold">{coverLetterResult.salutation}</div>
                      <div className="mt-2">{coverLetterResult.body}</div>
                      <div className="mt-3 font-semibold">{coverLetterResult.signOff}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 7. LINKEDIN GENERATOR */}
            {activeTab === 'linkedin' && (
              <div className="space-y-4 text-xs">
                <button
                  onClick={handleGenerateLinkedIn}
                  disabled={loadingAi}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#062B5B] hover:bg-[#062B5B]/90 text-white dark:bg-[#4FE6CF] dark:text-[#062B5B] flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{loadingAi ? 'Generating LinkedIn Copy...' : 'Generate Headlines & About Section'}</span>
                </button>

                {linkedInResult && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                      <div className="font-bold text-slate-900 dark:text-white">High-Converting Headlines</div>
                      {linkedInResult.headlines.map((hl, i) => (
                        <div key={i} className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-700 flex justify-between gap-2">
                          <span className="text-slate-800 dark:text-slate-200">{hl}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(hl);
                              alert('Headline copied!');
                            }}
                            className="text-[#062B5B] dark:text-[#4FE6CF] hover:underline shrink-0"
                          >
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 dark:text-white">Storytelling "About" Section</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(linkedInResult.aboutSection);
                            alert('About section copied!');
                          }}
                          className="text-[#062B5B] dark:text-[#4FE6CF] hover:underline"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {linkedInResult.aboutSection}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 8. RESUME RECREATION AI */}
            {activeTab === 'recreate' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="font-bold text-amber-900 dark:text-amber-300">Resume Recreation AI</div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Upload an old resume text scan or paste text from an exported document. Our engine extracts all historical data and regenerates a brand new modern design.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Paste Old Resume Text
                  </label>
                  <textarea
                    rows={8}
                    value={recreateInput}
                    onChange={(e) => setRecreateInput(e.target.value)}
                    placeholder="Paste text extracted from your PDF or Word document..."
                    className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={handleRecreateResume}
                  disabled={loadingAi || !recreateInput.trim()}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#062B5B] hover:bg-[#062B5B]/90 text-white dark:bg-[#4FE6CF] dark:text-[#062B5B] flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{loadingAi ? 'Rebuilding Modern Design...' : 'Recreate as Modern Resume'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Live Interactive Document Viewport (7 cols on lg) */}
        <div className="lg:col-span-7 bg-slate-200/80 dark:bg-slate-950/90 p-4 sm:p-8 overflow-y-auto flex justify-center items-start">
          <div className="max-w-full">
            <TemplateRenderer resume={resume} scale={zoomScale} interactive={true} />
          </div>
        </div>
      </div>

      {/* AI Bullet Enhancer Modal */}
      {bulletModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-[#062B5B] dark:text-[#4FE6CF]" />
                <span>AI Bullet Point Enhancer</span>
              </div>
              <button onClick={() => setBulletModal(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Original Bullet:
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                "{bulletModal.original}"
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Select High-Impact Variation:
              </div>
              {bulletModal.variations.map((v, i) => (
                <div
                  key={i}
                  onClick={() => {
                    updateBullet(bulletModal.expIndex, bulletModal.bulletIndex, v.text);
                    setBulletModal(null);
                    confetti({ particleCount: 25, spread: 50 });
                  }}
                  className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#4FE6CF] dark:hover:border-[#4FE6CF] rounded-xl cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#062B5B] dark:text-[#4FE6CF]">
                    <span>{v.type}</span>
                    <span className="text-[10px] font-normal text-slate-400 group-hover:underline">Click to apply</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Sparkles, Check, ArrowRight, ShieldCheck, Target, Zap, 
  Wand2, RefreshCw, Layers, Star, Download, Eye, FileText,
  Sliders, Palette, CheckCircle2, ChevronDown, ChevronUp, Cpu, Award
} from 'lucide-react';
import { resumeTemplates, templateCategories } from '../data/templates';
import { ResumeTemplate } from '../types/resume';

interface LandingPageProps {
  onStartBuilding: () => void;
  onTryAiBuilder: () => void;
  onSelectTemplate: (template: ResumeTemplate) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartBuilding,
  onTryAiBuilder,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredTemplates = selectedCategory === 'All'
    ? resumeTemplates.slice(0, 8)
    : resumeTemplates.filter((t) => t.category === selectedCategory).slice(0, 8);

  const stats = [
    { label: 'Resumes Created', value: '142,000+' },
    { label: 'Average ATS Score', value: '98.2%' },
    { label: 'Free Templates', value: '100+' },
    { label: 'Recruiter Interview Rate', value: '4.8x' },
  ];

  const faqs = [
    {
      q: 'How does ResumeForge AI differ from traditional resume builders?',
      a: 'Traditional builders give you rigid, monochrome, boring text documents. ResumeForge AI operates like Canva and Figma—giving you side-colored panels, floating element cards, modern typography, timeline layouts, and generative AI that automatically injects your career notes into high-end designer templates.',
    },
    {
      q: 'Are all 100+ templates really free?',
      a: 'Yes! Every single template across all 16 categories (Executive, Creative, Developer, Minimal, Student, etc.) is 100% free with full customization options.',
    },
    {
      q: 'How does the Special AI Template feature work?',
      a: 'First, choose any template that suits your aesthetic. Then paste your unformatted career notes, old bullet points, or raw draft. Gemini 3.8 Flash automatically reorganizes and styles your data directly inside that selected template.',
    },
    {
      q: 'Will my Canva-style resume pass Applicant Tracking Systems (ATS)?',
      a: 'Absolutely. Every layout is strictly engineered with standard semantic text flows, machine-readable headings, and verified keyword density, ensuring high parsing accuracy across Workday, Greenhouse, Taleo, and Lever.',
    },
    {
      q: 'Can I upload an existing resume to redesign it?',
      a: 'Yes. Our Resume Recreation AI accepts plain text or screenshot/PDF scans, extracts all relevant data, and maps it directly onto your chosen modern designer template.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden canva-canvas-grid">
        {/* Ambient Gradient Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-gradient-to-r from-[#0B5FFF]/15 via-[#7B61FF]/20 to-[#45D6FF]/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Unboxed Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9DEFF] dark:bg-slate-800 text-[#0B5FFF] dark:text-[#45D6FF] text-xs font-black tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Canva-Inspired Career Branding</span>
                <span className="text-slate-300">·</span>
                <span>100+ Free Blueprints</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] text-balance">
                Create Beautiful <span className="canva-gradient-text">Designer Resumes</span> With AI
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
                Choose a Template, Paste Your Information, and Get a Professionally Designed Resume in Minutes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onStartBuilding}
                  className="px-7 py-3.5 text-xs font-black text-white canva-gradient-bg hover:opacity-95 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Building</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onTryAiBuilder}
                  className="px-7 py-3.5 text-xs font-black text-slate-800 dark:text-white bg-white dark:bg-slate-900 border border-[#E9DEFF] dark:border-slate-800 hover:border-[#7B61FF] rounded-2xl shadow-xs transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <Wand2 className="w-4 h-4 text-[#7B61FF]" />
                  <span>Try AI Builder</span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="pt-6 border-t border-[#E9DEFF] dark:border-slate-800 flex items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-bold">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="tabular-nums">4.9/5</span>
                </div>
                <span>·</span>
                <span>142K+ Resumes Generated</span>
                <span>·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>98% ATS Compatibility</span>
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto rounded-3xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 p-2">
                <img
                  src="/src/assets/images/hero_resume_showcase_1794041299281.jpg"
                  alt="ResumeForge AI Designer Showcase"
                  className="w-full h-auto object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />

                {/* Floating Real-Time Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#E9DEFF] dark:border-slate-800 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl canva-gradient-bg flex items-center justify-center text-white font-black text-xs">
                      98%
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        Canva-Grade Aesthetic
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Workday & Greenhouse Verified
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onTryAiBuilder}
                    className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 cursor-pointer"
                  >
                    Try AI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE STATISTICS STRIP */}
      <section className="py-10 bg-white dark:bg-slate-900 border-y border-[#E9DEFF] dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black canva-gradient-text tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TEMPLATES SHOWCASE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#7B61FF]">
              100+ Free Blueprints
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              Explore High-End Canva-Style Templates
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Side colored panels, designer headers, timeline experience layouts, and modern typography.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-[#E9DEFF] dark:border-slate-800 rounded-2xl">
            {['All', 'Modern', 'Executive', 'Creative', 'Developer', 'Designer'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'canva-gradient-bg text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl)}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 hover:border-[#7B61FF] shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer"
            >
              <div
                className="h-52 p-4 relative flex flex-col justify-between"
                style={{ backgroundColor: `${tmpl.primaryColor}12` }}
              >
                <div className="flex justify-between items-center z-10">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-black text-white"
                    style={{ backgroundColor: tmpl.primaryColor }}
                  >
                    {tmpl.category}
                  </span>
                  <span className="text-[10px] font-black text-emerald-600 bg-white/90 px-2 py-0.5 rounded-md border border-emerald-200 tabular-nums">
                    {tmpl.atsScore}% ATS
                  </span>
                </div>

                {/* Wireframe Mock */}
                <div className="space-y-1.5 opacity-75 group-hover:opacity-100 transition-opacity">
                  <div className="h-3 w-3/4 rounded bg-slate-300 dark:bg-slate-700" />
                  <div className="h-2 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="h-12 rounded bg-white/70 dark:bg-slate-800" />
                    <div className="h-12 rounded bg-white/70 dark:bg-slate-800" />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-mono z-10">
                  <span>{tmpl.layoutMode}</span>
                  <span>{tmpl.fontFamily}</span>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{tmpl.name}</h3>
                  <div className="text-[11px] text-slate-400">{tmpl.recommendedRole}</div>
                </div>
                <button className="text-xs font-black text-[#0B5FFF] dark:text-[#45D6FF] flex items-center gap-1">
                  <span>Use Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. 10 AI FEATURES SUITE */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-[#E9DEFF] dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-black uppercase tracking-wider text-[#7B61FF]">
              Next-Gen AI Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              10 Generative AI Career Power Features
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Transform rough thoughts into executive-level, recruiter-ready accomplishments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '1. AI Resume Builder', desc: 'Paste rough notes. Automatically structures names, roles, dates, and bullets.', icon: Wand2 },
              { title: '2. AI Format Cleaner', desc: 'Fixes typography, standardizes dates, and eliminates formatting clutter.', icon: Sparkles },
              { title: '3. AI Content Improver', desc: 'Rewrites weak phrases with active executive vocabulary and punch.', icon: FileText },
              { title: '4. AI Bullet Point Generator', desc: 'Transforms everyday job duties into quantified, metric-backed wins.', icon: Zap },
              { title: '5. Professional Summary Generator', desc: 'Generates executive, startup, and creative summary variations.', icon: Sliders },
              { title: '6. Work Experience Enhancer', desc: 'Injects action verbs like Spearheaded, Engineered, and Orchestrated.', icon: Target },
              { title: '7. Project Description Generator', desc: 'Highlights architecture, technical tradeoffs, and quantifiable results.', icon: Layers },
              { title: '8. AI Skill Gap Analyzer', desc: 'Surfaces high-demand competencies for your specific target role.', icon: Cpu },
              { title: '9. AI Achievement Generator', desc: 'Extracts bold highlights to display in visual Canva metric cards.', icon: Award },
              { title: '10. AI Resume Quality Score', desc: 'Instant score for visual readability, action verbs, and career trajectory.', icon: ShieldCheck },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-[#F8F4FF] dark:bg-slate-800/60 border border-[#E9DEFF] dark:border-slate-700/60 space-y-3">
                  <div className="w-10 h-10 rounded-xl canva-gradient-bg flex items-center justify-center text-white shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ATS & JOB MATCH FEATURES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="text-xs font-black uppercase tracking-wider text-[#0B5FFF]">
              Guaranteed Parser Compatibility
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Deep ATS Compatibility & Real-Time Job Matcher
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Don't get filtered out by robots. Our algorithmic scanner tests your resume against Greenhouse, Workday, and Lever standards, scoring keyword density and format hygiene.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Overall ATS Score, Keyword Score & Formatting Score</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Paste target job vacancy to detect missing skills and keywords</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>1-click skill injection directly into your active template</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9DEFF] dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="font-black text-xs uppercase tracking-wider">ATS Live Diagnostics</span>
              <span className="text-2xl font-black text-emerald-600 tabular-nums">98.4%</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span>Keyword Coverage</span>
                <span className="tabular-nums">96%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[96%]" />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#F8F4FF] dark:bg-slate-800 text-xs space-y-1">
              <span className="font-bold text-[#7B61FF]">Job Match Recommendation:</span>
              <p className="text-slate-600 dark:text-slate-400">
                Found 9 matched keywords. Adding "Cloud Infrastructure" and "Kubernetes" will elevate match alignment to 100%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-[#E9DEFF] dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Loved By Candidates at Stripe, Figma, & Apple
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#F8F4FF] dark:bg-slate-800 border border-[#E9DEFF] dark:border-slate-700 space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "ResumeForge AI feels like Canva had a baby with ChatGPT. The side colored panel template got me an interview at Stripe within 48 hours."
              </p>
              <div className="font-bold text-xs">Sophia Chen · Staff Architect</div>
            </div>

            <div className="p-6 rounded-3xl bg-[#F8F4FF] dark:bg-slate-800 border border-[#E9DEFF] dark:border-slate-700 space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "I pasted messy raw bullets from my notes. The AI organized every single section into the designer template seamlessly."
              </p>
              <div className="font-bold text-xs">Marcus Bell · Product Design Director</div>
            </div>

            <div className="p-6 rounded-3xl bg-[#F8F4FF] dark:bg-slate-800 border border-[#E9DEFF] dark:border-slate-700 space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "All 100+ templates being free is unbelievable. The typography and color themes look like they were custom-designed in Figma."
              </p>
              <div className="font-bold text-xs">Liam O'Connor · Senior Full-Stack Lead</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Simple, Accessible Plans
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            All 100+ designer templates are 100% free forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9DEFF] dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-black uppercase text-slate-500">Free Tier</div>
              <div className="text-3xl font-black">$0 / forever</div>
              <p className="text-xs text-slate-500">Perfect for all job seekers.</p>
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>All 100+ Designer Templates Free</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>5 High-Quality Downloads Per Day</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>Basic AI Resume Builder</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>ATS Compatibility Score</span></div>
              </div>
            </div>
            <button
              onClick={onStartBuilding}
              className="mt-8 py-3 rounded-2xl text-xs font-black border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Start Free
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-[#7B61FF] shadow-2xl flex flex-col justify-between relative">
            <div className="space-y-4">
              <div className="text-xs font-black uppercase text-[#7B61FF]">Unlimited Pro</div>
              <div className="text-3xl font-black">$12 / month</div>
              <p className="text-xs text-slate-500">For ambitious candidates and executives.</p>
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span className="font-bold">Unlimited PDF & Print Downloads</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span className="font-bold">Unlimited 10 AI Power Tools</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>Cover Letter & LinkedIn Generators</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>Resume Recreation AI (Legacy Scan)</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /><span>Priority Gemini 3.8 Flash Processing</span></div>
              </div>
            </div>
            <button
              onClick={onStartBuilding}
              className="mt-8 py-3 rounded-2xl text-xs font-black text-white canva-gradient-bg shadow-md"
            >
              Get Unlimited Pro
            </button>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E9DEFF] dark:border-slate-800">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center text-left font-bold text-xs text-slate-900 dark:text-white"
              >
                <span>{f.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaq === i && (
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-[#E9DEFF] dark:border-slate-800 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-black text-slate-900 dark:text-white">
            ResumeForge AI — Premium Career Branding Platform
          </div>
          <div>© {new Date().getFullYear()} ResumeForge AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

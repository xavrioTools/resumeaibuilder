import React, { useState, useRef } from 'react';
import { 
  Sparkles, Wand2, Edit3, ArrowRight, ArrowLeft, Search, 
  Upload, Check, Eye, Layers, FileText, CheckCircle2, 
  FileUp, Image as ImageIcon, FileCode, AlertCircle, Camera, User
} from 'lucide-react';
import { ResumeData, ResumeTemplate, TemplateCategory } from '../types/resume';
import { resumeTemplates, templateCategories } from '../data/templates';
import { TemplateRenderer } from './TemplateRenderer';
import confetti from 'canvas-confetti';

interface ResumeCreationFlowProps {
  currentResume: ResumeData;
  setResume: React.Dispatch<React.SetStateAction<ResumeData>>;
  onComplete: () => void;
}

export const ResumeCreationFlow: React.FC<ResumeCreationFlowProps> = ({
  currentResume,
  setResume,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [creationMethod, setCreationMethod] = useState<'ai' | 'manual'>('ai');
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(resumeTemplates[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile photo file input reference
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);

  // Custom Uploaded Template State
  const [uploadedTemplate, setUploadedTemplate] = useState<{
    file: File;
    previewUrl?: string;
    isPdf: boolean;
    analyzing: boolean;
    templateData?: ResumeTemplate;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template preview modal
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);

  const filteredTemplates = resumeTemplates.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.recommendedRole.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Apply template settings
  const applyTemplate = (t: ResumeTemplate) => {
    setSelectedTemplate(t);
    setResume((prev) => ({
      ...prev,
      templateId: t.id,
      primaryColor: t.primaryColor,
      accentColor: t.accentColor,
      layoutMode: t.layoutMode,
      fontFamily: t.fontFamily,
      photoShape: t.photoShape,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Handle Upload of Image or PDF Template
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      alert('Please upload a valid PDF or Image file (.png, .jpg, .jpeg, .webp, .pdf).');
      return;
    }

    setUploadedTemplate({
      file,
      isPdf,
      analyzing: true,
    });

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result as string;

      if (isImage) {
        setUploadedTemplate((prev) => prev ? { ...prev, previewUrl: base64Data } : null);
      }

      try {
        // Call AI backend to analyze the visual structure & color palette
        const res = await fetch('/api/ai/analyze-template', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: isImage ? base64Data : undefined,
            mimeType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
            fileName: file.name,
          }),
        });

        const json = await res.json();
        const analyzed = json.template || {};

        const customTmpl: ResumeTemplate = {
          id: `custom-uploaded-${Date.now()}`,
          name: analyzed.name || `Custom: ${file.name.replace(/\.[^/.]+$/, '')}`,
          category: 'Creative',
          atsScore: 98,
          description: `Custom blueprint imported from ${file.name}. Configured with Canva luxury design parity.`,
          recommendedRole: 'Imported Career Blueprint',
          primaryColor: analyzed.primaryColor || '#0B5FFF',
          accentColor: analyzed.accentColor || '#45D6FF',
          layoutMode: analyzed.layoutMode || 'side-panel',
          fontFamily: analyzed.fontFamily || 'outfit',
          photoShape: analyzed.photoShape || 'floating',
          isPopular: true,
        };

        setUploadedTemplate((prev) => prev ? {
          ...prev,
          analyzing: false,
          templateData: customTmpl,
        } : null);

        applyTemplate(customTmpl);
        confetti({ particleCount: 40, spread: 60 });
      } catch (err) {
        console.error(err);
        const fallbackTmpl: ResumeTemplate = {
          id: `custom-uploaded-${Date.now()}`,
          name: `Custom: ${file.name.replace(/\.[^/.]+$/, '')}`,
          category: 'Creative',
          atsScore: 98,
          description: `Custom blueprint imported from ${file.name}.`,
          recommendedRole: 'Imported Design',
          primaryColor: '#0B5FFF',
          accentColor: '#45D6FF',
          layoutMode: 'side-panel',
          fontFamily: 'outfit',
          photoShape: 'floating',
        };

        setUploadedTemplate((prev) => prev ? {
          ...prev,
          analyzing: false,
          templateData: fallbackTmpl,
        } : null);

        applyTemplate(fallbackTmpl);
      }
    };

    reader.readAsDataURL(file);
  };

  // Profile photo upload handler
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (.png, .jpg, .jpeg, .webp).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setResume((prev) => ({
        ...prev,
        personal: { ...prev.personal, photoUrl: base64Data },
      }));
      confetti({ particleCount: 30, spread: 50 });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    setResume((prev) => ({
      ...prev,
      personal: { ...prev.personal, photoUrl: '' },
    }));
  };

  // Step 3 Handler: Generate via AI or Jump to Manual Editor
  const handleFinalize = async () => {
    if (creationMethod === 'manual') {
      applyTemplate(selectedTemplate);
      onComplete();
      return;
    }

    if (!rawText.trim()) {
      setErrorMsg('Please paste your career notes or information into the box.');
      return;
    }

    setLoadingAi(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          targetTemplateId: selectedTemplate.id,
        }),
      });

      if (!res.ok) throw new Error('AI structuring failed');

      const json = await res.json();
      if (json.data) {
        setResume((prev) => ({
          ...prev,
          templateId: selectedTemplate.id,
          primaryColor: selectedTemplate.primaryColor,
          accentColor: selectedTemplate.accentColor,
          layoutMode: selectedTemplate.layoutMode,
          fontFamily: selectedTemplate.fontFamily,
          photoShape: selectedTemplate.photoShape,
          updatedAt: new Date().toISOString(),
          personal: {
            ...prev.personal,
            ...(json.data.personal || {}),
            photoUrl: prev.personal.photoUrl,
          },
          experiences: json.data.experiences?.length ? json.data.experiences : prev.experiences,
          educations: json.data.educations?.length ? json.data.educations : prev.educations,
          skills: json.data.skills?.length ? json.data.skills : prev.skills,
          projects: json.data.projects?.length ? json.data.projects : prev.projects,
          certifications: json.data.certifications?.length ? json.data.certifications : prev.certifications,
          languages: json.data.languages?.length ? json.data.languages : prev.languages,
          awards: json.data.awards?.length ? json.data.awards : prev.awards,
        }));
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
        onComplete();
      }
    } catch (err: any) {
      setErrorMsg('Failed to process AI parsing. You can continue to the editor and customize manually.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0FF] dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Step Progress Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#E9DEFF] dark:border-slate-800 p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#7B61FF]">
              Creation Flow
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {step === 1 && 'Step 1: Choose Creation Mode'}
              {step === 2 && 'Step 2: Pick or Upload Designer Template'}
              {step === 3 && 'Step 3: Inject Information & Style'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s
                    ? 'canva-gradient-bg text-white shadow-xs'
                    : step > s
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* ================= STEP 1: CHOOSE METHOD ================= */}
        {step === 1 && (
          <div className="space-y-8 max-w-4xl mx-auto py-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                How Would You Like To Build Your Resume?
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Select your preferred workflow. You can switch between AI tools and fine-grained manual controls anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: AI Resume Builder (Recommended) */}
              <div
                onClick={() => setCreationMethod('ai')}
                className={`p-8 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  creationMethod === 'ai'
                    ? 'border-[#7B61FF] bg-white dark:bg-slate-900 shadow-xl scale-[1.02]'
                    : 'border-[#E9DEFF] dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-[#7B61FF]/60'
                }`}
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl canva-gradient-bg flex items-center justify-center text-white shadow-md">
                    <Wand2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#7B61FF] bg-[#E9DEFF]/60 mb-1">
                      Fastest & Recommended
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      AI Resume Builder
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      Choose any template or upload your own design, then paste your messy notes. Gemini AI extracts, formats, and transforms your career notes into an executive designer resume in seconds.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E9DEFF] dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#7B61FF]">
                  <span>100% Free · Auto-Bullet Generator</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${creationMethod === 'ai' ? 'border-[#7B61FF] bg-[#7B61FF] text-white' : 'border-slate-300'}`}>
                    {creationMethod === 'ai' && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>

              {/* Option 2: Manual Builder */}
              <div
                onClick={() => setCreationMethod('manual')}
                className={`p-8 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  creationMethod === 'manual'
                    ? 'border-[#0B5FFF] bg-white dark:bg-slate-900 shadow-xl scale-[1.02]'
                    : 'border-[#E9DEFF] dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-[#0B5FFF]/60'
                }`}
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white shadow-md">
                    <Edit3 className="w-7 h-7 text-[#45D6FF]" />
                  </div>
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-100 dark:bg-slate-800 mb-1">
                      Complete Hands-On Control
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      Manual Designer Builder
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      Hand-craft every single section, bullet point, typography scale, spacing margin, and color swatch with our live Canva-inspired interactive studio.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E9DEFF] dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Custom Sections · Reorder & Resize</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${creationMethod === 'manual' ? 'border-[#0B5FFF] bg-[#0B5FFF] text-white' : 'border-slate-300'}`}>
                    {creationMethod === 'manual' && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3.5 text-xs font-extrabold text-white canva-gradient-bg hover:opacity-95 rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Template Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CHOOSE OR UPLOAD TEMPLATE ================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Choose or Upload Your Designer Template
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Pick from 100+ free designer blueprints, OR upload your own template design (PDF or Image).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2 text-xs font-extrabold text-white canva-gradient-bg rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue With Selected ({selectedTemplate.name})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 🔥 EXTRA FEATURE: UPLOAD YOUR OWN TEMPLATE DESIGN (PDF & IMAGE ACCEPTED) */}
            <div className="bg-gradient-to-r from-[#0B5FFF]/10 via-[#7B61FF]/15 to-[#45D6FF]/10 rounded-3xl p-6 border-2 border-dashed border-[#7B61FF]/60 hover:border-[#7B61FF] transition-all bg-white dark:bg-slate-900">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl canva-gradient-bg text-white flex items-center justify-center shrink-0 shadow-md">
                    <FileUp className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white dark:bg-slate-800 text-[#7B61FF] border border-[#E9DEFF] mb-1">
                      <Sparkles className="w-3 h-3 text-[#7B61FF]" />
                      <span>Special Template Import Feature</span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Upload Your Own Template Design
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 max-w-xl">
                      Have a resume layout you love? Upload your <strong>Image (.png, .jpg)</strong> or <strong>PDF file</strong>. Our AI analyzes the visual architecture and adapts it directly into your editable resume.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-white canva-gradient-bg hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Template File (PDF / Image)</span>
                  </button>
                </div>
              </div>

              {/* Uploaded File Feedback Banner */}
              {uploadedTemplate && (
                <div className="mt-4 pt-4 border-t border-[#E9DEFF] dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {uploadedTemplate.previewUrl ? (
                      <img
                        src={uploadedTemplate.previewUrl}
                        alt="Uploaded template"
                        className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {uploadedTemplate.file.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                          {uploadedTemplate.analyzing ? 'AI Analyzing...' : 'Ready & Active'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {uploadedTemplate.analyzing
                          ? 'Extracting layout mode, color palette, and font pairing with Gemini...'
                          : 'Custom template generated! Click Continue to inject your career details into this design.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B5FFF] text-white hover:bg-[#0B5FFF]/90 flex items-center gap-1.5 shrink-0"
                  >
                    <span>Continue to Step 3</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E9DEFF] dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Or search 100+ free blueprints by role (e.g. Developer, Designer, Executive)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="text-xs font-bold text-slate-500">
                Selected: <span className="text-[#0B5FFF] dark:text-[#45D6FF]">{selectedTemplate.name}</span>
              </div>
            </div>

            {/* Category Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === 'All'
                    ? 'canva-gradient-bg text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-[#E9DEFF] dark:border-slate-800'
                }`}
              >
                All (112)
              </button>
              {templateCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? 'canva-gradient-bg text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-[#E9DEFF] dark:border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Templates Grid (Shows uploaded custom template first if present) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {uploadedTemplate?.templateData && (
                <div
                  onClick={() => applyTemplate(uploadedTemplate.templateData!)}
                  className="rounded-2xl border-2 border-[#7B61FF] shadow-xl scale-[1.02] overflow-hidden flex flex-col justify-between cursor-pointer bg-white dark:bg-slate-900"
                >
                  <div className="h-44 p-4 relative flex flex-col justify-between bg-gradient-to-br from-[#7B61FF]/20 to-[#45D6FF]/20">
                    <div className="flex justify-between items-center z-10">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black text-white canva-gradient-bg">
                        Your Upload
                      </span>
                      <span className="text-[10px] font-black text-emerald-600 bg-white/90 px-2 py-0.5 rounded-md border border-emerald-200">
                        98% ATS
                      </span>
                    </div>

                    <div className="flex items-center justify-center">
                      {uploadedTemplate.previewUrl ? (
                        <img
                          src={uploadedTemplate.previewUrl}
                          alt="Custom template preview"
                          className="h-24 w-auto object-cover rounded-lg shadow-sm border border-white"
                        />
                      ) : (
                        <div className="p-4 rounded-xl bg-white/90 text-slate-800 font-bold text-xs flex items-center gap-2">
                          <FileText className="w-5 h-5 text-red-500" />
                          <span>PDF Template File</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500 font-mono z-10">
                      <span>{uploadedTemplate.templateData.layoutMode}</span>
                      <span>Custom Design</span>
                    </div>
                  </div>

                  <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        {uploadedTemplate.templateData.name}
                      </h4>
                      <div className="text-[10px] text-slate-400">Custom Uploaded Blueprint</div>
                    </div>
                    <button className="px-3 py-1 text-[11px] font-bold rounded-lg canva-gradient-bg text-white">
                      Selected
                    </button>
                  </div>
                </div>
              )}

              {filteredTemplates.slice(0, 16).map((tmpl) => {
                const isSelected = selectedTemplate.id === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => applyTemplate(tmpl)}
                    className={`rounded-2xl border-2 transition-all overflow-hidden flex flex-col justify-between cursor-pointer bg-white dark:bg-slate-900 ${
                      isSelected
                        ? 'border-[#7B61FF] shadow-xl scale-[1.02]'
                        : 'border-[#E9DEFF] dark:border-slate-800 hover:border-[#7B61FF]/60'
                    }`}
                  >
                    {/* Visual Card Header */}
                    <div
                      className="h-44 p-4 relative flex flex-col justify-between"
                      style={{ backgroundColor: `${tmpl.primaryColor}12` }}
                    >
                      <div className="flex justify-between items-center z-10">
                        <span 
                          className="px-2 py-0.5 rounded-md text-[10px] font-black text-white"
                          style={{ backgroundColor: tmpl.primaryColor }}
                        >
                          {tmpl.category}
                        </span>
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-emerald-200">
                          {tmpl.atsScore}% ATS
                        </span>
                      </div>

                      {/* Mockup elements */}
                      <div className="space-y-1.5 opacity-80">
                        <div className="h-3 w-3/4 rounded bg-slate-300 dark:bg-slate-700" />
                        <div className="h-2 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div className="h-10 rounded bg-white/70 dark:bg-slate-800/60" />
                          <div className="h-10 rounded bg-white/70 dark:bg-slate-800/60" />
                        </div>
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-500 font-mono z-10">
                        <span>{tmpl.layoutMode}</span>
                        <span>{tmpl.fontFamily}</span>
                      </div>
                    </div>

                    {/* Card Info & Selection */}
                    <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{tmpl.name}</h4>
                        <div className="text-[10px] text-slate-400">{tmpl.recommendedRole}</div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          applyTemplate(tmpl);
                          setStep(3);
                        }}
                        className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                          isSelected
                            ? 'canva-gradient-bg text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#7B61FF] hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Use'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 3: BUILD / INJECT ================= */}
        {step === 3 && (
          <div className="space-y-6 max-w-4xl mx-auto py-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#7B61FF] uppercase tracking-wider">
                  Selected Template: {selectedTemplate.name}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                  {creationMethod === 'ai' ? 'Paste Information For AI Generation' : 'Start Manual Builder'}
                </h1>
              </div>

              <button
                onClick={() => setStep(2)}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Template</span>
              </button>
            </div>

            {/* Profile Photo Uploader Card for Owner's Picture */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative group shrink-0">
                  {currentResume.personal.photoUrl ? (
                    <img
                      src={currentResume.personal.photoUrl}
                      alt="Your profile"
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-[#7B61FF] shadow-sm bg-white"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/60">
                      <User className="w-6 h-6" />
                      <span className="text-[8px] font-bold">No Photo</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => profilePhotoInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    title="Upload custom portrait"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      Profile Picture (Resume Front Photo)
                    </h4>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded font-bold">
                      {currentResume.personal.photoUrl ? 'Active' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Replace the demo picture with your own personal photo across all templates.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => profilePhotoInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white canva-gradient-bg hover:opacity-95 shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{currentResume.personal.photoUrl ? 'Replace Photo' : 'Upload Your Photo'}</span>
                </button>
                {currentResume.personal.photoUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Hidden file input for photo upload */}
            <input
              type="file"
              ref={profilePhotoInputRef}
              accept="image/*"
              onChange={handleProfilePhotoUpload}
              className="hidden"
            />

            {creationMethod === 'ai' ? (
              <div className="space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0B5FFF] dark:text-[#45D6FF]">
                    <Sparkles className="w-4 h-4" />
                    <span>Special AI Template Injection</span>
                  </div>
                  <button
                    onClick={() =>
                      setRawText(
                        `John Doe\nSenior Backend & Cloud Engineer\njohn.doe@email.com | (555) 345-6789 | San Francisco, CA\n\nExperience:\nLead Engineer at FinTech Labs (2021 - Present)\n- Scaled microservices to 10M transactions per day\n- Cut AWS infrastructure costs by 34%\n- Mentored team of 8 backend engineers\n\nSoftware Engineer at StartupIO (2018 - 2021)\n- Built real-time WebSocket messaging layer\n- Implemented Redis caching saving 40ms per query\n\nEducation:\nBS Computer Science, UC Berkeley (2014 - 2018)\n\nSkills:\nPython, Django, PostgreSQL, Go, Docker, Kubernetes, AWS, Redis, GraphQL`
                      )
                    }
                    className="text-xs text-[#7B61FF] font-bold hover:underline"
                  >
                    Insert Sample Notes
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Paste your raw notes, bullets, or resume fragments. AI will automatically parse and inject all content directly into the <strong>{selectedTemplate.name}</strong> layout!
                </p>

                <textarea
                  rows={10}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your raw notes here..."
                  className="w-full p-4 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-[#7B61FF]"
                />

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">
                    {errorMsg}
                  </div>
                )}

                <button
                  onClick={handleFinalize}
                  disabled={loadingAi}
                  className="w-full py-3.5 text-xs font-black text-white canva-gradient-bg hover:opacity-95 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{loadingAi ? 'AI Injecting Content Into Template...' : 'Generate Designer Resume Now'}</span>
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E9DEFF] text-[#7B61FF] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Template Configured: {selectedTemplate.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Your template layout, typography, and color palette have been activated. Proceed to the live canvas editor to add or refine sections.
                </p>
                <button
                  onClick={handleFinalize}
                  className="px-8 py-3 text-xs font-black text-white canva-gradient-bg rounded-2xl shadow-md cursor-pointer"
                >
                  Open Live Canvas Editor
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

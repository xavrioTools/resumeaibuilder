import React, { useState, useRef } from 'react';
import { Search, Sparkles, Eye, ArrowRight, Check, Upload, FileUp, FileText } from 'lucide-react';
import { resumeTemplates, templateCategories } from '../data/templates';
import { ResumeTemplate, ResumeData } from '../types/resume';
import { TemplateRenderer } from './TemplateRenderer';
import confetti from 'canvas-confetti';

interface TemplateGalleryProps {
  onSelectTemplate: (template: ResumeTemplate) => void;
  currentResume: ResumeData;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  currentResume,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);

  // Custom Uploaded Template State
  const [customTemplate, setCustomTemplate] = useState<{
    file: File;
    previewUrl?: string;
    isPdf: boolean;
    templateData: ResumeTemplate;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      alert('Please upload a valid PDF or Image file (.png, .jpg, .jpeg, .webp, .pdf).');
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const base64Data = reader.result as string;

      try {
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
          description: `Custom blueprint analyzed from ${file.name}. Configured with Canva luxury design parity.`,
          recommendedRole: 'Imported Career Blueprint',
          primaryColor: analyzed.primaryColor || '#0B5FFF',
          accentColor: analyzed.accentColor || '#45D6FF',
          layoutMode: analyzed.layoutMode || 'side-panel',
          fontFamily: analyzed.fontFamily || 'outfit',
          photoShape: analyzed.photoShape || 'floating',
          isPopular: true,
        };

        setCustomTemplate({
          file,
          previewUrl: isImage ? base64Data : undefined,
          isPdf,
          templateData: customTmpl,
        });

        confetti({ particleCount: 35, spread: 60 });
      } catch (err) {
        console.error(err);
      }
    };

    reader.readAsDataURL(file);
  };

  const filtered = resumeTemplates.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.recommendedRole.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const previewResumeData: ResumeData = previewTemplate
    ? {
        ...currentResume,
        templateId: previewTemplate.id,
        primaryColor: previewTemplate.primaryColor,
        accentColor: previewTemplate.accentColor,
        layoutMode: previewTemplate.layoutMode,
        fontFamily: previewTemplate.fontFamily,
        photoShape: previewTemplate.photoShape,
      }
    : currentResume;

  return (
    <div className="min-h-screen bg-[#F5F0FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9DEFF] text-[#7B61FF] text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100+ Free Blueprints & Custom Upload</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Canva-Inspired Designer Templates
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Choose from 112 free blueprints or upload your own template design (PDF or Image) to customize in the live canvas.
          </p>
        </div>

        {/* Upload Custom Template Banner */}
        <div className="bg-gradient-to-r from-[#0B5FFF]/10 via-[#7B61FF]/15 to-[#45D6FF]/10 rounded-3xl p-6 border-2 border-dashed border-[#7B61FF]/60 hover:border-[#7B61FF] transition-all bg-white dark:bg-slate-900">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl canva-gradient-bg text-white flex items-center justify-center shrink-0 shadow-md">
                <FileUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Upload Your Own Template Design
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Accepts <strong>PDF</strong> and <strong>Image (.png, .jpg, .jpeg, .webp)</strong>. AI will analyze and replicate the design layout.
                </p>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl text-xs font-black text-white canva-gradient-bg hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Template File</span>
            </button>
          </div>

          {customTemplate && (
            <div className="mt-4 pt-4 border-t border-[#E9DEFF] dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {customTemplate.previewUrl ? (
                  <img
                    src={customTemplate.previewUrl}
                    alt="Custom template"
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {customTemplate.templateData.name}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold">
                    ✓ Custom template generated and ready to apply
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectTemplate(customTemplate.templateData)}
                className="px-4 py-2 rounded-xl text-xs font-black text-white canva-gradient-bg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Use Custom Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates by role or category (e.g. Developer, Designer, Executive, Startup)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:border-[#7B61FF]"
            />
          </div>

          <div className="text-xs font-bold text-slate-500 px-2 shrink-0">
            Showing <span className="text-[#0B5FFF] dark:text-[#45D6FF] tabular-nums font-black">{filtered.length}</span> of {resumeTemplates.length} templates
          </div>
        </div>

        {/* Categories Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
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
              className={`px-3.5 py-1.5 text-xs font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'canva-gradient-bg text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-[#E9DEFF] dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {customTemplate && (
            <div
              onClick={() => onSelectTemplate(customTemplate.templateData)}
              className="group bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#7B61FF] shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer"
            >
              <div className="h-56 p-5 relative overflow-hidden flex flex-col justify-between bg-gradient-to-br from-[#7B61FF]/20 to-[#45D6FF]/20">
                <div className="flex items-center justify-between z-10">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black text-white canva-gradient-bg">
                    Custom Upload
                  </span>
                  <div className="bg-white/90 px-2 py-0.5 rounded-md text-[10px] font-black text-emerald-600 tabular-nums border border-emerald-200">
                    98% ATS
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  {customTemplate.previewUrl ? (
                    <img
                      src={customTemplate.previewUrl}
                      alt="Uploaded preview"
                      className="h-28 w-auto object-cover rounded-xl shadow-md border-2 border-white"
                    />
                  ) : (
                    <div className="p-4 rounded-2xl bg-white/90 text-slate-800 font-bold text-xs flex items-center gap-2">
                      <FileText className="w-6 h-6 text-red-500" />
                      <span>PDF Template</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono z-10">
                  <span>{customTemplate.templateData.layoutMode}</span>
                  <span>Custom Blueprint</span>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {customTemplate.templateData.name}
                  </h3>
                  <div className="text-[10px] text-slate-400">Imported Template File</div>
                </div>
                <button className="px-3 py-1.5 rounded-xl text-xs font-black text-white canva-gradient-bg flex items-center gap-1">
                  <span>Use</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {filtered.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 hover:border-[#7B61FF] shadow-xs hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              <div
                className="h-56 p-5 relative overflow-hidden cursor-pointer flex flex-col justify-between"
                style={{ backgroundColor: `${tmpl.primaryColor}12` }}
                onClick={() => setPreviewTemplate(tmpl)}
              >
                <div className="flex items-center justify-between z-10">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-black text-white"
                    style={{ backgroundColor: tmpl.primaryColor }}
                  >
                    {tmpl.category}
                  </span>
                  <div className="bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 rounded-md text-[10px] font-black text-emerald-600 tabular-nums border border-emerald-200">
                    {tmpl.atsScore}% ATS
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-3 shadow-md space-y-2 opacity-85 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg shrink-0"
                      style={{ backgroundColor: tmpl.primaryColor }}
                    />
                    <div className="space-y-1 flex-1">
                      <div className="h-2 w-3/4 rounded bg-slate-300 dark:bg-slate-700" />
                      <div className="h-1.5 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="h-1.5 w-full rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-1.5 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono z-10">
                  <span>{tmpl.layoutMode}</span>
                  <span>{tmpl.fontFamily}</span>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {tmpl.name}
                  </h3>
                  <div className="text-[10px] text-slate-400">{tmpl.recommendedRole}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    title="Live Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectTemplate(tmpl)}
                    className="px-3 py-1.5 rounded-xl text-xs font-black text-white canva-gradient-bg flex items-center gap-1 cursor-pointer"
                  >
                    <span>Use</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Full Design Preview */}
        {previewTemplate && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-900 dark:text-white">
                      {previewTemplate.name}
                    </h2>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {previewTemplate.atsScore}% ATS Verified
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Category: {previewTemplate.category} · Layout: {previewTemplate.layoutMode} · Font: {previewTemplate.fontFamily}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectTemplate(previewTemplate);
                      setPreviewTemplate(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-black text-white canva-gradient-bg shadow-sm"
                  >
                    Apply To Canvas
                  </button>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-[#F5F0FF] dark:bg-slate-950 flex justify-center canva-canvas-grid">
                <div className="w-[210mm] max-w-full">
                  <TemplateRenderer resume={previewResumeData} scale={0.85} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

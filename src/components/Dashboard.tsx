import React from 'react';
import { 
  FileText, Download, Star, Clock, Plus, Trash2, 
  Copy, Edit3, ArrowRight, Sparkles, CheckCircle2 
} from 'lucide-react';
import { ResumeData, ResumeTemplate } from '../types/resume';
import { resumeTemplates } from '../data/templates';

interface DashboardProps {
  savedResumes: ResumeData[];
  onOpenResume: (resume: ResumeData) => void;
  onCreateNew: () => void;
  onDuplicateResume: (resume: ResumeData) => void;
  onDeleteResume: (id: string) => void;
  onSelectTemplate: (template: ResumeTemplate) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  savedResumes,
  onOpenResume,
  onCreateNew,
  onDuplicateResume,
  onDeleteResume,
  onSelectTemplate,
}) => {
  const favoriteTemplates = resumeTemplates.slice(0, 4);

  const downloadHistory = [
    {
      id: 'dl-1',
      title: 'Executive Product Architecture & AI Lead',
      format: 'PDF (Vector Print A4)',
      date: '1 hour ago',
      score: '98% ATS',
    },
    {
      id: 'dl-2',
      title: 'Staff Cloud Architect (Canva Modern)',
      format: 'PDF (High-Res)',
      date: 'Yesterday',
      score: '97% ATS',
    },
    {
      id: 'dl-3',
      title: 'Startup Design Lead (Backup)',
      format: 'JSON Document',
      date: '3 days ago',
      score: '96% ATS',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0FF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#7B61FF]">
              Workspace & Cloud Storage
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              ResumeForge Dashboard
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Access your designer resumes, export history, and favorite blueprints.
            </p>
          </div>

          <button
            onClick={onCreateNew}
            className="px-5 py-2.5 rounded-2xl text-xs font-black text-white canva-gradient-bg shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Designer Resume</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 shadow-xs">
            <div className="text-xs font-bold text-slate-500">Resumes Created</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {savedResumes.length}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Free Templates</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 shadow-xs">
            <div className="text-xs font-bold text-slate-500">Average ATS Compatibility</div>
            <div className="text-2xl font-black text-emerald-600 mt-1 tabular-nums">
              98.2%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Tier-1 Workday pass rate</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 shadow-xs">
            <div className="text-xs font-bold text-slate-500">Total PDF Downloads</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              18
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Vector print ready</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 shadow-xs">
            <div className="text-xs font-bold text-slate-500">AI Rewrites & Enhancements</div>
            <div className="text-2xl font-black text-[#7B61FF] mt-1 tabular-nums">
              56
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Gemini 3.8 Flash Engine</div>
          </div>
        </div>

        {/* Saved Resumes */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white">
            Saved Resumes ({savedResumes.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedResumes.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 p-5 shadow-xs hover:border-[#7B61FF] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#E9DEFF] text-[#7B61FF] flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      98% ATS
                    </span>
                  </div>

                  <h3 className="font-black text-sm text-slate-900 dark:text-white mt-3 truncate">
                    {item.title}
                  </h3>
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    {item.personal.jobTitle || 'Career Title'}
                  </div>

                  <div className="text-[11px] text-slate-400 mt-3 flex items-center gap-1 tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Edited {new Date(item.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDuplicateResume(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {savedResumes.length > 1 && (
                      <button
                        onClick={() => onDeleteResume(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenResume(item)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white canva-gradient-bg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Canvas</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Downloads & Recommended Templates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download History</span>
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {downloadHistory.map((d) => (
                <div key={d.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{d.title}</div>
                    <div className="text-[11px] text-slate-400">{d.format} · {d.date}</div>
                  </div>
                  <span className="font-black text-emerald-600 tabular-nums">{d.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E9DEFF] dark:border-slate-800 p-6 space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Favorite Canva Blueprints</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {favoriteTemplates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTemplate(t)}
                  className="p-3 rounded-2xl bg-[#F8F4FF] dark:bg-slate-800 border border-[#E9DEFF] dark:border-slate-700 hover:border-[#7B61FF] cursor-pointer space-y-1"
                >
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500">{t.category}</span>
                    <span className="text-emerald-600 tabular-nums">{t.atsScore}%</span>
                  </div>
                  <div className="font-black text-slate-900 dark:text-white truncate">{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

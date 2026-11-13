import React from 'react';
import { Sparkles, Moon, Sun, Wand2, Layers, LayoutDashboard, Shield, Plus } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'wizard' | 'editor' | 'templates' | 'dashboard' | 'admin';
  setCurrentView: (view: 'landing' | 'wizard' | 'editor' | 'templates' | 'dashboard' | 'admin') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenAiModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  darkMode,
  setDarkMode,
  onOpenAiModal,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#F5F0FF]/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-[#E9DEFF] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 text-left text-slate-900 dark:text-white font-extrabold text-lg tracking-tight whitespace-nowrap shrink-0 group focus-visible:outline-none cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl p-0.5 shadow-md flex items-center justify-center canva-gradient-bg">
            <div className="w-full h-full bg-[#F5F0FF] dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#7B61FF]" />
            </div>
          </div>
          <span className="flex items-center gap-1.5 font-black text-slate-900 dark:text-white tracking-tight">
            ResumeForge
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md text-white canva-gradient-bg shadow-2xs">
              AI
            </span>
          </span>
        </button>

        {/* Zone 2: Navigation Links (Single line, text only, hover underlines) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setCurrentView('landing')}
            className={`hover:text-[#0B5FFF] dark:hover:text-[#45D6FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'landing' ? 'text-[#0B5FFF] dark:text-[#45D6FF] font-bold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentView('templates')}
            className={`hover:text-[#0B5FFF] dark:hover:text-[#45D6FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'templates' ? 'text-[#0B5FFF] dark:text-[#45D6FF] font-bold' : ''
            }`}
          >
            100+ Free Templates
          </button>
          <button
            onClick={() => setCurrentView('wizard')}
            className={`hover:text-[#0B5FFF] dark:hover:text-[#45D6FF] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              currentView === 'wizard' ? 'text-[#0B5FFF] dark:text-[#45D6FF] font-bold' : ''
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-[#7B61FF]" />
            <span>AI Wizard</span>
          </button>
          <button
            onClick={() => setCurrentView('editor')}
            className={`hover:text-[#0B5FFF] dark:hover:text-[#45D6FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'editor' ? 'text-[#0B5FFF] dark:text-[#45D6FF] font-bold' : ''
            }`}
          >
            Live Canvas
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`hover:text-[#0B5FFF] dark:hover:text-[#45D6FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'dashboard' ? 'text-[#0B5FFF] dark:text-[#45D6FF] font-bold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className={`hover:text-[#0B5FFF] dark:hover:text-[#45D6FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'admin' ? 'text-[#0B5FFF] dark:text-[#45D6FF] font-bold' : ''
            }`}
          >
            Admin
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-[#E9DEFF]/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Quick AI Builder Button */}
          <button
            onClick={onOpenAiModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#7B61FF] dark:text-[#45D6FF] bg-white dark:bg-slate-900 border border-[#E9DEFF] dark:border-slate-700 hover:border-[#7B61FF] rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7B61FF]" />
            <span>AI Quick Build</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => setCurrentView('wizard')}
            className="px-4 py-2 text-xs font-extrabold text-white canva-gradient-bg hover:opacity-95 rounded-xl shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Start Building</span>
          </button>
        </div>
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { TemplateGallery } from './components/TemplateGallery';
import { ResumeCreationFlow } from './components/ResumeCreationFlow';
import { LiveCanvasEditor } from './components/LiveCanvasEditor';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { initialResume } from './data/initialResume';
import { ResumeData, ResumeTemplate } from './types/resume';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'wizard' | 'editor' | 'templates' | 'dashboard' | 'admin'>('landing');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Resume state with LocalStorage persistence
  const [currentResume, setCurrentResume] = useState<ResumeData>(() => {
    try {
      const stored = localStorage.getItem('resumeforge_active_resume');
      return stored ? JSON.parse(stored) : initialResume;
    } catch {
      return initialResume;
    }
  });

  const [savedResumes, setSavedResumes] = useState<ResumeData[]>(() => {
    try {
      const stored = localStorage.getItem('resumeforge_saved_resumes');
      return stored ? JSON.parse(stored) : [initialResume];
    } catch {
      return [initialResume];
    }
  });

  // Sync dark class on html document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync active resume to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('resumeforge_active_resume', JSON.stringify(currentResume));
    } catch (e) {
      console.error(e);
    }
  }, [currentResume]);

  // Sync saved resumes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('resumeforge_saved_resumes', JSON.stringify(savedResumes));
    } catch (e) {
      console.error(e);
    }
  }, [savedResumes]);

  const handleSelectTemplate = (template: ResumeTemplate) => {
    setCurrentResume((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      templateId: template.id,
      primaryColor: template.primaryColor,
      accentColor: template.accentColor,
      layoutMode: template.layoutMode,
      fontFamily: template.fontFamily,
      photoShape: template.photoShape,
    }));
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveResume = (updated: ResumeData) => {
    setCurrentResume(updated);
    setSavedResumes((prev) => {
      const exists = prev.findIndex((r) => r.id === updated.id);
      if (exists >= 0) {
        const copy = [...prev];
        copy[exists] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
  };

  const handleDuplicateResume = (toClone: ResumeData) => {
    const cloned: ResumeData = {
      ...toClone,
      id: `resume-${Date.now()}`,
      title: `${toClone.title} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    setSavedResumes((prev) => [cloned, ...prev]);
    setCurrentResume(cloned);
    setCurrentView('editor');
  };

  const handleDeleteResume = (id: string) => {
    setSavedResumes((prev) => {
      const remaining = prev.filter((r) => r.id !== id);
      if (remaining.length > 0 && currentResume.id === id) {
        setCurrentResume(remaining[0]);
      }
      return remaining;
    });
  };

  const handleCreateNew = () => {
    const newResume: ResumeData = {
      ...initialResume,
      id: `resume-${Date.now()}`,
      title: 'Untitled Designer Resume',
      updatedAt: new Date().toISOString(),
    };
    setCurrentResume(newResume);
    setSavedResumes((prev) => [newResume, ...prev]);
    setCurrentView('wizard');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F5F0FF] dark:bg-slate-950 transition-colors">
      {/* Universal Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAiModal={() => setCurrentView('wizard')}
      />

      {/* Main View Routing */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartBuilding={() => setCurrentView('wizard')}
            onTryAiBuilder={() => setCurrentView('wizard')}
            onSelectTemplate={handleSelectTemplate}
          />
        )}

        {currentView === 'wizard' && (
          <ResumeCreationFlow
            currentResume={currentResume}
            setResume={setCurrentResume}
            onComplete={() => setCurrentView('editor')}
          />
        )}

        {currentView === 'templates' && (
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            currentResume={currentResume}
          />
        )}

        {currentView === 'editor' && (
          <LiveCanvasEditor
            resume={currentResume}
            setResume={setCurrentResume}
            onOpenTemplates={() => setCurrentView('templates')}
            onSaveResume={handleSaveResume}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            savedResumes={savedResumes}
            onOpenResume={(r) => {
              setCurrentResume(r);
              setCurrentView('editor');
            }}
            onCreateNew={handleCreateNew}
            onDuplicateResume={handleDuplicateResume}
            onDeleteResume={handleDeleteResume}
            onSelectTemplate={handleSelectTemplate}
          />
        )}

        {currentView === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

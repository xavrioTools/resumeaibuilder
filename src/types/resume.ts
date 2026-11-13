export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  portfolio?: string;
  linkedin: string;
  github: string;
  photoUrl: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Skill {
  name: string;
  category: string;
  level: number; // 1-5
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Achievement {
  id: string;
  title: string;
  metric: string;
  description: string;
}

export interface VolunteerItem {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  link?: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  role: string;
  company: string;
  contact: string;
}

export type ThemePreset = 
  | 'ocean-luxury' 
  | 'canva-purple' 
  | 'cyan-breeze' 
  | 'emerald-executive' 
  | 'dark-obsidian' 
  | 'minimal-pearl';

export type LayoutMode = 
  | 'side-panel' 
  | 'canva-grid' 
  | 'timeline-split' 
  | 'executive-classic' 
  | 'designer-two-tone';

export type PhotoShape = 'circle' | 'square' | 'rounded' | 'creative' | 'floating' | 'modern-frame';
export type SpacingMode = 'compact' | 'standard' | 'relaxed';
export type FontFamily = 'outfit' | 'plus-jakarta' | 'playfair' | 'mono';

export interface ResumeData {
  id: string;
  title: string;
  updatedAt: string;
  templateId: string;
  themePreset: ThemePreset;
  primaryColor: string;
  accentColor: string;
  fontFamily: FontFamily;
  layoutMode: LayoutMode;
  spacing: SpacingMode;
  photoShape: PhotoShape;
  sectionOrder: string[];
  visibleSections: Record<string, boolean>;
  personal: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  awards: Award[];
  achievements: Achievement[];
  volunteers: VolunteerItem[];
  publications: PublicationItem[];
  references: ReferenceItem[];
}

export type TemplateCategory =
  | 'Modern'
  | 'Executive'
  | 'Professional'
  | 'Corporate'
  | 'Minimal'
  | 'Creative'
  | 'Designer'
  | 'Developer'
  | 'Marketing'
  | 'Finance'
  | 'Healthcare'
  | 'Engineering'
  | 'AI Friendly'
  | 'ATS Friendly'
  | 'Startup'
  | 'Student';

export interface ResumeTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  atsScore: number;
  description: string;
  recommendedRole: string;
  primaryColor: string;
  accentColor: string;
  layoutMode: LayoutMode;
  fontFamily: FontFamily;
  photoShape: PhotoShape;
  isPopular?: boolean;
}

export interface AtsAuditResult {
  overallScore: number;
  keywordScore: number;
  formattingScore: number;
  categoryScores: {
    contact: number;
    summary: number;
    experience: number;
    skills: number;
    structure: number;
  };
  strengths: string[];
  warnings: string[];
  actionableFixes: string[];
  missingKeywords: string[];
}

export interface JobMatchResult {
  matchScore: number;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  recommendedKeywords: string[];
  improvementTips: Array<{
    section: string;
    issue: string;
    suggestedFix: string;
  }>;
}

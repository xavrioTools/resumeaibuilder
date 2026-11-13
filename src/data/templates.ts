import { ResumeTemplate, TemplateCategory, LayoutMode, FontFamily, PhotoShape } from '../types/resume';

export const templateCategories: TemplateCategory[] = [
  'Modern',
  'Executive',
  'Professional',
  'Corporate',
  'Minimal',
  'Creative',
  'Designer',
  'Developer',
  'Marketing',
  'Finance',
  'Healthcare',
  'Engineering',
  'AI Friendly',
  'ATS Friendly',
  'Startup',
  'Student',
];

interface CategoryStyleConfig {
  primary: string;
  accent: string;
  layout: LayoutMode;
  font: FontFamily;
  photoShape: PhotoShape;
}

const categoryStyles: Record<TemplateCategory, CategoryStyleConfig[]> = {
  Modern: [
    { primary: '#0B5FFF', accent: '#45D6FF', layout: 'side-panel', font: 'outfit', photoShape: 'floating' },
    { primary: '#7B61FF', accent: '#45D6FF', layout: 'canva-grid', font: 'plus-jakarta', photoShape: 'modern-frame' },
    { primary: '#0F172A', accent: '#7B61FF', layout: 'timeline-split', font: 'outfit', photoShape: 'circle' },
  ],
  Executive: [
    { primary: '#0B5FFF', accent: '#7B61FF', layout: 'side-panel', font: 'playfair', photoShape: 'circle' },
    { primary: '#0F172A', accent: '#45D6FF', layout: 'executive-classic', font: 'playfair', photoShape: 'rounded' },
    { primary: '#1E1B4B', accent: '#7B61FF', layout: 'designer-two-tone', font: 'outfit', photoShape: 'modern-frame' },
  ],
  Professional: [
    { primary: '#1E293B', accent: '#0B5FFF', layout: 'executive-classic', font: 'plus-jakarta', photoShape: 'rounded' },
    { primary: '#0B5FFF', accent: '#45D6FF', layout: 'side-panel', font: 'outfit', photoShape: 'circle' },
    { primary: '#334155', accent: '#7B61FF', layout: 'timeline-split', font: 'plus-jakarta', photoShape: 'square' },
  ],
  Corporate: [
    { primary: '#0B5FFF', accent: '#7B61FF', layout: 'side-panel', font: 'plus-jakarta', photoShape: 'circle' },
    { primary: '#1E3A8A', accent: '#45D6FF', layout: 'executive-classic', font: 'plus-jakarta', photoShape: 'rounded' },
    { primary: '#0F172A', accent: '#7B61FF', layout: 'timeline-split', font: 'outfit', photoShape: 'modern-frame' },
  ],
  Minimal: [
    { primary: '#0F172A', accent: '#7B61FF', layout: 'executive-classic', font: 'plus-jakarta', photoShape: 'rounded' },
    { primary: '#18181B', accent: '#45D6FF', layout: 'side-panel', font: 'outfit', photoShape: 'circle' },
    { primary: '#27272A', accent: '#0B5FFF', layout: 'timeline-split', font: 'mono', photoShape: 'square' },
  ],
  Creative: [
    { primary: '#7B61FF', accent: '#45D6FF', layout: 'canva-grid', font: 'outfit', photoShape: 'creative' },
    { primary: '#0B5FFF', accent: '#7B61FF', layout: 'designer-two-tone', font: 'outfit', photoShape: 'floating' },
    { primary: '#EC4899', accent: '#7B61FF', layout: 'side-panel', font: 'outfit', photoShape: 'modern-frame' },
  ],
  Designer: [
    { primary: '#7B61FF', accent: '#45D6FF', layout: 'canva-grid', font: 'outfit', photoShape: 'floating' },
    { primary: '#0B5FFF', accent: '#45D6FF', layout: 'designer-two-tone', font: 'outfit', photoShape: 'creative' },
    { primary: '#0F172A', accent: '#7B61FF', layout: 'side-panel', font: 'outfit', photoShape: 'modern-frame' },
  ],
  Developer: [
    { primary: '#0B5FFF', accent: '#45D6FF', layout: 'side-panel', font: 'mono', photoShape: 'rounded' },
    { primary: '#0F172A', accent: '#7B61FF', layout: 'timeline-split', font: 'plus-jakarta', photoShape: 'circle' },
    { primary: '#1E1B4B', accent: '#45D6FF', layout: 'canva-grid', font: 'mono', photoShape: 'modern-frame' },
  ],
  Marketing: [
    { primary: '#7B61FF', accent: '#45D6FF', layout: 'canva-grid', font: 'outfit', photoShape: 'floating' },
    { primary: '#0B5FFF', accent: '#7B61FF', layout: 'designer-two-tone', font: 'plus-jakarta', photoShape: 'circle' },
    { primary: '#D946EF', accent: '#45D6FF', layout: 'side-panel', font: 'outfit', photoShape: 'rounded' },
  ],
  Finance: [
    { primary: '#0B5FFF', accent: '#059669', layout: 'executive-classic', font: 'playfair', photoShape: 'circle' },
    { primary: '#1E293B', accent: '#0B5FFF', layout: 'side-panel', font: 'plus-jakarta', photoShape: 'rounded' },
    { primary: '#0F172A', accent: '#7B61FF', layout: 'timeline-split', font: 'outfit', photoShape: 'square' },
  ],
  Healthcare: [
    { primary: '#0B5FFF', accent: '#45D6FF', layout: 'side-panel', font: 'plus-jakarta', photoShape: 'circle' },
    { primary: '#0284C7', accent: '#7B61FF', layout: 'executive-classic', font: 'plus-jakarta', photoShape: 'rounded' },
    { primary: '#059669', accent: '#45D6FF', layout: 'timeline-split', font: 'outfit', photoShape: 'modern-frame' },
  ],
  Engineering: [
    { primary: '#0B5FFF', accent: '#7B61FF', layout: 'side-panel', font: 'plus-jakarta', photoShape: 'modern-frame' },
    { primary: '#0F172A', accent: '#45D6FF', layout: 'timeline-split', font: 'mono', photoShape: 'rounded' },
    { primary: '#1E293B', accent: '#0B5FFF', layout: 'canva-grid', font: 'outfit', photoShape: 'circle' },
  ],
  'AI Friendly': [
    { primary: '#7B61FF', accent: '#45D6FF', layout: 'canva-grid', font: 'outfit', photoShape: 'creative' },
    { primary: '#0B5FFF', accent: '#7B61FF', layout: 'timeline-split', font: 'mono', photoShape: 'floating' },
    { primary: '#0F172A', accent: '#45D6FF', layout: 'side-panel', font: 'outfit', photoShape: 'modern-frame' },
  ],
  'ATS Friendly': [
    { primary: '#0B5FFF', accent: '#7B61FF', layout: 'executive-classic', font: 'plus-jakarta', photoShape: 'circle' },
    { primary: '#1E293B', accent: '#45D6FF', layout: 'executive-classic', font: 'plus-jakarta', photoShape: 'rounded' },
    { primary: '#0F172A', accent: '#0B5FFF', layout: 'side-panel', font: 'plus-jakarta', photoShape: 'circle' },
  ],
  Startup: [
    { primary: '#7B61FF', accent: '#45D6FF', layout: 'canva-grid', font: 'outfit', photoShape: 'floating' },
    { primary: '#0B5FFF', accent: '#45D6FF', layout: 'timeline-split', font: 'outfit', photoShape: 'creative' },
    { primary: '#F43F5E', accent: '#7B61FF', layout: 'designer-two-tone', font: 'plus-jakarta', photoShape: 'modern-frame' },
  ],
  Student: [
    { primary: '#0B5FFF', accent: '#45D6FF', layout: 'side-panel', font: 'outfit', photoShape: 'circle' },
    { primary: '#7B61FF', accent: '#0B5FFF', layout: 'timeline-split', font: 'plus-jakarta', photoShape: 'rounded' },
    { primary: '#059669', accent: '#45D6FF', layout: 'canva-grid', font: 'outfit', photoShape: 'floating' },
  ],
};

const adjectives = [
  'Aura', 'Canva Luxe', 'Vanguard', 'Prism', 'Nexus', 'Horizon', 'Catalyst', 'Summit',
  'Velocity', 'Starlight', 'Eclipse', 'Orbit', 'Pulse', 'Vertex', 'Genesis'
];

export const resumeTemplates: ResumeTemplate[] = [];

let counter = 1;

templateCategories.forEach((cat) => {
  const styles = categoryStyles[cat];
  const countPerCategory = 7; // 16 * 7 = 112 templates!

  for (let i = 0; i < countPerCategory; i++) {
    const style = styles[i % styles.length];
    const adj = adjectives[(counter + i) % adjectives.length];
    const atsScore = Math.floor(94 + ((counter * 7 + i * 5) % 6)); // 94% to 99%

    resumeTemplates.push({
      id: `tmpl-${cat.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      name: `${adj} ${cat}`,
      category: cat,
      atsScore,
      description: `High-end Canva-inspired ${cat.toLowerCase()} blueprint with luxury typography, floating element balance, and ${atsScore}% ATS rating.`,
      recommendedRole: `${cat} Specialists, Leads & Creators`,
      primaryColor: style.primary,
      accentColor: style.accent,
      layoutMode: style.layout,
      fontFamily: style.font,
      photoShape: style.photoShape,
      isPopular: i === 0 || i === 3,
    });

    counter++;
  }
});

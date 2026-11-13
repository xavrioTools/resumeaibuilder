import { ThemePreset } from '../types/resume';

export interface ThemeConfig {
  id: ThemePreset;
  name: string;
  primary: string;
  accent: string;
  secondary: string;
  bgLight: string;
  paperBg: string;
  textPrimary: string;
  textSecondary: string;
  gradient: string;
  previewBg: string;
}

export const themeConfigs: Record<ThemePreset, ThemeConfig> = {
  'ocean-luxury': {
    id: 'ocean-luxury',
    name: 'Ocean Luxury (Default)',
    primary: '#0B5FFF', // Ocean Blue
    accent: '#45D6FF',  // Accent Cyan
    secondary: '#7B61FF', // Ocean Purple
    bgLight: '#F5F0FF',
    paperBg: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    gradient: 'linear-gradient(135deg, #0B5FFF 0%, #7B61FF 50%, #45D6FF 100%)',
    previewBg: 'bg-gradient-to-r from-[#0B5FFF] via-[#7B61FF] to-[#45D6FF]',
  },
  'canva-purple': {
    id: 'canva-purple',
    name: 'Canva Modern Purple',
    primary: '#7B61FF',
    accent: '#45D6FF',
    secondary: '#E9DEFF',
    bgLight: '#F8F4FF',
    paperBg: '#FFFFFF',
    textPrimary: '#1E1B4B',
    textSecondary: '#64748B',
    gradient: 'linear-gradient(135deg, #7B61FF 0%, #A855F7 60%, #45D6FF 100%)',
    previewBg: 'bg-gradient-to-r from-[#7B61FF] to-[#45D6FF]',
  },
  'cyan-breeze': {
    id: 'cyan-breeze',
    name: 'Ocean Cyan Breeze',
    primary: '#0284C7',
    accent: '#45D6FF',
    secondary: '#0B5FFF',
    bgLight: '#F0F9FF',
    paperBg: '#FFFFFF',
    textPrimary: '#0C4A6E',
    textSecondary: '#475569',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0B5FFF 60%, #45D6FF 100%)',
    previewBg: 'bg-gradient-to-r from-[#0284C7] to-[#45D6FF]',
  },
  'emerald-executive': {
    id: 'emerald-executive',
    name: 'Emerald Executive',
    primary: '#059669',
    accent: '#34D399',
    secondary: '#10B981',
    bgLight: '#ECFDF5',
    paperBg: '#FFFFFF',
    textPrimary: '#064E3B',
    textSecondary: '#475569',
    gradient: 'linear-gradient(135deg, #059669 0%, #10B981 60%, #34D399 100%)',
    previewBg: 'bg-gradient-to-r from-[#059669] to-[#34D399]',
  },
  'dark-obsidian': {
    id: 'dark-obsidian',
    name: 'Dark Obsidian Modern',
    primary: '#0F172A',
    accent: '#7B61FF',
    secondary: '#38BDF8',
    bgLight: '#090D16',
    paperBg: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    gradient: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #7B61FF 100%)',
    previewBg: 'bg-gradient-to-r from-[#0F172A] to-[#7B61FF]',
  },
  'minimal-pearl': {
    id: 'minimal-pearl',
    name: 'Minimal Pearl Cream',
    primary: '#334155',
    accent: '#7B61FF',
    secondary: '#E2E8F0',
    bgLight: '#F8F4FF',
    paperBg: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    gradient: 'linear-gradient(135deg, #334155 0%, #64748B 60%, #7B61FF 100%)',
    previewBg: 'bg-gradient-to-r from-[#334155] to-[#7B61FF]',
  },
};

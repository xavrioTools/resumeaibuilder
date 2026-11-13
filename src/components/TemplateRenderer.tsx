import React from 'react';
import { ResumeData } from '../types/resume';
import { themeConfigs } from '../data/themes';
import { 
  Mail, Phone, MapPin, Globe, Linkedin, Github, 
  Briefcase, GraduationCap, Award, CheckCircle, Code, 
  Languages, FileText, HeartHandshake, BookOpen, Sparkles, Camera
} from 'lucide-react';

interface TemplateRendererProps {
  resume: ResumeData;
  scale?: number;
  interactive?: boolean;
  onPhotoClick?: () => void;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  resume,
  scale = 1,
  interactive = false,
  onPhotoClick,
}) => {
  const currentTheme = themeConfigs[resume.themePreset] || themeConfigs['ocean-luxury'];
  const primaryColor = resume.primaryColor || currentTheme.primary;
  const accentColor = resume.accentColor || currentTheme.accent;

  // Font family resolution
  const fontClass = {
    'outfit': 'font-["Outfit",sans-serif]',
    'plus-jakarta': 'font-["Plus_Jakarta_Sans",sans-serif]',
    'playfair': 'font-["Playfair_Display",serif]',
    'mono': 'font-["JetBrains_Mono",monospace]',
  }[resume.fontFamily] || 'font-["Outfit",sans-serif]';

  // Spacing configurations
  const spacingClass = {
    compact: { sectionGap: 'space-y-3.5', itemGap: 'space-y-2', padding: 'p-6', bulletGap: 'space-y-0.5' },
    standard: { sectionGap: 'space-y-5', itemGap: 'space-y-3', padding: 'p-8', bulletGap: 'space-y-1' },
    relaxed: { sectionGap: 'space-y-7', itemGap: 'space-y-4', padding: 'p-10', bulletGap: 'space-y-2' },
  }[resume.spacing] || { sectionGap: 'space-y-5', itemGap: 'space-y-3', padding: 'p-8', bulletGap: 'space-y-1' };

  // Photo shape styling
  const renderPhoto = (customClasses = '') => {
    if (!resume.personal.photoUrl) {
      if (interactive && onPhotoClick) {
        return (
          <button
            type="button"
            onClick={onPhotoClick}
            title="Click to upload your profile photo"
            className={`w-28 h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 p-2 transition-all cursor-pointer hover:bg-white/80 group ${customClasses}`}
            style={{ borderColor: `${primaryColor}60`, backgroundColor: `${primaryColor}08` }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-xs group-hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" style={{ color: primaryColor }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: primaryColor }}>
              + Add Photo
            </span>
          </button>
        );
      }
      return null;
    }

    let photoContent: React.ReactNode;

    switch (resume.photoShape) {
      case 'circle':
        photoContent = (
          <img
            src={resume.personal.photoUrl}
            alt={resume.personal.fullName || 'Resume Owner Photo'}
            className={`w-28 h-28 object-cover rounded-full border-2 shadow-md ${customClasses}`}
            style={{ borderColor: primaryColor }}
            referrerPolicy="no-referrer"
          />
        );
        break;
      case 'square':
        photoContent = (
          <img
            src={resume.personal.photoUrl}
            alt={resume.personal.fullName || 'Resume Owner Photo'}
            className={`w-28 h-28 object-cover rounded-none border-2 shadow-md ${customClasses}`}
            style={{ borderColor: primaryColor }}
            referrerPolicy="no-referrer"
          />
        );
        break;
      case 'rounded':
        photoContent = (
          <img
            src={resume.personal.photoUrl}
            alt={resume.personal.fullName || 'Resume Owner Photo'}
            className={`w-28 h-28 object-cover rounded-2xl border-2 shadow-md ${customClasses}`}
            style={{ borderColor: primaryColor }}
            referrerPolicy="no-referrer"
          />
        );
        break;
      case 'floating':
        photoContent = (
          <div className="relative inline-block">
            <div 
              className="absolute -inset-1 rounded-2xl blur-xs opacity-40"
              style={{ background: currentTheme.gradient }}
            />
            <img
              src={resume.personal.photoUrl}
              alt={resume.personal.fullName || 'Resume Owner Photo'}
              className={`relative w-28 h-28 object-cover rounded-2xl border-4 border-white shadow-xl ${customClasses}`}
              referrerPolicy="no-referrer"
            />
          </div>
        );
        break;
      case 'modern-frame':
        photoContent = (
          <div 
            className="p-1 rounded-2xl shadow-lg inline-block"
            style={{ background: currentTheme.gradient }}
          >
            <img
              src={resume.personal.photoUrl}
              alt={resume.personal.fullName || 'Resume Owner Photo'}
              className={`w-26 h-26 object-cover rounded-xl bg-white ${customClasses}`}
              referrerPolicy="no-referrer"
            />
          </div>
        );
        break;
      case 'creative':
      default:
        photoContent = (
          <div className="relative inline-block">
            <img
              src={resume.personal.photoUrl}
              alt={resume.personal.fullName || 'Resume Owner Photo'}
              className={`w-28 h-28 object-cover rounded-3xl border-2 shadow-md ${customClasses}`}
              style={{ borderColor: accentColor }}
              referrerPolicy="no-referrer"
            />
          </div>
        );
        break;
    }

    if (interactive && onPhotoClick) {
      return (
        <div
          onClick={onPhotoClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPhotoClick(); }}
          title="Click to replace photo with your own picture"
          className="group relative inline-block cursor-pointer select-none transition-transform hover:scale-103 focus:outline-none"
        >
          {photoContent}
          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 rounded-2xl pointer-events-none p-1 text-center backdrop-blur-[1px]">
            <Camera className="w-5 h-5 text-white animate-pulse" />
            <span className="leading-tight drop-shadow-sm">Change Photo</span>
          </div>
          <div 
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-white shadow-md flex items-center justify-center border-2 border-white pointer-events-none"
            style={{ backgroundColor: primaryColor }}
          >
            <Camera className="w-3 h-3" />
          </div>
        </div>
      );
    }

    return photoContent;
  };

  // Section Heading with Canva-inspired aesthetic
  const SectionTitle = ({ title, icon: Icon }: { title: string; icon?: React.ElementType }) => (
    <div className="flex items-center gap-2 pb-1.5 mb-2.5 border-b" style={{ borderBottomColor: `${primaryColor}20` }}>
      {Icon && (
        <div 
          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${primaryColor}15` }}
        >
          <Icon className="w-3 h-3" style={{ color: primaryColor }} />
        </div>
      )}
      <h3 
        className="text-xs font-extrabold uppercase tracking-wider"
        style={{ color: primaryColor }}
      >
        {title}
      </h3>
    </div>
  );

  // Contact list
  const ContactList = ({ compact = false }: { compact?: boolean }) => (
    <div className={`text-[11px] text-slate-600 ${compact ? 'flex flex-wrap gap-x-4 gap-y-1' : 'space-y-1.5'}`}>
      {resume.personal.email && (
        <a href={`mailto:${resume.personal.email}`} className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
          <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{resume.personal.email}</span>
        </a>
      )}
      {resume.personal.phone && (
        <span className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span>{resume.personal.phone}</span>
        </span>
      )}
      {resume.personal.address && (
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span>{resume.personal.address}</span>
        </span>
      )}
      {resume.personal.portfolio && (
        <a href={resume.personal.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
          <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{resume.personal.portfolio.replace(/^https?:\/\//, '')}</span>
        </a>
      )}
      {resume.personal.linkedin && (
        <a href={`https://${resume.personal.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
          <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{resume.personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
        </a>
      )}
      {resume.personal.github && (
        <a href={`https://${resume.personal.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
          <Github className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{resume.personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
        </a>
      )}
    </div>
  );

  // Key Highlight Metric Cards (Canva-inspired)
  const MetricHighlightStrip = () => {
    if (!resume.visibleSections.achievements || !resume.achievements || resume.achievements.length === 0) return null;
    return (
      <div className="grid grid-cols-3 gap-2.5 my-3">
        {resume.achievements.map((ach) => (
          <div 
            key={ach.id} 
            className="p-2.5 rounded-xl border border-slate-100 bg-white shadow-xs"
            style={{ borderLeft: `3px solid ${primaryColor}` }}
          >
            <div className="text-xs font-black tracking-tight" style={{ color: primaryColor }}>
              {ach.metric}
            </div>
            <div className="text-[10px] font-bold text-slate-800 leading-tight mt-0.5 truncate">
              {ach.title}
            </div>
            <div className="text-[9px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
              {ach.description}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Experience Section
  const ExperienceSection = () => {
    if (!resume.visibleSections.experience || resume.experiences.length === 0) return null;
    return (
      <div>
        <SectionTitle title="Experience" icon={Briefcase} />
        <div className={spacingClass.itemGap}>
          {resume.experiences.map((exp) => (
            <div key={exp.id} className="relative pl-3 border-l-2 border-slate-100" style={{ borderLeftColor: `${primaryColor}25` }}>
              <div 
                className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
              <div className="flex justify-between items-baseline gap-2">
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900">{exp.role}</h4>
                  <div className="text-[11.5px] font-medium text-slate-700">{exp.company}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10.5px] font-bold text-slate-500 tabular-nums">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </div>
                  {exp.location && <div className="text-[9.5px] text-slate-400">{exp.location}</div>}
                </div>
              </div>
              <ul className={`mt-1.5 list-disc list-outside ml-3.5 text-[11.5px] leading-snug text-slate-600 ${spacingClass.bulletGap}`}>
                {exp.bullets.map((b, idx) => (
                  <li key={idx} className="pl-0.5">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Skills Section
  const SkillsSection = ({ style = 'bars' }: { style?: 'bars' | 'tags' }) => {
    if (!resume.visibleSections.skills || resume.skills.length === 0) return null;
    return (
      <div>
        <SectionTitle title="Skills & Competencies" icon={Code} />
        {style === 'bars' ? (
          <div className="space-y-2">
            {resume.skills.map((skill, idx) => (
              <div key={idx} className="text-[11px]">
                <div className="flex justify-between font-medium text-slate-700 mb-0.5">
                  <span>{skill.name}</span>
                  <span className="text-[9.5px] text-slate-400">{skill.category}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(skill.level / 5) * 100}%`,
                      backgroundColor: primaryColor 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[10.5px] px-2.5 py-0.5 rounded-lg font-medium border text-slate-700 bg-white shadow-2xs"
                style={{ borderColor: `${primaryColor}20` }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Education Section
  const EducationSection = () => {
    if (!resume.visibleSections.education || resume.educations.length === 0) return null;
    return (
      <div>
        <SectionTitle title="Education" icon={GraduationCap} />
        <div className="space-y-2 text-[11.5px]">
          {resume.educations.map((edu) => (
            <div key={edu.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900">{edu.degree} in {edu.field}</span>
                <span className="text-[10px] text-slate-500 tabular-nums">{edu.startDate} – {edu.endDate}</span>
              </div>
              <div className="text-[11px] text-slate-700">{edu.institution}</div>
              {edu.gpa && <div className="text-[10px] text-slate-500">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Projects Section
  const ProjectsSection = () => {
    if (!resume.visibleSections.projects || resume.projects.length === 0) return null;
    return (
      <div>
        <SectionTitle title="Projects & Architecture" icon={Sparkles} />
        <div className="space-y-2.5 text-[11.5px]">
          {resume.projects.map((proj) => (
            <div key={proj.id} className="p-2 rounded-xl bg-slate-50/60 border border-slate-100">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>{proj.name}</span>
                {proj.link && <span className="text-[10px] text-slate-400 font-mono">{proj.link}</span>}
              </div>
              <p className="text-slate-600 mt-0.5 leading-snug">{proj.description}</p>
              {proj.technologies && (
                <div className="text-[10px] text-slate-500 mt-1">
                  <span className="font-semibold">Tech:</span> {proj.technologies}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Volunteer & Publications
  const VolunteerSection = () => {
    if (!resume.visibleSections.volunteers || !resume.volunteers || resume.volunteers.length === 0) return null;
    return (
      <div>
        <SectionTitle title="Leadership & Volunteering" icon={HeartHandshake} />
        <div className="space-y-1.5 text-[11px]">
          {resume.volunteers.map((vol) => (
            <div key={vol.id}>
              <div className="flex justify-between font-bold text-slate-900">
                <span>{vol.role}</span>
                <span className="text-[10px] text-slate-500">{vol.startDate} - {vol.endDate}</span>
              </div>
              <div className="text-slate-600">{vol.organization}</div>
              <p className="text-[10px] text-slate-500 mt-0.5">{vol.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="relative flex justify-center w-full transition-transform duration-200"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      <div
        id="resume-document"
        className={`w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl transition-all duration-200 ${fontClass} ${interactive ? 'cursor-default' : ''}`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(123, 97, 255, 0.15), 0 0 0 1px rgba(233, 222, 255, 0.6)',
        }}
      >
        {/* LAYOUT 1: SIDE COLORED PANEL (Canva Classic) */}
        {resume.layoutMode === 'side-panel' && (
          <div className="grid grid-cols-12 min-h-[297mm]">
            {/* Left Colored Sidebar (36%) */}
            <div 
              className={`col-span-4 ${spacingClass.padding} ${spacingClass.sectionGap} text-slate-700 relative`}
              style={{ backgroundColor: `${primaryColor}0C` }}
            >
              {/* Profile Photo */}
              <div className="flex justify-center mb-2">
                {renderPhoto()}
              </div>

              {/* Contact */}
              <div>
                <SectionTitle title="Contact" icon={Mail} />
                <ContactList />
              </div>

              {/* Skills */}
              <SkillsSection style="bars" />

              {/* Education */}
              <EducationSection />

              {/* Languages */}
              {resume.visibleSections.languages && resume.languages.length > 0 && (
                <div>
                  <SectionTitle title="Languages" icon={Languages} />
                  <div className="space-y-1 text-[11px]">
                    {resume.languages.map((l, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="font-medium text-slate-800">{l.name}</span>
                        <span className="text-[10px] text-slate-500">{l.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {resume.visibleSections.certifications && resume.certifications.length > 0 && (
                <div>
                  <SectionTitle title="Certifications" icon={CheckCircle} />
                  <div className="space-y-1 text-[11px]">
                    {resume.certifications.map((c) => (
                      <div key={c.id} className="flex justify-between">
                        <span className="font-medium text-slate-800 truncate">{c.name}</span>
                        <span className="text-[10px] text-slate-500 shrink-0">{c.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Main Body (64%) */}
            <div className={`col-span-8 ${spacingClass.padding} ${spacingClass.sectionGap}`}>
              {/* Header Title with Canva luxury accent */}
              <div>
                <h1 
                  className="text-3xl font-black tracking-tight"
                  style={{ color: primaryColor }}
                >
                  {resume.personal.fullName || 'Your Full Name'}
                </h1>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                  {resume.personal.jobTitle || 'Target Career Role'}
                </div>
              </div>

              {/* Metric Highlight Cards */}
              <MetricHighlightStrip />

              {/* Summary */}
              {resume.visibleSections.summary && resume.personal.summary && (
                <div>
                  <SectionTitle title="Executive Profile" icon={FileText} />
                  <p className="text-[12px] leading-relaxed text-slate-700 text-justify">
                    {resume.personal.summary}
                  </p>
                </div>
              )}

              {/* Experience */}
              <ExperienceSection />

              {/* Projects */}
              <ProjectsSection />

              {/* Volunteering */}
              <VolunteerSection />
            </div>
          </div>
        )}

        {/* LAYOUT 2: CANVA GRID CARDS */}
        {resume.layoutMode === 'canva-grid' && (
          <div className="min-h-[297mm] flex flex-col justify-between">
            {/* Header Banner */}
            <div 
              className="p-8 text-white relative overflow-hidden"
              style={{ background: currentTheme.gradient }}
            >
              <div className="flex items-center justify-between gap-6 relative z-10">
                <div className="space-y-1 text-white">
                  <h1 className="text-3xl font-black tracking-tight">
                    {resume.personal.fullName || 'Your Full Name'}
                  </h1>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/90">
                    {resume.personal.jobTitle || 'Target Career Role'}
                  </p>
                  <div className="pt-2">
                    <ContactList compact={true} />
                  </div>
                </div>
                {renderPhoto()}
              </div>
            </div>

            {/* Body */}
            <div className={`p-8 ${spacingClass.sectionGap} flex-1`}>
              <MetricHighlightStrip />

              {resume.visibleSections.summary && resume.personal.summary && (
                <div className="p-4 rounded-2xl bg-[#F8F4FF] border border-[#E9DEFF]">
                  <p className="text-[12px] leading-relaxed text-slate-700">
                    {resume.personal.summary}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-12 gap-6">
                <div className={`col-span-8 ${spacingClass.sectionGap}`}>
                  <ExperienceSection />
                  <ProjectsSection />
                </div>
                <div className={`col-span-4 ${spacingClass.sectionGap}`}>
                  <SkillsSection style="tags" />
                  <EducationSection />
                  <VolunteerSection />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 3: TIMELINE SPLIT */}
        {resume.layoutMode === 'timeline-split' && (
          <div className={`${spacingClass.padding} ${spacingClass.sectionGap}`}>
            {/* Header */}
            <div className="flex items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div>
                <h1 className="text-3xl font-black tracking-tight" style={{ color: primaryColor }}>
                  {resume.personal.fullName || 'Your Full Name'}
                </h1>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                  {resume.personal.jobTitle || 'Target Career Role'}
                </div>
                <div className="mt-3">
                  <ContactList compact={true} />
                </div>
              </div>
              {renderPhoto()}
            </div>

            <MetricHighlightStrip />

            {resume.visibleSections.summary && resume.personal.summary && (
              <div>
                <SectionTitle title="About & Impact" icon={FileText} />
                <p className="text-[12px] leading-relaxed text-slate-700">
                  {resume.personal.summary}
                </p>
              </div>
            )}

            <div className="grid grid-cols-12 gap-8">
              <div className={`col-span-8 ${spacingClass.sectionGap}`}>
                <ExperienceSection />
                <ProjectsSection />
              </div>
              <div className={`col-span-4 ${spacingClass.sectionGap}`}>
                <SkillsSection style="bars" />
                <EducationSection />
                <VolunteerSection />
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 4: EXECUTIVE CLASSIC */}
        {resume.layoutMode === 'executive-classic' && (
          <div className={`${spacingClass.padding} ${spacingClass.sectionGap}`}>
            <div className="text-center pb-6 border-b-2" style={{ borderBottomColor: primaryColor }}>
              <div className="flex justify-center mb-3">
                {renderPhoto()}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: primaryColor }}>
                {resume.personal.fullName || 'Your Full Name'}
              </h1>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-600 mt-1">
                {resume.personal.jobTitle || 'Target Professional Role'}
              </div>
              <div className="mt-3 flex justify-center">
                <ContactList compact={true} />
              </div>
            </div>

            <MetricHighlightStrip />

            {resume.visibleSections.summary && resume.personal.summary && (
              <div>
                <SectionTitle title="Executive Profile" icon={FileText} />
                <p className="text-[12px] leading-relaxed text-slate-700 text-justify">
                  {resume.personal.summary}
                </p>
              </div>
            )}

            <ExperienceSection />
            <EducationSection />
            <SkillsSection style="tags" />
            <ProjectsSection />
          </div>
        )}

        {/* LAYOUT 5: DESIGNER TWO-TONE */}
        {resume.layoutMode === 'designer-two-tone' && (
          <div className="min-h-[297mm]">
            <div 
              className="p-8 border-b-4 flex items-center justify-between"
              style={{ backgroundColor: '#F8F4FF', borderBottomColor: primaryColor }}
            >
              <div>
                <h1 className="text-3xl font-black text-slate-900">
                  {resume.personal.fullName || 'Your Full Name'}
                </h1>
                <div 
                  className="text-xs font-bold uppercase tracking-wider mt-1"
                  style={{ color: primaryColor }}
                >
                  {resume.personal.jobTitle || 'Target Career Role'}
                </div>
                <div className="mt-3">
                  <ContactList compact={true} />
                </div>
              </div>
              {renderPhoto()}
            </div>

            <div className={`p-8 ${spacingClass.sectionGap}`}>
              <MetricHighlightStrip />
              <div className="grid grid-cols-12 gap-8">
                <div className={`col-span-8 ${spacingClass.sectionGap}`}>
                  {resume.visibleSections.summary && resume.personal.summary && (
                    <div>
                      <SectionTitle title="Professional Narrative" icon={FileText} />
                      <p className="text-[12px] leading-relaxed text-slate-700">
                        {resume.personal.summary}
                      </p>
                    </div>
                  )}
                  <ExperienceSection />
                  <ProjectsSection />
                </div>
                <div className={`col-span-4 ${spacingClass.sectionGap}`}>
                  <SkillsSection style="bars" />
                  <EducationSection />
                  <VolunteerSection />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

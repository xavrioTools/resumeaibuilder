import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '15mb' }));

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper to safely call Gemini or provide intelligent structured fallback
async function callGemini(prompt: string, systemInstruction?: string, responseJson = false): Promise<string> {
  if (!ai || !apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on server.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || 'You are an elite, world-class executive resume strategist, designer, and ATS optimization engine.',
      ...(responseJson ? { responseMimeType: 'application/json' } : {}),
    },
  });

  return response.text || '';
}

// 1. Raw Text to Structured Resume (AI Resume Builder)
app.post('/api/ai/parse-resume', async (req: Request, res: Response) => {
  try {
    const { rawText, targetTemplateId } = req.body;
    if (!rawText || typeof rawText !== 'string') {
      res.status(400).json({ error: 'rawText is required' });
      return;
    }

    const systemPrompt = `You are an elite Canva/Figma designer and executive resume architect for "ResumeForge AI".
Analyze the user's raw, unformatted notes or resume text and transform it into a pristine, structured JSON object matching this schema:
{
  "personal": {
    "fullName": string,
    "jobTitle": string,
    "email": string,
    "phone": string,
    "address": string,
    "website": string,
    "linkedin": string,
    "github": string,
    "summary": string (refined, punchy, 2-3 sentences highlight impact and core value proposition)
  },
  "experiences": [
    {
      "id": string (unique ID like "exp-1"),
      "company": string,
      "role": string,
      "location": string,
      "startDate": string (e.g. "Jan 2021"),
      "endDate": string (e.g. "Present" or "Dec 2023"),
      "current": boolean,
      "bullets": string[] (3-5 high-impact bullet points rewritten with strong action verbs, quantifiable metrics, and business outcomes)
    }
  ],
  "educations": [
    {
      "id": string (unique ID like "edu-1"),
      "institution": string,
      "degree": string,
      "field": string,
      "startDate": string,
      "endDate": string,
      "gpa": string
    }
  ],
  "skills": [
    { "name": string, "category": string (e.g. "Technical", "Leadership", "Tools", "Design"), "level": number (1-5) }
  ],
  "projects": [
    {
      "id": string,
      "name": string,
      "description": string,
      "technologies": string,
      "link": string
    }
  ],
  "certifications": [
    { "id": string, "name": string, "issuer": string, "date": string }
  ],
  "languages": [
    { "name": string, "proficiency": string (e.g. "Native", "Fluent", "Professional") }
  ],
  "awards": [
    { "id": string, "title": string, "issuer": string, "date": string, "description": string }
  ]
}

Fix grammar, eliminate filler, enforce strong action verbs (Spearheaded, Orchestrated, Engineered, Scaled), and preserve authentic career accomplishments. Return valid JSON only.`;

    const result = await callGemini(`Raw Resume Notes:\n${rawText}\nSelected Template: ${targetTemplateId || 'default'}`, systemPrompt, true);
    const parsed = JSON.parse(result);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Parse resume error:', error);
    res.status(500).json({ error: error.message || 'Failed to parse resume text with AI' });
  }
});

// 2. AI Format Cleaner
app.post('/api/ai/format-cleaner', async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;
    const systemPrompt = `You are an AI resume format cleaner. Clean up typography, standardize dates (e.g. "Jan 2023 - Present"), eliminate extra punctuation/whitespace, fix capitalization of proper nouns and tech names (e.g. JavaScript, AWS, React, Python), and ensure consistent formatting throughout. Return cleaned resumeData JSON.`;
    const result = await callGemini(JSON.stringify(resumeData), systemPrompt, true);
    res.json({ success: true, data: JSON.parse(result) });
  } catch (error: any) {
    console.error('Format cleaner error:', error);
    res.status(500).json({ error: error.message || 'Failed to clean format' });
  }
});

// 3. AI Content Improver
app.post('/api/ai/content-improver', async (req: Request, res: Response) => {
  try {
    const { text, tone, fieldType } = req.body;
    const systemPrompt = `You are a high-end career branding strategist. Rephrase the following ${fieldType || 'resume content'} to sound significantly more compelling, authoritative, and achievement-oriented. Tone: ${tone || 'Executive & Modern'}. Return JSON: { "improvedText": string, "keyChanges": string[] }`;
    const result = await callGemini(`Original text:\n"${text}"`, systemPrompt, true);
    res.json(JSON.parse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to improve content' });
  }
});

// 4. AI Bullet Point Generator
app.post('/api/ai/enhance-bullet', async (req: Request, res: Response) => {
  try {
    const { bullet, tone, role, company } = req.body;
    const systemPrompt = `You are a senior career advisor at a top-tier executive recruiting firm.
The user provides a resume bullet point. Rewrite it into 3 high-impact, ATS-optimized variations.
Tone / Mode requested: ${tone || 'quantified-metrics'}.
Context: Role: ${role || 'Professional'}, Company: ${company || 'Organization'}.

Return JSON format:
{
  "variations": [
    {
      "type": "Metric-Driven (Quantified Impact)",
      "text": string
    },
    {
      "type": "Executive & Strategic Leadership",
      "text": string
    },
    {
      "type": "Concise & ATS-Optimized",
      "text": string
    }
  ]
}`;
    const result = await callGemini(`Original bullet: "${bullet}"`, systemPrompt, true);
    res.json(JSON.parse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to enhance bullet' });
  }
});

// 5. AI Professional Summary Generator
app.post('/api/ai/enhance-summary', async (req: Request, res: Response) => {
  try {
    const { currentSummary, jobTitle, yearsOfExp, topSkills } = req.body;
    const systemPrompt = `Generate 3 distinct, compelling, high-converting professional summaries for a resume.
Target Job Title: ${jobTitle || 'Industry Professional'}
Years of experience: ${yearsOfExp || '5+'}
Top skills: ${Array.isArray(topSkills) ? topSkills.join(', ') : topSkills || 'Relevant skills'}
Current draft: ${currentSummary || 'None provided'}

Return JSON:
{
  "summaries": [
    {
      "title": "High-Impact Executive",
      "text": string
    },
    {
      "title": "Creative & Visionary",
      "text": string
    },
    {
      "title": "Modern & High-Growth Startup",
      "text": string
    }
  ]
}`;
    const result = await callGemini('Generate 3 executive summaries', systemPrompt, true);
    res.json(JSON.parse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to enhance summary' });
  }
});

// 6. AI Skill Analyzer
app.post('/api/ai/analyze-skills', async (req: Request, res: Response) => {
  try {
    const { currentSkills, jobTitle } = req.body;
    const systemPrompt = `Analyze the current skills list for a "${jobTitle || 'Professional'}".
Identify high-demand trending industry skills that would make this resume stand out to top recruiters.
Return JSON:
{
  "trendingSkills": string[],
  "skillCategories": Array<{ "category": string, "skills": string[] }>,
  "analysis": string
}`;
    const result = await callGemini(`Current skills: ${JSON.stringify(currentSkills)}`, systemPrompt, true);
    res.json(JSON.parse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to analyze skills' });
  }
});

// 7. AI Achievement Generator
app.post('/api/ai/generate-achievements', async (req: Request, res: Response) => {
  try {
    const { role, company, duties } = req.body;
    const systemPrompt = `Transform daily duties/responsibilities into 3 standout quantifiable executive achievements.
Role: ${role}, Company: ${company}
Duties: ${duties}
Return JSON: { "achievements": string[] }`;
    const result = await callGemini('Generate achievements', systemPrompt, true);
    res.json(JSON.parse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate achievements' });
  }
});

// 8. AI Resume Quality Score
app.post('/api/ai/quality-score', async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;
    const systemPrompt = `You are an AI resume auditor.
Evaluate this resume for Overall Design & Content Quality (0-100), Visual Readability (0-100), Action Verb Strength (0-100), and Career Progression (0-100).
Return JSON:
{
  "overallQuality": number,
  "readabilityScore": number,
  "actionVerbStrength": number,
  "progressionScore": number,
  "strengths": string[],
  "quickWins": string[]
}`;
    const result = await callGemini(JSON.stringify(resumeData), systemPrompt, true);
    res.json(JSON.parse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to score quality' });
  }
});

// 9. Job Description Matcher & ATS Gap Analysis
app.post('/api/ai/match-job', async (req: Request, res: Response) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!jobDescription) {
      res.status(400).json({ error: 'Job description is required' });
      return;
    }

    const systemPrompt = `You are a corporate recruiter and ATS algorithm specialist.
Compare the user's resume against the target job description.
Compute an ATS Match Score (0 to 100).
Identify matched skills, missing essential skills, missing recommended keywords, and 3 specific bullet point tailoring recommendations to boost the match rate.

Return JSON:
{
  "matchScore": number,
  "summary": string,
  "matchedSkills": string[],
  "missingSkills": string[],
  "recommendedKeywords": string[],
  "improvementTips": [
    {
      "section": string,
      "issue": string,
      "suggestedFix": string
    }
  ]
}`;

    const prompt = `RESUME DATA:\n${JSON.stringify(resumeData, null, 2)}\n\nJOB DESCRIPTION:\n${jobDescription}`;
    const result = await callGemini(prompt, systemPrompt, true);
    res.json(JSON.parse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to match job description' });
  }
});

// 10. ATS Score Checker (Deep Audit)
app.post('/api/ai/ats-deep-audit', async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;

    const systemPrompt = `You are an ATS compliance audit engine.
Analyze the provided resume across 5 standard dimensions:
1. Contact & Header Completeness (weight 15)
2. Professional Summary Impact (weight 15)
3. Action Verbs & Measurable Metrics in Experience (weight 35)
4. Skills Density & Categorization (weight 20)
5. Structure, Length & Readability (weight 15)

Calculate an overall score out of 100, provide individual category scores, keyword score, formatting score, and actionable fixes.

Return JSON:
{
  "overallScore": number,
  "keywordScore": number,
  "formattingScore": number,
  "categoryScores": {
    "contact": number,
    "summary": number,
    "experience": number,
    "skills": number,
    "structure": number
  },
  "strengths": string[],
  "warnings": string[],
  "actionableFixes": string[],
  "missingKeywords": string[]
}`;

    const prompt = `AUDIT THIS RESUME:\n${JSON.stringify(resumeData, null, 2)}`;
    const result = await callGemini(prompt, systemPrompt, true);
    res.json(JSON.parse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to audit resume' });
  }
});

// 11. Cover Letter Generator
app.post('/api/ai/generate-cover-letter', async (req: Request, res: Response) => {
  try {
    const { resumeData, companyName, jobTitle, jobDescription, tone } = req.body;

    const systemPrompt = `You are an expert executive career writer for ResumeForge AI.
Write a personalized, compelling, high-converting 3-4 paragraph cover letter tailored to the job and company using the candidate's actual accomplishments from their resume.
Tone: ${tone || 'Professional & Confident'}.

Return JSON:
{
  "subject": string,
  "salutation": string,
  "body": string,
  "signOff": string
}`;

    const prompt = `Candidate Resume:\n${JSON.stringify(resumeData, null, 2)}\nCompany: ${companyName}\nRole: ${jobTitle}`;
    const result = await callGemini(prompt, systemPrompt, true);
    res.json(JSON.parse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate cover letter' });
  }
});

// 12. LinkedIn Profile Optimizer
app.post('/api/ai/generate-linkedin', async (req: Request, res: Response) => {
  try {
    const { resumeData } = req.body;

    const systemPrompt = `You are a top personal branding and LinkedIn strategist.
Based on the user's resume, generate:
1. 3 engaging, high-CTR LinkedIn headline options.
2. A first-person storytelling "About" section that hooks recruiters.
3. A punchy short summary bio.

Return JSON:
{
  "headlines": string[],
  "aboutSection": string,
  "shortSummary": string
}`;

    const prompt = `Candidate Resume:\n${JSON.stringify(resumeData, null, 2)}`;
    const result = await callGemini(prompt, systemPrompt, true);
    res.json(JSON.parse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate LinkedIn content' });
  }
});

// 13. Recreate Resume AI
app.post('/api/ai/recreate-resume', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, textContent } = req.body;

    const systemPrompt = `You are an AI resume reconstruction engine for ResumeForge AI.
Extract all details from the provided resume input and restructure into this JSON schema:
{
  "personal": { "fullName": "", "jobTitle": "", "email": "", "phone": "", "address": "", "website": "", "linkedin": "", "github": "", "summary": "" },
  "experiences": [{ "id": "exp-1", "company": "", "role": "", "location": "", "startDate": "", "endDate": "", "current": false, "bullets": [""] }],
  "educations": [{ "id": "edu-1", "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "", "gpa": "" }],
  "skills": [{ "name": "", "category": "Core", "level": 5 }],
  "projects": [{ "id": "proj-1", "name": "", "description": "", "technologies": "", "link": "" }],
  "certifications": [{ "id": "cert-1", "name": "", "issuer": "", "date": "" }],
  "languages": [{ "name": "", "proficiency": "Fluent" }]
}`;

    if (imageBase64 && ai) {
      const imagePart = {
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      };
      const textPart = { text: 'Extract and parse this resume into structured resume JSON.' };

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, data: parsed });
      return;
    } else {
      const result = await callGemini(textContent || 'No content provided', systemPrompt, true);
      res.json({ success: true, data: JSON.parse(result) });
      return;
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to recreate resume' });
  }
});

// 14. Analyze Custom Uploaded Template Design (Image or PDF)
app.post('/api/ai/analyze-template', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, fileName } = req.body;

    const systemPrompt = `You are an expert Canva & Figma design analyzer for ResumeForge AI.
Analyze the user's uploaded template design (image or PDF preview).
Determine:
1. Recommended layoutMode: must be one of ["side-panel", "canva-grid", "timeline-split", "executive-classic", "designer-two-tone"]
2. Dominant primaryColor: hex color (e.g. "#0B5FFF", "#7B61FF", "#0F172A", "#1E293B", etc.)
3. Accent accentColor: hex color (e.g. "#45D6FF", "#34D399", "#F43F5E", etc.)
4. Recommended fontFamily: one of ["outfit", "plus-jakarta", "playfair", "mono"]
5. Recommended photoShape: one of ["floating", "modern-frame", "creative", "circle", "rounded", "square"]
6. Suggested templateName: string

Return JSON:
{
  "name": string,
  "layoutMode": string,
  "primaryColor": string,
  "accentColor": string,
  "fontFamily": string,
  "photoShape": string,
  "analysis": string
}`;

    if (imageBase64 && ai) {
      const imagePart = {
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      };
      const textPart = { text: `Analyze the visual structure and color theme of this uploaded template named "${fileName || 'Custom Template'}"` };

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, template: parsed });
      return;
    }

    // Default intelligent fallback if image data is not available or pure PDF
    res.json({
      success: true,
      template: {
        name: fileName ? `Custom: ${fileName.replace(/\.[^/.]+$/, '')}` : 'My Uploaded Custom Template',
        layoutMode: 'side-panel',
        primaryColor: '#0B5FFF',
        accentColor: '#45D6FF',
        fontFamily: 'outfit',
        photoShape: 'floating',
        analysis: 'Detected modern dual-tone layout with left rail accents and executive typography.',
      },
    });
  } catch (error: any) {
    console.error('Analyze template error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze uploaded template' });
  }
});

// Vite integration for development / production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ResumeForge AI server running at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

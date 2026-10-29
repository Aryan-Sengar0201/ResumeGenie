import React from 'react';
import {
  Sparkles,
  FileCheck2,
  TrendingUp,
  Cpu,
  Download,
  ArrowRight,
  Target,
  Code2,
  FileText,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onLoadSample: (sample: 'swe' | 'data') => void;
  openMethodology: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onLoadSample,
  openMethodology,
}) => {
  return (
    <div className="space-y-20 py-8 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6 sm:pt-14">
        {/* Eyebrow */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>AI-Powered Resume Intelligence</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-[1.15]">
          Build a stronger resume.{' '}
          <span className="text-purple-600 dark:text-purple-400">
            Find your next opportunity.
          </span>
        </h1>

        {/* Supporting text */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
          Analyze your resume, uncover skill gaps, explore career paths, and turn your experience into stronger achievements.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartAnalysis}
            className="px-6 py-3 rounded-lg font-semibold text-sm bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <span>Analyze Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onLoadSample('swe')}
            className="px-5 py-3 rounded-lg font-medium text-sm bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Try Sample Resume</span>
          </button>
        </div>

        {/* Supporting note */}
        <div className="pt-2 text-xs text-zinc-500 dark:text-zinc-400 font-normal">
          PDF and DOCX support &bull; Transparent scoring &bull; Downloadable reports
        </div>
      </section>

      {/* 3 Simple Columns without heavy cards */}
      <section className="pt-4 border-t border-zinc-200 dark:border-zinc-850">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Resume Analysis */}
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              1. Resume Analysis
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Extracts text from PDF and DOCX files to evaluate section completeness, technical skill breadth, action verbs, and quantifiable metrics using our transparent 5-pillar scoring heuristic.
            </p>
            <div className="pt-1">
              <button
                onClick={openMethodology}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center space-x-1 font-medium"
              >
                <span>Read scoring methodology</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Column 2: Skill Gap Analysis */}
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              2. Skill Gap Analysis
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Benchmarks your detected competencies against 10 real-world industry career tracks. Pinpoints critical missing skills and simulates your projected match increase as you learn them.
            </p>
          </div>

          {/* Column 3: Career Guidance */}
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              3. Career Guidance
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Transforms passive duties into high-impact STAR bullet points, prepares targeted interview questions, recommends portfolio capstone projects, and generates an executive PDF audit report.
            </p>
          </div>
        </div>
      </section>

      {/* Analytical Workflow Overview */}
      <section className="rounded-xl p-8 border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Built for Software Engineers & Tech Professionals
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-normal">
              Private local parsing, zero required login, and instant evaluation.
            </p>
          </div>
          <button
            onClick={onStartAnalysis}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors self-start sm:self-auto shrink-0 cursor-pointer"
          >
            Get Started
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
          <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
            <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">
              100% Private & Local
            </span>
            <span>Documents parsed in memory; no data sold or shared.</span>
          </div>

          <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
            <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">
              Deterministic & AI-Backed
            </span>
            <span>Accurate heuristic scoring paired with Google Gemini models.</span>
          </div>

          <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
            <span className="font-semibold text-zinc-900 dark:text-zinc-200 block">
              Verified PDF Reports
            </span>
            <span>Export complete audit results with one click.</span>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import {
  X,
  BookOpen,
  Layers,
  Zap,
  Award,
  CheckCircle,
  Briefcase,
  ShieldCheck
} from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-1">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs uppercase font-medium tracking-wider">
              Transparent Heuristic Scoring
            </span>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            How ResumeGenie Calculates Your Score (0 – 100)
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-normal">
            ResumeGenie avoids opaque "black-box" scoring. We evaluate resumes across 5 deterministic pillars derived from industry recruiter standards.
          </p>
        </div>

        {/* 5 Pillars Explained */}
        <div className="space-y-3">
          {/* Pillar 1 */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>1. Section Completeness</span>
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Max 25 pts</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Verifies the presence of foundational sections: Contact Details (email & phone), Clickable Profiles (LinkedIn/GitHub/Portfolio), Education, Skills, and Experience/Projects.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>2. Skills Depth & Diversity</span>
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Max 25 pts</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Evaluates the range of recognizable technical competencies (languages, frameworks, databases, cloud tools) and balances them with essential soft skills (problem solving, leadership).
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>3. Action Verbs & Impact Quantification</span>
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Max 20 pts</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Checks for active verbs ('Engineered', 'Architected', 'Spearheaded') and quantified outcomes (percentages, request scale, latency reductions, cost savings).
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>4. Formatting, Structure & Readability</span>
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Max 15 pts</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Ensures optimal document length (350 – 850 words), clear bullet points for scannability, and avoidance of unstructured prose blocks.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-700 dark:text-sky-300 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-sky-500" />
                <span>5. Experience & Projects Depth</span>
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Max 15 pts</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Audits project descriptions to ensure technical tools are demonstrated in real deliverables rather than isolated lists.
            </p>
          </div>
        </div>

        {/* Ethical Transparency Disclaimer */}
        <div className="p-4 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 space-y-2 text-xs text-zinc-700 dark:text-purple-200">
          <div className="flex items-center space-x-2 font-semibold text-zinc-900 dark:text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Methodology & Transparency Notice</span>
          </div>
          <p className="leading-relaxed font-normal">
            ResumeGenie is an intelligent career analytics platform built for skill development and resume optimization. The score is a transparent heuristic benchmark. We explicitly do not claim this represents any proprietary company ATS score or guarantees specific recruitment callbacks.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

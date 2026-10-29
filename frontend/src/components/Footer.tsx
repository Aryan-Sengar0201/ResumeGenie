import React from 'react';
import { ShieldCheck, Sparkles, BookOpen, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 py-10 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 dark:text-zinc-400 font-normal transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">
              ResumeGenie &mdash; AI Career Intelligence Platform
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              AI-Powered Resume Analyzer & Career Recommendation System
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Local & Private Parsing (PyMuPDF)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Google Gemini AI & Fallback Engine</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Transparent Heuristic Scoring</span>
          </div>
        </div>

        <div className="text-center md:text-right text-[11px] text-zinc-500 dark:text-zinc-400">
          Professional career intelligence platform. No hiring outcome guarantees implied.
        </div>
      </div>
    </footer>
  );
};

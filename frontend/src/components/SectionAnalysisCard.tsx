import React from 'react';
import {
  CheckCircle2,
  XCircle,
  FileCheck,
  TrendingUp,
  Check,
  AlertTriangle,
  Clock,
  Type
} from 'lucide-react';
import { AnalysisFindings, ExtractedResumeData } from '../types';

interface SectionAnalysisCardProps {
  findings: AnalysisFindings;
  extractedData: ExtractedResumeData;
}

export const SectionAnalysisCard: React.FC<SectionAnalysisCardProps> = ({
  findings,
  extractedData,
}) => {
  const allCoreSections = [
    'Contact Information',
    'Summary / Objective',
    'Education',
    'Skills',
    'Experience / Projects',
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Structural & Content Hygiene */}
      <div className="rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-5">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>Structural Sections & Document Hygiene</span>
        </h3>

        {/* Sections list */}
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Core Structural Sections Check
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allCoreSections.map(sec => {
              const isMissing = extractedData.missing_sections.includes(sec);
              return (
                <div
                  key={sec}
                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs font-medium ${
                    isMissing
                      ? 'bg-rose-500/10 border-rose-500/25 text-rose-700 dark:text-rose-300'
                      : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  <span>{sec}</span>
                  {isMissing ? (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Word count and stats */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center justify-center space-x-1 mb-1">
              <Type className="w-3.5 h-3.5" />
              <span>Word Count</span>
            </div>
            <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {extractedData.word_count}
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
              {extractedData.word_count >= 350 && extractedData.word_count <= 850
                ? 'Optimal Length'
                : 'Review Length'}
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center justify-center space-x-1 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Read Time</span>
            </div>
            <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {extractedData.estimated_read_time_seconds}s
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">Fast Recruiter Scan</div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex items-center justify-center space-x-1 mb-1">
              <Check className="w-3.5 h-3.5" />
              <span>Formatting</span>
            </div>
            <div className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {findings.readability_rating}
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
              {findings.has_bullet_points ? 'Bullet-pointed' : 'Needs Bullets'}
            </div>
          </div>
        </div>
      </div>

      {/* Impact & Action Verbs Analysis */}
      <div className="rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-5">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>Action Verbs & Quantified Impact</span>
        </h3>

        {/* Action verbs */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
            <span>Power Action Verbs Identified</span>
            <span className="text-purple-600 dark:text-purple-400 font-semibold">{findings.action_verbs_count} found</span>
          </div>
          {findings.action_verbs_found.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {findings.action_verbs_found.map(verb => (
                <span
                  key={verb}
                  className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-medium"
                >
                  {verb}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 italic font-normal">
              No strong action verbs identified. Replace phrases like 'Responsible for' with 'Engineered', 'Architected', or 'Launched'.
            </p>
          )}
        </div>

        {/* Quantified metrics */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
            <span>Quantified Metrics & Performance Points</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              {findings.quantified_metrics_count} metrics
            </span>
          </div>
          {findings.quantified_snippets.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {findings.quantified_snippets.map((snip, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-medium"
                >
                  {snip}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-amber-600/90 dark:text-amber-400/90 italic font-normal">
              No concrete numbers detected. Add percentages (e.g. 30%), user scale (10,000+), or latency savings to substantiate achievements.
            </p>
          )}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-4 lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Observed Resume Strengths</span>
            </h4>
            <ul className="space-y-2">
              {findings.strengths.map((str, idx) => (
                <li
                  key={idx}
                  className="text-xs text-zinc-700 dark:text-zinc-300 bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200/60 dark:border-emerald-500/15 p-2.5 rounded-lg flex items-start space-x-2 font-normal"
                >
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">&bull;</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses / Growth Areas */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>High-Leverage Areas for Growth</span>
            </h4>
            <ul className="space-y-2">
              {findings.weaknesses.map((w, idx) => (
                <li
                  key={idx}
                  className="text-xs text-zinc-700 dark:text-zinc-300 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200/60 dark:border-amber-500/15 p-2.5 rounded-lg flex items-start space-x-2 font-normal"
                >
                  <span className="text-amber-600 dark:text-amber-400 font-semibold shrink-0">&bull;</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

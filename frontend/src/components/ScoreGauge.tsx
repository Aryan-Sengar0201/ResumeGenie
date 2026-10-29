import React from 'react';
import {
  Award,
  Layers,
  Zap,
  BookOpen,
  Briefcase,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { ScoreBreakdown } from '../types';

interface ScoreGaugeProps {
  scoreBreakdown: ScoreBreakdown;
  openMethodology: () => void;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  scoreBreakdown,
  openMethodology,
}) => {
  const total = scoreBreakdown.total_score;

  // Determine grade and color
  let scoreStroke = 'stroke-rose-500';
  let badgeColor = 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30';
  let label = 'Needs Structural Optimization';

  if (total >= 80) {
    scoreStroke = 'stroke-emerald-500';
    badgeColor = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
    label = 'Excellent Competitive Standing';
  } else if (total >= 65) {
    scoreStroke = 'stroke-purple-600 dark:stroke-purple-500';
    badgeColor = 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30';
    label = 'Solid Foundation & Good Alignment';
  } else if (total >= 50) {
    scoreStroke = 'stroke-amber-500';
    badgeColor = 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
    label = 'Moderate Quality — Actionable Gaps';
  }

  // SVG circular calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (total / 100) * circumference;

  const pillars = [
    {
      key: 'completeness',
      data: scoreBreakdown.section_completeness,
      icon: Layers,
      color: 'bg-purple-600',
    },
    {
      key: 'skills',
      data: scoreBreakdown.skills_depth,
      icon: Zap,
      color: 'bg-purple-600',
    },
    {
      key: 'action',
      data: scoreBreakdown.action_verbs_impact,
      icon: Award,
      color: 'bg-amber-500',
    },
    {
      key: 'structure',
      data: scoreBreakdown.readability_structure,
      icon: BookOpen,
      color: 'bg-emerald-500',
    },
    {
      key: 'experience',
      data: scoreBreakdown.experience_projects,
      icon: Briefcase,
      color: 'bg-sky-500',
    },
  ];

  return (
    <div className="rounded-xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        {/* Left: Circular Gauge */}
        <div className="flex items-center space-x-6">
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-zinc-200 dark:stroke-zinc-800 fill-transparent"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`fill-transparent transition-all duration-1000 ease-out ${scoreStroke}`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Centered Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {total}
              </span>
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-2 ${badgeColor}`}
            >
              {label}
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Resume Heuristic Score
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-sm font-normal">
              Quantified assessment across 5 criteria including section coverage, tech breadth, action verbs, and impact metrics.
            </p>
          </div>
        </div>

        {/* Scoring Methodology info pill */}
        <button
          onClick={openMethodology}
          className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center space-x-1.5 shrink-0 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>How is this scored?</span>
        </button>
      </div>

      {/* 5 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pillars.map(p => {
          const pct = Math.round((p.data.score / p.data.max_score) * 100);
          const Icon = p.icon;
          return (
            <div
              key={p.key}
              className="bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded-md bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {p.data.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {p.data.score}{' '}
                    <span className="text-zinc-400 dark:text-zinc-500 font-normal">
                      / {p.data.max_score}
                    </span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden my-2">
                  <div
                    className={`${p.color} h-1.5 rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                {p.data.feedback}
              </p>
            </div>
          );
        })}
      </div>

      {/* Disclaimer Box */}
      <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex items-start space-x-2.5 text-zinc-600 dark:text-zinc-400 text-[11px]">
        <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong className="text-zinc-800 dark:text-zinc-200 font-medium">
            Transparent Methodology Notice:
          </strong>{' '}
          {scoreBreakdown.disclaimer}
        </span>
      </div>
    </div>
  );
};

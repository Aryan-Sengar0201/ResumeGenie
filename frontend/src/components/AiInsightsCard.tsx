import React from 'react';
import {
  Sparkles,
  Bot,
  Cpu,
  HelpCircle,
  Code2,
  FolderPlus,
  Lightbulb
} from 'lucide-react';
import { AIInsights, ImprovementSuggestions } from '../types';

interface AiInsightsCardProps {
  aiInsights: AIInsights;
  suggestions: ImprovementSuggestions;
}

export const AiInsightsCard: React.FC<AiInsightsCardProps> = ({
  aiInsights,
  suggestions,
}) => {
  return (
    <div className="space-y-6">
      {/* Executive Advice & AI Engine Banner */}
      <div className="rounded-xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Executive Career Insights & Strategic Advice
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">
                Personalized resume audit recommendations and career development direction.
              </p>
            </div>
          </div>

          {/* Provider Badge */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
            {aiInsights.is_ai_generated ? (
              <>
                <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300">{aiInsights.provider}</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-700 dark:text-purple-300">{aiInsights.provider}</span>
              </>
            )}
          </div>
        </div>

        {/* Executive Summary Quote */}
        {aiInsights.executive_summary && (
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs leading-relaxed italic border-l-2 border-l-purple-600 dark:border-l-purple-500 font-normal">
            "{aiInsights.executive_summary}"
          </div>
        )}

        {aiInsights.custom_career_advice && (
          <div className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start space-x-2 bg-purple-500/5 border border-purple-500/20 p-3.5 rounded-xl font-normal">
            <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-zinc-900 dark:text-white font-medium">Advisor Note: </strong>
              <span>{aiInsights.custom_career_advice}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bullet Point Transformations (STAR Method) */}
      <div className="rounded-xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-4">
        <div className="flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            STAR-Method Bullet Point Transformations
          </h3>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">
          Transform passive duty descriptions into high-conversion bullets using Situation, Task, Action, and Result with quantifiable metrics.
        </p>

        <div className="space-y-4 pt-1">
          {aiInsights.bullet_rewrites.map((br, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-850 space-y-3"
            >
              {/* Original Weakness */}
              <div className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start space-x-2 font-normal">
                <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 text-[10px] font-semibold uppercase shrink-0">
                  Before
                </span>
                <span className="italic">{br.original_theme}</span>
              </div>

              {/* Improved STAR Version */}
              <div className="text-xs text-zinc-900 dark:text-zinc-100 flex items-start space-x-2 bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200/80 dark:border-emerald-500/20 p-3 rounded-lg font-normal">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold uppercase shrink-0">
                  After (STAR)
                </span>
                <span className="font-normal text-emerald-950 dark:text-emerald-100">{br.improved_star_bullet}</span>
              </div>

              {/* Impact Explanation */}
              <div className="text-[11px] text-zinc-600 dark:text-zinc-400 pl-2 border-l border-zinc-300 dark:border-zinc-700 font-normal">
                <strong className="text-zinc-800 dark:text-zinc-300 font-medium">Why this works: </strong>
                {br.impact_explanation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tailored Interview Preparation Questions */}
      {aiInsights.interview_questions && aiInsights.interview_questions.length > 0 && (
        <div className="rounded-xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-4">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Tailored Technical Interview Preparation Questions
            </h3>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">
            Interviewers will likely test you on these exact stack decisions and architectural tradeoffs.
          </p>

          <div className="space-y-2.5 pt-1">
            {aiInsights.interview_questions.map((q, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 flex items-start space-x-3 text-xs text-zinc-800 dark:text-zinc-200"
              >
                <span className="w-5 h-5 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold flex items-center justify-center shrink-0 text-[11px]">
                  Q{idx + 1}
                </span>
                <span className="leading-relaxed font-normal">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Portfolio Projects to Bridge Skill Gaps */}
      {suggestions.project_recommendations && suggestions.project_recommendations.length > 0 && (
        <div className="rounded-xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-4">
          <div className="flex items-center space-x-2">
            <FolderPlus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Recommended Portfolio Projects to Bridge Skill Gaps
            </h3>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">
            Build one of these flagship capstones to demonstrate missing target skills to recruiters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {suggestions.project_recommendations.map((proj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-850 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{proj.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-purple-700 dark:text-purple-400 border border-zinc-200 dark:border-zinc-700/60">
                      {proj.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-[10px] uppercase font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
                    Skills Covered:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proj.skills_covered.map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60 text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

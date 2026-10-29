import React from 'react';
import {
  Compass,
  ArrowRight,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CareerMatchItem } from '../types';

interface CareerMatchesCardProps {
  careerMatches: CareerMatchItem[];
  onSelectRoleForGap: (roleTitle: string) => void;
}

export const CareerMatchesCard: React.FC<CareerMatchesCardProps> = ({
  careerMatches,
  onSelectRoleForGap,
}) => {
  return (
    <div className="rounded-xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
            <Compass className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Target Career Role Recommendations</span>
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-normal">
            Roles benchmarked against extracted competencies, weighted by core industry requirements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {careerMatches.map((role, idx) => {
          let barColor = 'bg-rose-500';
          let textColor = 'text-rose-700 dark:text-rose-400';
          let badgeBorder = 'border-rose-500/30 bg-rose-500/10';

          if (role.match_percentage >= 70) {
            barColor = 'bg-emerald-500';
            textColor = 'text-emerald-700 dark:text-emerald-400';
            badgeBorder = 'border-emerald-500/30 bg-emerald-500/10';
          } else if (role.match_percentage >= 50) {
            barColor = 'bg-purple-600 dark:bg-purple-500';
            textColor = 'text-purple-700 dark:text-purple-400';
            badgeBorder = 'border-purple-500/30 bg-purple-500/10';
          } else if (role.match_percentage >= 35) {
            barColor = 'bg-amber-500';
            textColor = 'text-amber-700 dark:text-amber-400';
            badgeBorder = 'border-amber-500/30 bg-amber-500/10';
          }

          return (
            <div
              key={role.role_title}
              className="bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">#{idx + 1}</span>
                      <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {role.role_title}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px] text-zinc-600 dark:text-zinc-400 mt-1">
                      <span className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span>Demand: {role.demand_level}</span>
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{role.average_salary_range}</span>
                      </span>
                    </div>
                  </div>

                  {/* Percentage badge */}
                  <div
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeBorder} ${textColor} text-center`}
                  >
                    {role.match_percentage}%
                  </div>
                </div>

                {/* Match bar */}
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden my-3">
                  <div
                    className={`${barColor} h-1.5 rounded-full transition-all duration-700`}
                    style={{ width: `${role.match_percentage}%` }}
                  />
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3 font-normal">
                  {role.rationale}
                </p>

                {/* Skills breakdown */}
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center space-x-1 mb-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Matching Found ({role.matched_skills.length})</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.matched_skills.slice(0, 6).map(s => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {role.matched_skills.length > 6 && (
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 self-center">
                          +{role.matched_skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  {role.priority_skills.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-700 dark:text-amber-400 flex items-center space-x-1 mb-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>High Priority Gaps to Learn</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {role.priority_skills.map(s => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Skill gap button */}
              <button
                onClick={() => onSelectRoleForGap(role.role_title)}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-medium transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>View Full Skill-Gap Analysis</span>
                <ArrowRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

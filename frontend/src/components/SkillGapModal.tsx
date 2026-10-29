import React, { useEffect, useState } from 'react';
import {
  X,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { SkillGapData, RoleBenchmark } from '../types';

interface SkillGapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoleTitle: string;
  analysisId?: string;
  candidateSkills: string[];
  availableRoles: RoleBenchmark[];
}

export const SkillGapModal: React.FC<SkillGapModalProps> = ({
  isOpen,
  onClose,
  selectedRoleTitle,
  analysisId,
  candidateSkills,
  availableRoles,
}) => {
  const [roleTitle, setRoleTitle] = useState(selectedRoleTitle);
  const [gapData, setGapData] = useState<SkillGapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedRoleTitle) {
      setRoleTitle(selectedRoleTitle);
    }
  }, [selectedRoleTitle]);

  useEffect(() => {
    if (!isOpen || !roleTitle) return;

    setIsLoading(true);
    api.getSkillGap(roleTitle, analysisId, candidateSkills)
      .then(data => setGapData(data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [isOpen, roleTitle, analysisId, candidateSkills]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-1">
            <Target className="w-5 h-5" />
            <span className="text-xs uppercase font-medium tracking-wider">
              Comparative Skill-Gap Deep Dive
            </span>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Target Role: {roleTitle}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-normal">
            Analyze exactly which competencies you have and which skills to learn next to become competitive.
          </p>

          {/* Quick role switcher */}
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">Switch role:</span>
            <select
              value={roleTitle}
              onChange={e => setRoleTitle(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-purple-600"
            >
              {availableRoles.map(r => (
                <option key={r.title} value={r.title}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-zinc-500 dark:text-zinc-400 flex flex-col items-center justify-center space-y-2">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span>Calculating comparative gap analytics...</span>
          </div>
        ) : gapData ? (
          <div className="space-y-6">
            {/* Simulation Score Card */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-0.5">
                  Projected Match Potential
                </div>
                <div className="text-sm text-zinc-700 dark:text-zinc-200 font-normal">
                  Current Match: <strong className="text-zinc-900 dark:text-white font-semibold">{gapData.match_percentage}%</strong>
                  {' '}&rarr; Projected with top 2 priority skills:{' '}
                  <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{gapData.projected_match_with_priorities}%</strong>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{gapData.projected_match_with_priorities - gapData.match_percentage}% Potential Boost</span>
              </div>
            </div>

            {/* Side-by-side Skills Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matched Skills */}
              <div className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Skills You Already Have ({gapData.matched_skills.length})</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {gapData.matched_skills.map(skill => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {gapData.matched_skills.length === 0 && (
                    <span className="text-xs text-zinc-500 italic">
                      None of the target skills currently match.
                    </span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Missing Requirements ({gapData.missing_skills.length})</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {gapData.missing_skills.map(skill => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Priority Learning Roadmap Order */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Recommended Skill Acquisition Priority Order</span>
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">
                Focus on these high-demand core competencies first to maximize interview chances:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {gapData.priority_learning_order.map((skill, index) => (
                  <div
                    key={skill}
                    className="p-3 rounded-lg bg-white dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60 flex items-center space-x-3 text-xs"
                  >
                    <span className="w-5 h-5 rounded-md bg-purple-600/15 text-purple-700 dark:text-purple-300 font-semibold flex items-center justify-center shrink-0 text-xs">
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-white">{skill}</span>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal">
                        {index === 0
                          ? 'Immediate priority (Core competency)'
                          : index === 1
                          ? 'High secondary impact'
                          : 'Recommended complementary tool'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Certifications */}
            {gapData.recommended_certifications.length > 0 && (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Recognized Credentials & Certifications</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {gapData.recommended_certifications.map(cert => (
                    <span
                      key={cert}
                      className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

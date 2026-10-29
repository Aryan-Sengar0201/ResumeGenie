import React, { useState } from 'react';
import {
  Compass,
  Search,
  TrendingUp,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { RoleBenchmark } from '../types';
import { SkillGapModal } from '../components/SkillGapModal';

interface CareerExplorerPageProps {
  roles: RoleBenchmark[];
  candidateSkills: string[];
}

export const CareerExplorerPage: React.FC<CareerExplorerPageProps> = ({
  roles,
  candidateSkills,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleForGap, setSelectedRoleForGap] = useState<string | null>(null);

  const filteredRoles = roles.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
    r.core_skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase().trim()))
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
          <Compass className="w-3.5 h-3.5" />
          <span>Industry Career Tracks Catalogue</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Benchmark Your Tech Stack Against Target Roles
        </h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
          Explore essential industry competencies, core vs secondary requirements, and market demand for modern tech positions.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto pt-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search roles or skills (e.g. Python, DevOps, React)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRoles.map(role => (
          <div
            key={role.title}
            className="rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-4 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {role.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <span>{role.demand_level} Demand</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center space-x-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{role.salary_range}</span>
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed my-3 font-normal">
                {role.description}
              </p>

              {/* Core Skills */}
              <div className="space-y-2 pt-1">
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-purple-700 dark:text-purple-400 block mb-1">
                    Core Technical Requirements (Higher Weight)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.core_skills.map(s => {
                      const hasSkill = candidateSkills.includes(s);
                      return (
                        <span
                          key={s}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                            hasSkill
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/60'
                          }`}
                        >
                          {s} {hasSkill && '✓'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Secondary Skills */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1">
                    Secondary & Recommended Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {role.secondary_skills.map(s => {
                      const hasSkill = candidateSkills.includes(s);
                      return (
                        <span
                          key={s}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                            hasSkill
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                              : 'bg-zinc-50 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                          }`}
                        >
                          {s} {hasSkill && '✓'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Test match button */}
            <button
              onClick={() => setSelectedRoleForGap(role.title)}
              className="w-full mt-4 py-2 px-3 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60 text-xs font-medium transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Test Your Skill-Gap For This Role</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedRoleForGap && (
        <SkillGapModal
          isOpen={Boolean(selectedRoleForGap)}
          onClose={() => setSelectedRoleForGap(null)}
          selectedRoleTitle={selectedRoleForGap}
          candidateSkills={candidateSkills}
          availableRoles={roles}
        />
      )}
    </div>
  );
};

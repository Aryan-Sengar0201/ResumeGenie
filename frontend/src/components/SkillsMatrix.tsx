import React, { useState } from 'react';
import {
  Code,
  Layout,
  Server,
  Database,
  Cloud,
  Brain,
  Wrench,
  Users,
  Search
} from 'lucide-react';
import { CategorizedSkills } from '../types';

interface SkillsMatrixProps {
  skillsByCategory: CategorizedSkills;
  allSkills: string[];
}

export const SkillsMatrix: React.FC<SkillsMatrixProps> = ({
  skillsByCategory,
  allSkills,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      key: 'programming_languages',
      title: 'Languages',
      icon: Code,
      skills: skillsByCategory.programming_languages || [],
    },
    {
      key: 'frontend',
      title: 'Frontend',
      icon: Layout,
      skills: skillsByCategory.frontend || [],
    },
    {
      key: 'backend',
      title: 'Backend',
      icon: Server,
      skills: skillsByCategory.backend || [],
    },
    {
      key: 'databases',
      title: 'Databases & Storage',
      icon: Database,
      skills: skillsByCategory.databases || [],
    },
    {
      key: 'cloud_devops',
      title: 'Cloud & DevOps',
      icon: Cloud,
      skills: skillsByCategory.cloud_devops || [],
    },
    {
      key: 'ai_ml_data',
      title: 'AI, ML & Data',
      icon: Brain,
      skills: skillsByCategory.ai_ml_data || [],
    },
    {
      key: 'tools_frameworks',
      title: 'Tools & Methodologies',
      icon: Wrench,
      skills: skillsByCategory.tools_frameworks || [],
    },
    {
      key: 'soft_skills',
      title: 'Soft & Leadership',
      icon: Users,
      skills: skillsByCategory.soft_skills || [],
    },
  ];

  const filteredCount = allSkills.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase().trim())
  ).length;

  return (
    <div className="rounded-xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Identified Competencies Matrix
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
              {allSkills.length} Total Skills
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-normal">
            Categorized technical and interpersonal skills identified in the resume text.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search extracted skills..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500"
          />
        </div>
      </div>

      {searchTerm && (
        <div className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">
          Found <strong className="text-purple-600 dark:text-purple-400 font-semibold">{filteredCount}</strong> skills matching "{searchTerm}".
        </div>
      )}

      {/* Grid of categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(cat => {
          const Icon = cat.icon;
          const displaySkills = cat.skills.filter(s =>
            s.toLowerCase().includes(searchTerm.toLowerCase().trim())
          );

          if (searchTerm && displaySkills.length === 0) return null;

          return (
            <div
              key={cat.key}
              className="bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      {cat.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                    {displaySkills.length}
                  </span>
                </div>

                {displaySkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {displaySkills.map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/60 hover:border-purple-500/50 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 italic pt-1">
                    None explicitly detected.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

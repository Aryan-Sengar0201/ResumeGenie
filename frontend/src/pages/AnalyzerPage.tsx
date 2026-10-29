import React, { useState } from 'react';
import {
  FileText,
  Download,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Link2,
  Calendar,
  Sparkles,
  RefreshCw,
  Target
} from 'lucide-react';
import { AnalysisResponse, RoleBenchmark } from '../types';
import { ResumeUploader } from '../components/ResumeUploader';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillsMatrix } from '../components/SkillsMatrix';
import { SectionAnalysisCard } from '../components/SectionAnalysisCard';
import { CareerMatchesCard } from '../components/CareerMatchesCard';
import { AiInsightsCard } from '../components/AiInsightsCard';
import { SkillGapModal } from '../components/SkillGapModal';
import { api } from '../services/api';

interface AnalyzerPageProps {
  analysisResult: AnalysisResponse | null;
  setAnalysisResult: (result: AnalysisResponse | null) => void;
  availableRoles: RoleBenchmark[];
  openMethodology: () => void;
}

export const AnalyzerPage: React.FC<AnalyzerPageProps> = ({
  analysisResult,
  setAnalysisResult,
  availableRoles,
  openMethodology,
}) => {
  const [selectedRoleForGap, setSelectedRoleForGap] = useState<string | null>(null);
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);

  const handleOpenGapModal = (roleTitle: string) => {
    setSelectedRoleForGap(roleTitle);
    setIsGapModalOpen(true);
  };

  const handleDownloadPdf = () => {
    if (!analysisResult) return;
    const url = api.getReportDownloadUrl(analysisResult.id);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* If no analysis result is loaded, show the uploader */}
      {!analysisResult ? (
        <ResumeUploader
          onAnalysisComplete={setAnalysisResult}
          availableRoles={availableRoles}
        />
      ) : (
        <div className="space-y-8">
          {/* Top Candidate & Report Header Banner */}
          <div className="rounded-xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                    {analysisResult.file_type.toUpperCase()} Audit Report
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                    <span>{new Date(analysisResult.created_at || Date.now()).toLocaleDateString()}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {analysisResult.candidate_name || 'Candidate'}
                </h2>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                  {analysisResult.candidate_email && (
                    <span className="flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                      <span>{analysisResult.candidate_email}</span>
                    </span>
                  )}
                  {analysisResult.candidate_phone && (
                    <span className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                      <span>{analysisResult.candidate_phone}</span>
                    </span>
                  )}
                  {analysisResult.extracted_data.contact_info.linkedin && (
                    <span className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>LinkedIn Profile</span>
                    </span>
                  )}
                  {analysisResult.extracted_data.contact_info.github && (
                    <span className="flex items-center space-x-1">
                      <Link2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                      <span>GitHub</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: New Upload & Download PDF */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={() => setAnalysisResult(null)}
                  className="px-3.5 py-2 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  <span>Analyze Another Resume</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white transition-colors flex items-center space-x-2 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Verified PDF Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* 1. Score Gauge & Breakdown */}
          <ScoreGauge
            scoreBreakdown={analysisResult.scores_breakdown}
            openMethodology={openMethodology}
          />

          {/* 2. Skills Matrix */}
          <SkillsMatrix
            skillsByCategory={analysisResult.extracted_data.skills_by_category}
            allSkills={analysisResult.extracted_data.all_skills}
          />

          {/* 3. Section Analysis & Action Verbs */}
          <SectionAnalysisCard
            findings={analysisResult.analysis_findings}
            extractedData={analysisResult.extracted_data}
          />

          {/* 4. Career Recommendations & Match Percentage */}
          <CareerMatchesCard
            careerMatches={analysisResult.career_matches}
            onSelectRoleForGap={handleOpenGapModal}
          />

          {/* 5. Strategic AI Insights, STAR Rewrites & Interview Prep */}
          <AiInsightsCard
            aiInsights={analysisResult.ai_insights}
            suggestions={analysisResult.suggestions}
          />

          {/* Export PDF Bar */}
          <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Export Executive Audit Report
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 font-normal">
                Download a clean, verified PDF report ready to share with hiring managers, mentors, or recruiters.
              </p>
            </div>
            <button
              onClick={handleDownloadPdf}
              className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white transition-colors flex items-center space-x-2 shrink-0 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Report</span>
            </button>
          </div>
        </div>
      )}

      {/* Skill Gap Deep Dive Modal */}
      {selectedRoleForGap && (
        <SkillGapModal
          isOpen={isGapModalOpen}
          onClose={() => setIsGapModalOpen(false)}
          selectedRoleTitle={selectedRoleForGap}
          analysisId={analysisResult?.id}
          candidateSkills={analysisResult?.extracted_data.all_skills || []}
          availableRoles={availableRoles}
        />
      )}
    </div>
  );
};

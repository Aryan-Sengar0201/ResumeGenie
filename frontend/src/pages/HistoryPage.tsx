import React, { useEffect, useState } from 'react';
import {
  History,
  FileText,
  Calendar,
  Trash2,
  Download,
  ArrowRight,
  RefreshCw,
  Compass,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { HistoryItem, AnalysisResponse } from '../types';

interface HistoryPageProps {
  onSelectAnalysis: (analysis: AnalysisResponse) => void;
  onGoToAnalyzer: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onSelectAnalysis,
  onGoToAnalyzer,
}) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const items = await api.getAnalyses();
      setHistoryItems(items);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenItem = async (id: string) => {
    setLoadingId(id);
    try {
      const fullAnalysis = await api.getAnalysisById(id);
      onSelectAnalysis(fullAnalysis);
    } catch (err: any) {
      alert('Failed to load analysis: ' + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis from history?')) return;
    try {
      await api.deleteAnalysis(id);
      setHistoryItems(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleDownloadPdf = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(api.getReportDownloadUrl(id), '_blank');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center space-x-2">
            <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Recent Resume Analyses & History</span>
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-normal">
            Persisted locally in SQLite. Re-open past analyses or download PDF reports anytime.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center space-x-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2 font-normal">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* History Items */}
      {isLoading && historyItems.length === 0 ? (
        <div className="py-16 text-center text-xs text-zinc-500 dark:text-zinc-400 space-y-2 font-normal">
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <span>Loading analysis records...</span>
        </div>
      ) : historyItems.length === 0 ? (
        <div className="rounded-xl p-12 text-center border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-zinc-900 dark:text-white">No Resume Analyses Yet</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto font-normal">
              Upload your first resume or test our built-in CS/Data Analyst sample resumes to see analysis records here.
            </p>
          </div>
          <button
            onClick={onGoToAnalyzer}
            className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white transition-colors inline-flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <span>Upload a Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {historyItems.map(item => {
            let scoreColor = 'text-rose-700 dark:text-rose-400 border-rose-500/30 bg-rose-500/10';
            if (item.total_score >= 80) {
              scoreColor = 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
            } else if (item.total_score >= 60) {
              scoreColor = 'text-purple-700 dark:text-purple-400 border-purple-500/30 bg-purple-500/10';
            } else if (item.total_score >= 45) {
              scoreColor = 'text-amber-700 dark:text-amber-400 border-amber-500/30 bg-amber-500/10';
            }

            return (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item.id)}
                className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  {/* Score badge */}
                  <div
                    className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center shrink-0 ${scoreColor}`}
                  >
                    <span className="text-base font-bold leading-none">{item.total_score}</span>
                    <span className="text-[9px] uppercase font-semibold tracking-wider opacity-80 mt-0.5">
                      score
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {item.candidate_name || 'Candidate'}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60">
                        {item.file_type}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400 mt-1 font-normal">
                      <span className="text-zinc-900 dark:text-zinc-300 font-medium">{item.filename}</span>
                      <span>&bull;</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </span>
                      {item.top_career_match && (
                        <>
                          <span>&bull;</span>
                          <span className="flex items-center space-x-1 text-purple-700 dark:text-purple-300">
                            <Compass className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            <span>{item.top_career_match}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={e => handleDownloadPdf(item.id, e)}
                    className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-700/60 transition-colors cursor-pointer"
                    title="Download PDF Report"
                  >
                    <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </button>

                  <button
                    onClick={e => handleDelete(item.id, e)}
                    className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 hover:bg-rose-500/15 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 border border-zinc-200 dark:border-zinc-700/60 hover:border-rose-500/30 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-500/25 group-hover:bg-purple-600 group-hover:text-white transition-colors flex items-center space-x-1">
                    <span>{loadingId === item.id ? 'Loading...' : 'Open Audit'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

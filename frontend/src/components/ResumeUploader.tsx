import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileCheck,
  AlertCircle,
  FileText,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { AnalysisResponse, RoleBenchmark } from '../types';

interface ResumeUploaderProps {
  onAnalysisComplete: (result: AnalysisResponse) => void;
  availableRoles: RoleBenchmark[];
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onAnalysisComplete,
  availableRoles,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState<string>('');
  const [isCustomRole, setIsCustomRole] = useState<boolean>(false);
  const [customRoleInput, setCustomRoleInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisSteps = [
    'Parsing file and extracting text with PyMuPDF...',
    'Detecting resume sections & contact details...',
    'Extracting technical and soft competencies...',
    'Evaluating transparent 5-pillar heuristic scores...',
    'Matching career benchmarks & generating recommendations...',
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    const validExtensions = ['.pdf', '.docx'];
    const fileName = file.name.toLowerCase();
    const isValidExt = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidExt) {
      setErrorMessage('Invalid file format. Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit. Please upload a smaller file.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const runStepSimulation = () => {
    setCurrentStepIndex(0);
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < analysisSteps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 600);
    return interval;
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.7 },
        colors: ['#7c3aed', '#a855f7', '#38bdf8', '#10b981'],
      });
    } catch {
      // Ignored if confetti fails
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setErrorMessage(null);
    const stepInterval = runStepSimulation();

    const finalTargetRole = isCustomRole ? customRoleInput : targetRole;

    try {
      const result = await api.analyzeResume(selectedFile, finalTargetRole || undefined);
      clearInterval(stepInterval);
      triggerCelebration();
      onAnalysisComplete(result);
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(err.message || 'An error occurred during resume analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async (sampleName: 'swe' | 'data') => {
    setIsLoading(true);
    setErrorMessage(null);
    const stepInterval = runStepSimulation();

    try {
      const result = await api.analyzeSample(
        sampleName,
        sampleName === 'swe' ? 'Full Stack Developer' : 'Data Analyst'
      );
      clearInterval(stepInterval);
      triggerCelebration();
      onAnalysisComplete(result);
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMessage(err.message || 'Failed to load sample resume.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Card */}
      <div className="rounded-xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-xs relative">
        <div>
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Upload Your Resume for Instant Audit
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 font-normal">
              Supports <span className="font-medium text-zinc-900 dark:text-zinc-200">PDF</span> and{' '}
              <span className="font-medium text-zinc-900 dark:text-zinc-200">DOCX</span> formats. Evaluated against 5 transparent heuristic pillars with tailored career matching.
            </p>
          </div>

          {/* Role selector */}
          <div className="mb-6 max-w-md mx-auto">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
              Target Career Role (Optional)
            </label>
            <div className="space-y-2">
              <select
                value={isCustomRole ? '__custom__' : targetRole}
                onChange={e => {
                  if (e.target.value === '__custom__') {
                    setIsCustomRole(true);
                  } else {
                    setIsCustomRole(false);
                    setTargetRole(e.target.value);
                  }
                }}
                disabled={isLoading}
                aria-label="Target Career Role"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 transition-colors"
              >
                <option value="">Auto-Detect Best Matching Role</option>
                {availableRoles.map(role => (
                  <option key={role.title} value={role.title}>
                    {role.title}
                  </option>
                ))}
                <option value="__custom__">+ Custom Target Role...</option>
              </select>

              {isCustomRole && (
                <input
                  type="text"
                  placeholder="e.g. Embedded Firmware Engineer"
                  value={customRoleInput}
                  onChange={e => setCustomRoleInput(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500"
                />
              )}
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-colors duration-150 flex flex-col items-center justify-center ${
              dragActive
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20'
                : selectedFile
                ? 'border-emerald-600/50 bg-emerald-50/50 dark:bg-emerald-950/15'
                : 'border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {(selectedFile.size / 1024).toFixed(1)} KB &bull; Click to choose another file
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Drag and drop your resume here, or{' '}
                    <span className="text-purple-600 dark:text-purple-400 hover:underline">browse files</span>
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-normal">
                    Supports text-based PDF and DOCX files up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-start space-x-2.5 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Loading Animation & Step progress */}
          {isLoading && (
            <div className="mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                <span className="flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-spin" />
                  <span>Analyzing Resume...</span>
                </span>
                <span className="text-purple-600 dark:text-purple-400">
                  {Math.round(((currentStepIndex + 1) / analysisSteps.length) * 100)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentStepIndex + 1) / analysisSteps.length) * 100}%`,
                  }}
                />
              </div>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
                {analysisSteps[currentStepIndex]}
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Or try instant sample:</span>
              <button
                type="button"
                onClick={() => handleLoadSample('swe')}
                disabled={isLoading}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center space-x-1 cursor-pointer"
                title="Sample Software Engineer resume (PDF)"
              >
                <FileText className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span>SWE Resume (PDF)</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('data')}
                disabled={isLoading}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-750 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors flex items-center space-x-1 cursor-pointer"
                title="Sample Data Analyst resume (DOCX)"
              >
                <FolderOpen className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span>Data Analyst (DOCX)</span>
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || isLoading}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer ${
                !selectedFile || isLoading
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-800 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Processing...' : 'Run Comprehensive Analysis'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

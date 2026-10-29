import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  FileText,
  Compass,
  History,
  HelpCircle,
  Sun,
  Moon,
  Bot,
  Cpu,
  Layers,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

interface NavbarProps {
  activeTab: 'landing' | 'analyzer' | 'explorer' | 'history';
  setActiveTab: (tab: 'landing' | 'analyzer' | 'explorer' | 'history') => void;
  openMethodology: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openMethodology,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [aiStatus, setAiStatus] = useState<{ configured: boolean; model: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    api.checkHealth()
      .then(res => setAiStatus({ configured: res.gemini_configured, model: res.gemini_model }))
      .catch(() => setAiStatus({ configured: false, model: 'Fallback' }));
  }, []);

  const handleTabClick = (tab: 'landing' | 'analyzer' | 'explorer' | 'history') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => handleTabClick('landing')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white transition-opacity group-hover:opacity-90">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                ResumeGenie
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal hidden sm:block">
              AI Resume Analyzer & Career Guidance
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => handleTabClick('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              activeTab === 'landing'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700/60 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => handleTabClick('analyzer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              activeTab === 'analyzer'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700/60 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 border border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Analyze Resume</span>
          </button>

          <button
            onClick={() => handleTabClick('explorer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              activeTab === 'explorer'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700/60 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 border border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Career Roles</span>
          </button>

          <button
            onClick={() => handleTabClick('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors ${
              activeTab === 'history'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700/60 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40 border border-transparent'
            }`}
          >
            <History className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>History</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* AI engine indicator */}
          {aiStatus && (
            <div
              className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                aiStatus.configured
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
                  : 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20'
              }`}
              title={
                aiStatus.configured
                  ? `Powered by Gemini API (${aiStatus.model})`
                  : 'Using high-accuracy deterministic heuristic engine (offline ready)'
              }
            >
              {aiStatus.configured ? (
                <>
                  <Bot className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Gemini AI Active</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  <span>Deterministic Engine</span>
                </>
              )}
            </div>
          )}

          {/* Scoring Methodology Modal Trigger */}
          <button
            onClick={openMethodology}
            className="px-2.5 py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-lg transition-colors flex items-center space-x-1.5 text-xs font-medium"
            title="Scoring Heuristic Methodology"
          >
            <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Scoring Guide</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-purple-600" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 px-4 py-3 space-y-1">
          <button
            onClick={() => handleTabClick('landing')}
            className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 text-left ${
              activeTab === 'landing'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => handleTabClick('analyzer')}
            className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 text-left ${
              activeTab === 'analyzer'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Analyze Resume</span>
          </button>

          <button
            onClick={() => handleTabClick('explorer')}
            className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 text-left ${
              activeTab === 'explorer'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <Compass className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Career Roles</span>
          </button>

          <button
            onClick={() => handleTabClick('history')}
            className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 text-left ${
              activeTab === 'history'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <History className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>History</span>
          </button>
        </div>
      )}
    </header>
  );
};

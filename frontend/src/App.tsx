import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MethodologyModal } from './components/MethodologyModal';
import { LandingPage } from './pages/LandingPage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { CareerExplorerPage } from './pages/CareerExplorerPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalysisResponse, RoleBenchmark } from './types';
import { api } from './services/api';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'landing' | 'analyzer' | 'explorer' | 'history'>('landing');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [availableRoles, setAvailableRoles] = useState<RoleBenchmark[]>([]);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  useEffect(() => {
    api.getRoles()
      .then(roles => setAvailableRoles(roles))
      .catch(err => console.error('Failed to load career benchmarks:', err));
  }, []);

  const handleStartAnalysis = () => {
    setActiveTab('analyzer');
  };

  const handleLoadSampleFromLanding = async (sample: 'swe' | 'data') => {
    setActiveTab('analyzer');
    try {
      const res = await api.analyzeSample(
        sample,
        sample === 'swe' ? 'Full Stack Developer' : 'Data Analyst'
      );
      setAnalysisResult(res);
    } catch (err: any) {
      alert('Failed to load sample: ' + err.message);
    }
  };

  const handleSelectHistoryAnalysis = (item: AnalysisResponse) => {
    setAnalysisResult(item);
    setActiveTab('analyzer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors selection:bg-purple-500/20 selection:text-purple-700 dark:selection:text-purple-300">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openMethodology={() => setIsMethodologyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' && (
          <LandingPage
            onStartAnalysis={handleStartAnalysis}
            onLoadSample={handleLoadSampleFromLanding}
            openMethodology={() => setIsMethodologyOpen(true)}
          />
        )}

        {activeTab === 'analyzer' && (
          <AnalyzerPage
            analysisResult={analysisResult}
            setAnalysisResult={setAnalysisResult}
            availableRoles={availableRoles}
            openMethodology={() => setIsMethodologyOpen(true)}
          />
        )}

        {activeTab === 'explorer' && (
          <CareerExplorerPage
            roles={availableRoles}
            candidateSkills={analysisResult?.extracted_data.all_skills || []}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            onSelectAnalysis={handleSelectHistoryAnalysis}
            onGoToAnalyzer={() => setActiveTab('analyzer')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Scoring Methodology Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;

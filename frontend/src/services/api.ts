import {
  AnalysisResponse,
  HistoryItem,
  RoleBenchmark,
  SkillGapData
} from '../types';

const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api`;

export const api = {
  async checkHealth(): Promise<{ status: string; app: string; gemini_configured: boolean; gemini_model: string }> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Backend server is unreachable');
    return res.json();
  },

  async getRoles(): Promise<RoleBenchmark[]> {
    const res = await fetch(`${API_BASE}/roles`);
    if (!res.ok) throw new Error('Failed to fetch career roles');
    return res.json();
  },

  async analyzeResume(file: File, targetRole?: string): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (targetRole) {
      formData.append('target_role', targetRole);
    }

    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed with status ${res.status}`);
    }

    return res.json();
  },

  async analyzeSample(sampleName: 'swe' | 'data', targetRole?: string): Promise<AnalysisResponse> {
    let url = `${API_BASE}/sample/${sampleName}`;
    if (targetRole) {
      url += `?target_role=${encodeURIComponent(targetRole)}`;
    }

    const res = await fetch(url, {
      method: 'POST',
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to load sample resume');
    }

    return res.json();
  },

  async getAnalyses(limit = 20): Promise<HistoryItem[]> {
    const res = await fetch(`${API_BASE}/analyses?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  async getAnalysisById(id: string): Promise<AnalysisResponse> {
    const res = await fetch(`${API_BASE}/analyses/${id}`);
    if (!res.ok) throw new Error('Analysis report not found');
    return res.json();
  },

  async deleteAnalysis(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/analyses/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete analysis');
  },

  async getSkillGap(roleTitle: string, analysisId?: string, currentSkills?: string[]): Promise<SkillGapData> {
    const res = await fetch(`${API_BASE}/skill-gap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role_title: roleTitle,
        analysis_id: analysisId,
        current_skills: currentSkills,
      }),
    });

    if (!res.ok) throw new Error('Failed to calculate skill gap');
    return res.json();
  },

  getReportDownloadUrl(analysisId: string): string {
    return `${API_BASE}/report/${analysisId}/pdf`;
  },
};

const API_BASE = 'https://designops-maturity.de/api/v1';
const DEV_SUBMISSIONS_PREFIX = 'designops-dev-submission-';

export interface AdminStats {
  total: number;
  avgScore: number;
  minScore: number;
  maxScore: number;
  earliest: string;
  latest: string;
  branches: string[];
}

export async function fetchAdminStats(): Promise<AdminStats> {
  if (import.meta.env.DEV) {
    let total = 0;
    let sumScore = 0;
    let minScore = Infinity;
    let maxScore = -Infinity;
    let earliest = '';
    let latest = '';
    const branches = new Set<string>();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DEV_SUBMISSIONS_PREFIX)) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const data = JSON.parse(value);
            total++;
            const score = data.results?.overallScore || 0;
            sumScore += score;
            minScore = Math.min(minScore, score);
            maxScore = Math.max(maxScore, score);

            const submittedAt = data.meta?.submittedAt || '';
            if (submittedAt) {
              if (!earliest || submittedAt < earliest) earliest = submittedAt;
              if (!latest || submittedAt > latest) latest = submittedAt;
            }

            const branch = data.rawAnswers?.d_branch;
            if (branch) branches.add(branch);
          }
        } catch (e) {
          // ignore parsing errors
        }
      }
    }

    if (total === 0) {
      return {
        total: 0,
        avgScore: 0,
        minScore: 0,
        maxScore: 0,
        earliest: '',
        latest: '',
        branches: [],
      };
    }

    return {
      total,
      avgScore: sumScore / total,
      minScore,
      maxScore,
      earliest,
      latest,
      branches: Array.from(branches).sort(),
    };
  }

  const response = await fetch(`${API_BASE}/survey/stats`, {
    headers: {
      'X-API-Key': import.meta.env.VITE_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

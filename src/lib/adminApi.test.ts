/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchAdminStats } from './adminApi';

const DEV_SUBMISSIONS_PREFIX = 'designops-dev-submission-';

describe('fetchAdminStats', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    globalThis.fetch = vi.fn();
    localStorage.clear();
    vi.stubEnv('VITE_API_KEY', 'test-api-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('production mode', () => {
    beforeEach(() => {
      vi.stubEnv('DEV', false);
    });

    it('returns parsed data on success (200 OK)', async () => {
      const mockResponse = {
        total: 5,
        avgScore: 3.2,
        minScore: 1.8,
        maxScore: 4.6,
        earliest: '2025-06-01T10:00:00.000Z',
        latest: '2026-04-15T12:00:00.000Z',
        branches: ['Banking', 'IT']
      };

      (globalThis.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const stats = await fetchAdminStats();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://designops-maturity.de/api/v1/survey/stats',
        { headers: { 'X-API-Key': 'test-api-key' } }
      );
      expect(stats).toEqual(mockResponse);
    });

    it('throws on non-200 response', async () => {
      (globalThis.fetch as any).mockResolvedValue({
        ok: false,
        status: 500
      });

      await expect(fetchAdminStats()).rejects.toThrow('API error: 500');
    });

    it('throws on 401 response (missing API key)', async () => {
      (globalThis.fetch as any).mockResolvedValue({
        ok: false,
        status: 401
      });

      await expect(fetchAdminStats()).rejects.toThrow('API error: 401');
    });
  });

  describe('dev mode', () => {
    beforeEach(() => {
      vi.stubEnv('DEV', true);
    });

    it('returns zeros when no submissions in localStorage', async () => {
      const stats = await fetchAdminStats();

      expect(stats).toEqual({
        total: 0,
        avgScore: 0,
        minScore: 0,
        maxScore: 0,
        earliest: '',
        latest: '',
        branches: []
      });
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it('computes stats from localStorage submissions', async () => {
      const submission1 = {
        meta: { submittedAt: '2026-01-01T10:00:00.000Z' },
        rawAnswers: { d_branch: 'Retail' },
        results: { overallScore: 2.0 }
      };
      
      const submission2 = {
        meta: { submittedAt: '2026-02-01T10:00:00.000Z' },
        rawAnswers: { d_branch: 'Banking' },
        results: { overallScore: 4.0 }
      };

      const submission3 = {
        meta: { submittedAt: '2026-01-15T10:00:00.000Z' },
        rawAnswers: { d_branch: 'Retail' }, // duplicate branch should be deduped
        results: { overallScore: 3.0 }
      };

      localStorage.setItem(`${DEV_SUBMISSIONS_PREFIX}1`, JSON.stringify(submission1));
      localStorage.setItem(`${DEV_SUBMISSIONS_PREFIX}2`, JSON.stringify(submission2));
      localStorage.setItem(`${DEV_SUBMISSIONS_PREFIX}3`, JSON.stringify(submission3));
      localStorage.setItem('some-other-key', 'ignored data');

      const stats = await fetchAdminStats();

      expect(stats).toEqual({
        total: 3,
        avgScore: 3.0,
        minScore: 2.0,
        maxScore: 4.0,
        earliest: '2026-01-01T10:00:00.000Z',
        latest: '2026-02-01T10:00:00.000Z',
        branches: ['Banking', 'Retail'] // sorted alphabetically
      });
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });
  });
});
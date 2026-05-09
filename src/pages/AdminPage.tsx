import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  fetchAdminStats,
  fetchAdminSubmissions,
  resolveWorstDimension,
  type AdminStats,
  type AdminSubmissionsParams,
  type AdminSubmissionsResponse
} from '../lib/adminApi';
import './AdminPage.css';

export function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filters: AdminSubmissionsParams = useMemo(() => {
    const p = Object.fromEntries(searchParams);
    return {
      page: p.page ?? '1',
      dateFrom: p.dateFrom ?? '',
      dateTo: p.dateTo ?? '',
      scoreMin: p.scoreMin ?? '',
      scoreMax: p.scoreMax ?? '',
      branch: p.branch ?? '',
    };
  }, [searchParams]);

  const [statsState, setStatsState] = useState<'loading' | 'error' | 'ready'>('loading');
  const [statsData, setStatsData] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [dataState, setDataState] = useState<'loading' | 'error' | 'ready'>('loading');
  const [dataError, setDataError] = useState<string | null>(null);
  const [data, setData] = useState<AdminSubmissionsResponse | null>(null);

  const loadStats = useCallback(() => {
    let cancelled = false;
    setStatsState('loading');
    setStatsError(null);
    fetchAdminStats()
      .then(d => {
        if (!cancelled) {
          setStatsData(d);
          setStatsState('ready');
        }
      })
      .catch(err => {
        if (!cancelled) {
          setStatsError(err.message);
          setStatsState('error');
        }
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const cancel = loadStats();
    return cancel;
  }, [loadStats]);

  useEffect(() => {
    let cancelled = false;
    setDataState('loading');
    setDataError(null);
    fetchAdminSubmissions(filters)
      .then(d => {
        if (!cancelled) {
          setData(d);
          setDataState('ready');
        }
      })
      .catch(err => {
        if (!cancelled) {
          setDataError(err.message);
          setDataState('error');
        }
      });
    return () => { cancelled = true; };
  }, [filters]);

  const handleFilterChange = (key: keyof AdminSubmissionsParams, value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      if (key !== 'page') {
        next.set('page', '1');
      }
      return next;
    });
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h2>Verwaltung</h2>
      </header>

      <main className="admin-main">
        {statsState === 'loading' ? (
          <div className="admin-loading">Loading stats...</div>
        ) : statsState === 'error' ? (
          <div className="admin-error-banner">
            <span>{statsError || 'Failed to load stats.'}</span>
            <button className="btn" onClick={loadStats}>Retry</button>
          </div>
        ) : statsData ? (
          <div className="admin-stats-strip">
            <div className="admin-stat-card">
              <span className="admin-stat-label">Einsendungen</span>
              <span className="admin-stat-value">{statsData.total}</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Ø Score</span>
              <span className="admin-stat-value">
                {statsData.total > 0 ? statsData.avgScore.toFixed(1) : '-'}
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Min Score</span>
              <span className="admin-stat-value">
                {statsData.total > 0 ? statsData.minScore.toFixed(1) : '-'}
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Max Score</span>
              <span className="admin-stat-value">
                {statsData.total > 0 ? statsData.maxScore.toFixed(1) : '-'}
              </span>
            </div>
          </div>
        ) : null}

        <div className="admin-filter-bar">
          <input 
            type="date" 
            className="admin-filter-input" 
            placeholder="Date From" 
            value={filters.dateFrom} 
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)} 
          />
          <input 
            type="date" 
            className="admin-filter-input" 
            placeholder="Date To" 
            value={filters.dateTo} 
            onChange={(e) => handleFilterChange('dateTo', e.target.value)} 
          />
          <input 
            type="number" 
            className="admin-filter-input" 
            placeholder="Min Score" 
            value={filters.scoreMin} 
            onChange={(e) => handleFilterChange('scoreMin', e.target.value)} 
          />
          <input 
            type="number" 
            className="admin-filter-input" 
            placeholder="Max Score" 
            value={filters.scoreMax} 
            onChange={(e) => handleFilterChange('scoreMax', e.target.value)} 
          />
          <select 
            className="admin-filter-input" 
            value={filters.branch} 
            onChange={(e) => handleFilterChange('branch', e.target.value)}
          >
            <option value="">Alle Branchen</option>
            {statsData?.branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>

        {dataState === 'loading' ? (
          <div className="admin-loading">Loading data...</div>
        ) : dataState === 'error' ? (
          <div className="admin-error-banner">
            <span>{dataError || 'Failed to load data.'}</span>
            <button className="btn" onClick={() => handleFilterChange('page', filters.page || '1')}>Retry</button>
          </div>
        ) : data ? (
          <>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Eingereicht</th>
                    <th>Branch</th>
                    <th>Größe</th>
                    <th style={{ textAlign: 'right' }}>Score</th>
                    <th>Reifegrad</th>
                    <th>Schwächste Dimension</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map(sub => (
                    <tr 
                      key={sub._id} 
                      onClick={() => window.open(`/survey/result/${sub._id}`, '_blank')}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{new Date(sub.answers.meta.submittedAt).toLocaleDateString('de-DE')}</td>
                      <td><div className="truncate" style={{ maxWidth: '200px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{sub.answers.rawAnswers.d_branch as string}</div></td>
                      <td><div className="truncate" style={{ maxWidth: '200px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{sub.answers.rawAnswers.d_size as string}</div></td>
                      <td style={{ textAlign: 'right' }}>{sub.answers.results.overallScore.toFixed(1)}</td>
                      <td>{sub.answers.results.maturityLabel}</td>
                      <td>{resolveWorstDimension(sub)}</td>
                      <td><a href={`/survey/result/${sub._id}`} target="_blank" rel="noreferrer" aria-label="Ergebnis öffnen" style={{ color: 'var(--color-accent)' }} onClick={e => e.stopPropagation()}>→</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <button 
                className="btn btn-ghost" 
                disabled={data.page === 1}
                onClick={() => handleFilterChange('page', String(data.page - 1))}
              >← Prev</button>
              <span className="admin-pagination-info">Page {data.page} of {data.pages}</span>
              <button 
                className="btn btn-ghost" 
                disabled={data.page >= data.pages}
                onClick={() => handleFilterChange('page', String(data.page + 1))}
              >Next →</button>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
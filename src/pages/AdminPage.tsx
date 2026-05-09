import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAdminStats, type AdminStats } from '../lib/adminApi';
import './AdminPage.css';

interface AdminFilters {
  dateFrom: string;
  dateTo: string;
  scoreMin: string;
  scoreMax: string;
  branch: string;
  page: number;
}

export function AdminPage() {
  const [searchParams] = useSearchParams();
  
  const filters: AdminFilters = {
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    scoreMin: searchParams.get('scoreMin') || '',
    scoreMax: searchParams.get('scoreMax') || '',
    branch: searchParams.get('branch') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  const [statsState, setStatsState] = useState<'loading' | 'error' | 'ready'>('loading');
  const [statsData, setStatsData] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [listState, setListState] = useState<'loading' | 'error' | 'ready'>('loading');

  const loadStats = useCallback(() => {
    let cancelled = false;
    setStatsState('loading');
    setStatsError(null);
    fetchAdminStats()
      .then(data => {
        if (!cancelled) {
          setStatsData(data);
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
    // Simulate network latency for list data
    const timer = setTimeout(() => {
      setListState('ready');
    }, 500);
    return () => clearTimeout(timer);
  }, []); // Only run once for the stub

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
          <input type="date" className="admin-filter-input" placeholder="Date From" value={filters.dateFrom} readOnly />
          <input type="date" className="admin-filter-input" placeholder="Date To" value={filters.dateTo} readOnly />
          <input type="number" className="admin-filter-input" placeholder="Min Score" value={filters.scoreMin} readOnly />
          <input type="number" className="admin-filter-input" placeholder="Max Score" value={filters.scoreMax} readOnly />
          <select className="admin-filter-input" value={filters.branch} onChange={() => {}}>
            <option value="">All Branches</option>
            <option value="Automobil / Mobility">Automobil / Mobility</option>
            <option value="Banken / Finanzdienstleistungen">Banken / Finanzdienstleistungen</option>
            <option value="Sonstige">Sonstige</option>
          </select>
        </div>

        {listState === 'loading' ? (
          <div className="admin-loading">Loading data...</div>
        ) : listState === 'error' ? (
          <div className="admin-error-banner">
            <span>Failed to load data.</span>
            <button className="btn" onClick={() => setListState('loading')}>Retry</button>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Branch</th>
                  <th>Score</th>
                  <th>Waste</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td>SUB-{1000 + i}</td>
                    <td>2024-03-{10 + i}</td>
                    <td>{["Automobil / Mobility", "Banken / Finanzdienstleistungen", "Sonstige"][i % 3]}</td>
                    <td>{(2.5 + (i * 0.2)).toFixed(1)}</td>
                    <td>{10 + i}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="admin-pagination">
          <button className="btn btn-ghost" disabled>← Prev</button>
          <span className="admin-pagination-info">Page 1 of 5</span>
          <button className="btn btn-ghost" disabled>Next →</button>
        </div>
      </main>
    </div>
  );
}

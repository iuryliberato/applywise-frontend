import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

import { getMyApplications } from '../../services/jobApplicationService';
import './DashboardPage.css';

const STATUS_LABELS = {
  idea: 'Idea',
  applied: 'Applied',
  interviewing: 'Interviewing',
  'tech-test': 'Tech Test',
  offer: 'Offer',
  rejected: 'Rejected',
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Idea', label: 'Idea' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Interviewing', label: 'Interviewing' },
  { value: 'Tech-Test', label: 'Tech Test' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
];

const DashboardPage = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const [toast, setToast] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const apps = await getMyApplications();
        setApplications(apps);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const state = location.state;

    if (state?.toastMessage) {
      setToast(state.toastMessage);
      setShowToast(true);

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!toast) return;

    const hideTimer = setTimeout(() => setShowToast(false), 2600);
    const clearTimer = setTimeout(() => setToast(''), 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  }, [toast]);

  const handleRowClick = (id) => {
    navigate(`/application/${id}`);
  };

  const filteredApps = applications.filter((app) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (app.jobTitle || '').toLowerCase().includes(term) ||
      (app.companyName || '').toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="apps-page">
      <div className="apps-container">
        <h1 className="apps-title">Dashboard</h1>

        {toast && (
          <div
            className={
              'apps-toast ' + (showToast ? 'apps-toast--visible' : '')
            }
          >
            {toast}
          </div>
        )}

        <div className="apps-controls">
          <input
            type="text"
            className="apps-search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="apps-filter-wrapper">
            <button
              type="button"
              className="apps-filter-btn"
              onClick={() => setFilterOpen((prev) => !prev)}
            >
              Filter
            </button>

            {filterOpen && (
              <div className="apps-filter-menu">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={
                      'apps-filter-option' +
                      (statusFilter === opt.value
                        ? ' apps-filter-option--active'
                        : '')
                    }
                    onClick={() => {
                      setStatusFilter(opt.value);
                      setFilterOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <p className="apps-meta-text">Loading applications…</p>
        )}
        {error && <p className="apps-error">{error}</p>}

        <div className="apps-table-wrapper">
          <table className="apps-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th className="apps-status-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 && !loading ? (
                <tr>
                  <td colSpan="3" className="apps-empty">
                    No applications found. Try adjusting your search or
                    filters or adding new application.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr
                    key={app._id}
                    className="apps-row"
                    onClick={() => handleRowClick(app._id)}
                  >
                    <td>{app.jobTitle || 'Untitled role'}</td>
                    <td>{app.companyName || 'Unknown company'}</td>

                    <td className="apps-status-cell">
                      {(() => {
                        const statusKey = (app.status || 'Idea').toLowerCase();
                        return (
                          <span
                            className={
                              'apps-status-pill apps-status-pill--' +
                              statusKey
                            }
                          >
                            {STATUS_LABELS[statusKey] || statusKey}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;

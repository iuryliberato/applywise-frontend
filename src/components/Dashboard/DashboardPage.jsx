// src/pages/ApplicationsPage/ApplicationsPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getMyApplications } from '../../services/jobApplicationService';
import './DashboardPage.css';

const STATUS_LABELS = {
  'Idea': 'Idea',
  'Applied': 'Applied',
  'Interviewing': 'Interviewing',
  'Tech-Test': 'Tech Test',
  'Offer': 'Offer',
  'Rejected': 'Rejected',
};

const STATUS_OPTIONS = [
  { value: 'all',         label: 'All' },
  { value: 'Idea',        label: 'Idea' },
  { value: 'Applied',     label: 'Applied' },
  { value: 'Interviewing',label: 'Interviewing' },
  { value: 'Tech-Test',   label: 'Tech Test' },
  { value: 'Offer',       label: 'Offer' },
  { value: 'Rejected',    label: 'Rejected' },
];

const DashboardPage = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

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

        {/* Search + filter row */}
        <div className="apps-controls">
          <input
            type="text"
            className="apps-search"
            placeholder="Search by job title or company's name"
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

        {/* Table */}
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
                    No applications found. Try adjusting your search or filters.
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
    const statusKey = (app.status || 'idea').toLowerCase();

    return (
      <span
        className={
          'apps-status-pill apps-status-pill--' + statusKey
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

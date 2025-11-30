import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import './SingleApplication.css';
import { getOneApplication, updateApplicationStatus } from '../../services/jobApplicationService';


  
  const STATUS_OPTIONS = [
    { value: 'Idea',         label: 'Idea' },
    { value: 'Applied',      label: 'Applied' },
    { value: 'Interviewing', label: 'Interviewing' },
    { value: 'Tech-Test',    label: 'Tech Test' },
    { value: 'Offer',        label: 'Offer' },
    { value: 'Rejected',     label: 'Rejected' },
  ];
  

const SingleApplicationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updatingStatus, setUpdatingStatus] = useState(false);
const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOneApplication(id);
        setApp(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load application');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <main className="single-app-page">
        <p className="single-app-loading">Loading application...</p>
      </main>
    );
  }

  if (error || !app) {
    return (
      <main className="single-app-page">
        <p className="single-app-error">{error || 'Application not found.'}</p>
        <button
          className="single-app-back-btn"
          onClick={() => navigate('/add-application')}
        >
          Back to Add Application
        </button>
      </main>
    );
  }
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!app) return;
  
    try {
      setUpdatingStatus(true);
      const updated = await updateApplicationStatus(app._id, newStatus);
      setApp(updated); // updates pill + dropdown
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };
  const handleStatusChangeClick = async (newStatus) => {
    if (!app || newStatus === app.status) {
      setStatusMenuOpen(false);
      return;
    }
  
    try {
      setUpdatingStatus(true);
      const updated = await updateApplicationStatus(app._id, newStatus);
      setApp(updated);
      setStatusMenuOpen(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };
  

  const statusKey = app.status || 'idea';
  const statusLabel = STATUS_OPTIONS[statusKey] || statusKey;

  return (
    <main className="single-app-page">
      <div className="single-app-container">
        {/* Header */}
        <header className="single-app-header">
          <button
            type="button"
            className="single-app-back-link"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="single-app-header-main">
            <div>
              <h1 className="single-app-title">
                {app.jobTitle || 'Job Application'}
              </h1>
              <p className="single-app-company">
                {app.companyName || 'Unknown company'}
              </p>
            </div>

            <div className="single-app-header-right">
  {/* Status pill dropdown */}
  <div className="status-dropdown">
    <button
      type="button"
      className={
        'status-pill status-pill--' +
        statusKey +
        ' status-pill--toggle' +
        (updatingStatus ? ' status-pill--disabled' : '')
      }
      onClick={() => {
        if (!updatingStatus) setStatusMenuOpen(prev => !prev);
      }}
    >
      <span>{statusLabel}</span>
      <span className="status-dropdown-arrow">
        {statusMenuOpen ? '▲' : '▼'}
      </span>
    </button>

    {statusMenuOpen && (
      <div className="status-dropdown-menu">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={
              'status-pill status-pill--' +
              opt.value +
              (opt.value === statusKey
                ? ' status-pill--active-option'
                : '')
            }
            onClick={() => handleStatusChangeClick(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    )}
  </div>

  {app.jobUrl && (
    <a
      href={app.jobUrl}
      target="_blank"
      rel="noreferrer"
      className="single-app-link-btn"
    >
      View Original Job
    </a>
  )}
</div>

          </div>
        </header>

        {/* Meta info card */}
        <section className="single-app-card single-app-meta-card">
          <div className="single-app-meta-grid">
            <div className="single-app-meta-item">
              <span className="single-app-meta-label">Location</span>
              <span className="single-app-meta-value">
                {app.location || '—'}
              </span>
            </div>

            <div className="single-app-meta-item">
              <span className="single-app-meta-label">Employment type</span>
              <span className="single-app-meta-value">
                {app.employmentType || '—'}
              </span>
            </div>

            <div className="single-app-meta-item">
              <span className="single-app-meta-label">Seniority</span>
              <span className="single-app-meta-value">
                {app.seniorityLevel || '—'}
              </span>
            </div>

            <div className="single-app-meta-item">
              <span className="single-app-meta-label">Source</span>
              <span className="single-app-meta-value">
                {app.source || '—'}
              </span>
            </div>

            <div className="single-app-meta-item">
              <span className="single-app-meta-label">Salary</span>
              <span className="single-app-meta-value">
                {app.salaryInfo || '—'}
              </span>
            </div>

            <div className="single-app-meta-item">
              <span className="single-app-meta-label">Added on</span>
              <span className="single-app-meta-value">
                {app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString()
                  : '—'}
              </span>
            </div>
          </div>
        </section>

        {/* Summary */}
        {app.summary && (
          <section className="single-app-card">
            <h2 className="single-app-section-title">Summary</h2>
            <p className="single-app-summary">{app.summary}</p>
          </section>
        )}

        {/* Responsibilities / Requirements */}
        <section className="single-app-card">
          <div className="single-app-columns">
            <div className="single-app-column">
              <h2 className="single-app-section-title">Responsibilities</h2>
              {app.responsibilities && app.responsibilities.length > 0 ? (
                <ul className="single-app-list">
                  {app.responsibilities.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="single-app-empty">No responsibilities listed.</p>
              )}
            </div>

            <div className="single-app-column">
              <h2 className="single-app-section-title">Requirements</h2>
              {app.requirements && app.requirements.length > 0 ? (
                <ul className="single-app-list">
                  {app.requirements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="single-app-empty">No requirements listed.</p>
              )}
            </div>
          </div>
        </section>

        {/* Nice to have / Perks & benefits */}
        <section className="single-app-card">
          <div className="single-app-columns">
            <div className="single-app-column">
              <h2 className="single-app-section-title">Nice to have</h2>
              {app.niceToHave && app.niceToHave.length > 0 ? (
                <ul className="single-app-list">
                  {app.niceToHave.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="single-app-empty">No “nice to have” listed.</p>
              )}
            </div>

            <div className="single-app-column">
              <h2 className="single-app-section-title">Perks & benefits</h2>
              {app.perksAndBenefits && app.perksAndBenefits.length > 0 ? (
                <ul className="single-app-list">
                  {app.perksAndBenefits.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="single-app-empty">No perks & benefits listed.</p>
              )}
            </div>
          </div>
        </section>

        {/* Optional: raw snippet */}
        {app.rawTextSnippet && (
          <section className="single-app-card single-app-raw-card">
            <div className="single-app-raw-header">
              <h2 className="single-app-section-title">Source snippet</h2>
              <span className="single-app-ai-badge">AI generated</span>
            </div>
            <p className="single-app-raw-text">{app.rawTextSnippet}</p>
          </section>
        )}
      </div>
    </main>
  );
};

export default SingleApplicationPage;

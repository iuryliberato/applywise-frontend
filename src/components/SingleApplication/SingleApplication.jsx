import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import './SingleApplication.css';
import {
  getOneApplication,
  updateApplicationStatus,
  generateCoverLetter,
  deleteApplication,
} from '../../services/jobApplicationService';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModel';

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

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const [coverLetter, setCoverLetter] = useState('');
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverError, setCoverError] = useState('');
  const [copied, setCopied] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

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

  const handleCopyCoverLetter = async () => {
    if (!coverLetter) return;

    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      setCoverError('Failed to copy to clipboard');
    }
  };

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

  const handleGenerateCoverLetter = async () => {
    if (!app) return;
    setCoverError('');
    setCoverLoading(true);

    try {
      const data = await generateCoverLetter(app._id);
      setCoverLetter(data.coverLetter || '');
    } catch (err) {
      console.error(err);
      setCoverError(err.message || 'Failed to generate cover letter');
    } finally {
      setCoverLoading(false);
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

  const handleDeleteConfirm = async () => {
    try {
      await deleteApplication(app._id);

      navigate('/dashboard', {
        state: { toastMessage: 'Application Deleted ❌' },
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete application');
    } finally {
      setDeleteOpen(false);
    }
  };

  const statusKey = app.status || 'Idea';
  const statusLabel =
    STATUS_OPTIONS.find((opt) => opt.value === statusKey)?.label || statusKey;
  const statusClassKey = statusKey.toLowerCase(); // matches .status-pill--idea, .status-pill--tech-test, etc.

  return (
    <>
      <DeleteConfirmationModal
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <main className="single-app-page">
        <div className="single-app-container">
          {/* Header */}
          <header className="single-app-header">
          <button
  className="underline-btn single-app-back-btn"
  onClick={() => navigate('/add-application')}
>
  Back to Add Application
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
                      statusClassKey +
                      ' status-pill--toggle' +
                      (updatingStatus ? ' status-pill--disabled' : '')
                    }
                    onClick={() => {
                      if (!updatingStatus) {
                        setStatusMenuOpen((open) => !open);
                      }
                    }}
                  >
                    <span>{statusLabel}</span>
                    <span className="status-dropdown-arrow">
                      {statusMenuOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {statusMenuOpen && (
                    <div className="status-dropdown-menu">
                      {STATUS_OPTIONS.map((opt) => {
                        const optClassKey = opt.value.toLowerCase();

                        return (
                          <button
                            key={opt.value}
                            type="button"
                            className={
                              'status-pill status-pill--' +
                              optClassKey +
                              (opt.value === statusKey
                                ? ' status-pill--active-option'
                                : '')
                            }
                            onClick={() =>
                              handleStatusChangeClick(opt.value)
                            }
                          >
                            {opt.label}
                          </button>
                        );
                      })}
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

<button
  type="button"
  className="underline-btn single-app-delete-btn"
  onClick={() => setDeleteOpen(true)}
>
  Delete
</button>

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
                <span className="single-app-meta-label">Level</span>
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
                  <p className="single-app-empty">
                    No responsibilities listed.
                  </p>
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
                  <p className="single-app-empty">
                    No “nice to have” listed.
                  </p>
                )}
              </div>

              <div className="single-app-column">
                <h2 className="single-app-section-title">
                  Perks & benefits
                </h2>
                {app.perksAndBenefits &&
                app.perksAndBenefits.length > 0 ? (
                  <ul className="single-app-list">
                    {app.perksAndBenefits.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="single-app-empty">
                    No perks & benefits listed.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Cover letter */}
          <section className="single-app-card single-app-cover-card">
            <div className="single-app-cover-header">
              <h2 className="single-app-section-title">Cover letter</h2>

              <div className="single-app-cover-actions">
  <button
    type="button"
    className="underline-btn single-app-cover-btn"
    onClick={handleGenerateCoverLetter}
    disabled={coverLoading}
  >
    {coverLoading ? 'Generating…' : 'Generate cover letter'}
  </button>

  <button
    type="button"
    className="underline-btn single-app-cover-copy-btn"
    onClick={handleCopyCoverLetter}
    disabled={!coverLetter}
  >
    {copied ? 'Copied!' : 'Copy'}
  </button>
</div>

            </div>

            {coverError && (
              <p className="single-app-error">{coverError}</p>
            )}

            {coverLetter && (
              <pre className="single-app-cover-text">
                {coverLetter}
              </pre>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default SingleApplicationPage;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import './SingleApplication.css';
import {
  getOneApplication,
  updateApplicationStatus,
  deleteApplication,
  addNote,
  deleteNote,
} from '../../services/jobApplicationService';

import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModel';

const STATUS_OPTIONS = [
  { value: 'Idea', label: 'Idea' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Interviewing', label: 'Interviewing' },
  { value: 'Tech-Test', label: 'Tech Test' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
];

const SingleApplicationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [noteText, setNoteText] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteError, setNoteError] = useState('');

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
          className="single-app-back-btn underline-btn"
          onClick={() => navigate('/add-application')}
        >
          Back to Add Application
        </button>
      </main>
    );
  }

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

  const handleAddNote = async (e) => {
    e.preventDefault();
    const trimmed = noteText.trim();
    if (!trimmed) return;

    setNoteError('');
    setNoteSaving(true);

    try {
      const updated = await addNote(app._id, trimmed);
      setApp(updated);
      setNoteText('');
    } catch (err) {
      console.error(err);
      setNoteError(err.message || 'Failed to add note');
    } finally {
      setNoteSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    setNoteError('');
    try {
      const updated = await deleteNote(app._id, noteId);
      setApp(updated);
    } catch (err) {
      console.error(err);
      setNoteError(err.message || 'Failed to delete note');
    }
  };

  const statusKey = app.status || 'Idea';
  const statusLabel =
    STATUS_OPTIONS.find((opt) => opt.value === statusKey)?.label || statusKey;
  const statusClassKey = statusKey.toLowerCase();

  return (
    <>
      <DeleteConfirmationModal
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <main className="single-app-page">
        <div className="single-app-container">
          <header className="single-app-header">
          <div className="header-single-application">
          <button
              className="underline-btn single-app-back-btn"
              onClick={() => navigate('/add-application')}
            >
              Back to Add Application
            </button>
            <div className="single-app-cover-actions">
              <button
                type="button"
                className="single-app-cover-btn"
                onClick={() =>
                  navigate(`/application/${app._id}/generate-materials`)
                }
              >
                Go to CV & Cover Letter
              </button>
            </div>
          </div>

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
                            onClick={() => handleStatusChangeClick(opt.value)}
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

          {/* Meta card */}
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

          {/* Nice to have / Perks */}
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
                {app.perksAndBenefits && app.perksAndBenefits.length > 0 ? (
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
           {/* 🔗 New: Generate materials card */}
           <section className="single-app-card single-app-cover-card">
            <header className="single-app-card-header">
              <p className="single-app-card-subtitle">
                Generate an AI-tailored CV and cover letter specifically for this role.
              </p>
            </header>

            <div className="single-app-cover-actions">
              <button
                type="button"
                className="single-app-cover-btn"
                onClick={() =>
                  navigate(`/application/${app._id}/generate-materials`)
                }
              >
                Go to CV & Cover Letter
              </button>
            </div>
          </section>

          {/* Notes */}
          <section className="single-app-card single-app-notes-card">
            <div className="single-app-notes-header">
              <h2 className="single-app-title">Notes</h2>
            </div>

            {app.notes && app.notes.length > 0 ? (
              <ul className="single-app-notes-list">
                {app.notes
                  .slice()
                  .reverse()
                  .map((note) => (
                    <li key={note._id} className="single-app-note-item">
                      <div className="single-app-note-top">
                        <span className="single-app-note-date">
                          {note.createdAt
                            ? new Date(note.createdAt).toLocaleString()
                            : ''}
                        </span>
                        <button
                          type="button"
                          className="single-app-note-delete"
                          onClick={() => handleDeleteNote(note._id)}
                        >
                          Delete
                        </button>
                      </div>
                      <p className="single-app-note-text">{note.text}</p>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="single-app-empty">
                No notes yet. Use the box below to jot down anything relevant.
              </p>
            )}

            <form className="single-app-notes-form" onSubmit={handleAddNote}>
              <textarea
                className="single-app-notes-textarea"
                placeholder="Add a note about this application (interview prep, feedback, follow-ups)…"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <button
                type="submit"
                className="underline-btn add-note"
                disabled={noteSaving || !noteText.trim()}
              >
                {noteSaving ? 'Saving…' : 'Add note'}
              </button>
            </form>

            {noteError && <p className="single-app-error">{noteError}</p>}
          </section>

         
        </div>
      </main>
    </>
  );
};

export default SingleApplicationPage;

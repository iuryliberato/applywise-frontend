import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  createFromLink,
  createManualApplication,
} from '../../services/jobApplicationService';
import './AddApplicationPage.css';

const STATUS_OPTIONS = [
  { value: 'Idea', label: 'Idea' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Interviewing', label: 'Interviewing' },
  { value: 'Tech-Test', label: 'Tech Test' },
  { value: 'Offer', label: 'Offer' },
  { value: 'Rejected', label: 'Rejected' },
];

const AddApplicationPage = () => {
  const navigate = useNavigate();

  const [jobUrl, setJobUrl] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState('');

  const [manualOpen, setManualOpen] = useState(false);
  const [manualSaving, setManualSaving] = useState(false);
  const [manualError, setManualError] = useState('');

  const [manualForm, setManualForm] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    employmentType: '',
    salaryInfo: '',
    seniorityLevel: '',
    summary: '',
    responsibilities: '',
    requirements: '',
    niceToHave: '',
    perksAndBenefits: '',
    status: 'Idea',
  });

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!jobUrl.trim()) return;

    setLinkError('');
    setLinkLoading(true);

    try {
      const job = await createFromLink(jobUrl, 'Idea');
      navigate(`/application/${job._id}`);
    } catch (err) {
      console.error(err);
      setLinkError(err.message || 'Failed to create from link');
      setManualOpen(true);
    } finally {
      setLinkLoading(false);
    }
  };

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setManualError('');
    setManualSaving(true);

    try {
      const payload = {
        jobTitle: manualForm.jobTitle || 'Untitled role',
        companyName: manualForm.companyName || 'Unknown company',
        location: manualForm.location || '',
        employmentType: manualForm.employmentType || '',
        summary: manualForm.summary || '',
        salaryInfo: manualForm.salaryInfo || '',
        seniorityLevel: manualForm.seniorityLevel || '',
        responsibilities: manualForm.responsibilities
          ? manualForm.responsibilities
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean)
          : [],
        requirements: manualForm.requirements
          ? manualForm.requirements
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean)
          : [],
        niceToHave: manualForm.niceToHave
          ? manualForm.niceToHave
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean)
          : [],
        perksAndBenefits: manualForm.perksAndBenefits
          ? manualForm.perksAndBenefits
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean)
          : [],
        status: manualForm.status,
        source: 'Manual',
      };

      const job = await createManualApplication(payload);
      navigate(`/application/${job._id}`);
    } catch (err) {
      console.error(err);
      setManualError(err.message || 'Failed to save manual application');
    } finally {
      setManualSaving(false);
    }
  };

  return (
    <main className="add-app-page">
      <div className="add-app-container">
        <h1 className="add-app-title">Add Application</h1>

        <section className="add-app-card">
          <p className="add-app-subtitle">
            Paste the link from the job application below:
          </p>

          <form onSubmit={handleLinkSubmit} className="add-app-link-form">
            <input
              type="url"
              className="add-app-input"
              placeholder="https://www.linkedin.com/jobs/..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              required
            />
            <button
              type="submit"
              className="underline-btn add-app-btn"
              disabled={linkLoading}
            >
              {linkLoading ? (
                <span className="link-loading-msg">
                  <span className="cv-spinner"></span>
                  Adding application…
                </span>
              ) : (
                'Save Application'
              )}
            </button>
          </form>

          {linkError && <p className="add-app-error">{linkError}</p>}

          <div className="add-app-divider">
            <span>or</span>
          </div>

          <button
            type="button"
            className="underline-btn add-app-btn"
            onClick={() => setManualOpen((prev) => !prev)}
          >
            {manualOpen ? 'Hide manual form' : 'Add application manually'}
          </button>
        </section>

        {manualOpen && (
          <section className="add-app-card add-app-manual-card">
            <h2 className="add-app-section-title">Manual application</h2>

            <form className="add-app-manual-form" onSubmit={handleManualSubmit}>
              <div className="add-app-two-col">
                <select
                  name="status"
                  className={`add-app-input status add-app-select status-${manualForm.status.toLowerCase()}`}
                  value={manualForm.status}
                  onChange={handleManualChange}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="jobTitle"
                  className="add-app-input"
                  placeholder="Job title"
                  value={manualForm.jobTitle}
                  onChange={handleManualChange}
                />
                <input
                  type="text"
                  name="companyName"
                  className="add-app-input"
                  placeholder="Company"
                  value={manualForm.companyName}
                  onChange={handleManualChange}
                />
              </div>

              <div className="add-app-two-col">
                <input
                  type="text"
                  name="location"
                  className="add-app-input"
                  placeholder="Location"
                  value={manualForm.location}
                  onChange={handleManualChange}
                />
              </div>

              <div className="add-app-two-col">
                <input
                  type="text"
                  name="employmentType"
                  className="add-app-input"
                  placeholder="Employment Type"
                  value={manualForm.employmentType}
                  onChange={handleManualChange}
                />
              </div>

              <div className="add-app-two-col">
                <input
                  type="text"
                  name="salaryInfo"
                  className="add-app-input"
                  placeholder="Salary"
                  value={manualForm.salaryInfo}
                  onChange={handleManualChange}
                />
              </div>

              <div className="add-app-two-col">
                <input
                  type="text"
                  name="seniorityLevel"
                  className="add-app-input"
                  placeholder="Level"
                  value={manualForm.seniorityLevel}
                  onChange={handleManualChange}
                />
              </div>

              <textarea
                name="summary"
                className="add-app-input add-app-textarea"
                placeholder="Summary (optional)"
                value={manualForm.summary}
                onChange={handleManualChange}
              />

              <textarea
                name="responsibilities"
                className="add-app-input add-app-textarea"
                placeholder="Responsibilities (one per line)"
                value={manualForm.responsibilities}
                onChange={handleManualChange}
              />

              <textarea
                name="requirements"
                className="add-app-input add-app-textarea"
                placeholder="Requirements (one per line)"
                value={manualForm.requirements}
                onChange={handleManualChange}
              />

              <textarea
                name="niceToHave"
                className="add-app-input add-app-textarea"
                placeholder="Nice to Have (one per line)"
                value={manualForm.niceToHave}
                onChange={handleManualChange}
              />

              <textarea
                name="perksAndBenefits"
                className="add-app-input add-app-textarea"
                placeholder="Perks And Benefits (one per line)"
                value={manualForm.perksAndBenefits}
                onChange={handleManualChange}
              />

              {manualError && (
                <p className="add-app-error">{manualError}</p>
              )}

              <button
                type="submit"
                className="underline-btn add-app-btn add-app-btn--left"
                disabled={manualSaving}
              >
                {manualSaving ? 'Saving…' : 'Save manual application'}
              </button>
            </form>
          </section>
        )}
      </div>
    </main>
  );
};

export default AddApplicationPage;

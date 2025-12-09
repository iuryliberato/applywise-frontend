import '../SingleApplication/SingleApplication.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  getOneApplication,
  generateCoverLetter,
  updateCoverLetter,
  generateAiCv,
  updateAiCv,
  downloadAiCvPdf,
} from '../../services/jobApplicationService';

const GenerateMaterials = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cover letter state
  const [coverLetter, setCoverLetter] = useState('');
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverError, setCoverError] = useState('');
  const [copied, setCopied] = useState(false);

  // AI CV state
  const [aiCvData, setAiCvData] = useState(null);
  const [aiCvJson, setAiCvJson] = useState('');
  const [aiCvLoading, setAiCvLoading] = useState(false);
  const [aiCvSaving, setAiCvSaving] = useState(false);
  const [aiCvError, setAiCvError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getOneApplication(id);
        setApp(data);
        setCoverLetter(data.coverLetter || '');
        if (data.aiCvData) {
          setAiCvData(data.aiCvData);
          setAiCvJson(JSON.stringify(data.aiCvData, null, 2));
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load application materials');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ===== Cover letter handlers =====
  const handleGenerateCoverLetter = async () => {
    if (!app) return;
    setCoverError('');
    setCoverLoading(true);

    try {
      const data = await generateCoverLetter(app._id);
      setApp(data.job || app);
      setCoverLetter(data.coverLetter || '');
    } catch (err) {
      console.error(err);
      setCoverError(err.message || 'Failed to generate cover letter');
    } finally {
      setCoverLoading(false);
    }
  };

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

  const handleSaveCoverLetter = async () => {
    if (!coverLetter.trim()) return;
    try {
      setCoverError('');
      setCoverLoading(true);
      const updated = await updateCoverLetter(app._id, coverLetter);
      setApp(updated);
    } catch (err) {
      console.error(err);
      setCoverError(err.message || 'Failed to save cover letter');
    } finally {
      setCoverLoading(false);
    }
  };

  // ===== AI CV handlers =====
  const handleGenerateAiCv = async () => {
    if (!app) return;
    setAiCvError('');
    setAiCvLoading(true);
    try {
      const { cvData } = await generateAiCv(app._id);
      setAiCvData(cvData);
      setAiCvJson(JSON.stringify(cvData, null, 2));
    } catch (err) {
      console.error(err);
      setAiCvError(err.message || 'Failed to generate CV');
    }
    setAiCvLoading(false);
  };

  const handleSaveAiCv = async () => {
    if (!aiCvData) {
      setAiCvError('No CV data to save.');
      return;
    }

    setAiCvSaving(true);
    try {
      const { cvData } = await updateAiCv(app._id, aiCvData);
      setAiCvData(cvData);
      setAiCvJson(JSON.stringify(cvData, null, 2));
    } catch (err) {
      console.error(err);
      setAiCvError(err.message || 'Failed to save CV');
    }
    setAiCvSaving(false);
  };

  const handleDownloadAiCvPdf = async () => {
    try {
      await downloadAiCvPdf(app._id);
    } catch (err) {
      console.error(err);
      setAiCvError(err.message || 'Failed to download CV PDF');
    }
  };

  // ===== AI CV field helpers =====
  const updateCvField = (field, value) => {
    setAiCvData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const updateInterests = (text) => {
    const interests = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    setAiCvData((prev) => ({
      ...prev,
      interests,
    }));
  };

  // ========= Render =========

  if (loading) {
    return (
      <main className="single-app-page">
        <p className="single-app-loading">Loading materials…</p>
      </main>
    );
  }

  if (error || !app) {
    return (
      <main className="single-app-page">
        <p className="single-app-error">
          {error || 'Application not found.'}
        </p>
        <button
          className="single-app-back-btn underline-btn"
          onClick={() => navigate('/dashboard')}
        >
          Back to dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="single-app-page">
      <div className="single-app-container">
        <header className="single-app-header">
          <button
            className="underline-btn single-app-back-btn"
            onClick={() => navigate(`/application/${app._id}`)}
          >
            ← Back to application
          </button>

          <div className="single-app-header-main">
            <div>
              <h1 className="single-app-title">
                AI Materials for {app.jobTitle || 'Job'}
              </h1>
              <p className="single-app-company">
                {app.companyName || 'Unknown company'}
              </p>
            </div>
          </div>
        </header>

        {/* AI CV card */}
        <section className="single-app-card single-app-cover-card">
          <header className="single-app-card-header">
            <h2 className="single-app-section-title">AI-Tailored CV</h2>
            <p className="single-app-card-subtitle">
              Generate a CV for this specific role based on your profile, then export as PDF.
            </p>
          </header>

          <div className="single-app-cover-actions">
            <button
              type="button"
              className="single-app-cover-btn"
              onClick={handleGenerateAiCv}
              disabled={aiCvLoading}
            >
              {aiCvLoading ? (
                <span className="cover-loading-msg">
                  <span className="cv-spinner"></span>
                  Generating CV…
                </span>
              ) : (
                'Generate AI CV'
              )}
            </button>
          </div>

          {aiCvError && <p className="single-app-error">{aiCvError}</p>}

          {aiCvData && (
            <div className="single-app-cover-body ai-cv-editor">
              {/* Top basics */}
              <div className="ai-cv-row">
                <div className="ai-cv-field">
                  <label>Full name</label>
                  <input
                    type="text"
                    value={aiCvData.fullName || ''}
                    onChange={(e) =>
                      updateCvField('fullName', e.target.value)
                    }
                  />
                </div>

                <div className="ai-cv-field">
                  <label>Headline</label>
                  <input
                    type="text"
                    value={aiCvData.headline || ''}
                    onChange={(e) =>
                      updateCvField('headline', e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="ai-cv-section">
                <h3>Professional Summary</h3>
                <textarea
                  rows={4}
                  value={aiCvData.summary || ''}
                  onChange={(e) =>
                    updateCvField('summary', e.target.value)
                  }
                />
              </div>

              {/* Actions */}
              <div className="single-app-cover-actions">
                <button
                  type="button"
                  className="single-app-cover-copy-btn"
                  onClick={handleSaveAiCv}
                  disabled={aiCvSaving}
                >
                  {aiCvSaving ? 'Saving…' : 'Save CV changes'}
                </button>

                <button
                  type="button"
                  className="single-app-cover-copy-btn"
                  onClick={handleDownloadAiCvPdf}
                  disabled={!aiCvData || aiCvLoading || aiCvSaving}
                >
                  Export as PDF
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Cover letter card */}
        <section className="single-app-card single-app-cover-card">
          <div className="single-app-cover-header">
            <h2 className="single-app-section-title">Cover letter</h2>
            <p className="single-app-card-subtitle">
              Generate a CV for this specific role based on your profile, then export as PDF.
            </p>
            <div className="single-app-cover-actions">
              <button
                type="button"
                className="single-app-cover-btn"
                onClick={handleGenerateCoverLetter}
                disabled={coverLoading}
              >
                {coverLoading ? (
                  <span className="cover-loading-msg">
                    <span className="cv-spinner"></span>
                    Generating cover letter…
                  </span>
                ) : (
                  'Generate cover letter'
                )}
              </button>

              <button
                type="button"
                className="single-app-cover-copy-btn"
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

          <textarea
            className="single-app-cover-textarea"
            placeholder="Your cover letter will appear here. You can edit it before sending."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />

          <button
            type="button"
            className="single-app-cover-btn single-app-cover-copy-btn"
            onClick={handleSaveCoverLetter}
            disabled={coverLoading || !coverLetter.trim()}
          >
            Save changes
          </button>
        </section>
      </div>
    </main>
  );
};

export default GenerateMaterials;

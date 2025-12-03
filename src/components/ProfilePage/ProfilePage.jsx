import './ProfilePage.css';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router';
import { getMyProfile, saveMyProfile, uploadCvAndExtract } from '../../services/profileService';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [cvLoading, setCvLoading] = useState(false);
  const [cvFile, setCvFile] = useState(null);

  // ⭐ NEW: experience & education state
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  const [form, setForm] = useState({
    fullName: '',
    headline: '',
    location: '',
    summary: '',
    primarySkills: '',
    yearsOfExperience: '',
    linkedin: '',
    github: '',
    portfolio: '',
  });

  // Load existing profile
  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getMyProfile();
        console.log('Loaded profile:', profile);

        if (profile) {
          setForm({
            fullName: profile.fullName || '',
            headline: profile.headline || '',
            location: profile.location || '',
            summary: profile.summary || '',
            primarySkills: (profile.primarySkills || []).join(', '),
            yearsOfExperience: profile.yearsOfExperience || '',
            linkedin: profile.links?.linkedin || '',
            github: profile.links?.github || '',
            portfolio: profile.links?.portfolio || '',
          });

          // ⭐ also store experience & education from backend
          setExperience(profile.experience || []);
          setEducation(profile.education || []);
        }
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCvChange = (e) => {
    setCvFile(e.target.files[0] || null);
  };

  const handleUseCv = async () => {
    if (!cvFile) return;
    setCvLoading(true);
    setError('');

    try {
      const profile = await uploadCvAndExtract(cvFile);
      console.log('Profile after CV upload:', profile);

      // update form fields
      setForm(prev => ({
        ...prev,
        fullName: profile.fullName || prev.fullName,
        headline: profile.headline || prev.headline,
        location: profile.location || prev.location,
        summary: profile.summary || prev.summary,
        primarySkills: (profile.primarySkills || []).join(', '),
        yearsOfExperience:
          profile.yearsOfExperience || prev.yearsOfExperience || '',
        linkedin: profile.links?.linkedin || prev.linkedin,
        github: profile.links?.github || prev.github,
        portfolio: profile.links?.portfolio || prev.portfolio,
      }));

      // ⭐ CRUCIAL: update experience & education from CV result
      setExperience(profile.experience || []);
      setEducation(profile.education || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to use CV');
    } finally {
      setCvLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        fullName: form.fullName,
        headline: form.headline,
        location: form.location,
        summary: form.summary,
        primarySkills: form.primarySkills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        yearsOfExperience: form.yearsOfExperience
          ? Number(form.yearsOfExperience)
          : undefined,
        links: {
          linkedin: form.linkedin,
          github: form.github,
          portfolio: form.portfolio,
        },
        // experience & education are already saved by CV route,
        // but you could also send them here if you add editing later
      };

      await saveMyProfile(payload);
      navigate('/add-application');
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-page-loading">Loading profile...</div>;
  }

  return (
    <main className="profile-page">
      <div className="profile-container">
        {/* Title */}
        <h1 className="profile-title">  {form.fullName || user?.username}</h1>

        {/* Card */}
        <form className="profile-card" onSubmit={handleSubmit}>
          {/* CV upload section */}
          <div className="profile-cv-section">
            <label className="profile-cv-label">
              Upload CV (PDF)
              <input
                type="file"
                accept=".pdf"
                onChange={handleCvChange}
              />
            </label>
            <button
              type="button"
              className="profile-use-cv-btn"
              onClick={handleUseCv}
              disabled={!cvFile || cvLoading}
            >
              {cvLoading ? 'Reading CV…' : 'Use CV to Fill Profile'}
            </button>
          </div>

          {/* Form fields */}
          <div className="profile-fields">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="profile-input"
              value={form.fullName}
              onChange={handleChange}
            />

            <input
              type="text"
              name="headline"
              placeholder="Headline"
              className="profile-input"
              value={form.headline}
              onChange={handleChange}
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              className="profile-input"
              value={form.location}
              onChange={handleChange}
            />
            <input
              type="number"
              name="yearsOfExperience"
              placeholder="Years of Experience"
              className="profile-input"
              value={form.yearsOfExperience}
              onChange={handleChange}
            />
            <textarea
              name="summary"
              placeholder="Summary"
              className="profile-input profile-textarea"
              value={form.summary}
              onChange={handleChange}
            />

            <input
              type="text"
              name="primarySkills"
              placeholder="Primary Skills (comma separated)"
              className="profile-input"
              value={form.primarySkills}
              onChange={handleChange}
            />
          </div>

          {/* Experience */}
          <section className="profile-section">
            <h2 className="profile-section-title">Experience</h2>

            {experience.length === 0 ? (
              <p className="profile-section-empty">
                No experience data yet. Upload your CV to auto-populate this section.
              </p>
            ) : (
              <ul className="profile-card-list">
                {experience.map((exp, idx) => (
                  <li key={idx} className="profile-card-item">
                    <div className="profile-card-header">
                      <h3>{exp.jobTitle || 'Role'}</h3>
                      {exp.company && (
                        <span className="profile-card-company">{exp.company}</span>
                      )}
                    </div>

                    <div className="profile-card-meta">
                      {exp.location && <span>{exp.location}</span>}
                      {(exp.startDate || exp.endDate) && (
                        <span>
                          {exp.startDate || ''}{' '}
                          {exp.startDate && exp.endDate ? '–' : ''}
                          {exp.endDate || ''}
                        </span>
                      )}
                    </div>

                    {exp.description && (
                      <p className="profile-card-description">{exp.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Education */}
          <section className="profile-section">
            <h2 className="profile-section-title">Education</h2>

            {education.length === 0 ? (
              <p className="profile-section-empty">
                No education data yet. Upload your CV to auto-populate this section.
              </p>
            ) : (
              <ul className="profile-card-list">
                {education.map((edu, idx) => (
                  <li key={idx} className="profile-card-item">
                    <div className="profile-card-header">
                      <h3>{edu.fieldOfStudy || 'Course'}</h3>
                      {edu.institution && (
                        <span className="profile-card-company">{edu.institution}</span>
                      )}
                    </div>

                    <div className="profile-card-meta">
                      {edu.degree && <span>{edu.degree}</span>}
                      {(edu.startDate || edu.endDate) && (
                        <span>
                          {edu.startDate || ''}{' '}
                          {edu.startDate && edu.endDate ? '–' : ''}
                          {edu.endDate || ''}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>


          {/* Links block */}
          <section className="profile-links-section">
            <h2 className="profile-links-title">Links</h2>

            <div className="profile-links-grid">
              <div className="profile-link-field">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  className="profile-input"
                  value={form.linkedin}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-link-field">
                <label>GitHub</label>
                <input
                  type="url"
                  name="github"
                  className="profile-input"
                  value={form.github}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-link-field">
                <label>Portfolio</label>
                <input
                  type="url"
                  name="portfolio"
                  className="profile-input"
                  value={form.portfolio}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {error && <p className="profile-error">{error}</p>}

          <button
            type="submit"
            className="profile-save-btn"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ProfilePage;

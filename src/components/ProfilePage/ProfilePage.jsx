import './ProfilePage.css';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import {
  getMyProfile,
  saveMyProfile,
  uploadCvAndExtract,
} from '../../services/profileService';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [cvLoading, setCvLoading] = useState(false);
  const [cvFile, setCvFile] = useState(null);

  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);

  const [projects, setProjects] = useState([]);       // projects array
  const [interests, setInterests] = useState([]);   // interests array of strings

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

          setExperience(profile.experience || []);
          setEducation(profile.education || []);
          setProjects(profile.projects || []);
          setInterests(profile.interests || []);
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCvChange = (e) => {
    setCvFile(e.target.files[0] || null);
  };

  const handleUseCv = async (fileFromInput) => {
    const file = fileFromInput || cvFile;
    if (!file) return;

    setCvLoading(true);
    setError('');

    try {
      const profile = await uploadCvAndExtract(file);
      console.log('Profile after CV upload:', profile);

      setForm((prev) => ({
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

      setExperience(profile.experience || []);
      setEducation(profile.education || []);
      setProjects(profile.projects || []);         // NEW
      setInterests(profile.interests || []);     // NEW
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to use CV');
    } finally {
      setCvLoading(false);
    }
  };

  // ===== Experience helpers =====
  const handleExperienceChange = (index, field, value) => {
    setExperience((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  };

  const handleAddExperience = () => {
    setExperience((prev) => [
      
      {
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      },
      ...prev,
    ]);
  };

  const handleRemoveExperience = (index) => {
    setExperience((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== Education helpers =====
  const handleEducationChange = (index, field, value) => {
    setEducation((prev) =>
      prev.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu))
    );
  };

  const handleAddEducation = () => {
    setEducation((prev) => [
     
      {
        fieldOfStudy: '',
        institution: '',
        degree: '',
        startDate: '',
        endDate: '',
      },
      ...prev,
    ]);
  };

  const handleRemoveEducation = (index) => {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== Projects helpers =====
  const handleProjectChange = (index, field, value) => {
    setProjects((prev) =>
      prev.map((proj, i) => (i === index ? { ...proj, [field]: value } : proj))
    );
  };
  
  const handleAddProject = () => {
    setProjects((prev) => [
      
      {
        name: '',
        tech: '',
        description: '',
      },
      ...prev,
    ]);
  };
  
  const handleRemoveProject = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };
  

  // ===== Interests helpers =====
  const handleInterestChange = (index, value) => {
    setInterests((prev) =>
      prev.map((interest, i) => (i === index ? value : interest))
    );
  };

  const handleAddInterest = () => {
    setInterests((prev) => ['', ...prev]);
  };

  const handleRemoveInterest = (index) => {
    setInterests((prev) => prev.filter((_, i) => i !== index));
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
          .map((s) => s.trim())
          .filter(Boolean),
        yearsOfExperience: form.yearsOfExperience
          ? Number(form.yearsOfExperience)
          : undefined,
        links: {
          linkedin: form.linkedin,
          github: form.github,
          portfolio: form.portfolio,
        },
        experience,
        education,
        projects,     
        interests,    
      };

      await saveMyProfile(payload);
      navigate('/profile');
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
        <h1 className="profile-title">{form.fullName || user?.username}</h1>

        <form className="profile-card" onSubmit={handleSubmit}>
          <div className="profile-cv-section">
            <label className="profile-cv-label">
              {cvLoading ? (
                <p className="cv-loading-msg">
                  <span className="cv-spinner"></span>
                  <span className="loading">
                    Reading CV and filling your profile…
                  </span>
                </p>
              ) : (
                <span className="upload-message">
                  Upload CV to fill profile
                </span>
              )}

              <input
                type="file"
                accept=".pdf"
                disabled={cvLoading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  handleCvChange(e);
                  handleUseCv(file);
                }}
              />
            </label>
          </div>
          <p className="verify-profile">Please review your profile details before saving.</p>
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
                {/* ===== Projects (Editable) ===== */}
                <section className="profile-section">
            <div className="profile-section-heading">
              <h2 className="profile-section-title">Projects</h2>
              <button
                type="button"
                className="profile-add-btn"
                onClick={handleAddProject}
              >
                + ADD PROJECT
              </button>
            </div>
            {projects.length === 0 ? (
              <p className="profile-section-empty">
                No projects added yet. Add your key portfolio projects here.
              </p>
            ) : (
              <ul className="profile-card-list">
                {projects.map((proj, idx) => (
                  <li key={idx} className="profile-card-item editable-card">
                    <div className="profile-card-row">
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="Project name"
                        value={proj.name || ''}
                        onChange={(e) =>
                          handleProjectChange(idx, 'name', e.target.value)
                        }
                      />
                    </div>

                    <div className="profile-card-row">
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="Tech used (e.g. React, Node, MongoDB)"
                        value={proj.tech || ''}
                        onChange={(e) =>
                          handleProjectChange(idx, 'tech', e.target.value)
                        }
                      />
                    </div>

                    <textarea
                      className="profile-input profile-textarea"
                      placeholder="Short description of the project and your impact"
                      value={proj.description || ''}
                      onChange={(e) =>
                        handleProjectChange(idx, 'description', e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="profile-remove-btn"
                      onClick={() => handleRemoveProject(idx)}
                    >
                       Remove project
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ===== Experience (Editable) ===== */}
          <section className="profile-section">
            <div className="profile-section-heading">
              <h2 className="profile-section-title">Experience</h2>
              <button
                type="button"
                className="profile-add-btn"
                onClick={handleAddExperience}
              >
                + ADD EXPERIENCE
              </button>
            </div>

            {experience.length === 0 ? (
              <p className="profile-section-empty">
                No experience data yet. Upload your CV or add entries manually.
              </p>
            ) : (
              <ul className="profile-card-list">
                {experience.map((exp, idx) => (
                  <li key={idx} className="profile-card-item editable-card">
                    <div className="profile-card-row">
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="Job title"
                        value={exp.jobTitle || ''}
                        onChange={(e) =>
                          handleExperienceChange(idx, 'jobTitle', e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="Company"
                        value={exp.company || ''}
                        onChange={(e) =>
                          handleExperienceChange(idx, 'company', e.target.value)
                        }
                      />
                    </div>

                    <div className="profile-card-row">
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="Location"
                        value={exp.location || ''}
                        onChange={(e) =>
                          handleExperienceChange(idx, 'location', e.target.value)
                        }
                      />
                    </div>

                    <div className="profile-card-row profile-dates-row">
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="Start date (e.g. Jan 2022)"
                        value={exp.startDate || ''}
                        onChange={(e) =>
                          handleExperienceChange(idx, 'startDate', e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="End date (or Present)"
                        value={exp.endDate || ''}
                        onChange={(e) =>
                          handleExperienceChange(idx, 'endDate', e.target.value)
                        }
                      />
                    </div>

                    <textarea
                      className="profile-input profile-textarea"
                      placeholder="Short description / key achievements"
                      value={exp.description || ''}
                      onChange={(e) =>
                        handleExperienceChange(idx, 'description', e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="profile-remove-btn"
                      onClick={() => handleRemoveExperience(idx)}
                    >
                      Remove experience
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ===== Education (Editable) ===== */}
          <section className="profile-section">
            <div className="profile-section-heading">
              <h2 className="profile-section-title">Education</h2>
              <button
                type="button"
                className="profile-add-btn"
                onClick={handleAddEducation}
              >
                + ADD EDUCATION
              </button>
            </div>

            {education.length === 0 ? (
              <p className="profile-section-empty">
                No education data yet. Upload your CV or add entries manually.
              </p>
            ) : (
              <ul className="profile-card-list">
                {education.map((edu, idx) => (
                  <li key={idx} className="profile-card-item editable-card">
                    <div className="profile-card-row">
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="Course / field of study"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) =>
                          handleEducationChange(
                            idx,
                            'fieldOfStudy',
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="Institution"
                        value={edu.institution || ''}
                        onChange={(e) =>
                          handleEducationChange(
                            idx,
                            'institution',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="profile-card-row">
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="Degree (e.g. BSc, Bootcamp)"
                        value={edu.degree || ''}
                        onChange={(e) =>
                          handleEducationChange(idx, 'degree', e.target.value)
                        }
                      />
                    </div>

                    <div className="profile-card-row profile-dates-row">
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="Start date"
                        value={edu.startDate || ''}
                        onChange={(e) =>
                          handleEducationChange(idx, 'startDate', e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="End date (or Present)"
                        value={edu.endDate || ''}
                        onChange={(e) =>
                          handleEducationChange(idx, 'endDate', e.target.value)
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="profile-remove-btn"
                      onClick={() => handleRemoveEducation(idx)}
                    >
                       Remove education
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ===== Interests (Editable) ===== */}
          <section className="profile-section">
            <div className="profile-section-heading">
              <h2 className="profile-section-title">Interests</h2>
              <button
                type="button"
                className="profile-add-btn"
                onClick={handleAddInterest}
              >
                + ADD INTERESTS
              </button>
            </div>

            {interests.length === 0 ? (
              <p className="profile-section-empty">
                No interests added yet. Add a few personal / professional interests.
              </p>
            ) : (
              <ul className="profile-card-list">
                {interests.map((interest, idx) => (
                  <li key={idx} className="profile-card-item interests editable-card">
                    <div className="profile-card-row">
                      <input
                        type="text"
                        className="profile-input"
                        placeholder="e.g. UI design, accessibility, hiking"
                        value={interest || ''}
                        onChange={(e) =>
                          handleInterestChange(idx, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="profile-remove-btn"
                        onClick={() => handleRemoveInterest(idx)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

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

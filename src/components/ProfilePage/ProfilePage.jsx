import './ProfilePage.css';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { getMyProfile, saveMyProfile } from '../../services/profileService';

const ProfilePage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    const loadProfile = async () => {
      try {
        const profile = await getMyProfile();
        if (!profile) {
          setLoading(false);
          return; // no profile yet → keep empty form
        }

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
      } catch (err) {
        console.log(err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
      };

      await saveMyProfile(payload);

      // after save, go to dashboard (or wherever you want)
      navigate('/add-application');
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile-page-loading">Loading profile...</div>;

  return (
    <main className="profile-page">
    <div className="profile-container">
      {/* Title */}
      <h1 className="profile-title">Profile{/* or {user?.username} */}</h1>

      {/* Card */}
      <form className="profile-card" onSubmit={handleSubmit}>
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

          <input
            type="number"
            name="yearsOfExperience"
            placeholder="Years of Experience"
            className="profile-input"
            value={form.yearsOfExperience}
            onChange={handleChange}
          />
        </div>

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

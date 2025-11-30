import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createFromLink } from '../../services/jobApplicationService';
import './AddApplicationPage.css';

const AddApplicationPage = () => {
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleAdd = async () => {
    setError('');

    if (!link.trim()) {
      setError('Please paste a job link.');
      return;
    }

    try {
      setLoading(true);

      // Create the job application
      const newApp = await createFromLink(link);

      if (!newApp || !newApp._id) {
        throw new Error('Invalid response from server.');
      }

      // Redirect to the single job application page
      navigate(`/application/${newApp._id}`);

    } catch (err) {
      setError(err.message || 'Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-app-simple">
      <h1 className="add-app-title">Add Application</h1>

      <div className="add-app-card">
        <p className="add-app-instructions">
          Paste the Link from the job application below:
        </p>

        <input
          type="url"
          placeholder="https://www.linkedin.com/jobs/..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="add-app-input"
        />

        {error && <p className="add-app-error">{error}</p>}

        <button
          onClick={handleAdd}
          disabled={loading}
          className="add-app-button"
        >
          {loading ? 'Adding...' : 'Add Application'}
        </button>
      </div>
    </main>
  );
};

export default AddApplicationPage;

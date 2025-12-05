const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/job-applications`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// CREATE JOB FROM LINK
const createFromLink = async (jobUrl, status = 'idea') => {
  const res = await fetch(`${BASE_URL}/from-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ jobUrl, status }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to create job');
  }

  return data; // returns the created job object (including _id)
};


// GET ONE JOB BY ID
const getOneApplication = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch application');

  return data;
};


// GET ALL JOBS FOR LOGGED-IN USER (optional status)
const getMyApplications = async (status) => {
    const url = status
      ? `${BASE_URL}/my-applications?status=${encodeURIComponent(status)}`
      : `${BASE_URL}/my-applications`;
  
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch applications');
  
    return data;
  };
  
  
const updateApplicationStatus = async (id, status) => {
    const res = await fetch(`${BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update status');
  
    return data; // updated job
  };
  

  const getApplicationsSummary = async () => {
    const res = await fetch(`${BASE_URL}/my-applications/summary`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
  
    if (!res.ok) {
      let msg = 'Failed to fetch summary';
      try {
        const data = await res.json();
        msg = data.error || msg;
      } catch (_) {}
      throw new Error(msg);
    }
  
    return res.json();
  }

  
const generateCoverLetter = async(id) => {
  const token = localStorage.getItem('token'); // or from context if you prefer

  if (!token) {
    throw new Error('No auth token found – please sign in again.');
  }
  const res = await fetch(`${BASE_URL}/${id}/cover-letter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  // Debug: log the raw response if it's not JSON
  const contentType = res.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error('Non-JSON response from backend:\n', text);
    throw new Error('Server did not return JSON');
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with ${res.status}`);
  }

  const data = await res.json();
  return data; 
}
  
  const updateCoverLetter = async (id, coverLetter) => {
    const res = await fetch(`${BASE_URL}/${id}/cover-letter`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ coverLetter }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save cover letter');
  
    return data; // updated job
  };
  
  
  
  const deleteApplication = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete application');
  
    return data; // { message: 'Application deleted' }
  };
  const createManualApplication = async (payload) => {
    const res = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create application');
  
    return data; // created job with _id
  };
  
  


const addNote = async (appId, text) => {
    const res = await fetch(`${BASE_URL}/${appId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ text }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add note');
  
    // backend returns updated job application
    return data;
  };
  
  const updateNote = async (appId, noteId, text) => {
    const res = await fetch(`${BASE_URL}/${appId}/notes/${noteId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ text }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update note');
  
    return data;
  };
  
  const deleteNote = async (appId, noteId) => {
    const res = await fetch(`${BASE_URL}/${appId}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete note');
  
    return data;
  };
  
  export {
    createFromLink,
    createManualApplication,
    getOneApplication,
    getMyApplications,
    updateApplicationStatus,
    getApplicationsSummary,
    generateCoverLetter,
    deleteApplication,
    addNote,
    updateNote,
    deleteNote,
    updateCoverLetter,
  };
  
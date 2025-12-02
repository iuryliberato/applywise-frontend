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

  const generateCoverLetter = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}/cover-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate cover letter');
  
    return data; // { coverLetter: '...' }
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
  
  
export {
  createFromLink,
  getOneApplication,
  getMyApplications,
  updateApplicationStatus,
  getApplicationsSummary,
  generateCoverLetter,
  deleteApplication,
  createManualApplication
};

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


// OPTIONAL — GET ALL JOBS FOR LOGGED-IN USER
const getMyApplications = async () => {
  const res = await fetch(`${BASE_URL}/my-application`, {
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
  

export {
  createFromLink,
  getOneApplication,
  getMyApplications,
  updateApplicationStatus,
};

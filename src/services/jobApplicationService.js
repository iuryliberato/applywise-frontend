const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/job-applications`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const createFromLink = async (jobUrl, status = 'Idea') => {
  const res = await fetch(`${BASE_URL}/from-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ jobUrl, status }),
  });

  let data;
  try {
    data = await res.json();
  } catch (_) {
    data = {};
  }

  if (!res.ok) {
    const msg = data.error || `Failed to create job from link (HTTP ${res.status})`;
    throw new Error(msg);
  }

  return data;
};

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

  return data;
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
};

const generateCoverLetter = async (id) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found – please sign in again.');

  const res = await fetch(`${BASE_URL}/${id}/cover-letter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error('Non-JSON response from backend:\n', text);
    throw new Error('Server did not return JSON');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with ${res.status}`);
  }

  return res.json();
};

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

  return data;
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

  return data;
};

const createManualApplication = async (payload) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create application');

  return data;
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

const generateAiCv = async (jobId) => {
  const res = await fetch(`${BASE_URL}/${jobId}/ai-cv`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to generate AI CV');
  }

  return res.json();
};

const updateAiCv = async (jobId, cvData) => {
  const res = await fetch(`${BASE_URL}/${jobId}/ai-cv`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ cvData }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to save AI CV');
  }

  return res.json();
};

const downloadAiCvPdf = async (jobId) => {
  const res = await fetch(`${BASE_URL}/${jobId}/ai-cv/pdf`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Failed to download AI CV PDF');
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'applio-ai-cv.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export {
  createFromLink,
  createManualApplication,
  getOneApplication,
  getMyApplications,
  updateApplicationStatus,
  getApplicationsSummary,
  generateCoverLetter,
  updateCoverLetter,
  deleteApplication,
  addNote,
  updateNote,
  deleteNote,
  downloadAiCvPdf,
  updateAiCv,
  generateAiCv,
};

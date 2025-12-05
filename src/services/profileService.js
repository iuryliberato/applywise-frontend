const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/profile`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getMyProfile = async () => {
  try {
    const res = await fetch(`${BASE_URL}/my-profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (res.status === 404) {
      return null;
    }

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || 'Failed to load profile');
  }
};

const saveMyProfile = async (profileData) => {
  try {
    const res = await fetch(`${BASE_URL}/my-profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || 'Failed to save profile');
  }
};

const uploadCvAndExtract = async (file) => {
  const formData = new FormData();
  formData.append('cv', file);

  const url = `${BASE_URL}/my-profile/cv`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });

  const contentType = res.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error('Non-JSON response from /my-profile/cv:', text.slice(0, 500));
    throw new Error('Server did not return JSON');
  }

  const data = await res.json();

  if (data.err) {
    throw new Error(data.err);
  }

  return data;
};

export { getMyProfile, saveMyProfile, uploadCvAndExtract };

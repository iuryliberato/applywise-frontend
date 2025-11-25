
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/profile`;

// Helper to get token & headers
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

    // If profile doesn't exist yet, backend might send 404
    if (res.status === 404) {
      return null; // handle this in the component (e.g. empty form)
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

export {
  getMyProfile,
  saveMyProfile,
};

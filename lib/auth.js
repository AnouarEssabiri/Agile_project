const API_URL = 'http://localhost:8000/api/v1';

export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const setCurrentUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    setCurrentUser(data.user);
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    throw error;
  }
};

export const register = async (name, email, password, password_confirmation) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    setCurrentUser(data.user);
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'Admin';
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

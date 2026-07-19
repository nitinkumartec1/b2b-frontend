import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

if (!API_BASE_URL && typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.warn('[B2B] NEXT_PUBLIC_API_URL is not set. API calls will fail.');
}

export const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh access token on 401
let refreshing = false;
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && typeof window !== 'undefined') {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && !refreshing) {
        try {
          refreshing = true;
          const { data } = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );
          localStorage.setItem('accessToken', data.accessToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          localStorage.clear();
        } finally { refreshing = false; }
      }
    }
    return Promise.reject(error);
  }
);

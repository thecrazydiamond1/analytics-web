import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,  // to send HTTP-only cookies with requests
});

const refreshToken = async () => {
  const response = await apiClient.get('/refresh');
  return response.data.accessToken;
};

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();
      originalRequest.headers['Authorization'] = newAccessToken;
      localStorage.setItem('accesstoken', newAccessToken);
      return apiClient(originalRequest);
    }
    return Promise.reject(error);
  }
);
export default apiClient
import axios from 'axios';

// Centralise les appels HTTP + injecte automatiquement le token JWT
const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
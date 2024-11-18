import axios from 'axios';
import { API_HOST } from './config';
import store from '../store';

const axiosClient = axios.create({ baseURL: API_HOST });

// Interceptor to add Authorization header
axiosClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.global.token?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;

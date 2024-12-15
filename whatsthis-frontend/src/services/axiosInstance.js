import axios from 'axios';
import https from 'https';

const baseURL = (typeof window !== 'undefined')
  ? 'https://localhost:8443/api'
  : 'https://backend:8443/api';

console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Base URL being used:', baseURL);

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true,
    timeout: 60000
  }),
  timeout: 10000,
  maxContentLength: 10000000,
  maxBodyLength: 10000000
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  config => {
    console.log('Making request to:', config.url);
    console.log('Request headers:', config.headers);
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      console.error('Connection error:', error.code);
    }
    console.error('Request failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      code: error.code,
      headers: error.config?.headers
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;

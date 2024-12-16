import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Base URL being used:', baseURL);

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000,
  maxContentLength: 10000000,
  maxBodyLength: 10000000
});


axiosInstance.interceptors.request.use(
  config => {
    console.log('Making request to:', config.url);
    console.log('Request headers:', config.headers);
    return config;
  },
  error => Promise.reject(error)
);


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

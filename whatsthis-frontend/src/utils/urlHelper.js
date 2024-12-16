export const getFullImageUrl = (path) => {
  if (!path) return "https://www.gravatar.com/avatar/default?d=mp";
  if (path.startsWith('http')) return path;
  
 
  const baseUrl = `http://34.171.227.193:8080`;
  const cleanPath = path.startsWith('/uploads') ? path : `uploads/${path}`;
  
  return `${baseUrl}/${cleanPath}`;
};

export const getApiUrl = (endpoint) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://34.171.227.193:8080/api';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
}; 
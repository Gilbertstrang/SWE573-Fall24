export const getFullImageUrl = (path) => {
  if (!path) return "https://www.gravatar.com/avatar/default?d=mp";
  if (path.startsWith('http')) return path;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ?.replace('/api', '')
    ?.replace(/^https:\/\//, 'http://') || 
    'http://localhost:8080';
    
  const matches = path.match(/([^/]+)$/);
  const filename = matches ? matches[0] : '';
  
  const cleanPath = `uploads/${filename}`;
  
  return `${baseUrl}/${cleanPath}`;
};

export const getApiUrl = (endpoint) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  return `${baseUrl}/${cleanEndpoint}`;
}; 
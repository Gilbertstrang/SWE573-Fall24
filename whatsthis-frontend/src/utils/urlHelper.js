export const getFullImageUrl = (path) => {
  if (!path) return "https://www.gravatar.com/avatar/default?d=mp";
  if (path.startsWith('http')) return path;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
  const matches = path.match(/([^/]+)$/);
  const filename = matches ? matches[0] : '';
  
  const cleanPath = `uploads/${filename}`;
  
  return `${baseUrl}/${cleanPath}`;
};

export const getApiUrl = (endpoint) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  return `${baseUrl}/${cleanEndpoint}`;
}; 
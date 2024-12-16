export const getFullImageUrl = (path) => {
  if (!path) return "https://www.gravatar.com/avatar/default?d=mp";
  if (path.startsWith('http')) return path;
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 
                 `http://34.45.173.12/:8080`;
  
  const cleanPath = path.startsWith('/uploads') ? path.slice(1) : path;
  
  return `${baseUrl}/${cleanPath}`;
};

export const getApiUrl = (endpoint) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  return `${baseUrl}/${cleanEndpoint}`;
}; 
export const getFullImageUrl = (path) => {
  if (!path) return "https://www.gravatar.com/avatar/default?d=mp";
  if (path.startsWith('http')) return path;
  
  // For images, we don't want /api in the URL
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8443/api')
    .replace('/api', '')
    .replace(/^http:\/\//, 'https://');  // Force HTTPS
    

  const matches = path.match(/([^/]+)$/);
  const filename = matches ? matches[0] : '';
  
  // Create clean path with single uploads directory
  const cleanPath = `uploads/${filename}`;
  
  
  
  return `${baseUrl}/${cleanPath}`;
};

export const getApiUrl = (endpoint) => {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8443/api')
    .replace('https://', 'https://');
  
  // Remove any leading slashes from the endpoint
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  return `${baseUrl}/${cleanEndpoint}`;
}; 
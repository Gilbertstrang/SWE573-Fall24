export const getFullImageUrl = (path) => {
  if (!path) return "https://www.gravatar.com/avatar/default?d=mp";
  if (path.startsWith('http')) return path;
  
  // For images, we don't want /api in the URL and ensure HTTP
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api')
    .replace('/api', '')
    .replace(/^https?:\/\//, 'http://');  // Force HTTP
    
  // Extract the filename from the path
  const matches = path.match(/([^/]+)$/);
  const filename = matches ? matches[0] : '';
  
  // Create clean path with single uploads directory
  const cleanPath = `uploads/${filename}`;
  
  
  
  return `${baseUrl}/${cleanPath}`;
};

export const getApiUrl = (endpoint) => {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api')
    .replace('https://', 'http://');
  
  // Remove any leading slashes from the endpoint
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  return `${baseUrl}/${cleanEndpoint}`;
}; 
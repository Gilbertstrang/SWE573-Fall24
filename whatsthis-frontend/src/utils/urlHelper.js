export const getFullImageUrl = (path) => {
  if (!path) return "https://www.gravatar.com/avatar/default?d=mp";
  if (path.startsWith('http')) return path;
  
  const baseUrl = `http://${process.env.NEXT_PUBLIC_VM_IP || '35.238.239.131'}:8080`;
    
  const matches = path.match(/([^/]+)$/);
  const filename = matches ? matches[0] : '';
  
  const cleanPath = `uploads/${filename}`;
  
  return `${baseUrl}/${cleanPath}`;
};

export const getApiUrl = (endpoint) => {
    const baseUrl = `http://${process.env.NEXT_PUBLIC_VM_IP || '35.238.239.131'}:8080`;
  
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  return `${baseUrl}/${cleanEndpoint}`;
}; 
/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
      },
    output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: 'https://localhost:8443/api'
  }
};

export default nextConfig;

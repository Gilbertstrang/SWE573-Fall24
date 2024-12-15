#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting deployment process..."

# 1. Update system and install dependencies
echo "📦 Updating system and installing dependencies..."
sudo apt-get update
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# 2. Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# 3. Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "🐙 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# 4. Clean up old containers and images to save space
echo "🧹 Cleaning up old containers and images..."
docker system prune -af --volumes

# 5. Set up environment variables
echo "🔐 Setting up environment variables..."
export VM_IP=$(curl -s http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip -H "Metadata-Flavor: Google")
echo "VM IP is: $VM_IP"

# 6. Update configuration files
echo "⚙️ Updating configuration files..."
# Update frontend API URL
sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=https://$VM_IP:8443/api|g" .env

# 7. Start services with limited resources
echo "🚀 Starting services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# 8. Health check
echo "🏥 Performing health check..."
for i in {1..30}; do
    if curl -k -s https://localhost:8443/api/health > /dev/null; then
        echo "✅ Backend is up!"
        break
    fi
    echo "Waiting for backend to start... ($i/30)"
    sleep 10
done

if curl -k -s https://localhost:3000 > /dev/null; then
    echo "✅ Frontend is up!"
else
    echo "❌ Frontend failed to start"
fi

echo "🎉 Deployment completed!"
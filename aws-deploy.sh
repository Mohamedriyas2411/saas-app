#!/bin/bash

# AWS Deployment Script for SaaS Application
# Run this script on your EC2 instance

echo "🚀 Starting AWS deployment setup..."

# Update system
echo "📦 Updating system packages..."
sudo dnf update -y

# Install Node.js 18
echo "📦 Installing Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Install other required packages
echo "📦 Installing additional packages..."
sudo dnf install -y git nginx postgresql15

# Install PM2 globally
echo "📦 Installing PM2 process manager..."
sudo npm install -g pm2

# Create application directory
echo "📁 Setting up application directory..."
cd /home/ec2-user

# Clone repository (replace with your GitHub URL)
echo "📥 Cloning repository..."
# git clone https://github.com/yourusername/your-saas-app.git
# cd your-saas-app/backend

# Install backend dependencies
echo "📦 Installing backend dependencies..."
# npm install --production

# Setup environment variables
echo "⚙️ Setting up environment variables..."
# cp .env.aws .env
# nano .env  # Edit with your actual values

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'saas-backend',
    script: 'src/app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
}
EOF

# Setup Nginx configuration
echo "🌐 Setting up Nginx..."
sudo tee /etc/nginx/conf.d/saas-app.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;  # Replace with your domain

    # Frontend (if serving from same server)
    location / {
        root /home/ec2-user/your-saas-app/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Start and enable Nginx
echo "🚀 Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Start backend with PM2
echo "🚀 Starting backend application..."
# pm2 start ecosystem.config.js
# pm2 startup
# pm2 save

echo "✅ AWS deployment setup completed!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your RDS connection details"
echo "2. Start the application: pm2 start ecosystem.config.js"
echo "3. Check status: pm2 status"
echo "4. View logs: pm2 logs saas-backend"
echo "5. Update Amplify with your EC2 public IP"
echo ""
echo "Your backend will be available at: http://your-ec2-ip"

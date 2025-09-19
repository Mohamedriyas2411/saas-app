#!/bin/bash

# Pre-deployment script
echo "🚀 Preparing SaaS application for deployment..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
cd backend && npm install --production
cd ../frontend && npm install

# 2. Build frontend
echo "🏗️ Building frontend..."
npm run build

# 3. Test backend
echo "🧪 Testing backend..."
cd ../backend && npm test

# 4. Check environment variables
echo "🔍 Checking environment variables..."
if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET not set!"
    exit 1
fi

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ DB_PASSWORD not set!"
    exit 1
fi

echo "✅ Pre-deployment checks passed!"
echo "🌐 Ready for deployment!"

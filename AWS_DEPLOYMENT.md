# AWS Free Tier Deployment Guide for SaaS Application

## 🚀 Deploy Your SaaS Application to AWS (Free Tier)

Your SaaS application can be deployed to AWS using free tier services. Here are multiple deployment options:

## Option 1: AWS Amplify + EC2 (Recommended for Free Tier)

### Architecture:
- **Frontend**: AWS Amplify (Static hosting - Free)
- **Backend**: EC2 t2.micro (Free tier - 750 hours/month)
- **Database**: MongoDB Atlas (Free tier - 512MB)
- **Storage**: S3 (5GB free)

### Step 1: Prepare Your Application

First, let's create AWS-specific configuration files:

#### Frontend Environment for AWS:
```bash
# In frontend/.env.production
VITE_API_URL=https://your-ec2-instance.compute.amazonaws.com/api
```

#### Backend Environment for AWS:
```bash
# In backend/.env.aws
JWT_SECRET=your-super-secret-jwt-key-for-aws
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saas_app
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-amplify-app.amplifyapp.com
```

### Step 2: Deploy Frontend to AWS Amplify

1. **Push to GitHub** (if not already done):
```bash
git add .
git commit -m "AWS deployment ready"
git push origin main
```

2. **AWS Amplify Setup**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New App" → "Host web app"
   - Connect your GitHub repository
   - Choose the `frontend` folder as root directory
   - Build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/dist
       files:
         - '**/*'
   ```

3. **Environment Variables in Amplify**:
   - Add `VITE_API_URL` (will set after EC2 setup)

### Step 3: Deploy Backend to EC2

1. **Launch EC2 Instance**:
   - Go to EC2 Console
   - Click "Launch Instance"
   - Choose "Amazon Linux 2023 AMI" (Free tier eligible)
   - Instance type: t2.micro (Free tier)
   - Create new key pair (download .pem file)
   - Security Group: Allow HTTP (80), HTTPS (443), SSH (22), Custom TCP (5000)
   - Launch instance

2. **Connect to EC2 Instance**:
```bash
# Windows (using WSL or Git Bash)
ssh -i your-key.pem ec2-user@your-ec2-public-ip

# Or use EC2 Instance Connect in AWS Console
```

3. **Setup EC2 Instance**:
```bash
# Update system
sudo dnf update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Install Git
sudo dnf install -y git

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Clone your repository
git clone https://github.com/yourusername/your-saas-app.git
cd your-saas-app/backend

# Install dependencies
npm install --production

# Create environment file
cp .env.aws .env
nano .env  # Edit with your RDS connection details
```

### Step 4: Setup MongoDB Atlas Database

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create a new cluster (Free tier: M0 Sandbox)

2. **Configure Database**:
   - Choose AWS as cloud provider
   - Select same region as your EC2 instance
   - Create database user with username/password
   - Whitelist IP addresses (0.0.0.0/0 for now, restrict later)

3. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update your backend `.env` file with MONGODB_URI

4. **Initialize Database**:
   ```bash
   # Your MongoDB models will auto-create collections
   # No manual schema creation needed!
   ```

### Step 5: Start Backend Service

```bash
# On EC2 instance
cd /home/ec2-user/your-saas-app/backend

# Start with PM2
pm2 start src/app.js --name "saas-backend"
pm2 startup
pm2 save

# Setup Nginx as reverse proxy (optional but recommended)
sudo dnf install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Option 2: AWS Elastic Beanstalk (Simpler Setup)

### For Both Frontend and Backend:

1. **Install EB CLI**:
```bash
pip install awsebcli --upgrade --user
```

2. **Deploy Backend**:
```bash
cd backend
eb init -p node.js your-saas-backend
eb create production-backend
eb deploy
```

3. **Deploy Frontend**:
```bash
cd frontend
npm run build
# Upload dist folder to S3 and configure CloudFront
```

## Option 3: AWS Lambda + API Gateway (Serverless)

### Benefits:
- Pay per request
- Auto-scaling
- No server management

### Setup:
1. **Install Serverless Framework**:
```bash
npm install -g serverless
```

2. **Convert Express app to Lambda**:
```javascript
// backend/lambda.js
const serverless = require('serverless-http');
const app = require('./src/app');

module.exports.handler = serverless(app);
```

3. **Deploy**:
```bash
cd backend
serverless deploy
```

## AWS Free Tier Limits (12 Months):

- **EC2**: 750 hours/month of t2.micro instances
- **RDS**: 750 hours/month of db.t2.micro or db.t3.micro
- **S3**: 5 GB storage
- **Amplify**: 1000 build minutes, 5 GB storage
- **Lambda**: 1M free requests, 400,000 GB-seconds compute
- **CloudFront**: 50 GB data transfer out

## Cost Optimization Tips:

1. **Stop EC2 when not needed** (development)
2. **Use RDS only during business hours** (stop/start)
3. **Monitor usage** with AWS Cost Explorer
4. **Set up billing alerts** at $5-10

## Complete AWS Deployment Steps:

### Phase 1: Initial Setup (Day 1)
1. Create AWS account (if needed)
2. Push code to GitHub
3. Deploy frontend to Amplify
4. Launch EC2 instance
5. Setup security groups

### Phase 2: Backend Deployment (Day 2)
1. Configure EC2 with Node.js
2. Deploy backend code
3. Setup PM2 process manager
4. Configure Nginx (optional)

### Phase 3: Database Setup (Day 3)
1. Create RDS PostgreSQL instance
2. Configure security groups
3. Initialize database schema
4. Test connections

### Phase 4: Domain & SSL (Day 4)
1. Configure custom domain
2. Setup SSL certificates
3. Update environment variables
4. Test full application

## Security Best Practices:

- Use IAM roles instead of access keys
- Enable VPC for network isolation
- Configure security groups properly
- Enable CloudTrail for logging
- Use AWS Secrets Manager for sensitive data

## Monitoring & Maintenance:

- CloudWatch for metrics and logs
- SNS for notifications
- Auto Scaling Groups for high availability
- Regular security updates

## Estimated Monthly Cost After Free Tier:
- EC2 t2.micro: ~$8-10/month
- RDS db.t3.micro: ~$12-15/month
- Amplify: ~$1-3/month
- **Total**: ~$20-30/month

Would you like me to help you with any specific step, or shall I create the AWS-specific configuration files for your application?

# SaaS Application

A complete SaaS (Software as a Service) application built with modern technologies including Node.js, React, PostgreSQL, and Docker.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with registration, login, and password hashing
- **Subscription Management**: Multiple subscription plans with trial periods, upgrades, and cancellations
- **User Dashboard**: Personalized dashboard with account overview and quick actions
- **Profile Management**: Users can update their personal information and manage account settings
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **RESTful API**: Well-structured API endpoints for all functionality
- **Database**: PostgreSQL with optimized schema and indexes
- **Containerized**: Docker support for easy deployment and development

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database with Sequelize ORM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Joi** for input validation
- **Rate limiting** and security middleware

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development and building
- **React Router** for client-side routing
- **React Query** for API state management
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **React Hot Toast** for notifications

### Infrastructure
- **Docker** & Docker Compose for containerization
- **Nginx** for serving the frontend in production
- **PostgreSQL** for persistent data storage

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker** and **Docker Compose**
- **PostgreSQL** (if running without Docker)

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saas
   ```

2. **Run with Docker Compose**
   ```bash
   # For production build
   docker-compose up --build
   
   # For development with hot reloading
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

### Option 2: Manual Setup

1. **Setup PostgreSQL Database**
   ```bash
   # Create database and run schema
   psql -U postgres
   CREATE DATABASE saas_db;
   \c saas_db;
   \i database/schema.sql
   \i database/seed.sql
   ```

2. **Setup Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   npm install
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env if needed
   npm install
   npm run dev
   ```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
saas/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Sequelize models
│   │   └── routes/         # API routes
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── styles/         # CSS styles
│   ├── Dockerfile
│   └── package.json
├── database/               # Database files
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Sample data
├── docker-compose.yml      # Production setup
├── docker-compose.dev.yml  # Development setup
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Deactivate account

### Subscriptions
- `GET /api/subscriptions/plans` - Get available plans
- `GET /api/subscriptions/current` - Get current subscription
- `POST /api/subscriptions/create` - Create subscription
- `POST /api/subscriptions/upgrade` - Upgrade subscription
- `POST /api/subscriptions/cancel` - Cancel subscription
- `POST /api/subscriptions/reactivate` - Reactivate subscription

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `firstName` (String)
- `lastName` (String)
- `isActive` (Boolean)
- `emailVerified` (Boolean)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### Subscriptions Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `planId` (String)
- `planName` (String)
- `status` (Enum: active, canceled, past_due, unpaid, trialing)
- `currentPeriodStart` (Timestamp)
- `currentPeriodEnd` (Timestamp)
- `cancelAtPeriodEnd` (Boolean)
- `trialStart` (Timestamp)
- `trialEnd` (Timestamp)

## 🚢 Deployment

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build -d
   ```

2. **Check logs**
   ```bash
   docker-compose logs -f
   ```

### Cloud Deployment Options

#### AWS ECS
1. Push images to ECR
2. Create ECS service
3. Set up RDS PostgreSQL
4. Configure load balancer

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build settings
3. Add managed PostgreSQL database
4. Set environment variables

#### Heroku
1. Install Heroku CLI
2. Create Heroku apps for frontend/backend
3. Add Heroku PostgreSQL addon
4. Deploy using Git

### Environment-Specific Configurations

#### Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Enable HTTPS
- Set up monitoring and logging
- Configure backup strategies

#### Staging
- Use separate database
- Enable debug logging
- Test with production-like data

## 📈 Scaling Considerations

### Performance Optimizations
- Implement Redis for session storage
- Add database connection pooling
- Use CDN for static assets
- Implement API rate limiting
- Add database indexes

### Security Enhancements
- Implement 2FA authentication
- Add input sanitization
- Enable CORS properly
- Use HTTPS everywhere
- Regular security audits

## 🔍 Monitoring & Logging

### Recommended Tools
- **Application Monitoring**: New Relic, DataDog
- **Error Tracking**: Sentry
- **Logging**: Winston (Node.js), CloudWatch
- **Uptime Monitoring**: Pingdom, StatusCake

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Test Accounts
For testing purposes, you can use these accounts (password: `password123`):
- `admin@example.com`
- `user@example.com`
- `test@example.com`

### Common Issues

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# View database logs
docker-compose logs database
```

#### Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

### Getting Help
- Create an issue in the repository
- Check existing issues for solutions
- Review logs for error details

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ User authentication
- ✅ Subscription management
- ✅ Basic dashboard
- ✅ Docker containerization

### Phase 2 (Next)
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] API rate limiting
- [ ] Admin panel

### Phase 3 (Future)
- [ ] Multi-tenancy support
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Third-party integrations

---

**Happy coding! 🎉**

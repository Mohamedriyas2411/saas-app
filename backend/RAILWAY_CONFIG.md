# Railway Backend Service Configuration

## For Backend Service Deployment:

1. **Service Settings:**
   - Root Directory: `backend/`
   - Start Command: `npm start`
   - Build Command: `npm install`

2. **Environment Variables:**
   ```env
   NODE_ENV=production
   JWT_SECRET=your-super-secret-railway-jwt-key-123456789
   PORT=${{PORT}}
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   FRONTEND_URL=https://your-frontend-service.railway.app
   ```

3. **Health Check:**
   - Path: `/health`
   - Expected Response: `{"status":"OK"}`

## Service Configuration (railway.json for backend):
```json
{
  "deploy": {
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```
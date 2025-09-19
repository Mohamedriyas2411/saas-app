# Railway Frontend Service Configuration

## For Frontend Service Deployment:

1. **Service Settings:**
   - Root Directory: `frontend/`
   - Build Command: `npm run build`
   - Start Command: `npm run preview`
   - Output Directory: `dist/`

2. **Environment Variables:**
   ```env
   VITE_API_URL=https://your-backend-service.railway.app/api
   ```

3. **Build Configuration:**
   - Node Version: 18.x
   - Build Tool: Vite
   - Static Files: Yes

## Alternative: Use Static Site Deployment
Railway can serve your React build as a static site:
- Upload `frontend/dist/` folder after building locally
- Or use Railway's static site deployment feature
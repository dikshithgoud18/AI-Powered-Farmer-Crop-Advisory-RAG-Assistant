# Vercel Deployment Guide

## Project Status ✅

Your project is now **ready for Vercel deployment**. Both the backend and frontend are configured and running locally.

### Running Locally

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```
Runs on: http://localhost:5000

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```
Runs on: http://localhost:5173

## Vercel Configuration

The project includes a `vercel.json` configuration that handles:

1. **Frontend**: Static build with Vite
   - Build command: `tsc -b && vite build`
   - Output directory: `dist`

2. **Backend**: Node.js serverless functions
   - Build command: `tsc` (compiles TypeScript to JavaScript)
   - Output directory: `backend/dist`
   - Entry point: `backend/dist/api/index.js`

3. **Routing**:
   - `/api/*` → Backend serverless functions
   - `/*` → Frontend static files with SPA fallback

## Required Environment Variables for Vercel

Add these to your Vercel project settings:

```
PORT=5000
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_uri (optional for production)
JWT_SECRET=your_jwt_secret
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langchain_api_key
LANGCHAIN_PROJECT=farmer-rag-evals
CHROMA_DB_URL=your_chroma_db_url (optional)
```

## Deployment Steps

1. **Push to Git**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the root directory (don't select individual folders)

3. **Configure Environment Variables**:
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add all required environment variables
   - Ensure they're set for all environments (Production, Preview, Development)

4. **Deploy**:
   - Vercel will automatically build and deploy when you push to main
   - Build process:
     - Backend: `npm run build` in backend folder
     - Frontend: `npm run build` in frontend folder

## Build Scripts Added ✅

- **Backend**: Added `"build": "tsc"` to compile TypeScript
- **Frontend**: Already has `"build": "tsc -b && vite build"`

## Configuration Files Updated ✅

- **vercel.json**: Updated to use compiled `backend/dist` output
- **.env.example**: Created with required environment variables
- **backend/package.json**: Added build script

## Health Check

Test your deployment:
```bash
curl https://your-domain.vercel.app/api/health
```

Should respond with:
```json
{"status":"healthy","timestamp":"2026-06-03T..."}
```

## Notes

- The backend uses MongoDB (optional) - ensure MONGODB_URI is set in production
- ChromaDB is used for vector storage
- GROQ API is required for the RAG service
- TypeScript is compiled to JavaScript for Vercel compatibility
- All API requests are proxied through `/api/` endpoint
- Frontend SPA routing is handled via vercel.json configuration

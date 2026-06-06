# Railway Setup Guide

## 1. Create Railway account
Go to https://railway.app and sign up with GitHub.

## 2. Create new project
- Click "New Project"
- Choose "Empty Project"
- Name it: todolist-devops

## 3. Add MySQL plugin
- Inside the project, click "+ New"
- Select "Database" → "MySQL"
- Railway creates MySQL and sets DATABASE_URL automatically

## 4. Add backend service
- Click "+ New" → "GitHub Repo"
- Select your repo
- Set root directory to: /backend
- Railway detects Dockerfile automatically
- Set service name: backend

## 5. Add frontend service
- Click "+ New" → "GitHub Repo"  
- Select your repo
- Set root directory to: /frontend
- Set service name: frontend

## 6. Set environment variables for backend
In Railway dashboard → backend service → Variables:
- NODE_ENV = production
- DATABASE_URL = (auto-filled by MySQL plugin, click "Add Reference")

## 7. Set frontend env variable
In Railway dashboard → frontend service → Variables:
- VITE_API_URL = https://your-backend-url.up.railway.app
  (or REACT_APP_API_URL depending on your frontend framework)

## 8. Get Railway token for CI/CD
- Railway dashboard → Account Settings → Tokens
- Create token named: github-actions
- Copy the token

## 9. Get Railway Project ID
- Railway dashboard → your project → Settings
- Copy the Project ID

## 10. Add secrets to GitHub
Go to your GitHub repo → Settings → Secrets and variables → Actions:
- RAILWAY_TOKEN = (token from step 8)
- RAILWAY_PROJECT_ID = (project ID from step 9)

## 11. Push to main
git push origin main
The pipeline will deploy automatically.

# Sweet Shop Backend

## Environment Variables

For deployment, set the following environment variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://anantk13:Rockstar13@cluster0.v3ibqnh.mongodb.net/sweetshop?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
JWT_SECRET=sweetshop-super-secret-production-key-2024-change-this
```

⚠️ **IMPORTANT:** Change `JWT_SECRET` to a strong random value before deploying to production!

## Deployment Instructions

### Render Deployment

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect your repository
5. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables (see above)
7. Deploy

### Railway Deployment

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project
4. Connect your repository
5. Add environment variables (see above)
6. Deploy

### Heroku Deployment

1. Push code to GitHub
2. Go to [heroku.com](https://heroku.com)
3. Create new app
4. Connect GitHub repository
5. Add environment variables in Settings → Config Vars
6. Deploy

## Build Command

```bash
npm install
```

## Start Command

```bash
npm start
```

## After Deployment

1. Copy your deployed backend URL (e.g., `https://your-app.onrender.com`)
2. Use this URL in your frontend environment variable:
   ```env
   REACT_APP_API_URL=https://your-app.onrender.com/api
   ```
3. Update CORS in `server.js` to allow your frontend domain

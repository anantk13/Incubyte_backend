# Render Deployment Configuration

## Build Settings

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

OR

```bash
node server.js
```

## Environment Variables

Add these in Render Dashboard → Environment:

```
PORT=5000
MONGODB_URI=mongodb+srv://anantk13:Rockstar13@cluster0.v3ibqnh.mongodb.net/sweetshop?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
JWT_SECRET=sweetshop-super-secret-production-key-2024-change-this
```

## Important Notes

1. **Entry File:** `server.js` (not `index.js`)
2. **Port:** The app uses `process.env.PORT` which Render will provide
3. **MongoDB:** Already configured with your Atlas cluster
4. **CORS:** Will need to be updated with your frontend URL after frontend deployment

## After Deployment

1. Copy your deployed backend URL (e.g., `https://your-app.onrender.com`)
2. Test the API:
   - `https://your-app.onrender.com/api/sweets` (should return empty array)
3. Use this URL in frontend environment variable:
   ```
   REACT_APP_API_URL=https://your-app.onrender.com/api
   ```

## Troubleshooting

### Error: Cannot find module 'index.js'
**Solution:** Make sure Start Command is `node server.js` or `npm start`

### Error: MongoDB connection failed
**Solution:** Check that MONGODB_URI environment variable is set correctly

### Error: CORS blocked
**Solution:** Update `server.js` to include your frontend URL in CORS origins

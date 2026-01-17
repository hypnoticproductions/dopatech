# Dopa-Tech Voice Server (Railway)

WebSocket server for xAI Voice Agent, designed for Railway deployment.

## 🚀 Quick Deploy to Railway

### Option 1: Deploy from GitHub (Recommended)

1. **Push this folder to GitHub:**
   ```bash
   cd /home/user/dopatech/railway-voice-server
   git init
   git add .
   git commit -m "Initial commit - Railway voice server"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/dopatech-voice-server.git
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to: https://railway.app/
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your `dopatech-voice-server` repository
   - Railway will auto-detect Node.js and deploy!

3. **Add Environment Variables:**
   - In Railway dashboard, click your project
   - Click **"Variables"** tab
   - Add:
     ```
     XAI_API_KEY=your-xai-api-key-here
     COLLECTION_ID=your-collection-id-here
     ```
   - Click **"Deploy"** to restart with new variables

### Option 2: Deploy with Railway CLI

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy:**
   ```bash
   cd /home/user/dopatech/railway-voice-server
   railway login
   railway init
   railway up
   ```

3. **Set environment variables:**
   ```bash
   railway variables set XAI_API_KEY=your-key-here
   railway variables set COLLECTION_ID=your-collection-id-here
   ```

## 📝 After Deployment

1. **Get your Railway URL:**
   - In Railway dashboard, click **"Settings"**
   - Find **"Domains"** section
   - You'll see something like: `your-app.railway.app`

2. **Test the server:**
   ```bash
   curl https://your-app.railway.app/
   ```

   Should return:
   ```json
   {
     "service": "xAI Voice Agent WebSocket Server",
     "status": "online",
     "version": "3.0.0-RAILWAY"
   }
   ```

3. **Update your frontend:**
   - Edit `/home/user/dopatech/xai-voice-agent.js`
   - Change line ~890:
     ```javascript
     window.voiceAgent = new XAIVoiceAgent('wss://your-app.railway.app/');
     ```

## 🔧 Local Testing

```bash
# Install dependencies
npm install

# Set environment variables
export XAI_API_KEY=your-key-here
export COLLECTION_ID=your-collection-id-here

# Run server
npm start
```

Server will run on `http://localhost:3000`

## 📊 Monitoring

Check Railway logs:
- Go to Railway dashboard
- Click your project
- Click **"Deployments"** tab
- View real-time logs

## 🆘 Troubleshooting

### "XAI_API_KEY environment variable is required"
- Make sure you added the environment variable in Railway
- Check spelling is exactly: `XAI_API_KEY`

### WebSocket connection fails
- Check Railway logs for errors
- Verify your domain is correct (should be `wss://` not `ws://`)
- Make sure Railway service is running

### No audio response
- Check browser console for events
- Look for `output_audio.delta` events
- Check Railway logs for xAI API errors

## 💰 Cost

Railway free tier includes:
- $5 free credit per month
- ~500 hours of runtime
- Plenty for development and testing

Upgrade to Hobby plan ($5/month) for production use.

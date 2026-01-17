# 🚂 Railway Deployment Guide

## Why Railway Instead of Cloudflare?

✅ **More Reliable** - Proper Node.js server with better error handling
✅ **Easier to Debug** - Real-time logs you can actually read
✅ **Simpler Setup** - No complex Worker syntax
✅ **Better WebSocket Support** - Native WebSocket library
✅ **Free Tier** - $5 free credit per month (~500 hours)

---

## 📋 Step-by-Step Deployment

### Step 1: Sign Up for Railway

1. Go to: **https://railway.app/**
2. Click **"Login"** → Sign in with GitHub (recommended)
3. Authorize Railway to access your GitHub

### Step 2: Create New Project from GitHub

**Option A: If you already pushed the code to GitHub**

1. In Railway, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose repository: `hypnoticproductions/dopatech`
4. Railway will ask: **"Which directory?"**
   - Enter: `railway-voice-server`
5. Click **"Deploy"**

**Option B: Quick Deploy (No GitHub needed)**

1. In Railway, click **"New Project"**
2. Select **"Empty Project"**
3. Click **"+ New"** → **"Empty Service"**
4. In the service, click **"Settings"** tab
5. Under **"Source"**, click **"Connect Repo"**
6. Choose your repo and set root directory to `railway-voice-server`

### Step 3: Add Environment Variables

1. In your Railway project, click the service name
2. Click **"Variables"** tab
3. Click **"+ New Variable"**
4. Add these two variables:

   ```
   XAI_API_KEY
   ```
   Value: Your xAI API key (starts with `xai-`)

   ```
   COLLECTION_ID
   ```
   Value: Your collection ID (starts with `collection_`)

5. Railway will automatically redeploy

### Step 4: Get Your Railway URL

1. Click **"Settings"** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"**
4. Copy your domain (looks like: `your-app.railway.app`)

### Step 5: Test the Server

Open a terminal and run:

```bash
curl https://your-app.railway.app/
```

You should see:
```json
{
  "service": "xAI Voice Agent WebSocket Server",
  "status": "online",
  "version": "3.0.0-RAILWAY",
  "platform": "Railway"
}
```

✅ If you see this, your server is working!

### Step 6: Update Frontend to Use Railway

Now we need to update your website to connect to Railway instead of Cloudflare.

I'll do this for you in the next step, but here's what needs to change:

In `public/xai-voice-agent.js` (line ~890), change:
```javascript
// OLD (Cloudflare):
window.voiceAgent = new XAIVoiceAgent('wss://sitetalkr.richard-fproductions.workers.dev/');

// NEW (Railway):
window.voiceAgent = new XAIVoiceAgent('wss://your-app.railway.app/');
```

---

## 🔍 Monitoring & Debugging

### View Live Logs

1. In Railway project, click **"Deployments"** tab
2. Click the latest deployment
3. See real-time logs showing:
   - Client connections: `👤 New client connected`
   - xAI connections: `✅ Connected to xAI Realtime API`
   - Messages: `📤 Client → xAI` and `📥 xAI → Client`

### Common Log Messages

```
✅ Connected to xAI Realtime API    // Good! Server connected to xAI
👤 New client connected             // Good! User connected
📤 Sent session configuration       // Good! Configuration sent
📥 xAI → Client: output_audio.delta // Good! Receiving audio
❌ xAI WebSocket error               // Bad! Check API key
```

---

## 💰 Cost Breakdown

**Free Tier:**
- $5 credit per month
- Unused credit does NOT roll over
- Covers ~500 hours of runtime
- Perfect for development

**Hobby Plan ($5/month):**
- Unlimited usage
- No sleep mode
- Better for production

**For your use case:** Free tier should be plenty!

---

## ⚠️ Troubleshooting

### "Application failed to respond"
- Check environment variables are set correctly
- View deployment logs for errors
- Make sure `XAI_API_KEY` is set

### "XAI_API_KEY environment variable is required"
- Go to Variables tab
- Verify `XAI_API_KEY` is spelled exactly right
- Make sure the value starts with `xai-`

### WebSocket connection refused
- Make sure you're using `wss://` (not `ws://`)
- Check your Railway domain is correct
- Verify service is running (green dot in Railway dashboard)

### No audio playing
- Open browser console
- Look for `output_audio.delta` events
- Check Railway logs for xAI API errors
- Verify Collection ID is correct

---

## ✅ Next Steps

Once your Railway server is deployed and responding:

1. I'll update your frontend to use the Railway URL
2. We'll push the changes to Vercel
3. Test the voice agent on your live site
4. Celebrate! 🎉

**Ready to deploy? Let me know when you have your Railway URL!**

# 🚀 Voice Agent Deployment Instructions

## ✅ What Was Fixed

Based on the **working SafeTravel Trav Talkr** implementation, we identified and fixed **3 critical issues**:

### 1. ❌ Missing Model Parameter
**Problem:** xAI API requires `model=grok-2-public` in URL
**Fix:** Added `?model=grok-2-public` to WebSocket URL

### 2. ❌ Wrong Audio Format
**Problem:** Using MediaRecorder with webm/opus (compressed format)
**Fix:** Switched to ScriptProcessorNode with raw PCM16 @ 24kHz

### 3. ❌ Wrong Event Names
**Problem:** Listening for `response.audio.delta` (OpenAI format)
**Fix:** Changed to `response.output_audio.delta` (xAI format with "output_" prefix)

---

## 📦 Deployment Steps

### Step 1: Update Cloudflare Worker

1. **Go to Cloudflare Dashboard:**
   ```
   https://dash.cloudflare.com/
   Workers & Pages > sitetalkr
   ```

2. **Click "Edit Code"**

3. **Replace ALL code** with contents from:
   ```
   /home/user/dopatech/cloudflare-worker-FINAL-FIX.js
   ```

4. **Verify Environment Variables** (Settings > Variables):
   ```
   XAI_API_KEY = <your-xai-api-key>
   COLLECTION_ID = <your-collection-id>
   ```

5. **Click "Save and Deploy"**

6. **Verify it's working:**
   - Visit: `https://sitetalkr.richard-fproductions.workers.dev/`
   - Should show: `"version": "2.0.0-FINAL-FIX"`
   - Should show: `"model": "grok-2-public"`

---

### Step 2: Update Frontend Code

1. **Replace the voice agent file:**
   ```bash
   # Copy the fixed version
   cp xai-voice-agent-FIXED.js public/xai-voice-agent.js
   ```

2. **Commit and push:**
   ```bash
   git add public/xai-voice-agent.js
   git commit -m "Deploy fixed voice agent with correct audio encoding"
   git push origin claude/fix-unexpected-issue-QOQyh
   ```

3. **Merge to master** (if on feature branch)

4. **Wait for Vercel to deploy** (~1-2 minutes)

---

### Step 3: Test the Voice Agent

1. **Visit your deployed site** (hard refresh: Ctrl+Shift+R)

2. **Click the voice button** (bottom-right floating button)

3. **Click "Press to Speak"** and allow microphone

4. **Say:** "What is Dopa-Tech?"

5. **Expected result:**
   - Status: Ready → Listening → Processing → Speaking
   - **You HEAR audio response** with specific info about Dopa-Tech
   - Console shows: `Received message type: response.output_audio.delta`

---

## 🔍 Verification Checklist

### Worker Verification:
- [ ] Worker responds at: `https://sitetalkr.richard-fproductions.workers.dev/`
- [ ] Shows version: `2.0.0-FINAL-FIX`
- [ ] Shows model: `grok-2-public`
- [ ] Environment variables are set

### Frontend Verification:
- [ ] Voice button appears (bottom-right)
- [ ] Panel opens on click
- [ ] Shows "READY" status (green dot)
- [ ] Console shows: "Connected to voice agent worker"

### Voice Functionality:
- [ ] Microphone permission works
- [ ] Status changes to "Listening..." when speaking
- [ ] Console shows: `Received message type: response.output_audio.delta`
- [ ] **Audio plays back** (you hear the AI)
- [ ] AI gives specific Dopa-Tech info (RAG working)

---

## 🐛 Troubleshooting

### Issue: Still stuck on "Processing..."

**Check console for:**
```javascript
// Good - should see:
"Received message type: session.created"
"Received message type: response.output_audio.delta"

// Bad - if you see error:
"Server error: ..."
```

**Solutions:**
1. Verify Worker has correct code (check version number)
2. Verify environment variables in Cloudflare
3. Check Worker logs for errors (requires paid plan)
4. Verify collection exists in xAI console

### Issue: No audio playback

**Check console for:**
```javascript
"Failed to play audio: ..."
```

**Solutions:**
1. Make sure AudioContext is resumed (click page first)
2. Check browser audio isn't muted
3. Try different browser (Chrome/Edge work best)

### Issue: "Connection Error"

**Solutions:**
1. Check Worker is deployed and online
2. Verify WebSocket URL is correct
3. Check browser console for CORS errors

---

## 📊 Technical Details

### Audio Pipeline:
```
Microphone (24kHz mono)
  ↓
ScriptProcessorNode (4096 samples)
  ↓
Float32 → Int16 PCM conversion
  ↓
Int16 → Base64 encoding
  ↓
WebSocket → Cloudflare Worker
  ↓
Worker → xAI API (wss://api.x.ai/v1/realtime?model=grok-2-public)
  ↓
xAI returns: response.output_audio.delta (Base64 PCM16)
  ↓
Worker → Browser WebSocket
  ↓
Base64 → ArrayBuffer
  ↓
Add WAV header
  ↓
AudioContext.decodeAudioData()
  ↓
Queue and play audio chunks
```

### Event Flow:
```
1. session.created                      ← Connection established
2. session.update                        ← Config accepted
3. input_audio_buffer.speech_started    ← You started speaking
4. input_audio_buffer.commit            ← You stopped speaking
5. response.output_audio.delta (many)   ← AI audio chunks
6. response.output_audio_transcript.delta ← What AI is saying
7. response.done                         ← Response complete
```

---

## ✅ Success Criteria

Voice agent is working correctly when:

1. **You hear the AI speak** (most important!)
2. **AI provides specific Dopa-Tech information** (RAG working)
3. **No errors in console**
4. **Smooth conversation flow**

---

## 📞 Support

If issues persist:
1. Check Worker logs (Cloudflare Dashboard > Workers > Logs)
2. Share console errors
3. Verify xAI API key has Realtime API access
4. Confirm collection exists in xAI console

---

**All the fixed code is in your repository:**
- `cloudflare-worker-FINAL-FIX.js` ← Deploy this to Cloudflare
- `xai-voice-agent-FIXED.js` ← Deploy this to Vercel (as public/xai-voice-agent.js)

Good luck! 🚀

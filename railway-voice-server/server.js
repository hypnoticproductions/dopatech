/**
 * xAI Voice Agent - Railway WebSocket Server
 * Node.js server for handling real-time voice communication with xAI API
 */

import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import WebSocket from 'ws';

const app = express();
const PORT = process.env.PORT || 3000;

// Environment variables
const XAI_API_KEY = process.env.XAI_API_KEY;
const COLLECTION_ID = process.env.COLLECTION_ID;

if (!XAI_API_KEY) {
  console.error('❌ XAI_API_KEY environment variable is required');
  process.exit(1);
}

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'xAI Voice Agent WebSocket Server',
    status: 'online',
    version: '3.0.0-RAILWAY',
    platform: 'Railway',
    model: 'grok-2-public',
    configuration: {
      rag: COLLECTION_ID ? 'enabled' : 'disabled',
      audio: 'pcm16 @ 24kHz',
      voice: 'alloy',
      vad: 'server_vad'
    },
    endpoints: {
      health: '/',
      websocket: 'ws://[your-url]/'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Create HTTP server
const server = createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

console.log('🚀 Starting Railway Voice Server...');
console.log('📡 Environment:', {
  hasApiKey: !!XAI_API_KEY,
  hasCollectionId: !!COLLECTION_ID,
  port: PORT
});

wss.on('connection', (clientSocket, req) => {
  console.log('👤 New client connected from:', req.socket.remoteAddress);

  // Connect to xAI Realtime API with model parameter
  const xaiUrl = 'wss://api.x.ai/v1/realtime?model=grok-2-public';

  console.log('🔌 Connecting to xAI API:', xaiUrl);

  const xaiSocket = new WebSocket(xaiUrl, {
    headers: {
      'Authorization': `Bearer ${XAI_API_KEY}`,
      'OpenAI-Beta': 'realtime=v1'
    }
  });

  let isXaiConnected = false;

  // Handle xAI connection open
  xaiSocket.on('open', () => {
    console.log('✅ Connected to xAI Realtime API');
    isXaiConnected = true;

    // Configure session
    const sessionConfig = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1'
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 1000
        },
        temperature: 0.8,
        instructions: `You are Dopa-Tech AI, a helpful voice assistant for the Dopa-Tech infrastructure platform.

Dopa-Tech is a multi-divisional node connecting technology, rhythm, and visual identity. It includes:

**Divisions:**
- **Hypnotic Productions**: Music production, artist services, and audio engineering. Features the "Five Doors" artist development framework with transparent revenue splits.
- **Dopamine Clothing**: Independent apparel designed by Rashad, including the Flow Energy and Nori L'amour collections.
- **DEV NE-Thing**: Computational frameworks, app development, research and analysis.
- **Shawn Parks**: AI-assisted digital artist persona by producer Rashad Corbin, blending Caribbean heritage with computational music frameworks.

**Artist Services:**
- Song Likeness Licensing (50% publishing share)
- Name, Image & Likeness agreements (50/50 brand splits)
- Artist-owned DAW masters (100% artist ownership)
- Merchandising (70% artist-branded, 30% label-branded)
- Video Master NFTs for sync licensing
- Full-spectrum production services with AI-powered tools

**Key Principles:**
- Transparent business frameworks
- No cross-collateralization between revenue streams
- Financial protections for artists
- Clear ownership and rights management

Be concise, helpful, and conversational. Keep responses under 100 words for voice delivery. When users ask about specific services, pricing, or business models, provide accurate details.`
      }
    };

    // Add RAG tool if collection ID is provided
    if (COLLECTION_ID) {
      sessionConfig.session.tools = [{
        type: 'collections_search',
        collection_ids: [COLLECTION_ID]
      }];
      sessionConfig.session.tool_choice = 'auto';
      console.log('✅ RAG enabled with collection:', COLLECTION_ID);
    }

    xaiSocket.send(JSON.stringify(sessionConfig));
    console.log('📤 Sent session configuration');
  });

  // Forward messages from client to xAI
  clientSocket.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (isXaiConnected && xaiSocket.readyState === WebSocket.OPEN) {
        xaiSocket.send(JSON.stringify(message));

        // Log non-audio messages for debugging
        if (message.type !== 'input_audio_buffer.append') {
          console.log('📤 Client → xAI:', message.type);
        }
      } else {
        console.warn('⚠️ xAI not connected, message dropped:', message.type);
      }
    } catch (error) {
      console.error('❌ Error parsing client message:', error.message);
    }
  });

  // Forward messages from xAI to client
  xaiSocket.on('message', (data) => {
    try {
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(data);

        // Log received events (except audio chunks)
        try {
          const message = JSON.parse(data.toString());
          if (message.type !== 'output_audio.delta' && message.type !== 'response.audio.delta') {
            console.log('📥 xAI → Client:', message.type);
          }
        } catch (e) {
          // Ignore parsing errors for binary data
        }
      }
    } catch (error) {
      console.error('❌ Error forwarding xAI message:', error.message);
    }
  });

  // Handle xAI errors
  xaiSocket.on('error', (error) => {
    console.error('❌ xAI WebSocket error:', error.message);
    if (clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.send(JSON.stringify({
        type: 'error',
        error: {
          message: 'xAI connection error',
          details: error.message
        }
      }));
    }
  });

  // Handle xAI close
  xaiSocket.on('close', (code, reason) => {
    console.log('🔌 xAI connection closed:', code, reason.toString());
    isXaiConnected = false;

    if (clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.close(1000, 'xAI connection closed');
    }
  });

  // Handle client disconnect
  clientSocket.on('close', (code, reason) => {
    console.log('👋 Client disconnected:', code, reason);

    if (xaiSocket.readyState === WebSocket.OPEN) {
      xaiSocket.close(1000, 'Client disconnected');
    }
  });

  // Handle client errors
  clientSocket.on('error', (error) => {
    console.error('❌ Client WebSocket error:', error.message);

    if (xaiSocket.readyState === WebSocket.OPEN) {
      xaiSocket.close(1001, 'Client error');
    }
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Railway Voice Server running on port:', PORT);
  console.log('🌐 Ready to accept WebSocket connections');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received, closing server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

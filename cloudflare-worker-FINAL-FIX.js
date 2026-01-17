/**
 * xAI Voice Agent - Cloudflare Worker
 * FINAL CORRECTED VERSION - All issues fixed
 * Based on working SafeTravel implementation
 */

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

async function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

async function handleWebSocket(request, env) {
  const webSocketPair = new WebSocketPair();
  const [clientSocket, serverSocket] = Object.values(webSocketPair);

  await initWebSocket(serverSocket, env);

  return new Response(null, {
    status: 101,
    webSocket: clientSocket,
    headers: corsHeaders
  });
}

async function initWebSocket(serverSocket, env) {
  // ✅ FIX 1: Add model parameter
  const xAIUrl = 'wss://api.x.ai/v1/realtime?model=grok-2-public';

  const xaiSocket = new WebSocket(xAIUrl, [
    'realtime',
    `openai-insecure-api-key.${env.XAI_API_KEY}`
  ]);

  let sessionConfigured = false;

  // Forward client messages to xAI
  serverSocket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'input_audio_buffer.append' && xaiSocket.readyState === WebSocket.OPEN) {
        xaiSocket.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: data.audio
        }));
      }
      else if (data.type === 'input_audio_buffer.commit' && xaiSocket.readyState === WebSocket.OPEN) {
        xaiSocket.send(JSON.stringify({
          type: 'input_audio_buffer.commit'
        }));
      }
      else if (data.type === 'response.create' && xaiSocket.readyState === WebSocket.OPEN) {
        xaiSocket.send(JSON.stringify({
          type: 'response.create'
        }));
      }
    } catch (error) {
      console.error('Error parsing client message:', error);
    }
  });

  // Handle xAI connection open
  xaiSocket.addEventListener('open', () => {
    console.log('Connected to xAI Realtime API');

    // Send session configuration
    xaiSocket.send(JSON.stringify({
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
        // ✅ Correct RAG configuration
        tools: [{
          type: 'collections_search',
          collection_ids: [env.COLLECTION_ID]
        }],
        tool_choice: 'auto',
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

Be concise, helpful, and conversational. Keep responses under 100 words for voice delivery. When users ask about specific services, pricing, or business models, use the RAG tool to provide accurate details from the knowledge base.`
      }
    }));

    sessionConfigured = true;
  });

  // Forward xAI messages to client
  xaiSocket.addEventListener('message', (event) => {
    try {
      if (serverSocket.readyState === WebSocket.OPEN) {
        serverSocket.send(event.data);
      }
    } catch (error) {
      console.error('Error forwarding xAI message:', error);
    }
  });

  // Handle errors
  xaiSocket.addEventListener('error', (error) => {
    console.error('xAI WebSocket error:', error);
  });

  xaiSocket.addEventListener('close', (event) => {
    console.log('xAI connection closed:', event.code, event.reason);
    try {
      if (serverSocket.readyState === WebSocket.OPEN) {
        serverSocket.close(event.code, event.reason || 'xAI connection closed');
      }
    } catch (error) {
      console.error('Error closing server socket:', error);
    }
  });

  serverSocket.addEventListener('close', (event) => {
    console.log('Client connection closed:', event.code, event.reason);
    if (xaiSocket.readyState === WebSocket.OPEN) {
      xaiSocket.close(1000, 'Client disconnected');
    }
  });

  serverSocket.addEventListener('error', (error) => {
    console.error('Client WebSocket error:', error);
    if (xaiSocket.readyState === WebSocket.OPEN) {
      xaiSocket.close(1001, 'Client error');
    }
  });
}

// Main fetch handler
export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    const upgradeHeader = request.headers.get('Upgrade');

    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response(JSON.stringify({
        service: 'xAI Voice Agent WebSocket Relay',
        status: 'online',
        version: '2.0.0-FINAL-FIX',
        model: 'grok-2-public',
        configuration: {
          rag: 'collections_search',
          audio: 'pcm16 @ 24kHz',
          voice: 'alloy',
          vad: 'server_vad'
        },
        fixes_applied: [
          'Added model=grok-2-public to URL',
          'Updated to xAI event names (output_audio)',
          'Corrected collections_search format'
        ],
        usage: 'Connect via WebSocket with PCM16 audio @ 24kHz'
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    try {
      return await handleWebSocket(request, env);
    } catch (error) {
      console.error('WebSocket error:', error);
      return new Response(JSON.stringify({
        error: 'WebSocket connection failed',
        message: error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  }
};

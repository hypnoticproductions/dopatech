/**
 * xAI Voice Agent - Cloudflare Worker
 * Proper WebSocket relay for xAI Realtime API with RAG support
 */

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle OPTIONS preflight requests
async function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Handle WebSocket upgrade requests
async function handleWebSocket(request, env) {
  // Create WebSocket pair for Cloudflare Workers
  const webSocketPair = new WebSocketPair();
  const [clientSocket, serverSocket] = Object.values(webSocketPair);

  // Initialize the WebSocket connection
  await initWebSocket(serverSocket, env);
  
  // Return response with upgrade header
  return new Response(null, {
    status: 101,
    webSocket: clientSocket,
    headers: corsHeaders
  });
}

// Initialize WebSocket connections
async function initWebSocket(serverSocket, env) {
  // Connect to xAI Realtime API
  const xAIUrl = 'wss://api.x.ai/v1/realtime';
  
  const xaiSocket = new WebSocket(xAIUrl, [
    'realtime',
    `openai-insecure-api-key.${env.XAI_API_KEY}`
  ]);

  let sessionConfigured = false;

  // Handle incoming messages from client (browser)
  serverSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      // Forward audio data to xAI
      if (data.type === 'input_audio_buffer.append' && xaiSocket.readyState === WebSocket.OPEN) {
        xaiSocket.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: data.audio
        }));
      }
      // Commit audio buffer
      else if (data.type === 'input_audio_buffer.commit' && xaiSocket.readyState === WebSocket.OPEN) {
        xaiSocket.send(JSON.stringify({
          type: 'input_audio_buffer.commit'
        }));
      }
      // Handle response creation
      else if (data.type === 'response.create' && xaiSocket.readyState === WebSocket.OPEN) {
        xaiSocket.send(JSON.stringify({
          type: 'response.create'
        }));
      }
    } catch (error) {
      console.error('Error parsing client message:', error);
    }
  };

  // Handle xAI connection open
  xaiSocket.onopen = () => {
    console.log('Connected to xAI Realtime API');
    
    // Send session configuration
    xaiSocket.send(JSON.stringify({
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          silence_duration_ms: 1000
        },
        // RAG configuration using collection_id
        tools: [{
          type: 'retrieval',
          retrieval: {
            collection_id: env.COLLECTION_ID
          }
        }],
        tool_choice: 'auto',
        instructions: `You are Dopa-Tech AI, a helpful voice assistant for the Dopa-Tech infrastructure platform.
        
Dopa-Tech is a multi-divisional node connecting technology, rhythm, and visual identity. It includes:
- Hypnotic Productions (music/artistic division)
- Dopamine Clothing (apparel by Rashad)
- Advanced Artist Services (AI-powered artist development)
- Shawn Parks (AI-assisted digital artist persona)
- DEV NE-Thing (computational frameworks, app development, research and analysis)

Be concise, helpful, and speak naturally. Keep responses under 100 words for voice delivery.`
      }
    }));
    
    sessionConfigured = true;
  };

  // Forward messages from xAI to client
  xaiSocket.onmessage = (event) => {
    try {
      serverSocket.send(event.data);
    } catch (error) {
      console.error('Error forwarding xAI message:', error);
    }
  };

  // Handle xAI errors
  xaiSocket.onerror = (error) => {
    console.error('xAI WebSocket error:', error);
    serverSocket.send(JSON.stringify({
      type: 'error',
      error: 'xAI connection error'
    }));
  };

  // Handle xAI close
  xaiSocket.onclose = (event) => {
    console.log('xAI connection closed:', event.code, event.reason);
    try {
      serverSocket.close(event.code, event.reason);
    } catch (error) {
      console.error('Error closing server socket:', error);
    }
  };

  // Handle client socket close
  serverSocket.onclose = (event) => {
    console.log('Client connection closed:', event.code, event.reason);
    if (xaiSocket.readyState === WebSocket.OPEN) {
      xaiSocket.close(event.code, event.reason);
    }
  };

  // Handle client socket errors
  serverSocket.onerror = (error) => {
    console.error('Client WebSocket error:', error);
    if (xaiSocket.readyState === WebSocket.OPEN) {
      xaiSocket.close(1001, 'Client error');
    }
  };
}

// Main fetch handler
export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    // Check for WebSocket upgrade
    const upgradeHeader = request.headers.get('Upgrade');
    
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      // Return info for non-WebSocket requests
      return new Response('xAI Voice Agent WebSocket Relay', {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        }
      });
    }

    // Handle WebSocket upgrade
    try {
      return await handleWebSocket(request, env);
    } catch (error) {
      console.error('WebSocket error:', error);
      return new Response('WebSocket error: ' + error.message, {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};

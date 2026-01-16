export default {
  async fetch(request, env) {
    const upgradeHeader = request.headers.get('Upgrade');
    
    // Check if WebSocket upgrade request
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    // Get the client WebSocket pair
    const [clientSocket, response] = Deno.upgradeWebSocket(request);

    // Connect to xAI Realtime API with RAG collection
    const xAIUrl = `wss://api.x.ai/v1/realtime?model=grok-2-realtime-api-2025-01-20`;
    
    const grokSocket = new WebSocket(xAIUrl, [
      'realtime',
      `openai-insecure-api-key.${env.XAI_API_KEY}`
    ]);

    let grokConnected = false;

    // When client connects, establish xAI connection
    clientSocket.onopen = () => {
      console.log('Client connected');
    };

    // Forward messages from client to xAI
    clientSocket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      // If client wants to commit audio, forward to xAI
      if (data.type === 'input_audio_buffer.commit') {
        grokSocket.send(JSON.stringify({
          type: 'input_audio_buffer.commit'
        }));
      }
      // Forward audio chunks
      else if (data.type === 'input_audio_buffer.append') {
        grokSocket.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: data.audio
        }));
      }
    };

    // Handle xAI messages
    grokSocket.onopen = () => {
      console.log('Connected to xAI');
      
      // Send session configuration
      grokSocket.send(JSON.stringify({
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
            silence_duration_ms: 1000
          },
          // Add RAG collection for knowledge base
          tools: [{
            type: 'collections_search',
            collection_ids: [env.COLLECTION_ID]
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
    };

    grokSocket.onmessage = (event) => {
      // Forward all xAI messages to client
      clientSocket.send(event.data);
    };

    grokSocket.onerror = (error) => {
      console.error('xAI WebSocket error:', error);
    };

    grokSocket.onclose = () => {
      console.log('xAI connection closed');
    };

    clientSocket.onclose = () => {
      grokSocket.close();
    };

    return response;
  }
};

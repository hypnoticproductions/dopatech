/**
 * xAI Voice Agent - Frontend Implementation
 * Connects to Cloudflare Worker relay for real-time audio streaming with RAG
 */

class XAIVoiceAgent {
    constructor(workerUrl) {
        this.workerUrl = workerUrl;
        this.ws = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioContext = null;
        this.audioPlayer = null;
        this.isConnected = false;
        this.isRecording = false;
        this.stream = null;
        
        // Audio settings
        this.sampleRate = 24000;
        this.bufferSize = 4096;
        
        // UI Elements
        this.button = null;
        this.statusIndicator = null;
        this.waveformCanvas = null;
        this.statusText = null;
        
        this.init();
    }
    
    async init() {
        this.setupAudioContext();
        this.setupUI();
        this.setupEventListeners();
    }
    
    setupAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: this.sampleRate
        });
        
        // Create audio player node
        this.audioPlayer = {
            context: this.audioContext,
            nextStartTime: 0,
            queue: [],
            isPlaying: false
        };
    }
    
    setupUI() {
        // Create the voice agent container
        const container = document.createElement('div');
        container.id = 'voice-agent-container';
        container.innerHTML = `
            <!-- Floating Button -->
            <button id="voice-agent-toggle" class="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-full shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-all duration-300 flex items-center justify-center group">
                <svg id="voice-agent-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white transition-transform duration-500">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                <div id="voice-agent-pulse" class="absolute inset-0 rounded-full border-2 border-cyan-400 opacity-0 transition-opacity duration-300"></div>
            </button>
            
            <!-- Voice Agent Panel -->
            <div id="voice-agent-panel" class="fixed bottom-28 right-8 z-40 w-80 bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 opacity-0 invisible transform translate-y-4 transition-all duration-500">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-bold uppercase tracking-tight text-white">Site Talkr</h3>
                            <p class="text-[10px] font-mono uppercase tracking-widest text-gray-400">Voice Interface</p>
                        </div>
                    </div>
                    <button id="voice-agent-close" class="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <!-- Status Display -->
                <div class="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                    <div class="flex items-center gap-3 mb-3">
                        <div id="voice-agent-status-dot" class="w-3 h-3 rounded-full bg-gray-500"></div>
                        <span id="voice-agent-status" class="text-sm font-mono uppercase tracking-widest text-gray-400">Ready</span>
                    </div>
                    <canvas id="voice-agent-waveform" class="w-full h-16 rounded-lg bg-black/50"></canvas>
                </div>
                
                <!-- Control Button -->
                <button id="voice-agent-mic" class="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    </svg>
                    <span>Press to Speak</span>
                </button>
                
                <!-- Info -->
                <p class="text-[10px] font-mono text-gray-500 text-center mt-4">
                    Ask about Dopa-Tech services, music production, or artist programs
                </p>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Cache element references
        this.button = document.getElementById('voice-agent-toggle');
        this.panel = document.getElementById('voice-agent-panel');
        this.micButton = document.getElementById('voice-agent-mic');
        this.statusText = document.getElementById('voice-agent-status');
        this.statusDot = document.getElementById('voice-agent-status-dot');
        this.waveformCanvas = document.getElementById('voice-agent-waveform');
        this.waveformCtx = this.waveformCanvas.getContext('2d');
        this.pulseIndicator = document.getElementById('voice-agent-pulse');
        
        // Setup canvas
        this.waveformCanvas.width = 280;
        this.waveformCanvas.height = 64;
    }
    
    setupEventListeners() {
        // Toggle button
        this.button.addEventListener('click', () => this.togglePanel());
        
        // Close button
        document.getElementById('voice-agent-close').addEventListener('click', () => this.closePanel());
        
        // Mic button
        this.micButton.addEventListener('click', () => this.toggleRecording());
        
        // Keyboard shortcut (spacebar when panel is open)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.panel.classList.contains('visible')) {
                e.preventDefault();
                this.toggleRecording();
            }
        });
    }
    
    togglePanel() {
        this.panel.classList.toggle('invisible');
        this.panel.classList.toggle('opacity-0');
        this.panel.classList.toggle('visible');
        this.panel.classList.toggle('transform-none');
        
        if (this.panel.classList.contains('visible')) {
            this.connect();
        }
    }
    
    closePanel() {
        this.panel.classList.add('invisible');
        this.panel.classList.add('opacity-0');
        this.panel.classList.remove('visible');
        this.panel.classList.remove('transform-none');
    }
    
    async connect() {
        if (this.isConnected) return;
        
        this.updateStatus('Connecting...', 'connecting');
        console.log('Attempting to connect to worker:', this.workerUrl);
        
        try {
            this.ws = new WebSocket(this.workerUrl);
            console.log('WebSocket created, waiting for connection...');
            
            this.ws.onopen = () => {
                console.log('Connected to voice agent worker');
                this.isConnected = true;
                this.updateStatus('Ready', 'ready');
                this.startVisualization();
            };
            
            this.ws.onmessage = async (event) => {
                console.log('Received message type:', JSON.parse(event.data)?.type || 'unknown');
                await this.handleMessage(event.data);
            };
            
            this.ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                this.isConnected = false;
                this.updateStatus('Disconnected', 'disconnected');
                // Auto-reconnect after 3 seconds
                setTimeout(() => {
                    if (this.panel.classList.contains('visible')) {
                        console.log('Attempting to reconnect...');
                        this.connect();
                    }
                }, 3000);
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateStatus('Connection Error', 'error');
            };

        } catch (error) {
            console.error('Failed to connect:', error);
            this.updateStatus('Connection Failed', 'error');
        }
    }
    
    async handleMessage(data) {
        try {
            const event = JSON.parse(data);
            
            switch (event.type) {
                case 'session.created':
                    console.log('Session created');
                    break;
                    
                case 'response.audio.delta':
                    // Received audio from the assistant
                    if (event.delta) {
                        await this.playAudio(event.delta);
                    }
                    break;
                    
                case 'response.done':
                    console.log('Response complete');
                    this.updateStatus('Ready', 'ready');
                    break;
                    
                case 'input_audio_buffer.speech_started':
                    this.updateStatus('Listening...', 'listening');
                    break;
                    
                case 'error':
                    console.error('Server error:', event.error);
                    this.updateStatus('Error: ' + event.error, 'error');
                    break;
                    
                default:
                    // Handle other events
                    break;
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }
    
    async toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
    }
    
    async startRecording() {
        try {
            // Request microphone access
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            
            // Create media recorder
            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: 'audio/webm;codecs=opus'
            });
            
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                await this.sendAudio(audioBlob);
            };
            
            // Start recording
            this.mediaRecorder.start(250); // Send data every 250ms
            this.isRecording = true;
            
            // Update UI
            this.micButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse">
                    <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
                </svg>
                <span>Listening...</span>
            `;
            this.micButton.classList.add('bg-cyan-600/20', 'border-cyan-500/50');
            this.micButton.classList.remove('bg-white/5');
            this.pulseIndicator.classList.add('opacity-100');
            
            this.updateStatus('Listening...', 'listening');
            
        } catch (error) {
            console.error('Failed to start recording:', error);
            this.updateStatus('Microphone Error', 'error');
        }
    }
    
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            
            // Stop all tracks
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }
            
            this.isRecording = false;
            
            // Reset UI
            this.micButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                </svg>
                <span>Press to Speak</span>
            `;
            this.micButton.classList.remove('bg-cyan-600/20', 'border-cyan-500/50');
            this.micButton.classList.add('bg-white/5');
            this.pulseIndicator.classList.remove('opacity-100');
            
            this.updateStatus('Processing...', 'processing');
        }
    }
    
    async sendAudio(audioBlob) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        
        try {
            // Convert blob to array buffer
            const arrayBuffer = await audioBlob.arrayBuffer();
            
            // Convert to base64
            const base64Audio = this.arrayBufferToBase64(arrayBuffer);
            
            // Send as binary event
            this.ws.send(JSON.stringify({
                type: 'input_audio_buffer.append',
                audio: base64Audio
            }));
            
            // Signal end of audio
            this.ws.send(JSON.stringify({
                type: 'input_audio_buffer.commit'
            }));
            
        } catch (error) {
            console.error('Failed to send audio:', error);
        }
    }
    
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
    
    async playAudio(base64Audio) {
        try {
            // Decode base64 to array buffer
            const audioData = this.base64ToArrayBuffer(base64Audio);
            
            // Decode audio data
            const audioBuffer = await this.audioContext.decodeAudioData(audioData);
            
            // Queue the audio for playback
            this.queueAudio(audioBuffer);
            
        } catch (error) {
            console.error('Failed to play audio:', error);
        }
    }
    
    queueAudio(audioBuffer) {
        const now = this.audioContext.currentTime;
        
        // If nothing is playing, start immediately
        if (!this.audioPlayer.isPlaying || this.audioPlayer.nextStartTime < now) {
            this.audioPlayer.nextStartTime = now;
            this.audioPlayer.isPlaying = true;
        }
        
        // Create buffer source
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
        
        // Schedule playback
        source.start(this.audioPlayer.nextStartTime);
        
        // Update next start time
        this.audioPlayer.nextStartTime += audioBuffer.duration;
        
        // Handle end of playback
        source.onended = () => {
            if (this.audioPlayer.nextStartTime <= now) {
                this.audioPlayer.isPlaying = false;
            }
        };
        
        // Update UI to show speaking
        this.updateStatus('Speaking...', 'speaking');
    }
    
    base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
    
    updateStatus(status, state) {
        this.statusText.textContent = status;
        
        // Update status dot color
        const colors = {
            ready: '#22c55e',      // green
            connecting: '#eab308', // yellow
            listening: '#06b6d4',  // cyan
            speaking: '#a855f7',   // purple
            processing: '#f97316', // orange
            error: '#ef4444',      // red
            disconnected: '#6b7280' // gray
        };
        
        this.statusDot.style.backgroundColor = colors[state] || colors.disconnected;
        
        // Add animation for active states
        if (state === 'listening' || state === 'speaking') {
            this.statusDot.classList.add('animate-pulse');
        } else {
            this.statusDot.classList.remove('animate-pulse');
        }
    }
    
    startVisualization() {
        const animate = () => {
            this.drawWaveform();
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    drawWaveform() {
        const canvas = this.waveformCanvas;
        const ctx = this.waveformCtx;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw animated waveform
        const time = Date.now() / 1000;
        const centerY = height / 2;
        
        ctx.beginPath();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        
        for (let x = 0; x < width; x++) {
            const frequency = this.isRecording || this.audioPlayer.isPlaying ? 0.05 : 0.02;
            const amplitude = this.isRecording ? 15 : this.audioPlayer.isPlaying ? 20 : 8;
            const noise = Math.sin(x * frequency + time * 3) * amplitude;
            const wave = Math.sin(x * 0.1 + time * 2) * noise * 0.3;
            const y = centerY + wave + noise * Math.sin(time * 5 + x * 0.05);
            
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

// Initialize voice agent when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.voiceAgent = new XAIVoiceAgent('wss://sitetalkr.richard-fproductions.workers.dev/');
});

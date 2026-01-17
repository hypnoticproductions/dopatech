/**
 * xAI Voice Agent - Frontend Implementation
 * FINAL FIXED VERSION
 * Based on working SafeTravel implementation
 *
 * KEY FIXES:
 * 1. Uses ScriptProcessorNode for PCM16 audio (not MediaRecorder)
 * 2. Listens for correct xAI event names (response.output_audio.delta)
 * 3. Proper sample rate (24kHz)
 */

class XAIVoiceAgent {
    constructor(workerUrl) {
        this.workerUrl = workerUrl;
        this.ws = null;
        this.audioContext = null;
        this.processor = null;
        this.stream = null;
        this.isConnected = false;
        this.isRecording = false;

        // Audio settings - MUST be 24kHz for xAI
        this.sampleRate = 24000;

        // Audio playback
        this.audioPlayer = {
            context: null,
            nextStartTime: 0,
            isPlaying: false
        };

        // UI Elements
        this.button = null;
        this.panel = null;
        this.micButton = null;
        this.statusText = null;
        this.statusDot = null;
        this.waveformCanvas = null;
        this.waveformCtx = null;
        this.pulseIndicator = null;

        this.init();
    }

    async init() {
        this.setupAudioContext();
        this.setupUI();
        this.setupEventListeners();
    }

    setupAudioContext() {
        // ✅ FIX: Set correct sample rate
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: this.sampleRate
        });

        this.audioPlayer.context = this.audioContext;
    }

    setupUI() {
        const container = document.createElement('div');
        container.id = 'voice-agent-container';
        container.innerHTML = `
            <button id="voice-agent-toggle" class="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-full shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-all duration-300 flex items-center justify-center group">
                <svg id="voice-agent-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white transition-transform duration-500">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                <div id="voice-agent-pulse" class="absolute inset-0 rounded-full border-2 border-cyan-400 opacity-0 transition-opacity duration-300"></div>
            </button>

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

                <div class="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                    <div class="flex items-center gap-3 mb-3">
                        <div id="voice-agent-status-dot" class="w-3 h-3 rounded-full bg-gray-500"></div>
                        <span id="voice-agent-status" class="text-sm font-mono uppercase tracking-widest text-gray-400">Ready</span>
                    </div>
                    <canvas id="voice-agent-waveform" class="w-full h-16 rounded-lg bg-black/50"></canvas>
                </div>

                <button id="voice-agent-mic" class="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    </svg>
                    <span>Press to Speak</span>
                </button>

                <p class="text-[10px] font-mono text-gray-500 text-center mt-4">
                    Ask about Dopa-Tech services, music production, or artist programs
                </p>
            </div>
        `;

        document.body.appendChild(container);

        this.button = document.getElementById('voice-agent-toggle');
        this.panel = document.getElementById('voice-agent-panel');
        this.micButton = document.getElementById('voice-agent-mic');
        this.statusText = document.getElementById('voice-agent-status');
        this.statusDot = document.getElementById('voice-agent-status-dot');
        this.waveformCanvas = document.getElementById('voice-agent-waveform');
        this.waveformCtx = this.waveformCanvas.getContext('2d');
        this.pulseIndicator = document.getElementById('voice-agent-pulse');

        this.waveformCanvas.width = 280;
        this.waveformCanvas.height = 64;
    }

    setupEventListeners() {
        this.button.addEventListener('click', () => this.togglePanel());
        document.getElementById('voice-agent-close').addEventListener('click', () => this.closePanel());
        this.micButton.addEventListener('click', () => this.toggleRecording());

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
            this.startVisualization();
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
            };

            this.ws.onmessage = async (event) => {
                await this.handleMessage(event.data);
            };

            this.ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);
                this.isConnected = false;
                this.updateStatus('Disconnected', 'disconnected');

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
            console.log('Received message type:', event.type);

            switch (event.type) {
                case 'session.created':
                    console.log('Session created');
                    break;

                // ✅ FIX: Listen for correct xAI event names with "output_" prefix
                case 'response.output_audio.delta':
                    // Received audio from the assistant (xAI uses output_ prefix)
                    if (event.delta) {
                        await this.playAudio(event.delta);
                    }
                    break;

                case 'response.output_audio_transcript.delta':
                    // Transcript of what AI is saying
                    console.log('AI transcript:', event.delta);
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
                    // Log other events for debugging
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
            // ✅ FIX: Request microphone with correct settings
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: this.sampleRate,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // ✅ FIX: Use ScriptProcessorNode instead of MediaRecorder
            const source = this.audioContext.createMediaStreamSource(this.stream);
            this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

            this.processor.onaudioprocess = (e) => {
                if (!this.isRecording) return;

                const inputData = e.inputBuffer.getChannelData(0);
                const encoded = this.encodeAudioData(inputData);
                this.sendAudio(encoded);
            };

            source.connect(this.processor);
            this.processor.connect(this.audioContext.destination);

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
        this.isRecording = false;

        if (this.processor) {
            this.processor.disconnect();
            this.processor = null;
        }

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        // Commit the audio buffer
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'input_audio_buffer.commit'
            }));
        }

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

    // ✅ FIX: Encode Float32 to Int16 PCM, then base64
    encodeAudioData(float32Array) {
        const int16Array = new Int16Array(float32Array.length);
        for (let i = 0; i < float32Array.length; i++) {
            const s = Math.max(-1, Math.min(1, float32Array[i]));
            int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Convert Int16Array to base64
        const uint8Array = new Uint8Array(int16Array.buffer);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        return btoa(binary);
    }

    sendAudio(base64Audio) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        try {
            this.ws.send(JSON.stringify({
                type: 'input_audio_buffer.append',
                audio: base64Audio
            }));
        } catch (error) {
            console.error('Failed to send audio:', error);
        }
    }

    async playAudio(base64Audio) {
        try {
            const audioData = this.base64ToArrayBuffer(base64Audio);

            // Add WAV header for proper decoding
            const wavBuffer = this.addWavHeader(audioData);
            const audioBuffer = await this.audioContext.decodeAudioData(wavBuffer);

            this.queueAudio(audioBuffer);

        } catch (error) {
            console.error('Failed to play audio:', error);
        }
    }

    queueAudio(audioBuffer) {
        const now = this.audioContext.currentTime;

        if (!this.audioPlayer.isPlaying || this.audioPlayer.nextStartTime < now) {
            this.audioPlayer.nextStartTime = now;
            this.audioPlayer.isPlaying = true;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);

        source.start(this.audioPlayer.nextStartTime);
        this.audioPlayer.nextStartTime += audioBuffer.duration;

        source.onended = () => {
            if (this.audioPlayer.nextStartTime <= now) {
                this.audioPlayer.isPlaying = false;
            }
        };

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

    // Add WAV header to raw PCM data
    addWavHeader(audioData) {
        const buffer = new ArrayBuffer(44 + audioData.byteLength);
        const view = new DataView(buffer);
        const uint8 = new Uint8Array(audioData);

        // RIFF chunk descriptor
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + audioData.byteLength, true);
        this.writeString(view, 8, 'WAVE');

        // FMT sub-chunk
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true); // Subchunk size
        view.setUint16(20, 1, true); // Audio format (PCM)
        view.setUint16(22, 1, true); // Num channels
        view.setUint32(24, this.sampleRate, true); // Sample rate
        view.setUint32(28, this.sampleRate * 2, true); // Byte rate
        view.setUint16(32, 2, true); // Block align
        view.setUint16(34, 16, true); // Bits per sample

        // Data sub-chunk
        this.writeString(view, 36, 'data');
        view.setUint32(40, audioData.byteLength, true);

        // Copy audio data
        const dataView = new Uint8Array(buffer);
        dataView.set(uint8, 44);

        return buffer;
    }

    writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    updateStatus(status, state) {
        this.statusText.textContent = status;

        const colors = {
            ready: '#22c55e',
            connecting: '#eab308',
            listening: '#06b6d4',
            speaking: '#a855f7',
            processing: '#f97316',
            error: '#ef4444',
            disconnected: '#6b7280'
        };

        this.statusDot.style.backgroundColor = colors[state] || colors.disconnected;

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

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, height);

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

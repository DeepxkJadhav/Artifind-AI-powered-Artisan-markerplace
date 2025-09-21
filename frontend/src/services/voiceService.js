class VoiceService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (this.isSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Voice recognition started');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Voice recognition ended');
    };

    this.recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      this.isListening = false;
    };
  }

  /**
   * Start voice recognition
   * @param {Object} options - Recognition options
   * @param {string} options.language - Language code (default: 'en-US')
   * @param {boolean} options.continuous - Continuous recognition (default: false)
   * @returns {Promise<string>} Recognized text
   */
  async startListening(options = {}) {
    if (!this.isSupported) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    if (this.isListening) {
      throw new Error('Voice recognition is already active');
    }

    // Request microphone permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      throw new Error('Microphone permission denied');
    }

    // Apply options
    if (options.language) {
      this.recognition.lang = options.language;
    }
    if (options.continuous !== undefined) {
      this.recognition.continuous = options.continuous;
    }

    return new Promise((resolve, reject) => {
      let finalTranscript = '';
      let timeoutId;

      // Set timeout for recognition
      const timeout = options.timeout || 10000; // 10 seconds default
      timeoutId = setTimeout(() => {
        this.recognition.stop();
        reject(new Error('Voice recognition timeout'));
      }, timeout);

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Provide interim results for real-time feedback
        if (options.onInterim && interimTranscript) {
          options.onInterim(interimTranscript);
        }

        // If we have a final result, resolve
        if (finalTranscript) {
          clearTimeout(timeoutId);
          resolve(finalTranscript.trim());
        }
      };

      this.recognition.onerror = (event) => {
        clearTimeout(timeoutId);
        reject(new Error(`Voice recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        clearTimeout(timeoutId);
        if (!finalTranscript) {
          reject(new Error('No speech was detected'));
        }
      };

      // Start recognition
      this.recognition.start();
    });
  }

  /**
   * Stop voice recognition
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Check if voice recognition is currently active
   * @returns {boolean} Is listening status
   */
  getIsListening() {
    return this.isListening;
  }

  /**
   * Check if voice recognition is supported
   * @returns {boolean} Support status
   */
  getIsSupported() {
    return this.isSupported;
  }

  /**
   * Get list of supported languages
   * @returns {Array<Object>} Available languages
   */
  getSupportedLanguages() {
    return [
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' },
      { code: 'es-ES', name: 'Spanish (Spain)' },
      { code: 'es-MX', name: 'Spanish (Mexico)' },
      { code: 'fr-FR', name: 'French (France)' },
      { code: 'de-DE', name: 'German (Germany)' },
      { code: 'it-IT', name: 'Italian (Italy)' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)' },
      { code: 'ja-JP', name: 'Japanese (Japan)' },
      { code: 'ko-KR', name: 'Korean (South Korea)' },
      { code: 'zh-CN', name: 'Chinese (Simplified)' },
      { code: 'zh-TW', name: 'Chinese (Traditional)' },
      { code: 'hi-IN', name: 'Hindi (India)' },
      { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
      { code: 'ru-RU', name: 'Russian (Russia)' }
    ];
  }

  /**
   * Alternative method using Google Cloud Speech-to-Text API
   * This would be used when Web Speech API is not available or for better accuracy
   * @param {Blob} audioBlob - Audio data
   * @param {Object} options - API options
   * @returns {Promise<string>} Transcribed text
   */
  async transcribeWithGoogleAPI(audioBlob, options = {}) {
    const apiKey = import.meta.env.VITE_GOOGLE_SPEECH_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Speech API key not configured');
    }

    try {
      // Convert audio blob to base64
      const base64Audio = await this.blobToBase64(audioBlob);
      
      const requestBody = {
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: options.language || 'en-US',
          enableAutomaticPunctuation: true,
          model: 'latest_long',
          useEnhanced: true
        },
        audio: {
          content: base64Audio.split(',')[1] // Remove data URL prefix
        }
      };

      const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Google Speech API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.results && result.results.length > 0) {
        return result.results[0].alternatives[0].transcript;
      } else {
        throw new Error('No speech was detected in the audio');
      }
    } catch (error) {
      console.error('Google Speech API transcription error:', error);
      throw error;
    }
  }

  /**
   * Record audio for server-side transcription
   * @param {number} maxDuration - Maximum recording duration in milliseconds
   * @returns {Promise<Blob>} Audio blob
   */
  async recordAudio(maxDuration = 30000) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Media recording is not supported');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      return new Promise((resolve, reject) => {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        
        const audioChunks = [];
        let timeoutId;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach(track => track.stop());
          clearTimeout(timeoutId);
          
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
          resolve(audioBlob);
        };

        mediaRecorder.onerror = (event) => {
          stream.getTracks().forEach(track => track.stop());
          clearTimeout(timeoutId);
          reject(new Error(`Recording error: ${event.error}`));
        };

        // Set maximum recording duration
        timeoutId = setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, maxDuration);

        mediaRecorder.start();
        
        // Return stop function for manual control
        resolve.stop = () => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        };
      });
    } catch (error) {
      throw new Error(`Failed to access microphone: ${error.message}`);
    }
  }

  /**
   * Convert blob to base64
   * @param {Blob} blob - Blob to convert
   * @returns {Promise<string>} Base64 string
   */
  blobToBase64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
}

// Create singleton instance
const voiceService = new VoiceService();
export default voiceService;
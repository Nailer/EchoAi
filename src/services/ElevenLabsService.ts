interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

interface GenerateAudioOptions {
  text: string;
  voiceId: string;
  modelId?: string;
  voiceSettings?: VoiceSettings;
  outputFormat?: 'mp3_44100_128' | 'pcm_16000' | 'pcm_22050' | 'pcm_24000' | 'pcm_44100';
}

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  preview_url?: string;
  available_for_tiers: string[];
  settings?: VoiceSettings;
  labels: Record<string, string>;
}

interface AudioGenerationResult {
  audioUrl: string;
  audioBlob: Blob;
  duration?: number;
}

class ElevenLabsService {
  private static instance: ElevenLabsService;
  private apiKey: string | null = null;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  private audioCache = new Map<string, string>();

  private constructor() {}

  static getInstance(): ElevenLabsService {
    if (!ElevenLabsService.instance) {
      ElevenLabsService.instance = new ElevenLabsService();
    }
    return ElevenLabsService.instance;
  }

  initialize(apiKey: string): void {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('Invalid API key provided');
    }
    this.apiKey = apiKey.trim();
    console.log('ElevenLabs service initialized with API key');
  }

  isInitialized(): boolean {
    return !!this.apiKey;
  }

  private getHeaders(): HeadersInit {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not set');
    }

    return {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': this.apiKey,
    };
  }

  async getAvailableVoices(): Promise<Voice[]> {
    if (!this.isInitialized()) {
      throw new Error('ElevenLabs service not initialized');
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.apiKey!,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your ElevenLabs API key.');
        }
        throw new Error(`Failed to fetch voices: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      // Return fallback voices if API fails
      return this.getHumanitarianVoices();
    }
  }

  async generateAudio(options: GenerateAudioOptions): Promise<AudioGenerationResult> {
    if (!this.isInitialized()) {
      throw new Error('ElevenLabs service not initialized');
    }

    const {
      text,
      voiceId,
      modelId = 'eleven_multilingual_v2',
      voiceSettings = {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
      },
      outputFormat = 'mp3_44100_128',
    } = options;

    if (!text || text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    // Truncate text if too long (ElevenLabs has character limits)
    const maxLength = 5000;
    const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

    // Check cache first
    const cacheKey = `${voiceId}-${this.hashString(truncatedText)}-${JSON.stringify(voiceSettings)}`;
    if (this.audioCache.has(cacheKey)) {
      const cachedUrl = this.audioCache.get(cacheKey)!;
      try {
        // Verify cached URL is still valid
        const testResponse = await fetch(cachedUrl, { method: 'HEAD' });
        if (testResponse.ok) {
          const response = await fetch(cachedUrl);
          const audioBlob = await response.blob();
          return {
            audioUrl: cachedUrl,
            audioBlob,
          };
        }
      } catch (error) {
        // Remove invalid cache entry
        this.audioCache.delete(cacheKey);
      }
    }

    try {
      console.log('Generating audio with ElevenLabs...', { 
        voiceId, 
        textLength: truncatedText.length,
        originalLength: text.length 
      });

      const requestBody = {
        text: truncatedText,
        model_id: modelId,
        voice_settings: voiceSettings,
      };

      console.log('Request body:', requestBody);

      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey!,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('ElevenLabs response status:', response.status);
      console.log('ElevenLabs response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', errorText);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your ElevenLabs API key.');
        } else if (response.status === 422) {
          throw new Error('Invalid request parameters. Please check voice ID and settings.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();
      console.log('Audio blob received:', { 
        size: audioBlob.size, 
        type: audioBlob.type,
        sizeInKB: Math.round(audioBlob.size / 1024)
      });

      if (audioBlob.size === 0) {
        throw new Error('Received empty audio response');
      }

      // Verify the blob is actually audio
      if (!audioBlob.type.startsWith('audio/')) {
        console.warn('Unexpected blob type:', audioBlob.type);
        // Try to read as text to see if it's an error message
        const text = await audioBlob.text();
        console.error('Blob content:', text);
        throw new Error('Received non-audio response from ElevenLabs');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('Audio URL created:', audioUrl);

      // Test the audio URL immediately
      try {
        const testAudio = new Audio();
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Audio load timeout'));
          }, 10000);

          testAudio.addEventListener('loadedmetadata', () => {
            clearTimeout(timeout);
            console.log('Audio test successful:', {
              duration: testAudio.duration,
              readyState: testAudio.readyState
            });
            resolve(true);
          });

          testAudio.addEventListener('error', (e) => {
            clearTimeout(timeout);
            console.error('Audio test failed:', e);
            reject(new Error('Generated audio is not playable'));
          });

          testAudio.src = audioUrl;
        });
      } catch (testError) {
        console.error('Audio validation failed:', testError);
        URL.revokeObjectURL(audioUrl);
        throw new Error('Generated audio failed validation');
      }

      // Cache the result only if validation passed
      this.audioCache.set(cacheKey, audioUrl);

      return {
        audioUrl,
        audioBlob,
      };
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    }
  }

  async generateStoryAudio(
    storyText: string,
    characterName: string,
    language: string = 'en'
  ): Promise<AudioGenerationResult> {
    // Select appropriate voice based on character and language
    const voiceId = this.selectVoiceForStory(characterName, language);
    
    console.log('Generating story audio:', { characterName, language, voiceId, textLength: storyText.length });
    
    // Optimize voice settings for storytelling
    const voiceSettings: VoiceSettings = {
      stability: 0.6,
      similarity_boost: 0.8,
      style: 0.2,
      use_speaker_boost: true,
    };

    return this.generateAudio({
      text: storyText,
      voiceId,
      voiceSettings,
      modelId: 'eleven_multilingual_v2',
    });
  }

  private selectVoiceForStory(characterName: string, language: string): string {
    // Use well-known ElevenLabs voice IDs that are guaranteed to work
    const voiceMap: Record<string, Record<string, string>> = {
      en: {
        'Mariam': '21m00Tcm4TlvDq8ikWAM', // Rachel - young female
        'Ahmed': 'VR6AewLTigWG4xSOukaG', // Arnold - mature male  
        'Elena': 'jsCqWAovK2LkecY7zXl4', // Emily - warm female
        'default': '21m00Tcm4TlvDq8ikWAM', // Rachel as default
      },
      ar: {
        'Mariam': '21m00Tcm4TlvDq8ikWAM',
        'Ahmed': 'VR6AewLTigWG4xSOukaG',
        'default': '21m00Tcm4TlvDq8ikWAM',
      },
      uk: {
        'Elena': 'jsCqWAovK2LkecY7zXl4',
        'default': 'jsCqWAovK2LkecY7zXl4',
      },
    };

    const selectedVoice = voiceMap[language]?.[characterName] || voiceMap[language]?.['default'] || voiceMap['en']['default'];
    console.log('Selected voice for story:', { characterName, language, selectedVoice });
    return selectedVoice;
  }

  // Get predefined voices for humanitarian storytelling
  getHumanitarianVoices(): Voice[] {
    return [
      {
        voice_id: '21m00Tcm4TlvDq8ikWAM',
        name: 'Rachel',
        category: 'premade',
        description: 'Young, hopeful female voice perfect for children\'s stories',
        available_for_tiers: ['free', 'starter', 'creator', 'pro'],
        labels: { accent: 'american', age: 'young_adult', gender: 'female' },
        settings: { stability: 0.6, similarity_boost: 0.8 },
      },
      {
        voice_id: 'VR6AewLTigWG4xSOukaG',
        name: 'Arnold',
        category: 'premade',
        description: 'Mature, authoritative male voice for serious narratives',
        available_for_tiers: ['free', 'starter', 'creator', 'pro'],
        labels: { accent: 'american', age: 'middle_aged', gender: 'male' },
        settings: { stability: 0.7, similarity_boost: 0.75 },
      },
      {
        voice_id: 'jsCqWAovK2LkecY7zXl4',
        name: 'Emily',
        category: 'premade',
        description: 'Warm, empathetic female voice for emotional stories',
        available_for_tiers: ['free', 'starter', 'creator', 'pro'],
        labels: { accent: 'british', age: 'young_adult', gender: 'female' },
        settings: { stability: 0.5, similarity_boost: 0.8 },
      },
    ];
  }

  // Helper method to create a simple hash for caching
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Clean up cached audio URLs to prevent memory leaks
  clearCache(): void {
    this.audioCache.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    this.audioCache.clear();
  }

  // Get usage statistics (if available)
  async getUsageStats(): Promise<any> {
    if (!this.isInitialized()) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.apiKey!,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch usage stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      return null;
    }
  }
}

export default ElevenLabsService;
export type { Voice, VoiceSettings, GenerateAudioOptions, AudioGenerationResult };
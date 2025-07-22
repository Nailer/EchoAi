import { useState, useEffect, useCallback } from 'react';
import ElevenLabsService, { Voice, AudioGenerationResult } from '../services/ElevenLabsService';

interface UseElevenLabsReturn {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  voices: Voice[];
  currentAudio: HTMLAudioElement | null;
  isPlaying: boolean;
  generateStoryAudio: (storyText: string, characterName: string, language?: string) => Promise<AudioGenerationResult | null>;
  playAudio: (audioUrl: string) => Promise<void>;
  pauseAudio: () => void;
  stopAudio: () => void;
  loadVoices: () => Promise<void>;
  clearError: () => void;
}

export function useElevenLabs(apiKey?: string): UseElevenLabsReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const elevenLabs = ElevenLabsService.getInstance();

  // Initialize ElevenLabs service
  useEffect(() => {
    if (apiKey && !isInitialized && !apiKey.includes('your_elevenlabs_api_key_here')) {
      try {
        console.log('Initializing ElevenLabs with API key...');
        elevenLabs.initialize(apiKey);
        setIsInitialized(true);
        setError(null);
        console.log('ElevenLabs initialized successfully');
      } catch (err: any) {
        console.error('ElevenLabs initialization error:', err);
        setError(err.message || 'Failed to initialize ElevenLabs');
      }
    }
  }, [apiKey, isInitialized]);

  // Load available voices
  const loadVoices = useCallback(async () => {
    if (!isInitialized) {
      console.log('ElevenLabs not initialized, skipping voice loading');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Loading voices from ElevenLabs...');
      
      // Get both API voices and predefined humanitarian voices
      const [apiVoices, humanitarianVoices] = await Promise.all([
        elevenLabs.getAvailableVoices().catch((err) => {
          console.warn('Failed to load API voices, using fallback:', err.message);
          return [];
        }),
        Promise.resolve(elevenLabs.getHumanitarianVoices()),
      ]);

      console.log('Loaded voices:', { apiVoices: apiVoices.length, humanitarianVoices: humanitarianVoices.length });

      // Combine and deduplicate voices
      const allVoices = [...humanitarianVoices, ...apiVoices];
      const uniqueVoices = allVoices.filter((voice, index, self) => 
        index === self.findIndex(v => v.voice_id === voice.voice_id)
      );

      setVoices(uniqueVoices);
      console.log('Total unique voices loaded:', uniqueVoices.length);
    } catch (err: any) {
      console.error('Error loading voices:', err);
      setError(err.message || 'Failed to load voices');
      // Fallback to predefined voices
      const fallbackVoices = elevenLabs.getHumanitarianVoices();
      setVoices(fallbackVoices);
      console.log('Using fallback voices:', fallbackVoices.length);
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Generate story audio
  const generateStoryAudio = useCallback(async (
    storyText: string,
    characterName: string,
    language: string = 'en'
  ): Promise<AudioGenerationResult | null> => {
    if (!isInitialized) {
      setError('ElevenLabs not initialized');
      return null;
    }

    if (!storyText || storyText.trim().length === 0) {
      setError('Story text cannot be empty');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('Generating story audio...', { characterName, language, textLength: storyText.length });

      const result = await elevenLabs.generateStoryAudio(storyText, characterName, language);
      
      console.log('Audio generation successful:', { 
        audioUrl: result.audioUrl, 
        blobSize: result.audioBlob.size,
        blobType: result.audioBlob.type 
      });

      return result;
    } catch (err: any) {
      console.error('Audio generation failed:', err);
      setError(err.message || 'Failed to generate audio');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Play audio with better error handling
  const playAudio = useCallback(async (audioUrl: string) => {
    try {
      console.log('Attempting to play audio:', audioUrl);

      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
        setIsPlaying(false);
      }

      // Create new audio element
      const audio = new Audio();
      
      // Set up promise-based loading
      const loadPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Audio loading timeout'));
        }, 30000); // 30 second timeout

        const handleCanPlay = () => {
          clearTimeout(timeout);
          console.log('Audio can play - metadata loaded');
          setIsLoading(false);
          resolve();
        };

        const handleError = (e: Event) => {
          clearTimeout(timeout);
          const audioElement = e.target as HTMLAudioElement;
          const error = audioElement.error;
          
          let errorMessage = 'Failed to load audio';
          if (error) {
            switch (error.code) {
              case MediaError.MEDIA_ERR_ABORTED:
                errorMessage = 'Audio loading was aborted';
                break;
              case MediaError.MEDIA_ERR_NETWORK:
                errorMessage = 'Network error while loading audio';
                break;
              case MediaError.MEDIA_ERR_DECODE:
                errorMessage = 'Audio format not supported or corrupted';
                break;
              case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = 'Audio source not supported';
                break;
            }
          }
          
          console.error('Audio loading error:', errorMessage, error);
          reject(new Error(errorMessage));
        };

        audio.addEventListener('canplay', handleCanPlay, { once: true });
        audio.addEventListener('error', handleError, { once: true });
        audio.addEventListener('loadstart', () => {
          console.log('Audio loading started');
          setIsLoading(true);
        }, { once: true });
      });

      // Set up playback event listeners
      const handlePlay = () => {
        console.log('Audio started playing');
        setIsPlaying(true);
      };

      const handlePause = () => {
        console.log('Audio paused');
        setIsPlaying(false);
      };

      const handleEnded = () => {
        console.log('Audio ended');
        setIsPlaying(false);
        setCurrentAudio(null);
      };

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      // Set audio properties
      audio.preload = 'auto';
      audio.volume = 0.8;
      audio.crossOrigin = 'anonymous'; // For blob URLs

      // Set the audio source and wait for it to load
      audio.src = audioUrl;
      setCurrentAudio(audio);

      // Wait for audio to be ready
      await loadPromise;

      // Try to play
      console.log('Attempting to play audio...');
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('Audio play promise resolved');
      }
    } catch (err: any) {
      console.error('Play audio error:', err);
      setError(err.message || 'Failed to play audio');
      setIsLoading(false);
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  }, [currentAudio]);

  // Pause audio
  const pauseAudio = useCallback(() => {
    if (currentAudio && isPlaying) {
      console.log('Pausing audio');
      currentAudio.pause();
    }
  }, [currentAudio, isPlaying]);

  // Stop audio
  const stopAudio = useCallback(() => {
    if (currentAudio) {
      console.log('Stopping audio');
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsPlaying(false);
    }
  }, [currentAudio]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load voices when initialized
  useEffect(() => {
    if (isInitialized && voices.length === 0) {
      console.log('Loading voices after initialization...');
      loadVoices();
    }
  }, [isInitialized, voices.length, loadVoices]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
      elevenLabs.clearCache();
    };
  }, [currentAudio]);

  return {
    isInitialized,
    isLoading,
    error,
    voices,
    currentAudio,
    isPlaying,
    generateStoryAudio,
    playAudio,
    pauseAudio,
    stopAudio,
    loadVoices,
    clearError,
  };
}
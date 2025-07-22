import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Loader2, AlertCircle, Headphones, AudioWaveform as Waveform, RotateCcw } from 'lucide-react';
import { useElevenLabs } from '../hooks/useElevenLabs';

interface VoicePlayerProps {
  storyText: string;
  characterName: string;
  language?: string;
  autoGenerate?: boolean;
  className?: string;
}

export default function VoicePlayer({ 
  storyText, 
  characterName, 
  language = 'en',
  autoGenerate = false,
  className = '' 
}: VoicePlayerProps) {
  const elevenLabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  
  const {
    isInitialized,
    isLoading,
    error,
    currentAudio,
    isPlaying,
    generateStoryAudio,
    playAudio,
    pauseAudio,
    stopAudio,
    clearError,
  } = useElevenLabs(elevenLabsApiKey);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generationAttempts, setGenerationAttempts] = useState(0);

  // Update audio volume
  useEffect(() => {
    if (currentAudio) {
      currentAudio.volume = isMuted ? 0 : volume;
    }
  }, [currentAudio, volume, isMuted]);

  // Update time progress
  useEffect(() => {
    if (!currentAudio) return;

    const updateTime = () => {
      setCurrentTime(currentAudio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(currentAudio.duration || 0);
      console.log('Audio metadata loaded:', {
        duration: currentAudio.duration,
        readyState: currentAudio.readyState
      });
    };

    currentAudio.addEventListener('timeupdate', updateTime);
    currentAudio.addEventListener('loadedmetadata', handleLoadedMetadata);
    currentAudio.addEventListener('durationchange', handleLoadedMetadata);

    return () => {
      currentAudio.removeEventListener('timeupdate', updateTime);
      currentAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      currentAudio.removeEventListener('durationchange', handleLoadedMetadata);
    };
  }, [currentAudio]);

  // Auto-generate audio if enabled
  useEffect(() => {
    if (autoGenerate && isInitialized && !hasGenerated && storyText.trim() && generationAttempts === 0) {
      console.log('Auto-generating audio...');
      handleGenerateAudio();
    }
  }, [autoGenerate, isInitialized, hasGenerated, storyText, generationAttempts]);

  const handleGenerateAudio = async () => {
    if (!storyText.trim()) {
      console.warn('Cannot generate audio: story text is empty');
      return;
    }

    if (!isInitialized) {
      console.warn('Cannot generate audio: ElevenLabs not initialized');
      return;
    }

    try {
      console.log('Starting audio generation...', { characterName, language, textLength: storyText.length });
      
      clearError();
      setGenerationAttempts(prev => prev + 1);
      
      const result = await generateStoryAudio(storyText, characterName, language);
      
      if (result) {
        console.log('Audio generation successful, setting URL:', result.audioUrl);
        setAudioUrl(result.audioUrl);
        setHasGenerated(true);
        
        // Verify the audio URL is valid
        try {
          const response = await fetch(result.audioUrl, { method: 'HEAD' });
          if (!response.ok) {
            throw new Error('Generated audio URL is not accessible');
          }
          console.log('Audio URL verified successfully');
        } catch (verifyError) {
          console.error('Audio URL verification failed:', verifyError);
          setAudioUrl(null);
          throw new Error('Generated audio is not accessible');
        }
      } else {
        console.error('Audio generation returned null result');
        throw new Error('Audio generation failed - no result returned');
      }
    } catch (err: any) {
      console.error('Failed to generate audio:', err);
      setHasGenerated(false);
    }
  };

  const handlePlay = async () => {
    console.log('Play button clicked', { audioUrl, isPlaying, isLoading });

    if (!audioUrl) {
      console.log('No audio URL, generating audio first...');
      await handleGenerateAudio();
      return;
    }

    if (isPlaying) {
      console.log('Audio is playing, pausing...');
      pauseAudio();
    } else {
      console.log('Starting audio playback...');
      try {
        await playAudio(audioUrl);
      } catch (err) {
        console.error('Failed to play audio:', err);
      }
    }
  };

  const handleStop = () => {
    console.log('Stop button clicked');
    stopAudio();
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    console.log('Seeking to time:', newTime);
    if (currentAudio && isFinite(newTime)) {
      currentAudio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    console.log('Toggling mute:', !isMuted);
    setIsMuted(!isMuted);
  };

  // Show setup message if API key is missing
  if (!elevenLabsApiKey || elevenLabsApiKey.includes('your_elevenlabs_api_key_here')) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${className}`}>
        <div className="flex items-center space-x-3 text-yellow-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">ElevenLabs Setup Required</p>
            <p className="text-xs text-gray-400 mt-1">
              Add your ElevenLabs API key to enable AI voice narration
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${className}`}>
        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Initializing voice service...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-4 border border-purple-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Headphones className="w-5 h-5 text-purple-400" />
          <span className="text-white font-semibold text-sm">AI Voice Narration</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-purple-300">
          <Waveform className="w-3 h-3" />
          <span>{characterName}</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2 text-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Audio Generation Failed</p>
              <p className="text-xs mt-1">{error}</p>
              <button
                onClick={() => {
                  clearError();
                  setGenerationAttempts(0);
                  setHasGenerated(false);
                  setAudioUrl(null);
                }}
                className="text-xs text-red-300 hover:text-red-100 underline mt-1"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-800 bg-opacity-50 rounded p-2 mb-4 text-xs text-gray-400">
          <div>Initialized: {isInitialized ? 'Yes' : 'No'}</div>
          <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
          <div>Audio URL: {audioUrl ? 'Set' : 'None'}</div>
          <div>Is Playing: {isPlaying ? 'Yes' : 'No'}</div>
          <div>Generation Attempts: {generationAttempts}</div>
          <div>Has Generated: {hasGenerated ? 'Yes' : 'No'}</div>
          <div>Current Time: {formatTime(currentTime)}</div>
          <div>Duration: {formatTime(duration)}</div>
        </div>
      )}

      {/* Main Controls */}
      <div className="space-y-4">
        {/* Play Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePlay}
            disabled={isLoading}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </button>

          <button
            onClick={handleStop}
            disabled={!audioUrl || isLoading}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Square className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={() => {
              setHasGenerated(false);
              setGenerationAttempts(0);
              setAudioUrl(null);
              clearError();
              handleGenerateAudio();
            }}
            disabled={isLoading || !storyText.trim()}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Regenerate audio"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>

          {/* Status Text */}
          <div className="flex-1 text-sm text-purple-200">
            {isLoading ? (
              <span>Generating audio...</span>
            ) : audioUrl ? (
              <span>Ready to play • {formatTime(duration)}</span>
            ) : (
              <span>Click play to generate audio</span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {audioUrl && duration > 0 && (
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-purple-300">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        {/* Volume Control */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleMute}
            className="text-purple-300 hover:text-white transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(isMuted ? 0 : volume) * 100}%, #374151 ${(isMuted ? 0 : volume) * 100}%, #374151 100%)`
            }}
          />
          
          <span className="text-xs text-purple-300 w-8">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>

      {/* Language Indicator */}
      <div className="mt-3 pt-3 border-t border-purple-700">
        <div className="flex items-center justify-between text-xs text-purple-300">
          <span>Language: {language.toUpperCase()}</span>
          <span>Powered by ElevenLabs AI</span>
        </div>
      </div>
    </div>
  );
}
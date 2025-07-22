import React, { useState } from 'react';
import { 
  Settings, 
  Volume2, 
  Mic, 
  Globe, 
  User,
  Sliders,
  Save,
  RotateCcw
} from 'lucide-react';
import { Voice, VoiceSettings as IVoiceSettings } from '../services/ElevenLabsService';

interface VoiceSettingsProps {
  voices: Voice[];
  selectedVoice: string;
  voiceSettings: IVoiceSettings;
  language: string;
  onVoiceChange: (voiceId: string) => void;
  onSettingsChange: (settings: IVoiceSettings) => void;
  onLanguageChange: (language: string) => void;
  onSave?: () => void;
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
];

export default function VoiceSettings({
  voices,
  selectedVoice,
  voiceSettings,
  language,
  onVoiceChange,
  onSettingsChange,
  onLanguageChange,
  onSave,
  className = ''
}: VoiceSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSettingChange = (key: keyof IVoiceSettings, value: number | boolean) => {
    onSettingsChange({
      ...voiceSettings,
      [key]: value,
    });
  };

  const resetToDefaults = () => {
    onSettingsChange({
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true,
    });
  };

  const selectedVoiceData = voices.find(v => v.voice_id === selectedVoice);

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-750 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-400" />
          <span className="text-white font-semibold">Voice Settings</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {selectedVoiceData?.name || 'Default'}
          </span>
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <Settings className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-6">
          {/* Voice Selection */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-400" />
              <label className="text-sm font-semibold text-white">Voice Character</label>
            </div>
            <select
              value={selectedVoice}
              onChange={(e) => onVoiceChange(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {voices.map((voice) => (
                <option key={voice.voice_id} value={voice.voice_id}>
                  {voice.name} - {voice.description || voice.category}
                </option>
              ))}
            </select>
            {selectedVoiceData && (
              <p className="text-xs text-gray-400">
                {selectedVoiceData.description}
              </p>
            )}
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-green-400" />
              <label className="text-sm font-semibold text-white">Language</label>
            </div>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Quality Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <label className="text-sm font-semibold text-white">Voice Quality</label>
            </div>

            {/* Stability */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-300">Stability</label>
                <span className="text-sm text-gray-400">{voiceSettings.stability.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={voiceSettings.stability}
                onChange={(e) => handleSettingChange('stability', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <p className="text-xs text-gray-500">
                Higher values make the voice more stable but less expressive
              </p>
            </div>

            {/* Similarity Boost */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm text-gray-300">Similarity Boost</label>
                <span className="text-sm text-gray-400">{voiceSettings.similarity_boost.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={voiceSettings.similarity_boost}
                onChange={(e) => handleSettingChange('similarity_boost', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <p className="text-xs text-gray-500">
                Enhances similarity to the original voice
              </p>
            </div>

            {/* Style */}
            {voiceSettings.style !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm text-gray-300">Style</label>
                  <span className="text-sm text-gray-400">{voiceSettings.style.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={voiceSettings.style}
                  onChange={(e) => handleSettingChange('style', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <p className="text-xs text-gray-500">
                  Adjusts the style and expressiveness of the voice
                </p>
              </div>
            )}

            {/* Speaker Boost */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-gray-300">Speaker Boost</label>
                <p className="text-xs text-gray-500">Enhances voice clarity</p>
              </div>
              <button
                onClick={() => handleSettingChange('use_speaker_boost', !voiceSettings.use_speaker_boost)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  voiceSettings.use_speaker_boost ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    voiceSettings.use_speaker_boost ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-700">
            <button
              onClick={resetToDefaults}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            
            {onSave && (
              <button
                onClick={onSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Users, 
  Globe, 
  Heart,
  Star,
  Clock,
  Eye,
  Share2,
  Download,
  Settings,
  Loader2,
  AlertCircle,
  Camera,
  Mic,
  Monitor
} from 'lucide-react';

interface TavusVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  views: number;
  category: 'testimonial' | 'update' | 'education' | 'appeal';
  location: string;
  character: string;
  language: string;
  isPremium: boolean;
  createdAt: string;
  videoUrl?: string;
}

interface TavusVideoIntegrationProps {
  className?: string;
}

const mockTavusVideos: TavusVideo[] = [
  {
    id: 'tavus-1',
    title: 'Mariam\'s Personal Message',
    description: 'A heartfelt video message from Mariam about her educational journey in Gaza',
    thumbnail: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: 120,
    views: 2847,
    category: 'testimonial',
    location: 'Gaza',
    character: 'Mariam',
    language: 'en',
    isPremium: false,
    createdAt: '2024-01-15T10:30:00Z',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  },
  {
    id: 'tavus-2',
    title: 'Dr. Ahmed\'s Medical Update',
    description: 'Latest updates from the medical clinic and how donations are making a difference',
    thumbnail: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: 180,
    views: 1923,
    category: 'update',
    location: 'Syria',
    character: 'Ahmed',
    language: 'en',
    isPremium: true,
    createdAt: '2024-01-14T15:45:00Z',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
  },
  {
    id: 'tavus-3',
    title: 'Elena\'s Cultural Preservation',
    description: 'How Ukrainian artists are preserving culture through digital platforms',
    thumbnail: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: 240,
    views: 3421,
    category: 'education',
    location: 'Ukraine',
    character: 'Elena',
    language: 'en',
    isPremium: true,
    createdAt: '2024-01-13T09:20:00Z',
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4'
  }
];

export default function TavusVideoIntegration({ className = '' }: TavusVideoIntegrationProps) {
  const [selectedVideo, setSelectedVideo] = useState<TavusVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Videos', icon: Video },
    { id: 'testimonial', name: 'Testimonials', icon: Heart },
    { id: 'update', name: 'Updates', icon: Globe },
    { id: 'education', name: 'Education', icon: Users },
    { id: 'appeal', name: 'Appeals', icon: Star },
  ];

  const filteredVideos = activeCategory === 'all' 
    ? mockTavusVideos 
    : mockTavusVideos.filter(video => video.category === activeCategory);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'testimonial': return 'bg-red-600';
      case 'update': return 'bg-blue-600';
      case 'education': return 'bg-green-600';
      case 'appeal': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  const handleVideoSelect = (video: TavusVideo) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    setCurrentTime(0);
    setError(null);
  };

  const handlePlayPause = () => {
    if (!selectedVideo) return;
    
    setIsLoading(true);
    // Simulate video loading
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(!isPlaying);
    }, 1000);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={`bg-gray-800 rounded-2xl p-6 border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI-Generated Video Messages</h3>
            <p className="text-gray-400 text-sm">Powered by Tavus AI • Personalized humanitarian stories</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-pink-600 to-violet-600 px-3 py-1 rounded-full">
            <span className="text-white text-xs font-semibold">AI Generated</span>
          </div>
          <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-pink-600 to-violet-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm">{category.name}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Player */}
        <div className="space-y-4">
          {selectedVideo ? (
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-600">
              {/* Video Display */}
              <div className="relative aspect-video bg-black">
                <img 
                  src={selectedVideo.thumbnail} 
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button
                    onClick={handlePlayPause}
                    disabled={isLoading}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm p-4 rounded-full transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </button>
                </div>

                {/* Video Info Overlay */}
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(selectedVideo.category)}`}>
                      {selectedVideo.category}
                    </span>
                    {selectedVideo.isPremium && (
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-1 rounded-full text-xs font-semibold text-white">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4 text-white" />
                    </button>
                    <button className="bg-black bg-opacity-50 hover:bg-opacity-70 p-2 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Duration */}
                <div className="absolute bottom-4 right-4">
                  <span className="bg-black bg-opacity-70 px-2 py-1 rounded text-white text-xs">
                    {formatDuration(selectedVideo.duration)}
                  </span>
                </div>
              </div>

              {/* Video Controls */}
              <div className="p-4 space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={selectedVideo.duration}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(currentTime / selectedVideo.duration) * 100}%, #374151 ${(currentTime / selectedVideo.duration) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(selectedVideo.duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handlePlayPause}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      )}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleMute}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>

                  <button className="text-gray-300 hover:text-white transition-colors">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl border border-gray-600 aspect-video flex items-center justify-center">
              <div className="text-center">
                <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg font-semibold">Select a video to play</p>
                <p className="text-gray-500 text-sm mt-1">Choose from AI-generated humanitarian stories</p>
              </div>
            </div>
          )}

          {/* Selected Video Info */}
          {selectedVideo && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-lg font-bold text-white mb-2">{selectedVideo.title}</h4>
              <p className="text-gray-300 text-sm mb-3">{selectedVideo.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatViews(selectedVideo.views)} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(selectedVideo.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>{selectedVideo.location}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">Available Videos</h4>
            <span className="text-sm text-gray-400">{filteredVideos.length} videos</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredVideos.map((video) => (
              <button
                key={video.id}
                onClick={() => handleVideoSelect(video)}
                className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                  selectedVideo?.id === video.id
                    ? 'border-pink-500 bg-pink-900 bg-opacity-20'
                    : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex space-x-3">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-20 h-12 object-cover rounded"
                    />
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 px-1 rounded text-xs text-white">
                      {formatDuration(video.duration)}
                    </div>
                    {video.isPremium && (
                      <div className="absolute -top-1 -right-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-white text-sm truncate">{video.title}</h5>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{video.description}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${getCategoryColor(video.category)}`}>
                          {video.category}
                        </span>
                        <span className="text-xs text-gray-400">{video.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Eye className="w-3 h-3" />
                        <span>{formatViews(video.views)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tavus Integration Info */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="bg-gradient-to-r from-pink-900 to-violet-900 rounded-lg p-4 border border-pink-700">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h5 className="text-white font-semibold mb-2">AI-Powered Video Generation</h5>
              <p className="text-pink-200 text-sm mb-3">
                These videos are generated using Tavus AI technology, creating personalized video messages 
                from humanitarian workers and beneficiaries around the world.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white bg-opacity-10 rounded-lg p-2">
                  <Mic className="w-5 h-5 text-pink-300 mx-auto mb-1" />
                  <div className="text-xs text-pink-200">Voice Cloning</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-2">
                  <Monitor className="w-5 h-5 text-pink-300 mx-auto mb-1" />
                  <div className="text-xs text-pink-200">Video Synthesis</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-2">
                  <Globe className="w-5 h-5 text-pink-300 mx-auto mb-1" />
                  <div className="text-xs text-pink-200">Multi-Language</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Share2, 
  Users, 
  ExternalLink, 
  Trophy, 
  Zap, 
  AlertCircle,
  CheckCircle,
  Loader2,
  User,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Globe,
  Heart,
  MessageCircle,
  ArrowUpRight,
  RefreshCw,
  LogOut,
  Settings
} from 'lucide-react';
import { useReddit } from '../hooks/useReddit';

interface RedditQuestIntegrationProps {
  className?: string;
  onQuestComplete?: (questId: string, tokensEarned: number) => void;
}

export default function RedditQuestIntegration({ 
  className = '', 
  onQuestComplete 
}: RedditQuestIntegrationProps) {
  const {
    isConfigured,
    isAuthenticated,
    isLoading,
    error,
    user,
    questProgress,
    getAuthUrl,
    disconnect,
    shareStoryQuest,
    createAwarenessQuest,
    refreshUserData,
    refreshQuestProgress,
    getSuggestedSubreddits,
    clearError,
  } = useReddit();

  const [activeTab, setActiveTab] = useState<'overview' | 'quests' | 'progress'>('overview');
  const [questInProgress, setQuestInProgress] = useState<string | null>(null);
  const [showStoryShareModal, setShowStoryShareModal] = useState(false);
  const [showAwarenessModal, setShowAwarenessModal] = useState(false);

  // Story sharing form
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');

  // Awareness post form
  const [awarenessTitle, setAwarenessTitle] = useState('');
  const [awarenessMessage, setAwarenessMessage] = useState('');

  const suggestedSubreddits = getSuggestedSubreddits();

  const handleConnect = () => {
    if (!isConfigured) {
      alert('Reddit integration is not configured. Please add your Reddit API credentials to the environment variables.');
      return;
    }

    const authUrl = getAuthUrl();
    if (authUrl) {
      window.open(authUrl, '_blank', 'width=600,height=700');
    }
  };

  const handleShareStory = async () => {
    if (!storyTitle.trim() || !storyContent.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      setQuestInProgress('share-story');
      const post = await shareStoryQuest(storyTitle, storyContent);
      
      // Award tokens for completing the quest
      onQuestComplete?.('reddit-share-story', 75);
      
      setShowStoryShareModal(false);
      setStoryTitle('');
      setStoryContent('');
      
      alert(`Story shared successfully! View it at: https://reddit.com${post.permalink}`);
    } catch (err) {
      console.error('Failed to share story:', err);
    } finally {
      setQuestInProgress(null);
    }
  };

  const handleCreateAwareness = async () => {
    if (!awarenessTitle.trim() || !awarenessMessage.trim()) {
      alert('Please fill in both title and message');
      return;
    }

    try {
      setQuestInProgress('create-awareness');
      const post = await createAwarenessQuest(awarenessTitle, awarenessMessage);
      
      // Award tokens for completing the quest
      onQuestComplete?.('reddit-awareness-post', 100);
      
      setShowAwarenessModal(false);
      setAwarenessTitle('');
      setAwarenessMessage('');
      
      alert(`Awareness post created successfully! View it at: https://reddit.com${post.permalink}`);
    } catch (err) {
      console.error('Failed to create awareness post:', err);
    } finally {
      setQuestInProgress(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isConfigured) {
    return (
      <div className={`bg-gray-800 rounded-2xl p-6 border border-gray-700 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Reddit Quest Integration</h3>
          <p className="text-gray-400 text-sm mb-6">
            Reddit integration is not configured. Add your Reddit API credentials to enable quest features.
          </p>
          <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg p-4">
            <div className="flex items-start space-x-2 text-yellow-200">
              <Settings className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-sm">Setup Required</p>
                <p className="text-xs mt-1">
                  Add VITE_REDDIT_CLIENT_ID and VITE_REDDIT_CLIENT_SECRET to your .env file
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-2xl border border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Reddit Community Hub</h3>
              <p className="text-gray-400 text-sm">
                {isAuthenticated ? `Connected as u/${user?.name}` : 'Share humanitarian stories on Reddit'}
              </p>
            </div>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={refreshUserData}
                disabled={isLoading}
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={disconnect}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg font-semibold text-white transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-6 py-2 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50"
            >
              Connect Reddit
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 border-b border-gray-700">
          <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-3">
            <div className="flex items-start space-x-2 text-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Reddit Integration Error</p>
                <p className="text-xs mt-1">{error}</p>
                <button
                  onClick={clearError}
                  className="text-xs text-red-300 hover:text-red-100 underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {!isAuthenticated ? (
          <div className="text-center">
            <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Connect Your Reddit Account</h4>
            <p className="text-gray-400 text-sm mb-6">
              Link your Reddit account to complete quests by sharing humanitarian stories and raising awareness about global causes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <Share2 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <h5 className="font-semibold text-white text-sm">Share Stories</h5>
                <p className="text-xs text-gray-400 mt-1">Post humanitarian stories to raise awareness</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h5 className="font-semibold text-white text-sm">Engage Community</h5>
                <p className="text-xs text-gray-400 mt-1">Comment and support other humanitarian posts</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h5 className="font-semibold text-white text-sm">Earn Rewards</h5>
                <p className="text-xs text-gray-400 mt-1">Complete quests and earn tokens</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-700 rounded-lg p-1">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'quests', label: 'Quests', icon: Target },
                { id: 'progress', label: 'Progress', icon: TrendingUp },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-600'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && user && (
              <div className="space-y-6">
                {/* User Info */}
                <div className="bg-gradient-to-r from-orange-900 to-red-900 rounded-lg p-4 border border-orange-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">u/{user.name}</h4>
                        <p className="text-orange-200 text-sm">Reddit Account Connected</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{user.karma.toLocaleString()}</div>
                      <div className="text-xs text-orange-300">Total Karma</div>
                    </div>
                  </div>
                  
                  {questProgress && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{questProgress.postsCreated}</div>
                        <div className="text-xs text-orange-300">Humanitarian Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{questProgress.commentsCreated}</div>
                        <div className="text-xs text-orange-300">Support Comments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{questProgress.totalKarma}</div>
                        <div className="text-xs text-orange-300">Quest Karma</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggested Subreddits */}
                <div>
                  <h5 className="text-lg font-semibold text-white mb-3">Suggested Communities</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestedSubreddits.slice(0, 4).map((subreddit) => (
                      <div key={subreddit.name} className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h6 className="font-semibold text-white text-sm">r/{subreddit.name}</h6>
                            <p className="text-xs text-gray-400 mt-1">{subreddit.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-400">{subreddit.members}</div>
                            <a
                              href={`https://reddit.com/r/${subreddit.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-400 hover:text-orange-300 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quests' && (
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-white">Available Reddit Quests</h5>
                
                {/* Share Story Quest */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Share2 className="w-6 h-6 text-blue-400" />
                      <div>
                        <h6 className="font-semibold text-white">Share Humanitarian Story</h6>
                        <p className="text-sm text-gray-400">Post a story to raise awareness</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">75 tokens</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStoryShareModal(true)}
                    disabled={questInProgress === 'share-story'}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
                  >
                    {questInProgress === 'share-story' ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sharing...</span>
                      </div>
                    ) : (
                      'Start Quest'
                    )}
                  </button>
                </div>

                {/* Create Awareness Quest */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-6 h-6 text-green-400" />
                      <div>
                        <h6 className="font-semibold text-white">Create Awareness Post</h6>
                        <p className="text-sm text-gray-400">Raise awareness about a cause</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">100 tokens</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAwarenessModal(true)}
                    disabled={questInProgress === 'create-awareness'}
                    className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
                  >
                    {questInProgress === 'create-awareness' ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      'Start Quest'
                    )}
                  </button>
                </div>

                {/* Community Engagement Quest */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-6 h-6 text-red-400" />
                      <div>
                        <h6 className="font-semibold text-white">Community Engagement</h6>
                        <p className="text-sm text-gray-400">Support others with comments and upvotes</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">50 tokens</span>
                    </div>
                  </div>
                  <a
                    href="https://reddit.com/r/HumanitarianAid"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold text-white transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Visit Community</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'progress' && questProgress && (
              <div className="space-y-6">
                <h5 className="text-lg font-semibold text-white">Quest Progress (Last 30 Days)</h5>
                
                {/* Progress Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-900 bg-opacity-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{questProgress.postsCreated}</div>
                    <div className="text-xs text-blue-300 mt-1">Stories Shared</div>
                  </div>
                  <div className="bg-green-900 bg-opacity-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{questProgress.commentsCreated}</div>
                    <div className="text-xs text-green-300 mt-1">Comments Made</div>
                  </div>
                  <div className="bg-yellow-900 bg-opacity-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{questProgress.totalKarma}</div>
                    <div className="text-xs text-yellow-300 mt-1">Karma Earned</div>
                  </div>
                  <div className="bg-purple-900 bg-opacity-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">{questProgress.subredditsPosted.length}</div>
                    <div className="text-xs text-purple-300 mt-1">Communities</div>
                  </div>
                </div>

                {/* Active Communities */}
                {questProgress.subredditsPosted.length > 0 && (
                  <div>
                    <h6 className="text-md font-semibold text-white mb-3">Active Communities</h6>
                    <div className="flex flex-wrap gap-2">
                      {questProgress.subredditsPosted.map((subreddit) => (
                        <a
                          key={subreddit}
                          href={`https://reddit.com/r/${subreddit}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-full text-white text-sm font-semibold transition-colors"
                        >
                          r/{subreddit}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Last Activity */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Last Activity: {formatDate(questProgress.lastActivity)}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Story Share Modal */}
      {showStoryShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700">
            <div className="p-6">
              <h4 className="text-xl font-bold text-white mb-4">Share Humanitarian Story</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Story Title</label>
                  <input
                    type="text"
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    placeholder="Enter a compelling title..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Story Content</label>
                  <textarea
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    placeholder="Share the humanitarian story..."
                    rows={6}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowStoryShareModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleShareStory}
                  disabled={!storyTitle.trim() || !storyContent.trim() || isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
                >
                  Share Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Awareness Modal */}
      {showAwarenessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700">
            <div className="p-6">
              <h4 className="text-xl font-bold text-white mb-4">Create Awareness Post</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Cause/Topic</label>
                  <input
                    type="text"
                    value={awarenessTitle}
                    onChange={(e) => setAwarenessTitle(e.target.value)}
                    placeholder="e.g., Gaza Education Crisis"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Awareness Message</label>
                  <textarea
                    value={awarenessMessage}
                    onChange={(e) => setAwarenessMessage(e.target.value)}
                    placeholder="Write your awareness message..."
                    rows={6}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAwarenessModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAwareness}
                  disabled={!awarenessTitle.trim() || !awarenessMessage.trim() || isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { 
  Play, 
  Heart, 
  Globe, 
  Users, 
  Trophy, 
  Star, 
  MapPin, 
  Volume2,
  ChevronRight,
  Zap,
  Shield,
  Award,
  Target,
  Headphones,
  Share2,
  DollarSign,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ExternalLink,
  FileText,
  HelpCircle,
  Lock,
  Database
} from 'lucide-react';
import GlobalImpactMap from './components/GlobalImpactMap';
import TavusVideoIntegration from './components/TavusVideoIntegration';
import SupabaseAuth from './components/SupabaseAuth';
import SupabaseSetup from './components/SupabaseSetup';
import SubscriptionPaywall from './components/SubscriptionPaywall';
import SubscriptionStatus from './components/SubscriptionStatus';
import BlockDAGWallet from './components/BlockDAGWallet';
import DonationModal from './components/DonationModal';
import BlockchainTransparency from './components/BlockchainTransparency';
import VoicePlayer from './components/VoicePlayer';
import VoiceSettings from './components/VoiceSettings';
import RedditQuestIntegration from './components/RedditQuestIntegration';
import { useRevenueCat } from './hooks/useRevenueCat';
import { useElevenLabs } from './hooks/useElevenLabs';
import { useSupabase } from './hooks/useSupabase';
import { VoiceSettings as IVoiceSettings } from './services/ElevenLabsService';

// Read API keys from environment variables
const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY;
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function App() {
  const [activeStory, setActiveStory] = useState(0);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{
    id: string;
    title: string;
    image?: string;
  } | null>(null);
  const [ignoreRevenueCatError, setIgnoreRevenueCatError] = useState(false);
  const [ignoreSupabaseError, setIgnoreSupabaseError] = useState(false);

  // Voice settings state
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM');
  const [voiceSettings, setVoiceSettings] = useState<IVoiceSettings>({
    stability: 0.6,
    similarity_boost: 0.8,
    style: 0.2,
    use_speaker_boost: true,
  });
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Check if Supabase is properly configured
  const isSupabaseConfigured = SUPABASE_URL && 
    SUPABASE_ANON_KEY && 
    !SUPABASE_URL.includes('your_supabase_project_url_here') && 
    !SUPABASE_ANON_KEY.includes('your_supabase_anon_key_here');

  // Supabase integration (only if configured and not ignored)
  const {
    user,
    profile,
    stories: supabaseStories,
    projects: supabaseProjects,
    quests: supabaseQuests,
    leaderboard: supabaseLeaderboard,
    isLoading: isSupabaseLoading,
    error: supabaseError,
    signUp,
    signIn,
    signOut,
    likeStory,
    completeQuest,
    clearError: clearSupabaseError,
  } = useSupabase(
    isSupabaseConfigured && !ignoreSupabaseError ? SUPABASE_URL : undefined, 
    isSupabaseConfigured && !ignoreSupabaseError ? SUPABASE_ANON_KEY : undefined
  );

  // RevenueCat integration
  const {
    subscriptionStatus,
    isLoading: isRevenueCatLoading,
    error: revenueCatError,
    refreshStatus,
    showPaywall,
    hidePaywall,
    isPaywallVisible,
  } = useRevenueCat(REVENUECAT_API_KEY, user?.id);

  // ElevenLabs integration
  const {
    voices,
    isInitialized: isElevenLabsInitialized,
  } = useElevenLabs(ELEVENLABS_API_KEY);

  // Fallback data when Supabase is not available
  const fallbackStories = [
    {
      id: '1',
      title: "Mariam's Educational Journey",
      content: "My name is Mariam, and I'm 10 years old. Even though our school was damaged, we never stopped learning. My teacher, Miss Fatima, started teaching us under the olive tree in our neighborhood. She says education is like water - it finds a way to flow even through the smallest cracks. Every morning, I walk past the rubble with my notebook clutched tight to my chest. The other children and I sit in a circle, sharing the few books we have left. We practice writing in the sand when we run out of paper. Miss Fatima tells us stories of children around the world who go to beautiful schools with libraries full of books. She promises that one day, we'll have that too. Until then, we keep learning, because hope grows strongest in the hardest ground.",
      character_name: "Mariam",
      character_age: 10,
      location: "Gaza",
      urgency: "high" as const,
      category: "education" as const,
      image_url: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=400",
      is_premium: false,
      is_published: true,
      listeners_count: 2847,
      likes_count: 156,
      language: "en",
      project_id: "gaza-education",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: "Dr. Ahmed's Medical Mission",
      content: "I am Ahmed, a father of three beautiful children. Before the conflict, I was a doctor at Damascus General Hospital. Now, I work in a makeshift clinic in a refugee camp, treating families with whatever supplies we can find. Every day, I see the resilience of the human spirit. Mothers who walk miles to bring their sick children to us. Elderly people who share their last bit of medicine with strangers. Children who draw pictures of their dreams on the walls of our tent clinic. We may have lost our homes, but we haven't lost our humanity. With each patient I treat, with each life we save, we're rebuilding not just bodies, but hope itself. The international community's support gives us the strength to continue healing, one person at a time.",
      character_name: "Ahmed",
      character_age: 34,
      location: "Syria",
      urgency: "medium" as const,
      category: "healthcare" as const,
      image_url: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
      is_premium: true,
      is_published: true,
      listeners_count: 1923,
      likes_count: 89,
      language: "en",
      project_id: "syria-healthcare",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: "Elena's Cultural Resistance",
      content: "My name is Elena, and I'm a folk dancer from Kyiv. When the war started, I thought our cultural traditions might be lost forever. But something beautiful happened - artists from all over Ukraine began gathering in safe spaces, determined to keep our heritage alive. We teach traditional dances to children in shelters, sing folk songs that have been passed down for generations, and create art that tells our story. Every performance is an act of resistance, every song a declaration that our culture will survive. International supporters have helped us set up mobile cultural centers, bringing music and art to displaced families. Through dance and song, we're not just preserving our past - we're creating hope for our future.",
      character_name: "Elena",
      character_age: 28,
      location: "Ukraine",
      urgency: "high" as const,
      category: "education" as const,
      image_url: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      is_premium: true,
      is_published: true,
      listeners_count: 3421,
      likes_count: 203,
      language: "en",
      project_id: "ukraine-culture",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  const fallbackQuests = [
    { id: '1', title: "Share Mariam's Story", reward_tokens: 50, difficulty: "easy" as const, completed: false },
    { id: '2', title: "Donate $5 to Education Fund", reward_tokens: 100, difficulty: "medium" as const, completed: true },
    { id: '3', title: "Create Awareness Meme", reward_tokens: 75, difficulty: "easy" as const, completed: false },
    { id: '4', title: "Join Community Discussion", reward_tokens: 25, difficulty: "easy" as const, completed: true }
  ];

  const fallbackLeaderboard = [
    { rank: 1, full_name: "Sarah M.", tokens: 15420, level: 24 },
    { rank: 2, full_name: "Alex K.", tokens: 12890, level: 21 },
    { rank: 3, full_name: "You", tokens: profile?.tokens || 1247, level: profile?.level || 8 },
    { rank: 4, full_name: "Maria L.", tokens: 8934, level: 16 },
    { rank: 5, full_name: "John D.", tokens: 7621, level: 14 }
  ];

  // Use Supabase data if available, otherwise fallback
  const stories = supabaseStories.length > 0 ? supabaseStories : fallbackStories;
  const quests = supabaseQuests.length > 0 ? supabaseQuests.map(q => ({ ...q, completed: false })) : fallbackQuests;
  const leaderboard = supabaseLeaderboard.length > 0 ? supabaseLeaderboard : fallbackLeaderboard;
  const userTokens = profile?.tokens || 1247;
  const userLevel = profile?.level || 8;

  const handleStoryAccess = (storyIndex: number) => {
    const story = stories[storyIndex];
    if (story.is_premium && !subscriptionStatus.isPremium && !ignoreRevenueCatError) {
      showPaywall();
      return;
    }
    setActiveStory(storyIndex);
  };

  const handleSubscriptionChange = (newStatus: any) => {
    refreshStatus();
  };

  const handleManageSubscription = () => {
    showPaywall();
  };

  const handleDonateClick = (projectId?: string) => {
    const story = stories.find(s => s.project_id === projectId) || stories[activeStory];
    setSelectedProject({
      id: story.project_id || story.id,
      title: `${story.character_name}'s Story - ${story.location}`,
      image: story.image_url,
    });
    setDonationModalOpen(true);
  };

  const handleContinueWithoutRevenueCat = () => {
    setIgnoreRevenueCatError(true);
  };

  const handleContinueWithoutSupabase = () => {
    setIgnoreSupabaseError(true);
  };

  const handleQuestComplete = async (questId: string, tokensEarned: number) => {
    if (user && completeQuest) {
      try {
        await completeQuest(questId, tokensEarned);
      } catch (error) {
        console.error('Failed to complete quest:', error);
      }
    }
  };

  const handleStoryLike = async (storyId: string) => {
    if (user && likeStory) {
      try {
        await likeStory(storyId);
      } catch (error) {
        console.error('Failed to like story:', error);
      }
    }
  };

  // Show Supabase setup if not configured and not ignored
  if (!ignoreSupabaseError && !isSupabaseConfigured) {
    return <SupabaseSetup onContinueWithoutSupabase={handleContinueWithoutSupabase} />;
  }

  // Show auth screen if Supabase is configured but user is not authenticated (and not ignored)
  if (!ignoreSupabaseError && isSupabaseConfigured && !user && !isSupabaseLoading) {
    return (
      <SupabaseAuth
        onSignUp={signUp}
        onSignIn={signIn}
        isLoading={isSupabaseLoading}
        error={supabaseError}
        onClearError={clearSupabaseError}
      />
    );
  }

  // Show error message if RevenueCat API key is missing or invalid (unless user chooses to ignore)
  if (!ignoreRevenueCatError && (!REVENUECAT_API_KEY || REVENUECAT_API_KEY.includes('your_revenuecat_api_key_here'))) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-gray-800 rounded-2xl border border-gray-700 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-4">RevenueCat Setup Required</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            To use VoiceForPeace with full subscription features, you need to configure your RevenueCat API key. Please:
          </p>
          <div className="text-left space-y-2 mb-6">
            <p className="text-sm text-gray-400">1. Go to your RevenueCat Dashboard</p>
            <p className="text-sm text-gray-400">2. Navigate to API Keys</p>
            <p className="text-sm text-gray-400">3. Copy your "Public API Key (Web Billing)"</p>
            <p className="text-sm text-gray-400">4. Add it to your .env file as VITE_REVENUECAT_API_KEY</p>
          </div>
          
          <div className="space-y-3">
            <a 
              href="https://app.revenuecat.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open RevenueCat Dashboard</span>
            </a>
            
            <button
              onClick={handleContinueWithoutRevenueCat}
              className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 border border-gray-600"
            >
              Continue Without Subscription Features
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Note: Without RevenueCat, premium features and subscription management will not be available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EchoAid</h1>
              <p className="text-sm text-gray-400">
                {user ? `Welcome, ${profile?.full_name || user.email}` : 'Powered by BlockDAG & AI'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-yellow-400">{userTokens}</span>
              <span className="text-gray-300">tokens</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-purple-400">Level {userLevel}</span>
            </div>
            {!ignoreRevenueCatError && subscriptionStatus.isPremium ? (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="font-semibold text-white">Premium</span>
              </div>
            ) : !ignoreRevenueCatError ? (
              <button 
                onClick={showPaywall}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Upgrade Plan
              </button>
            ) : (
              <div className="flex items-center space-x-2 bg-yellow-600 px-4 py-2 rounded-lg">
                <HelpCircle className="w-4 h-4 text-white" />
                <span className="font-semibold text-white text-sm">Free Mode</span>
              </div>
            )}
            
            {user && signOut && (
              <button
                onClick={signOut}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Story Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Story */}
            <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
              <div className="relative">
                <img 
                  src={stories[activeStory].image_url} 
                  alt={stories[activeStory].character_name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                
                {/* Premium Badge */}
                {stories[activeStory].is_premium && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Premium</span>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        Meet {stories[activeStory].character_name}, {stories[activeStory].character_age}
                      </h2>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{stories[activeStory].location}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          stories[activeStory].urgency === 'high' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-yellow-600 text-white'
                        }`}>
                          {stories[activeStory].urgency} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  {stories[activeStory].is_premium && !subscriptionStatus.isPremium && !ignoreRevenueCatError ? (
                    <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-600 rounded-lg p-4 text-center">
                      <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-white mb-2">Premium Content</h3>
                      <p className="text-purple-200 text-sm mb-4">
                        This story is available to premium subscribers. Upgrade to access exclusive content and support humanitarian causes.
                      </p>
                      <button
                        onClick={showPaywall}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg font-semibold text-white transition-all duration-200"
                      >
                        Unlock Premium
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">
                        {stories[activeStory].content}
                      </p>
                      
                      {/* AI Voice Player */}
                      <VoicePlayer
                        storyText={stories[activeStory].content}
                        characterName={stories[activeStory].character_name}
                        language={stories[activeStory].language}
                        autoGenerate={false}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Headphones className="w-4 h-4" />
                      <span>{stories[activeStory].listeners_count.toLocaleString()} listeners</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Heart className="w-4 h-4" />
                      <span>{stories[activeStory].likes_count} likes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Volume2 className="w-4 h-4" />
                      <span>AI Voice Available</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleDonateClick(stories[activeStory].project_id)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Donate with BDAG</span>
                  </button>
                  <button 
                    onClick={() => handleStoryLike(stories[activeStory].id)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Like Story</span>
                  </button>
                  <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Story Navigation */}
            <div className="grid grid-cols-3 gap-4">
              {stories.map((story, index) => (
                <button
                  key={story.id}
                  onClick={() => handleStoryAccess(index)}
                  className={`relative p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                    activeStory === index 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                      : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {story.is_premium && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-1 rounded-full">
                        <Star className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                  <img 
                    src={story.image_url} 
                    alt={story.character_name}
                    className="w-full h-20 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-semibold text-sm text-white">{story.character_name}</h3>
                  <p className="text-xs text-gray-400">{story.location}</p>
                  {story.is_premium && !subscriptionStatus.isPremium && !ignoreRevenueCatError && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Interactive Map Section */}
            <GlobalImpactMap />

            {/* Tavus Video Integration */}
            <TavusVideoIntegration />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* BlockDAG Wallet */}
            <BlockDAGWallet />

            {/* Reddit Quest Integration */}
            <RedditQuestIntegration onQuestComplete={handleQuestComplete} />

            {/* Voice Settings */}
            {isElevenLabsInitialized && voices.length > 0 && (
              <VoiceSettings
                voices={voices}
                selectedVoice={selectedVoice}
                voiceSettings={voiceSettings}
                language={selectedLanguage}
                onVoiceChange={setSelectedVoice}
                onSettingsChange={setVoiceSettings}
                onLanguageChange={setSelectedLanguage}
              />
            )}

            {/* Subscription Status */}
            {!isRevenueCatLoading && !ignoreRevenueCatError && (
              <SubscriptionStatus
                status={subscriptionStatus}
                onUpgrade={showPaywall}
                onManage={handleManageSubscription}
              />
            )}

            {/* Free Mode Notice */}
            {ignoreRevenueCatError && (
              <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-2xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Free Mode</h3>
                </div>
                <p className="text-yellow-200 text-sm mb-3">
                  You're using VoiceForPeace without subscription features. All stories are accessible, but premium subscription management is disabled.
                </p>
                <p className="text-xs text-yellow-300">
                  Configure RevenueCat API key to enable premium features.
                </p>
              </div>
            )}

            {/* Database Mode Notice */}
            {ignoreSupabaseError && (
              <div className="bg-blue-900 bg-opacity-50 border border-blue-600 rounded-2xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Demo Mode</h3>
                </div>
                <p className="text-blue-200 text-sm mb-3">
                  You're using VoiceForPeace without database features. User accounts, real-time data, and community features are disabled.
                </p>
                <p className="text-xs text-blue-300">
                  Configure Supabase to enable full functionality.
                </p>
              </div>
            )}

            {/* Blockchain Transparency */}
            <BlockchainTransparency />

            {/* Daily Quests */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span>Daily Quests</span>
              </h3>
              <div className="space-y-3">
                {quests.map((quest, index) => (
                  <div 
                    key={quest.id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      quest.completed 
                        ? 'bg-green-900 bg-opacity-30 border-green-600' 
                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600 cursor-pointer'
                    }`}
                    onClick={() => !quest.completed && user && handleQuestComplete(quest.id, quest.reward_tokens)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white text-sm">{quest.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        quest.difficulty === 'easy' 
                          ? 'bg-green-600 text-white' 
                          : quest.difficulty === 'medium'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}>
                        {quest.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">{quest.reward_tokens}</span>
                      </div>
                      {quest.completed ? (
                        <span className="text-green-400 text-sm font-semibold">Completed ✓</span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>Community Leaders</span>
              </h3>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      entry.full_name === 'You' || (user && entry.full_name === profile?.full_name)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-gray-900' :
                        entry.rank === 2 ? 'bg-gray-400 text-gray-900' :
                        entry.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{entry.full_name}</p>
                        <p className="text-xs text-gray-400">Level {entry.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-yellow-400">{entry.tokens.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">tokens</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        projectId={selectedProject?.id || ''}
        projectTitle={selectedProject?.title || ''}
        projectImage={selectedProject?.image}
      />

      {/* Subscription Paywall */}
      {!ignoreRevenueCatError && (
        <SubscriptionPaywall
          isOpen={isPaywallVisible}
          onClose={hidePaywall}
          onSubscriptionChange={handleSubscriptionChange}
        />
      )}

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">EchoAid</h3>
                  <p className="text-sm text-gray-400">Powered by AI & BlockDAG</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting global communities through AI-powered storytelling and ultra-fast transparent humanitarian aid distribution on BlockDAG.
              </p>
              <div className="flex space-x-4">
                <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-200">
                  <Facebook className="w-5 h-5 text-gray-300" />
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-200">
                  <Twitter className="w-5 h-5 text-gray-300" />
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-200">
                  <Instagram className="w-5 h-5 text-gray-300" />
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-200">
                  <Youtube className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>

            {/* Platform Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                    <span>AI Voice Stories</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                    <span>Daily Quests</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                    <span>Leaderboard</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                    <span>Impact Map</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                    <span>Community</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>Help Center</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Terms of Service</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Security</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4" />
                    <span>BlockDAG Explorer</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Stay Connected</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">hello@voiceforpeace.org</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Subscribe to our newsletter</p>
                <div className="flex space-x-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                  />
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-lg font-semibold transition-all duration-200">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>© 2025 VoiceForPeace. All rights reserved.</span>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>100% Transparent</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Powered by</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
                    <span className="text-white font-semibold">BlockDAG</span>
                  </div>
                  <span>&</span>
                  <div className="flex items-center space-x-1">
                    <Headphones className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-semibold">AI Voice</span>
                  </div>
                  <span>&</span>
                  <div className="flex items-center space-x-1">
                    <Database className="w-4 h-4 text-green-400" />
                    <span className="text-white font-semibold">Supabase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
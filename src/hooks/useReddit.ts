import { useState, useEffect, useCallback } from 'react';
import RedditService, { RedditUser, RedditPost, RedditComment, RedditQuestProgress } from '../services/RedditService';

interface UseRedditReturn {
  isConfigured: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: RedditUser | null;
  questProgress: RedditQuestProgress | null;
  
  // Auth methods
  getAuthUrl: () => string;
  handleAuthCallback: (code: string, state: string) => Promise<void>;
  disconnect: () => void;
  
  // Quest methods
  shareStoryQuest: (storyTitle: string, storyContent: string) => Promise<RedditPost>;
  createAwarenessQuest: (cause: string, message: string) => Promise<RedditPost>;
  engageWithCommunityQuest: (postId: string, message: string) => Promise<RedditComment>;
  
  // Data methods
  refreshUserData: () => Promise<void>;
  refreshQuestProgress: () => Promise<void>;
  getSuggestedSubreddits: () => Array<{ name: string; description: string; members: string }>;
  
  // Utility
  clearError: () => void;
}

export function useReddit(): UseRedditReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<RedditUser | null>(null);
  const [questProgress, setQuestProgress] = useState<RedditQuestProgress | null>(null);

  const reddit = RedditService.getInstance();

  // Initialize Reddit service
  useEffect(() => {
    const config = {
      clientId: import.meta.env.VITE_REDDIT_CLIENT_ID || 'demo_client_id',
      clientSecret: import.meta.env.VITE_REDDIT_CLIENT_SECRET || 'demo_client_secret',
      redirectUri: `${window.location.origin}/reddit/callback`,
      userAgent: 'VoiceForPeace:v1.0.0 (by /u/VoiceForPeace)',
    };

    try {
      reddit.initialize(config);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Reddit service');
    }
  }, []);

  // Load user data if authenticated
  useEffect(() => {
    if (reddit.isAuthenticated()) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = await reddit.getCurrentUser();
      setUser(userData);

      const progress = await reddit.getQuestProgress(userData.name);
      setQuestProgress(progress);
    } catch (err: any) {
      setError(err.message || 'Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthUrl = useCallback(() => {
    try {
      return reddit.getAuthUrl();
    } catch (err: any) {
      setError(err.message || 'Failed to generate auth URL');
      return '';
    }
  }, []);

  const handleAuthCallback = useCallback(async (code: string, state: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await reddit.exchangeCodeForToken(code, state);
      await loadUserData();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    reddit.disconnect();
    setUser(null);
    setQuestProgress(null);
    setError(null);
  }, []);

  const shareStoryQuest = useCallback(async (storyTitle: string, storyContent: string): Promise<RedditPost> => {
    try {
      setIsLoading(true);
      setError(null);

      const post = await reddit.completeShareStoryQuest(storyTitle, storyContent);
      
      // Refresh quest progress
      if (user) {
        const progress = await reddit.getQuestProgress(user.name);
        setQuestProgress(progress);
      }

      return post;
    } catch (err: any) {
      setError(err.message || 'Failed to share story');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createAwarenessQuest = useCallback(async (cause: string, message: string): Promise<RedditPost> => {
    try {
      setIsLoading(true);
      setError(null);

      const post = await reddit.completeAwarenessQuest(cause, message);
      
      // Refresh quest progress
      if (user) {
        const progress = await reddit.getQuestProgress(user.name);
        setQuestProgress(progress);
      }

      return post;
    } catch (err: any) {
      setError(err.message || 'Failed to create awareness post');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const engageWithCommunityQuest = useCallback(async (postId: string, message: string): Promise<RedditComment> => {
    try {
      setIsLoading(true);
      setError(null);

      const comment = await reddit.createComment(postId, message);
      
      // Refresh quest progress
      if (user) {
        const progress = await reddit.getQuestProgress(user.name);
        setQuestProgress(progress);
      }

      return comment;
    } catch (err: any) {
      setError(err.message || 'Failed to engage with community');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refreshUserData = useCallback(async () => {
    if (reddit.isAuthenticated()) {
      await loadUserData();
    }
  }, []);

  const refreshQuestProgress = useCallback(async () => {
    if (user) {
      try {
        setError(null);
        const progress = await reddit.getQuestProgress(user.name);
        setQuestProgress(progress);
      } catch (err: any) {
        setError(err.message || 'Failed to refresh quest progress');
      }
    }
  }, [user]);

  const getSuggestedSubreddits = useCallback(() => {
    return reddit.getSuggestedSubreddits();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isConfigured: reddit.isConfigured(),
    isAuthenticated: reddit.isAuthenticated(),
    isLoading,
    error,
    user,
    questProgress,
    
    getAuthUrl,
    handleAuthCallback,
    disconnect,
    
    shareStoryQuest,
    createAwarenessQuest,
    engageWithCommunityQuest,
    
    refreshUserData,
    refreshQuestProgress,
    getSuggestedSubreddits,
    
    clearError,
  };
}
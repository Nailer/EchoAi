import { useState, useEffect, useCallback } from 'react';
import SupabaseService, { 
  Profile, 
  Story, 
  Project, 
  Quest, 
  LeaderboardEntry,
  Donation 
} from '../services/SupabaseService';
import { User, Session } from '@supabase/supabase-js';

interface UseSupabaseReturn {
  // Auth state
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;

  // Auth methods
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Data methods
  stories: Story[];
  projects: Project[];
  quests: Quest[];
  leaderboard: LeaderboardEntry[];
  userDonations: Donation[];

  // Data actions
  refreshStories: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  refreshQuests: () => Promise<void>;
  refreshLeaderboard: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  
  likeStory: (storyId: string) => Promise<void>;
  unlikeStory: (storyId: string) => Promise<void>;
  completeQuest: (questId: string, tokensEarned: number) => Promise<void>;
  recordDonation: (projectId: string, amount: number, transactionId?: string) => Promise<void>;
  
  // Utility
  clearError: () => void;
}

export function useSupabase(
  supabaseUrl?: string, 
  supabaseAnonKey?: string
): UseSupabaseReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [stories, setStories] = useState<Story[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userDonations, setUserDonations] = useState<Donation[]>([]);

  const supabase = SupabaseService.getInstance();

  // Initialize Supabase
  useEffect(() => {
    if (supabaseUrl && supabaseAnonKey && !supabase.isInitialized()) {
      try {
        supabase.initialize(supabaseUrl, supabaseAnonKey);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize Supabase');
      }
    }
  }, [supabaseUrl, supabaseAnonKey]);

  // Monitor auth state
  useEffect(() => {
    if (!supabase.isInitialized()) return;

    const checkAuth = async () => {
      try {
        const currentUser = supabase.getCurrentUser();
        const currentSession = supabase.getCurrentSession();
        
        setUser(currentUser);
        setSession(currentSession);

        if (currentUser) {
          await loadUserProfile(currentUser.id);
          await loadUserData();
        }
      } catch (err: any) {
        setError(err.message || 'Failed to check authentication');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up a periodic check for auth state changes
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, [supabase.isInitialized()]);

  const loadUserProfile = async (userId: string) => {
    try {
      const userProfile = await supabase.getProfile(userId);
      setProfile(userProfile);
    } catch (err: any) {
      console.error('Failed to load user profile:', err);
    }
  };

  const loadUserData = async () => {
    try {
      const [userDonationsData] = await Promise.all([
        supabase.getDonations(),
      ]);
      
      setUserDonations(userDonationsData);
    } catch (err: any) {
      console.error('Failed to load user data:', err);
    }
  };

  // Auth methods
  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await supabase.signUp(email, password, fullName);
      
      // Auth state will be updated by the auth listener
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await supabase.signIn(email, password);
      
      // Auth state will be updated by the auth listener
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      
      await supabase.signOut();
      
      // Clear local state
      setUser(null);
      setSession(null);
      setProfile(null);
      setUserDonations([]);
    } catch (err: any) {
      setError(err.message || 'Sign out failed');
      throw err;
    }
  }, []);

  // Data refresh methods
  const refreshStories = useCallback(async () => {
    try {
      setError(null);
      const storiesData = await supabase.getStories({ limit: 50 });
      setStories(storiesData);
    } catch (err: any) {
      setError(err.message || 'Failed to load stories');
    }
  }, []);

  const refreshProjects = useCallback(async () => {
    try {
      setError(null);
      const projectsData = await supabase.getProjects();
      setProjects(projectsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    }
  }, []);

  const refreshQuests = useCallback(async () => {
    try {
      setError(null);
      const questsData = await supabase.getQuests(true); // Daily quests only
      setQuests(questsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load quests');
    }
  }, []);

  const refreshLeaderboard = useCallback(async () => {
    try {
      setError(null);
      const leaderboardData = await supabase.getLeaderboard('all_time', 10);
      setLeaderboard(leaderboardData);
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard');
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      setError(null);
      await loadUserProfile(user.id);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh profile');
    }
  }, [user]);

  // Action methods
  const likeStory = useCallback(async (storyId: string) => {
    try {
      setError(null);
      await supabase.likeStory(storyId);
      
      // Update local state
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, likes_count: story.likes_count + 1 }
          : story
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to like story');
    }
  }, []);

  const unlikeStory = useCallback(async (storyId: string) => {
    try {
      setError(null);
      await supabase.unlikeStory(storyId);
      
      // Update local state
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, likes_count: Math.max(0, story.likes_count - 1) }
          : story
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to unlike story');
    }
  }, []);

  const completeQuest = useCallback(async (questId: string, tokensEarned: number) => {
    try {
      setError(null);
      await supabase.completeQuest(questId, tokensEarned);
      
      // Refresh profile to get updated tokens
      await refreshProfile();
    } catch (err: any) {
      setError(err.message || 'Failed to complete quest');
    }
  }, [refreshProfile]);

  const recordDonation = useCallback(async (projectId: string, amount: number, transactionId?: string) => {
    try {
      setError(null);
      
      const donation = await supabase.createDonation({
        project_id: projectId,
        amount,
        currency: 'ALGO',
        transaction_id: transactionId,
        status: 'pending',
        is_anonymous: false,
      });

      // Add to local state
      setUserDonations(prev => [donation, ...prev]);
      
      return donation;
    } catch (err: any) {
      setError(err.message || 'Failed to record donation');
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load initial data when authenticated
  useEffect(() => {
    if (user && supabase.isInitialized()) {
      Promise.all([
        refreshStories(),
        refreshProjects(),
        refreshQuests(),
        refreshLeaderboard(),
      ]).catch(console.error);
    }
  }, [user, refreshStories, refreshProjects, refreshQuests, refreshLeaderboard]);

  return {
    // Auth state
    user,
    session,
    profile,
    isLoading,
    error,

    // Auth methods
    signUp,
    signIn,
    signOut,

    // Data
    stories,
    projects,
    quests,
    leaderboard,
    userDonations,

    // Data actions
    refreshStories,
    refreshProjects,
    refreshQuests,
    refreshLeaderboard,
    refreshProfile,
    
    likeStory,
    unlikeStory,
    completeQuest,
    recordDonation,
    
    // Utility
    clearError,
  };
}
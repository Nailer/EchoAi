import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// Database types
export interface Profile {
  id: string;
  user_id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role: 'user' | 'moderator' | 'admin';
  tokens: number;
  level: number;
  total_donations: number;
  stories_listened: number;
  quests_completed: number;
  preferred_language: string;
  notification_preferences: {
    email: boolean;
    push: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  character_name: string;
  character_age?: number;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  category: 'education' | 'healthcare' | 'food' | 'shelter' | 'emergency';
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  is_premium: boolean;
  is_published: boolean;
  listeners_count: number;
  likes_count: number;
  language: string;
  project_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  category: 'education' | 'healthcare' | 'food' | 'shelter' | 'emergency';
  funding_goal: number;
  current_funding: number;
  beneficiaries_count: number;
  image_url?: string;
  is_active: boolean;
  algorand_address?: string;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  user_id: string;
  project_id: string;
  amount: number;
  currency: string;
  transaction_id?: string;
  blockchain_hash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  message?: string;
  is_anonymous: boolean;
  created_at: string;
  confirmed_at?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reward_tokens: number;
  requirements: Record<string, any>;
  is_daily: boolean;
  is_active: boolean;
  created_at: string;
}

export interface UserQuestCompletion {
  id: string;
  user_id: string;
  quest_id: string;
  completed_at: string;
  tokens_earned: number;
}

export interface LeaderboardEntry {
  rank: number;
  full_name?: string;
  tokens: number;
  level: number;
  period: string;
  period_start?: string;
  period_end?: string;
}

export interface VoiceGeneration {
  id: string;
  user_id: string;
  story_id?: string;
  voice_id: string;
  text_content: string;
  audio_url?: string;
  language: string;
  voice_settings: Record<string, any>;
  generation_time_ms?: number;
  created_at: string;
}

class SupabaseService {
  private static instance: SupabaseService;
  private supabase: SupabaseClient | null = null;
  private currentUser: User | null = null;
  private currentSession: Session | null = null;

  private constructor() {}

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  initialize(supabaseUrl: string, supabaseAnonKey: string): void {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentSession = session;
      this.currentUser = session?.user || null;
      
      console.log('Auth state changed:', event, this.currentUser?.id);
    });

    console.log('Supabase service initialized');
  }

  isInitialized(): boolean {
    return !!this.supabase;
  }

  // Authentication methods
  async signUp(email: string, password: string, fullName?: string) {
    if (!this.supabase) throw new Error('Supabase not initialized');

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    if (!this.supabase) throw new Error('Supabase not initialized');

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    if (!this.supabase) throw new Error('Supabase not initialized');

    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  // Profile methods
  async getProfile(userId?: string): Promise<Profile | null> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    const targetUserId = userId || this.currentUser?.id;
    if (!targetUserId) return null;

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    if (!this.supabase || !this.currentUser) throw new Error('Not authenticated');

    const { data, error } = await this.supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', this.currentUser.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Stories methods
  async getStories(filters?: {
    category?: string;
    urgency?: string;
    is_premium?: boolean;
    limit?: number;
  }): Promise<Story[]> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    let query = this.supabase
      .from('stories')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.urgency) {
      query = query.eq('urgency', filters.urgency);
    }
    if (filters?.is_premium !== undefined) {
      query = query.eq('is_premium', filters.is_premium);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getStory(id: string): Promise<Story | null> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    const { data, error } = await this.supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async incrementStoryListeners(storyId: string): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    const { error } = await this.supabase.rpc('increment_story_listeners', {
      story_uuid: storyId,
    });

    if (error) throw error;
  }

  async likeStory(storyId: string): Promise<void> {
    if (!this.supabase || !this.currentUser) throw new Error('Not authenticated');

    const { error } = await this.supabase
      .from('story_likes')
      .insert({
        user_id: this.currentUser.id,
        story_id: storyId,
      });

    if (error && error.code !== '23505') throw error; // Ignore duplicate key error
  }

  async unlikeStory(storyId: string): Promise<void> {
    if (!this.supabase || !this.currentUser) throw new Error('Not authenticated');

    const { error } = await this.supabase
      .from('story_likes')
      .delete()
      .eq('user_id', this.currentUser.id)
      .eq('story_id', storyId);

    if (error) throw error;
  }

  // Projects methods
  async getProjects(activeOnly: boolean = true): Promise<Project[]> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    let query = this.supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getProject(id: string): Promise<Project | null> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Donations methods
  async createDonation(donation: Omit<Donation, 'id' | 'created_at'>): Promise<Donation> {
    if (!this.supabase || !this.currentUser) throw new Error('Not authenticated');

    const { data, error } = await this.supabase
      .from('donations')
      .insert({
        ...donation,
        user_id: this.currentUser.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateDonationStatus(
    donationId: string,
    status: 'confirmed' | 'failed',
    blockchainHash?: string
  ): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'confirmed') {
      updates.confirmed_at = new Date().toISOString();
    }

    if (blockchainHash) {
      updates.blockchain_hash = blockchainHash;
    }

    const { error } = await this.supabase
      .from('donations')
      .update(updates)
      .eq('id', donationId);

    if (error) throw error;
  }

  async getDonations(userId?: string): Promise<Donation[]> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    const targetUserId = userId || this.currentUser?.id;
    if (!targetUserId) return [];

    const { data, error } = await this.supabase
      .from('donations')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getRecentDonations(limit: number = 10): Promise<Donation[]> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    const { data, error } = await this.supabase
      .from('donations')
      .select('*')
      .eq('status', 'confirmed')
      .eq('is_anonymous', false)
      .order('confirmed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Quests methods
  async getQuests(dailyOnly: boolean = false): Promise<Quest[]> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    let query = this.supabase
      .from('quests')
      .select('*')
      .eq('is_active', true)
      .order('difficulty', { ascending: true });

    if (dailyOnly) {
      query = query.eq('is_daily', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async completeQuest(questId: string, tokensEarned: number): Promise<void> {
    if (!this.supabase || !this.currentUser) throw new Error('Not authenticated');

    const { error } = await this.supabase
      .from('user_quest_completions')
      .insert({
        user_id: this.currentUser.id,
        quest_id: questId,
        tokens_earned: tokensEarned,
      });

    if (error && error.code !== '23505') throw error; // Ignore duplicate key error
  }

  async getUserQuestCompletions(date?: string): Promise<UserQuestCompletion[]> {
    if (!this.supabase || !this.currentUser) throw new Error('Not authenticated');

    let query = this.supabase
      .from('user_quest_completions')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .order('completed_at', { ascending: false });

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte('completed_at', startOfDay.toISOString())
        .lte('completed_at', endOfDay.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Leaderboard methods
  async getLeaderboard(period: string = 'all_time', limit: number = 10): Promise<LeaderboardEntry[]> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    const { data, error } = await this.supabase
      .from('leaderboard_view')
      .select('*')
      .eq('period', period)
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Voice generation methods
  async saveVoiceGeneration(generation: Omit<VoiceGeneration, 'id' | 'created_at'>): Promise<VoiceGeneration> {
    if (!this.supabase || !this.currentUser) throw new Error('Not authenticated');

    const { data, error } = await this.supabase
      .from('voice_generations')
      .insert({
        ...generation,
        user_id: this.currentUser.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getVoiceGenerations(limit: number = 50): Promise<VoiceGeneration[]> {
    if (!this.supabase || !this.currentUser) throw new Error('Not authenticated');

    const { data, error } = await this.supabase
      .from('voice_generations')
      .select('*')
      .eq('user_id', this.currentUser.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Real-time subscriptions
  subscribeToStories(callback: (payload: any) => void) {
    if (!this.supabase) throw new Error('Supabase not initialized');

    return this.supabase
      .channel('stories')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'stories' },
        callback
      )
      .subscribe();
  }

  subscribeToLeaderboard(callback: (payload: any) => void) {
    if (!this.supabase) throw new Error('Supabase not initialized');

    return this.supabase
      .channel('leaderboard')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard_entries' },
        callback
      )
      .subscribe();
  }

  subscribeToUserProfile(callback: (payload: any) => void) {
    if (!this.supabase || !this.currentUser) throw new Error('Not authenticated');

    return this.supabase
      .channel('user_profile')
      .on('postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles',
          filter: `user_id=eq.${this.currentUser.id}`
        },
        callback
      )
      .subscribe();
  }

  // Utility methods
  async getTotalStats(): Promise<{
    totalDonations: number;
    totalUsers: number;
    totalStories: number;
    totalProjects: number;
  }> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    const [donationsResult, usersResult, storiesResult, projectsResult] = await Promise.all([
      this.supabase.from('donations').select('amount', { count: 'exact' }).eq('status', 'confirmed'),
      this.supabase.from('profiles').select('id', { count: 'exact' }),
      this.supabase.from('stories').select('id', { count: 'exact' }).eq('is_published', true),
      this.supabase.from('projects').select('id', { count: 'exact' }).eq('is_active', true),
    ]);

    const totalDonations = donationsResult.data?.reduce((sum, d) => sum + d.amount, 0) || 0;

    return {
      totalDonations,
      totalUsers: usersResult.count || 0,
      totalStories: storiesResult.count || 0,
      totalProjects: projectsResult.count || 0,
    };
  }
}

export default SupabaseService;
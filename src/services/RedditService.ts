interface RedditConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  userAgent: string;
}

interface RedditUser {
  id: string;
  name: string;
  karma: number;
  created: number;
  verified: boolean;
}

interface RedditPost {
  id: string;
  title: string;
  url: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
}

interface RedditComment {
  id: string;
  body: string;
  score: number;
  created_utc: number;
  permalink: string;
}

interface RedditQuestProgress {
  postsCreated: number;
  commentsCreated: number;
  totalKarma: number;
  subredditsPosted: string[];
  lastActivity: Date;
}

class RedditService {
  private static instance: RedditService;
  private config: RedditConfig | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): RedditService {
    if (!RedditService.instance) {
      RedditService.instance = new RedditService();
    }
    return RedditService.instance;
  }

  initialize(config: RedditConfig): void {
    this.config = config;
    this.isInitialized = true;
    
    // Try to load saved tokens from localStorage
    this.loadTokensFromStorage();
    
    console.log('Reddit service initialized');
  }

  isConfigured(): boolean {
    return this.isInitialized && !!this.config;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // OAuth2 Authentication Flow
  getAuthUrl(): string {
    if (!this.config) throw new Error('Reddit service not configured');

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      state: this.generateRandomState(),
      redirect_uri: this.config.redirectUri,
      duration: 'permanent',
      scope: 'identity read submit edit history',
    });

    return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string, state: string): Promise<void> {
    if (!this.config) throw new Error('Reddit service not configured');

    try {
      const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.config.userAgent,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.config.redirectUri,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;

      this.saveTokensToStorage();
      console.log('Reddit authentication successful');
    } catch (error) {
      console.error('Reddit token exchange error:', error);
      throw error;
    }
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.config || !this.refreshToken) {
      throw new Error('Cannot refresh token: missing config or refresh token');
    }

    try {
      const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.config.clientId}:${this.config.clientSecret}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.config.userAgent,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;

      this.saveTokensToStorage();
      console.log('Reddit token refreshed successfully');
    } catch (error) {
      console.error('Reddit token refresh error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<RedditUser> {
    const response = await this.makeAuthenticatedRequest('/api/v1/me');
    return {
      id: response.id,
      name: response.name,
      karma: response.total_karma || 0,
      created: response.created_utc,
      verified: response.verified || false,
    };
  }

  async getUserPosts(username: string, limit: number = 25): Promise<RedditPost[]> {
    const response = await this.makeAuthenticatedRequest(`/user/${username}/submitted.json?limit=${limit}`);
    
    return response.data.children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      url: child.data.url,
      subreddit: child.data.subreddit,
      score: child.data.score,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
      permalink: child.data.permalink,
    }));
  }

  async getUserComments(username: string, limit: number = 25): Promise<RedditComment[]> {
    const response = await this.makeAuthenticatedRequest(`/user/${username}/comments.json?limit=${limit}`);
    
    return response.data.children.map((child: any) => ({
      id: child.data.id,
      body: child.data.body,
      score: child.data.score,
      created_utc: child.data.created_utc,
      permalink: child.data.permalink,
    }));
  }

  async createPost(subreddit: string, title: string, text: string): Promise<RedditPost> {
    const response = await this.makeAuthenticatedRequest('/api/submit', {
      method: 'POST',
      body: new URLSearchParams({
        sr: subreddit,
        kind: 'self',
        title,
        text,
        api_type: 'json',
      }),
    });

    if (response.json.errors && response.json.errors.length > 0) {
      throw new Error(`Reddit post creation failed: ${response.json.errors[0][1]}`);
    }

    const postData = response.json.data;
    return {
      id: postData.id,
      title: postData.title || title,
      url: postData.url,
      subreddit,
      score: 1,
      num_comments: 0,
      created_utc: Date.now() / 1000,
      permalink: postData.permalink || '',
    };
  }

  async createComment(postId: string, text: string): Promise<RedditComment> {
    const response = await this.makeAuthenticatedRequest('/api/comment', {
      method: 'POST',
      body: new URLSearchParams({
        thing_id: `t3_${postId}`,
        text,
        api_type: 'json',
      }),
    });

    if (response.json.errors && response.json.errors.length > 0) {
      throw new Error(`Reddit comment creation failed: ${response.json.errors[0][1]}`);
    }

    const commentData = response.json.data.things[0].data;
    return {
      id: commentData.id,
      body: text,
      score: 1,
      created_utc: Date.now() / 1000,
      permalink: commentData.permalink || '',
    };
  }

  async getQuestProgress(username: string): Promise<RedditQuestProgress> {
    try {
      const [posts, comments] = await Promise.all([
        this.getUserPosts(username, 100),
        this.getUserComments(username, 100),
      ]);

      // Filter for humanitarian-related content (last 30 days)
      const thirtyDaysAgo = Date.now() / 1000 - (30 * 24 * 60 * 60);
      const recentPosts = posts.filter(post => post.created_utc > thirtyDaysAgo);
      const recentComments = comments.filter(comment => comment.created_utc > thirtyDaysAgo);

      const humanitarianKeywords = [
        'humanitarian', 'charity', 'donation', 'refugee', 'aid', 'relief',
        'voiceforpeace', 'gaza', 'ukraine', 'syria', 'yemen', 'lebanon',
        'education', 'healthcare', 'food security', 'emergency'
      ];

      const humanitarianPosts = recentPosts.filter(post =>
        humanitarianKeywords.some(keyword =>
          post.title.toLowerCase().includes(keyword)
        )
      );

      const humanitarianComments = recentComments.filter(comment =>
        humanitarianKeywords.some(keyword =>
          comment.body.toLowerCase().includes(keyword)
        )
      );

      const totalKarma = humanitarianPosts.reduce((sum, post) => sum + post.score, 0) +
                        humanitarianComments.reduce((sum, comment) => sum + comment.score, 0);

      const subredditsPosted = [...new Set(humanitarianPosts.map(post => post.subreddit))];

      return {
        postsCreated: humanitarianPosts.length,
        commentsCreated: humanitarianComments.length,
        totalKarma,
        subredditsPosted,
        lastActivity: new Date(Math.max(
          ...recentPosts.map(p => p.created_utc * 1000),
          ...recentComments.map(c => c.created_utc * 1000)
        )),
      };
    } catch (error) {
      console.error('Error getting quest progress:', error);
      return {
        postsCreated: 0,
        commentsCreated: 0,
        totalKarma: 0,
        subredditsPosted: [],
        lastActivity: new Date(),
      };
    }
  }

  // Quest-specific methods
  async completeShareStoryQuest(storyTitle: string, storyContent: string): Promise<RedditPost> {
    const title = `🌍 Humanitarian Story: ${storyTitle} | EchoAid`;
    const text = `${storyContent}\n\n---\n\n*This story is part of EchoAid, a platform connecting global communities through AI-powered storytelling and transparent humanitarian aid distribution. Learn more about supporting humanitarian causes worldwide.*\n\n#EchoAid #HumanitarianAid #GlobalCommunity`;

    return this.createPost('HumanitarianAid', title, text);
  }

  async completeAwarenessQuest(cause: string, message: string): Promise<RedditPost> {
    const title = `🚨 Raising Awareness: ${cause} | Help Make a Difference`;
    const text = `${message}\n\n---\n\n*Join EchoAid in supporting humanitarian causes worldwide through transparent blockchain donations and AI-powered storytelling.*\n\n#HumanitarianAid #${cause.replace(/\s+/g, '')} #EchoAid`;

    return this.createPost('worldnews', title, text);
  }

  async completeEngagementQuest(postId: string, supportMessage: string): Promise<RedditComment> {
    const text = `${supportMessage}\n\n*Supporting humanitarian causes through EchoAid - where every voice matters and every donation is transparent.*`;

    return this.createComment(postId, text);
  }

  disconnect(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.clearTokensFromStorage();
    console.log('Reddit account disconnected');
  }

  // Private helper methods
  private async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Reddit');
    }

    if (!this.config) {
      throw new Error('Reddit service not configured');
    }

    const url = endpoint.startsWith('http') ? endpoint : `https://oauth.reddit.com${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'User-Agent': this.config.userAgent,
          ...options.headers,
        },
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshAccessToken();
        
        // Retry the request with new token
        return this.makeAuthenticatedRequest(endpoint, options);
      }

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Reddit API request failed:', error);
      throw error;
    }
  }

  private generateRandomState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private saveTokensToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('reddit_access_token', this.accessToken || '');
      localStorage.setItem('reddit_refresh_token', this.refreshToken || '');
    }
  }

  private loadTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('reddit_access_token');
      this.refreshToken = localStorage.getItem('reddit_refresh_token');
    }
  }

  private clearTokensFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('reddit_access_token');
      localStorage.removeItem('reddit_refresh_token');
    }
  }

  // Get suggested subreddits for humanitarian content
  getSuggestedSubreddits(): Array<{ name: string; description: string; members: string }> {
    return [
      {
        name: 'HumanitarianAid',
        description: 'Community focused on humanitarian assistance and relief efforts',
        members: '45K'
      },
      {
        name: 'worldnews',
        description: 'Global news and current events',
        members: '30M'
      },
      {
        name: 'UpliftingNews',
        description: 'Positive news and inspiring stories',
        members: '17M'
      },
      {
        name: 'nonprofit',
        description: 'Discussion about nonprofit organizations and causes',
        members: '25K'
      },
      {
        name: 'MadeMeSmile',
        description: 'Heartwarming content that brings joy',
        members: '6M'
      },
      {
        name: 'HumansBeingBros',
        description: 'People helping people and acts of kindness',
        members: '4M'
      }
    ];
  }
}

export default RedditService;
export type { RedditConfig, RedditUser, RedditPost, RedditComment, RedditQuestProgress };
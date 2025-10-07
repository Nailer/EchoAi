[![Watch the video](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://youtu.be/DpzWR01nfYc)

<!-- [![Watch the video](https://youtu.be/Kq4UQByS1tw)](https://youtu.be/DpzWR01nfYc) -->


# EchoAid - Ultra-Fast Global Humanitarian Aid Platform

A modern web application that connects global communities through voice-based storytelling and ultra-fast transparent humanitarian aid distribution, powered by BlockDAG network, ElevenLabs AI, and Supabase database.

# Project Overview
EchoAid is a revolutionary humanitarian aid platform that combines cutting-edge AI technology with BlockDAG blockchain to create the world's fastest and most transparent donation system. Our platform connects global communities through AI-powered voice storytelling while enabling ultra-fast, verifiable humanitarian aid distribution.

# Key Innovation
Ultra-Fast Blockchain Donations: Powered by BlockDAG network, our platform processes donations in ~1.2 seconds with 15,000+ TPS, making it the fastest humanitarian aid platform in the world.

# Core Features
AI-Powered Storytelling
. ElevenLabs Voice AI: Real-time voice generation for humanitarian stories in multiple languages
. Tavus Video AI: Personalized video messages from aid workers and beneficiaries
. Multi-language Support: Stories available in 10+ languages including Arabic, Ukrainian, and English

# ✨ BlockDAG Blockchain Integration
. Ultra-Fast Donations: 1.2-second confirmation times vs traditional 4+ seconds
. Complete Transparency: Every donation tracked on BlockDAG with real-time verification
. Multiple Wallets: Support for BlockDAG Wallet, MetaMask, and WalletConnect
. Low Fees: Minimal transaction costs for maximum impact

# Gamified Community Engagement
. Daily Quests: Earn tokens by sharing stories, making donations, and engaging with content
. Reddit Integration: Automated quest completion through social media engagement
. Global Leaderboards: Community-driven impact tracking and recognition
. Token Rewards: Incentivized participation in humanitarian causes

# Premium Features (RevenueCat)
. Subscription Management: Tiered access to exclusive content and features
. Direct Sponsor Connections: Premium users can connect directly with humanitarian sponsors
. Advanced Analytics: Detailed impact tracking and donation history
. Ad-free Experience: Clean, distraction-free interface for supporters
. Real-time Data & Transparency

# Supabase Backend: Real-time user profiles, story management, and community features
- Live Donation Tracking: Watch donations flow to projects in real-time
- Impact Visualization: Interactive global map showing project locations and progress
- Blockchain Explorer Integration: Direct links to verify all transactions


# Technology Stack
Frontend: React 18 + TypeScript + Vite + Tailwind CSS
Blockchain: BlockDAG Network (15,000+ TPS, 1.2s confirmations)
AI Voice: ElevenLabs API for multi-language voice generation
AI Video: Tavus API for personalized video messages
Database: Supabase (PostgreSQL with real-time features)
Payments: RevenueCat for subscription management
Social: Reddit API for community quest integration
Maps: Google Maps for global impact visualization


# Unique Value Proposition
Speed: Fastest humanitarian donation platform (1.2s vs industry 4+ seconds)
Transparency: 100% blockchain-verified donations with real-time tracking
Engagement: AI-powered storytelling creates emotional connection with causes
Gamification: Quest system incentivizes community participation and sharing
Global Reach: Multi-language support and worldwide project coverage
Scalability: BlockDAG technology handles massive transaction volumes


# Impact Metrics
Transaction Speed: 15,000+ TPS capability
Confirmation Time: ~1.2 seconds average
Language Support: 10+ languages for global accessibility
Real-time Features: Live donation tracking and community updates
Transparency: 100% blockchain-verified fund distribution


# Gamification & Community
Quest System: Daily challenges for community engagement
Token Economy: Reward system for platform participation
Social Integration: Reddit API for automated quest completion
Leaderboards: Global and regional impact rankings
Premium Tiers: Subscription-based enhanced features


# Security & Trust
Blockchain Verification: All donations recorded on BlockDAG
Row-Level Security: Supabase RLS for data protection
Multi-Wallet Support: Secure wallet integrations
Real-time Monitoring: Live transaction and impact tracking


# Global Impact
EchoAid addresses critical humanitarian challenges by combining the emotional power of AI-generated storytelling with the speed and transparency of BlockDAG blockchain technology. Our platform makes humanitarian aid more accessible, transparent, and engaging than ever before.

## Features

### Core Platform
- **Voice-based Storytelling**: Listen to real stories from humanitarian causes worldwide using ElevenLabs AI
- **Interactive Global Map**: Visualize impact and ongoing projects across the globe
- **Gamification System**: Daily quests, tokens, and community leaderboards
- **Transparency Dashboard**: BlockDAG-verified fund distribution tracking with ultra-fast confirmations
- **Real-time Community**: User authentication, profiles, and live data updates

### Premium Features (RevenueCat Integration)
- **Premium Content**: Access exclusive stories and in-depth content
- **Direct Sponsor Connections**: Connect directly with humanitarian sponsors
- **Advanced Analytics**: Detailed impact tracking and reporting
- **Ad-free Experience**: Clean, distraction-free interface
- **Priority Support**: Enhanced customer service

### Database Features (Supabase Integration)
- **User Authentication**: Secure email/password authentication
- **User Profiles**: Customizable profiles with tokens, levels, and preferences
- **Story Management**: Create, like, and track story engagement
- **Quest System**: Complete daily quests and earn rewards
- **Leaderboards**: Community rankings and achievements
- **Donation Tracking**: Transparent donation history and verification
- **Real-time Updates**: Live data synchronization across users

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL with real-time features)
- **Authentication**: Supabase Auth
- **Maps**: Google Maps JavaScript API
- **Subscriptions**: RevenueCat Web SDK
- **AI Voice**: ElevenLabs API
- **AI Video**: Tavus API (integration ready)
- **Blockchain**: BlockDAG Network (for ultra-fast transparency)

## Setup Instructions

### 1. Supabase Database Setup

1. **Create Supabase Project**
   - Sign up at [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project

2. **Get Project Credentials**
   - Go to Project Settings → API
   - Copy your project URL and anon key

3. **Run Database Migrations**
   - Open the SQL Editor in your Supabase dashboard
   - Run the SQL files in this order:
     1. `supabase/migrations/create_initial_schema.sql`
     2. `supabase/migrations/seed_initial_data.sql`

4. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Supabase credentials
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 2. RevenueCat Setup (Optional)

1. **Create RevenueCat Account**
   - Sign up at [RevenueCat Dashboard](https://app.revenuecat.com)
   - Create a new project for your web application

2. **Configure Products**
   - Set up subscription products (monthly/annual plans)
   - Configure entitlements (e.g., "premium" entitlement)
   - Set up offerings and packages

3. **Get API Key**
   - Go to your RevenueCat Dashboard → Your Project → API Keys
   - Copy the "Public API Key (Web Billing)"
   - Add it to your .env file:
   ```env
   VITE_REVENUECAT_API_KEY=your_web_billing_api_key_here
   ```

### 3. ElevenLabs Setup (Optional)

1. **Create ElevenLabs Account**
   - Sign up at [ElevenLabs](https://elevenlabs.io)
   - Get your API key from the profile section

2. **Add to Environment**
   ```env
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ```

### 4. Google Maps Setup (Optional)

1. **Get Google Maps API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable Maps JavaScript API
   - Create an API key

2. **Add to Environment**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

## Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Database Schema

The Supabase database includes the following main tables:

- **profiles**: User profiles and preferences
- **stories**: Humanitarian stories and content
- **projects**: Humanitarian projects and campaigns
- **donations**: Donation tracking and transparency
- **quests**: Daily quests and gamification
- **user_quest_completions**: Quest completion tracking
- **leaderboard_entries**: Community leaderboard data
- **voice_generations**: AI voice generation history
- **video_generations**: AI video generation history
- **comments**: User comments and interactions
- **story_likes**: Story likes and engagement

## Key Features

### Authentication & Profiles
- Email/password authentication via Supabase Auth
- User profiles with tokens, levels, and preferences
- Automatic profile creation on signup
- Secure row-level security (RLS) policies

### Gamification System
- Daily quests with token rewards
- User levels based on token accumulation
- Community leaderboards
- Achievement tracking

### Story Management
- Create and publish humanitarian stories
- AI voice generation for stories
- Like and engagement tracking
- Premium content access control

### Donation Transparency
- BlockDAG-verified donations with ultra-fast confirmation
- Real-time donation tracking
- Project funding progress
- Anonymous donation options

### Real-time Features
- Live story updates
- Real-time leaderboard changes
- Instant quest completion feedback
- Community engagement notifications

## Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: RevenueCat Web API Key
VITE_REVENUECAT_API_KEY=your_web_billing_api_key_here

# Optional: ElevenLabs API Key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Optional: Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Project Structure

```
src/
├── components/
│   ├── GlobalImpactMap.tsx      # Interactive world map
│   ├── TavusVideoIntegration.tsx # AI video generation
│   ├── SupabaseAuth.tsx         # Authentication component
│   ├── SupabaseSetup.tsx        # Database setup guide
│   ├── SubscriptionPaywall.tsx  # RevenueCat paywall
│   ├── SubscriptionStatus.tsx   # Subscription status display
│   ├── VoicePlayer.tsx          # ElevenLabs voice player
│   ├── AlgorandWallet.tsx       # Blockchain wallet
│   └── ...
├── hooks/
│   ├── useSupabase.ts           # Supabase integration hook
│   ├── useRevenueCat.ts         # RevenueCat integration hook
│   ├── useElevenLabs.ts         # ElevenLabs integration hook
│   └── useAlgorand.ts           # Algorand integration hook
├── services/
│   ├── SupabaseService.ts       # Supabase service layer
│   ├── RevenueCatService.ts     # RevenueCat service layer
│   ├── ElevenLabsService.ts     # ElevenLabs service layer
│   └── AlgorandService.ts       # Algorand service layer
└── App.tsx                      # Main application component
```

## Deployment Notes

1. **Environment Variables**: Ensure all required environment variables are set in your deployment environment
2. **Supabase Configuration**: Make sure your Supabase project is properly configured with the database schema
3. **RevenueCat Configuration**: Add your deployment domain to RevenueCat's allowed domains list
4. **Database Migrations**: Run all SQL migrations in your Supabase project
5. **Row Level Security**: Verify that RLS policies are properly configured for data security

## Troubleshooting

### Database Issues
- Ensure all migrations are run in the correct order
- Check that RLS policies are enabled and configured
- Verify environment variables are correctly set

### Authentication Issues
- Make sure Supabase Auth is properly configured
- Check that email confirmation is disabled (or configured as needed)
- Verify API keys are correct and have proper permissions

### "Invalid API key" Errors
- For RevenueCat: Use "Public API Key (Web Billing)" not iOS/Android keys
- For ElevenLabs: Ensure you have sufficient credits and valid API key
- For Supabase: Check that the anon key matches your project

## Support

- **Supabase**: [Documentation](https://supabase.com/docs)
- **RevenueCat**: [Web SDK Guide](https://docs.revenuecat.com/docs/web)
- **ElevenLabs**: [API Documentation](https://elevenlabs.io/docs)
- **BlockDAG**: [Developer Portal](https://blockdag.network/developers)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
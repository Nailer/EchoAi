import React, { useState } from 'react';
import { 
  Database, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Key,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

interface SupabaseSetupProps {
  onContinueWithoutSupabase: () => void;
}

export default function SupabaseSetup({ onContinueWithoutSupabase }: SupabaseSetupProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const setupSteps = [
    {
      title: "Create Supabase Project",
      description: "Sign up for a free Supabase account and create a new project",
      action: "Go to Supabase Dashboard",
      url: "https://supabase.com/dashboard"
    },
    {
      title: "Get Project Credentials",
      description: "Copy your project URL and anon key from the API settings",
      action: "Project Settings → API",
      url: null
    },
    {
      title: "Set Environment Variables",
      description: "Add your Supabase credentials to your .env file",
      action: "Update .env file",
      url: null
    },
    {
      title: "Run Database Migrations",
      description: "Execute the SQL migrations to set up the database schema",
      action: "Run migrations",
      url: null
    }
  ];

  const envExample = `# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here`;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Supabase Database Setup</h1>
          <p className="text-gray-400 text-lg">
            Set up your Supabase database to enable full EchoAid functionality
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white text-sm">Secure Authentication</h3>
            <p className="text-xs text-gray-400 mt-1">User accounts & profiles</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <Database className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white text-sm">Real-time Data</h3>
            <p className="text-xs text-gray-400 mt-1">Live updates & sync</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white text-sm">Gamification</h3>
            <p className="text-xs text-gray-400 mt-1">Quests & leaderboards</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
            <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white text-sm">Global Community</h3>
            <p className="text-xs text-gray-400 mt-1">Stories & donations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Setup Steps */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-400" />
              <span>Setup Steps</span>
            </h2>

            <div className="space-y-4">
              {setupSteps.map((step, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                    {step.url && (
                      <a
                        href={step.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm mt-2 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{step.action}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-6">
            {/* Environment Variables */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Key className="w-5 h-5 text-green-400" />
                <span>Environment Variables</span>
              </h3>

              <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Add to your .env file:</span>
                  <button
                    onClick={() => handleCopy(envExample, 'env')}
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {copied === 'env' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {envExample}
                </pre>
              </div>

              <div className="mt-4 p-3 bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg">
                <div className="flex items-start space-x-2 text-yellow-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Important</p>
                    <p className="text-xs mt-1">
                      Make sure to use your actual Supabase project URL and anon key, not the example values.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Database Schema */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Database className="w-5 h-5 text-purple-400" />
                <span>Database Schema</span>
              </h3>

              <p className="text-gray-400 text-sm mb-4">
                The database migrations will create the following tables:
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  'profiles', 'stories', 'projects', 'donations',
                  'quests', 'leaderboard', 'voice_generations', 'video_generations'
                ].map((table) => (
                  <div key={table} className="bg-gray-700 rounded px-3 py-2 text-gray-300">
                    {table}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-900 bg-opacity-50 border border-blue-600 rounded-lg">
                <div className="flex items-start space-x-2 text-blue-200">
                  <Database className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Auto-Migration</p>
                    <p className="text-xs mt-1">
                      Run the SQL files in the supabase/migrations folder in your Supabase SQL editor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Open Supabase Dashboard</span>
          </a>

          <button
            onClick={onContinueWithoutSupabase}
            className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 border border-gray-600"
          >
            Continue Without Database
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Without Supabase, user authentication, data persistence, and community features will not be available.
          </p>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { 
  Shield, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  CheckCircle,
  RefreshCw,
  Eye,
  Activity,
  Zap
} from 'lucide-react';
import { useBlockDAG } from '../hooks/useBlockDAG';

export default function BlockchainTransparency() {
  const { totalDonations, recentDonations, networkStats, isLoading, refreshData } = useBlockDAG();
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTxId = (txId: string) => {
    return `${txId.slice(0, 8)}...${txId.slice(-8)}`;
  };

  const parseNote = (note: string) => {
    try {
      const parsed = JSON.parse(note);
      return {
        projectId: parsed.projectId || 'Unknown',
        message: parsed.message || '',
      };
    } catch {
      return { projectId: 'Unknown', message: '' };
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span>BlockDAG Transparency</span>
        </h3>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg p-4 text-center">
          <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-white">
            {totalDonations.total.toLocaleString()} BDAG
          </div>
          <div className="text-xs text-green-300">Total Raised</div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-4 text-center">
          <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-white">{totalDonations.count}</div>
          <div className="text-xs text-blue-300">Donations</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-4 text-center">
          <Activity className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-lg font-bold text-white">{networkStats.tps.toLocaleString()}</div>
          <div className="text-xs text-purple-300">TPS</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">Recent Donations</h4>
          <button
            onClick={() => setShowAllTransactions(!showAllTransactions)}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>{showAllTransactions ? 'Show Less' : 'View All'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {(showAllTransactions ? recentDonations : recentDonations.slice(0, 3)).map((donation, index) => {
            const noteData = parseNote(donation.note);
            
            return (
              <div key={donation.txId} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white font-semibold">
                      {donation.amount} BDAG
                    </span>
                    <span className="text-gray-400 text-sm">
                      to {noteData.projectId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(donation.timestamp)}</span>
                  </div>
                </div>
                
                {noteData.message && (
                  <p className="text-gray-300 text-sm mb-2 italic">
                    "{noteData.message}"
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    From: {donation.sender.slice(0, 8)}...{donation.sender.slice(-8)}
                  </div>
                  <button
                    onClick={() => window.open(`https://testnet.algoexplorer.io/tx/${donation.txId}`, '_blank')}
                    onClick={() => window.open(`https://testnet.blockdag.network/tx/${donation.txId}`, '_blank')}
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{formatTxId(donation.txId)}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {recentDonations.length === 0 && (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No donations recorded yet</p>
            <p className="text-gray-500 text-sm mt-1">
              All donations will be transparently tracked on the BlockDAG network
            </p>
          </div>
        )}
      </div>

      {/* Network Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <div className="text-sm font-bold text-white">{networkStats.avgConfirmationTime}s</div>
          <div className="text-xs text-gray-400">Avg Confirmation</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <div className="text-sm font-bold text-white">{(networkStats.dagSize / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-gray-400">DAG Blocks</div>
        </div>
      </div>

      {/* BlockDAG Info */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Powered by BlockDAG Network</span>
          </div>
          <button
            onClick={() => window.open('https://testnet.blockdag.network/', '_blank')}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Explorer</span>
          </button>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <span className="text-gray-400">Network:</span> BlockDAG Testnet
          </div>
          <div>
            <span className="text-gray-400">Confirmation:</span> ~{networkStats.avgConfirmationTime} seconds
          </div>
        </div>
      </div>
    </div>
  );
}
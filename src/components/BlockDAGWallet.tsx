import React, { useState } from 'react';
import { 
  Wallet, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Zap,
  Shield,
  RefreshCw,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useBlockDAG } from '../hooks/useBlockDAG';

export default function BlockDAGWallet() {
  const {
    wallet,
    balance,
    isConnecting,
    error,
    networkStats,
    connectWallet,
    disconnectWallet,
    refreshData,
  } = useBlockDAG();

  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  if (!wallet) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Connect BlockDAG Wallet</h3>
          <p className="text-gray-400 text-sm mb-6">
            Connect your wallet to make ultra-fast, secure donations on the BlockDAG network
          </p>

          {/* Network Stats Preview */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-700 rounded-lg p-3 text-center">
              <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-white">{formatNumber(networkStats.tps)}</div>
              <div className="text-xs text-gray-400">TPS</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-center">
              <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-white">{networkStats.avgConfirmationTime}s</div>
              <div className="text-xs text-gray-400">Confirmation</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 text-red-200">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => connectWallet('blockdag-wallet')}
              disabled={isConnecting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>Connect BlockDAG Wallet</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => connectWallet('metamask')}
                disabled={isConnecting}
                className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold text-white transition-all duration-200 text-sm disabled:opacity-50"
              >
                MetaMask
              </button>
              <button
                onClick={() => connectWallet('walletconnect')}
                disabled={isConnecting}
                className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold text-white transition-all duration-200 text-sm disabled:opacity-50"
              >
                WalletConnect
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-green-400" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>Ultra-Fast</span>
              </div>
              <div className="flex items-center space-x-1">
                <Activity className="w-3 h-3 text-purple-400" />
                <span>DAG Technology</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-6 border border-purple-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">BlockDAG Wallet</h3>
            <p className="text-purple-200 text-sm capitalize">{wallet.provider} connected</p>
          </div>
        </div>
        <button
          onClick={refreshData}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-200 text-sm">Wallet Address</span>
            <button
              onClick={handleCopyAddress}
              className="flex items-center space-x-1 text-purple-300 hover:text-white transition-colors"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-white font-mono text-sm">{formatAddress(wallet.address)}</p>
        </div>

        <div className="bg-white bg-opacity-10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-purple-200 text-sm">Balance</span>
            <div className="text-right">
              <p className="text-white font-bold text-lg">{balance.toFixed(2)} BDAG</p>
              <p className="text-purple-300 text-xs">≈ ${(balance * 0.15).toFixed(2)} USD</p>
            </div>
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
            <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">{formatNumber(networkStats.tps)}</div>
            <div className="text-xs text-purple-300">TPS</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
            <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <div className="text-sm font-bold text-white">{networkStats.avgConfirmationTime}s</div>
            <div className="text-xs text-purple-300">Confirmation</div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => window.open(`https://testnet.blockdag.network/address/${wallet.address}`, '_blank')}
            className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View on Explorer</span>
          </button>
          <button
            onClick={disconnectWallet}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 text-sm"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
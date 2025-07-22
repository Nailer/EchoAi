import { useState, useEffect, useCallback } from 'react';
import BlockDAGService, { WalletConnection, DonationTransaction } from '../services/BlockDAGService';

interface UseBlockDAGReturn {
  wallet: WalletConnection | null;
  balance: number;
  isConnecting: boolean;
  isLoading: boolean;
  error: string | null;
  totalDonations: { total: number; count: number };
  recentDonations: DonationTransaction[];
  networkStats: {
    tps: number;
    avgConfirmationTime: number;
    totalTransactions: number;
    dagSize: number;
  };
  connectWallet: (provider?: 'blockdag-wallet' | 'metamask' | 'walletconnect') => Promise<void>;
  disconnectWallet: () => void;
  sendDonation: (amount: number, projectId: string, message?: string) => Promise<string>;
  refreshData: () => Promise<void>;
}

export function useBlockDAG(): UseBlockDAGReturn {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDonations, setTotalDonations] = useState({ total: 0, count: 0 });
  const [recentDonations, setRecentDonations] = useState<DonationTransaction[]>([]);
  const [networkStats, setNetworkStats] = useState({
    tps: 0,
    avgConfirmationTime: 0,
    totalTransactions: 0,
    dagSize: 0,
  });

  const blockdagService = BlockDAGService.getInstance();

  // Initialize BlockDAG service
  useEffect(() => {
    const initializeService = async () => {
      try {
        const config = blockdagService.getTestnetConfig();
        blockdagService.initialize(config);
        await loadDonationData();
        await loadNetworkStats();
      } catch (err) {
        console.error('Failed to initialize BlockDAG service:', err);
        setError('Failed to initialize blockchain connection');
      } finally {
        setIsLoading(false);
      }
    };

    initializeService();
  }, []);

  const loadDonationData = useCallback(async () => {
    try {
      const [donations, history] = await Promise.all([
        blockdagService.getTotalDonations(),
        blockdagService.getDonationHistory(10),
      ]);
      
      setTotalDonations(donations);
      setRecentDonations(history);
    } catch (err) {
      console.error('Failed to load BlockDAG donation data:', err);
    }
  }, []);

  const loadNetworkStats = useCallback(async () => {
    try {
      const stats = await blockdagService.getNetworkStats();
      setNetworkStats(stats);
    } catch (err) {
      console.error('Failed to load BlockDAG network stats:', err);
    }
  }, []);

  const connectWallet = useCallback(async (provider: 'blockdag-wallet' | 'metamask' | 'walletconnect' = 'blockdag-wallet') => {
    try {
      setIsConnecting(true);
      setError(null);

      const connection = await blockdagService.connectWallet(provider);
      setWallet(connection);

      // Get wallet balance
      const walletBalance = await blockdagService.getAccountBalance(connection.address);
      setBalance(walletBalance);
    } catch (err: any) {
      setError(err.message || 'Failed to connect BlockDAG wallet');
      console.error('BlockDAG wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    blockdagService.disconnectWallet();
    setWallet(null);
    setBalance(0);
    setError(null);
  }, []);

  const sendDonation = useCallback(async (amount: number, projectId: string, message?: string): Promise<string> => {
    if (!wallet) {
      throw new Error('No wallet connected');
    }

    try {
      setError(null);

      // Create transaction
      const transaction = await blockdagService.createDonationTransaction(amount, projectId, message);
      
      // Sign and send transaction
      const txId = await blockdagService.signAndSendTransaction(transaction);
      
      // Refresh data after successful donation
      await Promise.all([
        loadDonationData(),
        blockdagService.getAccountBalance(wallet.address).then(setBalance),
      ]);

      return txId;
    } catch (err: any) {
      const errorMessage = err.message || 'Donation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [wallet, loadDonationData]);

  const refreshData = useCallback(async () => {
    try {
      setError(null);
      await Promise.all([
        loadDonationData(),
        loadNetworkStats(),
      ]);
      
      if (wallet) {
        const walletBalance = await blockdagService.getAccountBalance(wallet.address);
        setBalance(walletBalance);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to refresh data');
    }
  }, [wallet, loadDonationData, loadNetworkStats]);

  return {
    wallet,
    balance,
    isConnecting,
    isLoading,
    error,
    totalDonations,
    recentDonations,
    networkStats,
    connectWallet,
    disconnectWallet,
    sendDonation,
    refreshData,
  };
}
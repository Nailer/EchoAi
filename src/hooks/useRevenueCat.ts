import { useState, useEffect, useCallback } from 'react';
import RevenueCatService, { SubscriptionStatus } from '../services/RevenueCatService';

interface UseRevenueCatReturn {
  subscriptionStatus: SubscriptionStatus;
  isLoading: boolean;
  error: string | null;
  refreshStatus: () => Promise<void>;
  showPaywall: () => void;
  hidePaywall: () => void;
  isPaywallVisible: boolean;
}

export function useRevenueCat(apiKey: string, userId?: string): UseRevenueCatReturn {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isActive: false,
    isPremium: false,
    expirationDate: null,
    productIdentifier: null,
    entitlements: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaywallVisible, setIsPaywallVisible] = useState(false);

  const revenueCat = RevenueCatService.getInstance();

  const initializeRevenueCat = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!revenueCat.isInitialized()) {
        await revenueCat.initialize(apiKey, userId);
      }

      const status = revenueCat.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (err) {
      console.error('RevenueCat initialization error:', err);
      setError('Failed to initialize subscription service');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, userId]);

  const refreshStatus = useCallback(async () => {
    try {
      setError(null);
      await revenueCat.refreshCustomerInfo();
      const status = revenueCat.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (err) {
      console.error('Failed to refresh subscription status:', err);
      setError('Failed to refresh subscription status');
    }
  }, []);

  const showPaywall = useCallback(() => {
    setIsPaywallVisible(true);
  }, []);

  const hidePaywall = useCallback(() => {
    setIsPaywallVisible(false);
  }, []);

  useEffect(() => {
    initializeRevenueCat();
  }, [initializeRevenueCat]);

  return {
    subscriptionStatus,
    isLoading,
    error,
    refreshStatus,
    showPaywall,
    hidePaywall,
    isPaywallVisible,
  };
}
import React from 'react';
import { Crown, Star, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { SubscriptionStatus as ISubscriptionStatus } from '../services/RevenueCatService';

interface SubscriptionStatusProps {
  status: ISubscriptionStatus;
  onUpgrade: () => void;
  onManage: () => void;
}

export default function SubscriptionStatus({ status, onUpgrade, onManage }: SubscriptionStatusProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isExpiringSoon = (dateString: string | null) => {
    if (!dateString) return false;
    const expirationDate = new Date(dateString);
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 7 && daysUntilExpiration > 0;
  };

  if (!status.isActive) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Free Plan</h3>
          <p className="text-gray-400 text-sm mb-6">
            You're currently on the free plan. Upgrade to unlock premium features and support humanitarian causes.
          </p>
          <button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Star className="w-4 h-4" />
            <span>Upgrade to Premium</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-2xl p-6 border border-purple-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Premium Supporter</span>
              {status.isPremium && <Star className="w-5 h-5 text-yellow-400" />}
            </h3>
            <p className="text-purple-200 text-sm">Active subscription</p>
          </div>
        </div>
        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Active
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-purple-200">
            <Calendar className="w-4 h-4" />
            <span>Renewal Date</span>
          </div>
          <span className="text-white font-semibold">
            {formatDate(status.expirationDate)}
          </span>
        </div>

        {status.productIdentifier && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-purple-200">
              <CreditCard className="w-4 h-4" />
              <span>Plan</span>
            </div>
            <span className="text-white font-semibold capitalize">
              {status.productIdentifier.includes('annual') ? 'Annual' : 'Monthly'}
            </span>
          </div>
        )}

        {status.entitlements.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-purple-200">
              <Star className="w-4 h-4" />
              <span>Entitlements</span>
            </div>
            <span className="text-white font-semibold">
              {status.entitlements.join(', ')}
            </span>
          </div>
        )}
      </div>

      {isExpiringSoon(status.expirationDate) && (
        <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 text-yellow-200">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">Subscription Expiring Soon</span>
          </div>
          <p className="text-xs text-yellow-300 mt-1">
            Your subscription expires on {formatDate(status.expirationDate)}. 
            Make sure your payment method is up to date.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onManage}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm py-2 rounded-lg font-semibold text-white transition-all duration-200 text-sm"
        >
          Manage Subscription
        </button>
        <button
          onClick={onUpgrade}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 py-2 rounded-lg font-semibold text-white transition-all duration-200 text-sm"
        >
          Change Plan
        </button>
      </div>
    </div>
  );
}
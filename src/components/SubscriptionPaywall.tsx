import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Crown, 
  Check, 
  X, 
  Loader2, 
  Shield, 
  Zap, 
  Heart,
  Globe,
  Users,
  Headphones,
  Award
} from 'lucide-react';
import RevenueCatService, { OfferingData, SubscriptionStatus } from '../services/RevenueCatService';
import { PurchasesPackage } from '@revenuecat/purchases-js';

interface SubscriptionPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionChange: (status: SubscriptionStatus) => void;
}

interface PricingPlan {
  package: PurchasesPackage;
  title: string;
  description: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

export default function SubscriptionPaywall({ isOpen, onClose, onSubscriptionChange }: SubscriptionPaywallProps) {
  const [offerings, setOfferings] = useState<OfferingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const revenueCat = RevenueCatService.getInstance();

  useEffect(() => {
    if (isOpen) {
      loadOfferings();
    }
  }, [isOpen]);

  const loadOfferings = async () => {
    try {
      setLoading(true);
      setError(null);
      const offeringsData = await revenueCat.getOfferings();
      setOfferings(offeringsData);
    } catch (err) {
      setError('Failed to load subscription options. Please try again.');
      console.error('Error loading offerings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageToPurchase: PurchasesPackage) => {
    try {
      setPurchasing(packageToPurchase.identifier);
      setError(null);
      
      await revenueCat.purchasePackage(packageToPurchase);
      const subscriptionStatus = revenueCat.getSubscriptionStatus();
      
      onSubscriptionChange(subscriptionStatus);
      onClose();
    } catch (err: any) {
      if (err.code === 'PURCHASE_CANCELLED') {
        // User cancelled, don't show error
        return;
      }
      setError('Purchase failed. Please try again.');
      console.error('Purchase error:', err);
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestore = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await revenueCat.restorePurchases();
      const subscriptionStatus = revenueCat.getSubscriptionStatus();
      
      onSubscriptionChange(subscriptionStatus);
      onClose();
    } catch (err) {
      setError('No previous purchases found.');
      console.error('Restore error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPricingPlans = (): PricingPlan[] => {
    if (!offerings.length) return [];

    const currentOffering = offerings[0];
    const plans: PricingPlan[] = [];

    currentOffering.packages.forEach((pkg) => {
      const product = pkg.product;
      let title = 'Premium';
      let description = 'Monthly access';
      let savings = '';
      let popular = false;

      // Determine plan type based on package identifier or product identifier
      if (pkg.identifier.includes('annual') || pkg.identifier.includes('yearly')) {
        title = 'Premium Annual';
        description = 'Best value - yearly access';
        savings = 'Save 40%';
        popular = true;
      } else if (pkg.identifier.includes('monthly')) {
        title = 'Premium Monthly';
        description = 'Monthly access';
      }

      plans.push({
        package: pkg,
        title,
        description,
        popular,
        savings,
        features: [
          'Unlimited story access',
          'Exclusive premium content',
          'Direct sponsor connections',
          'Advanced impact tracking',
          'Priority customer support',
          'Ad-free experience',
          'Early access to new features',
          'Community forum access'
        ]
      });
    });

    return plans.sort((a, b) => {
      // Sort by popular first, then by price (annual before monthly)
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return 0;
    });
  };

  const formatPrice = (price: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Unlock Premium Features</h2>
            <p className="text-gray-400 text-lg">
              Support humanitarian causes while accessing exclusive content and features
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-400">Loading subscription options...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">{error}</div>
              <button
                onClick={loadOfferings}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold text-white transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Premium Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white text-sm">Unlimited Stories</h3>
                  <p className="text-xs text-gray-400 mt-1">Access all humanitarian stories</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white text-sm">Global Impact</h3>
                  <p className="text-xs text-gray-400 mt-1">Track worldwide initiatives</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white text-sm">Direct Connect</h3>
                  <p className="text-xs text-gray-400 mt-1">Connect with sponsors</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white text-sm">Premium Support</h3>
                  <p className="text-xs text-gray-400 mt-1">Priority assistance</p>
                </div>
              </div>

              {/* Pricing Plans */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {getPricingPlans().map((plan, index) => (
                  <div
                    key={plan.package.identifier}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-200 ${
                      plan.popular
                        ? 'border-gradient-to-r from-blue-500 to-purple-600 bg-gradient-to-r from-blue-900/20 to-purple-900/20'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {plan.savings && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {plan.savings}
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                      
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-white">
                          {formatPrice(plan.package.product.price, plan.package.product.currencyCode)}
                        </span>
                        <span className="text-gray-400 ml-2">
                          /{plan.package.identifier.includes('annual') ? 'year' : 'month'}
                        </span>
                      </div>

                      {plan.package.identifier.includes('annual') && (
                        <p className="text-sm text-green-400">
                          Just {formatPrice(plan.package.product.price / 12, plan.package.product.currencyCode)}/month
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePurchase(plan.package)}
                      disabled={purchasing === plan.package.identifier}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {purchasing === plan.package.identifier ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Subscribe Now</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <X className="w-4 h-4 text-blue-400" />
                    <span>Cancel Anytime</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>Support Humanitarian Causes</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="text-center space-y-4">
                <button
                  onClick={handleRestore}
                  disabled={loading}
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm underline"
                >
                  Restore Previous Purchase
                </button>
                
                <p className="text-xs text-gray-500">
                  By subscribing, you agree to our Terms of Service and Privacy Policy. 
                  Subscriptions auto-renew unless cancelled 24 hours before renewal.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
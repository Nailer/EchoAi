import { 
  Purchases,
  PurchasesOffering, 
  PurchasesPackage, 
  CustomerInfo,
  PurchasesEntitlementInfo
} from '@revenuecat/purchases-js';

export interface SubscriptionStatus {
  isActive: boolean;
  isPremium: boolean;
  expirationDate: string | null;
  productIdentifier: string | null;
  entitlements: string[];
}

export interface OfferingData {
  identifier: string;
  serverDescription: string;
  packages: PurchasesPackage[];
}

class RevenueCatService {
  private static instance: RevenueCatService;
  private _isInitialized = false;
  private currentCustomerInfo: CustomerInfo | null = null;

  private constructor() {}

  static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  async initialize(apiKey: string, userId?: string): Promise<void> {
    if (this._isInitialized) return;

    try {
      // Configure RevenueCat
      await Purchases.configure({
        apiKey: apiKey,
        appUserId: userId || undefined,
      });

      // Set log level for debugging (remove in production)
      Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

      this._isInitialized = true;
      console.log('RevenueCat initialized successfully');

      // Get initial customer info
      await this.refreshCustomerInfo();
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async refreshCustomerInfo(): Promise<CustomerInfo> {
    try {
      this.currentCustomerInfo = await Purchases.getCustomerInfo();
      return this.currentCustomerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  }

  async getOfferings(): Promise<OfferingData[]> {
    try {
      const offerings = await Purchases.getOfferings();
      
      return Object.values(offerings.all).map((offering: PurchasesOffering) => ({
        identifier: offering.identifier,
        serverDescription: offering.serverDescription,
        packages: offering.availablePackages,
      }));
    } catch (error) {
      console.error('Failed to get offerings:', error);
      throw error;
    }
  }

  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<CustomerInfo> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      this.currentCustomerInfo = customerInfo;
      return customerInfo;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    try {
      this.currentCustomerInfo = await Purchases.restorePurchases();
      return this.currentCustomerInfo;
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }

  getSubscriptionStatus(): SubscriptionStatus {
    if (!this.currentCustomerInfo) {
      return {
        isActive: false,
        isPremium: false,
        expirationDate: null,
        productIdentifier: null,
        entitlements: [],
      };
    }

    const entitlements = this.currentCustomerInfo.entitlements.active;
    const premiumEntitlement = entitlements['premium'] as PurchasesEntitlementInfo;
    
    const activeEntitlements = Object.keys(entitlements);
    const isActive = activeEntitlements.length > 0;
    const isPremium = !!premiumEntitlement;

    return {
      isActive,
      isPremium,
      expirationDate: premiumEntitlement?.expirationDate || null,
      productIdentifier: premiumEntitlement?.productIdentifier || null,
      entitlements: activeEntitlements,
    };
  }

  async setUserId(userId: string): Promise<void> {
    try {
      await Purchases.logIn(userId);
      await this.refreshCustomerInfo();
    } catch (error) {
      console.error('Failed to set user ID:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await Purchases.logOut();
      this.currentCustomerInfo = null;
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this._isInitialized;
  }

  getCurrentCustomerInfo(): CustomerInfo | null {
    return this.currentCustomerInfo;
  }
}

export default RevenueCatService;
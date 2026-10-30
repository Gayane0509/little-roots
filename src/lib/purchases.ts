export interface Plan {
  id: 'yearly' | 'monthly';
  title: string;
  priceLabel: string;
  perMonthLabel?: string;
  trialDays?: number;
}
export interface PurchasesService {
  getPlans(): Promise<Plan[]>;
  purchase(planId: Plan['id']): Promise<'success' | 'cancelled' | 'unavailable'>;
  restore(): Promise<boolean>;
}
const plans: Plan[] = [
  { id: 'yearly', title: 'Yearly', priceLabel: '$34.99', perMonthLabel: '$2.92/month', trialDays: 7 },
  { id: 'monthly', title: 'Monthly', priceLabel: '$4.99' },
];
let devPurchased = false;
export const devProvider: PurchasesService = {
  async getPlans() { return plans; },
  async purchase(planId) { if (!plans.some((plan) => plan.id === planId)) return 'unavailable'; devPurchased = true; return 'success'; },
  async restore() { return devPurchased; },
};
export const unavailableProvider: PurchasesService = {
  async getPlans() { return plans; },
  async purchase() { return 'unavailable'; },
  async restore() { return false; },
};
// TODO: Replace the production provider with StoreKit / Play Billing (for example RevenueCat) once store products exist.
export function getPurchases(onPremium?: (value: boolean) => Promise<void>): PurchasesService {
  if (!__DEV__) return unavailableProvider;
  if (!onPremium) return devProvider;
  return {
    getPlans: () => devProvider.getPlans(),
    async purchase(planId) { const result = await devProvider.purchase(planId); if (result === 'success') await onPremium(true); return result; },
    async restore() { const restored = await devProvider.restore(); if (restored) await onPremium(true); return restored; },
  };
}

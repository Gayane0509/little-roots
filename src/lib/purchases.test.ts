import { expect, test, jest } from '@jest/globals';
import { devProvider, getPurchases, unavailableProvider } from './purchases';
test('plans and unavailable production service have honest results', async () => {
  const plans = await unavailableProvider.getPlans();
  expect(plans.map((p) => p.id)).toEqual(['yearly', 'monthly']);
  expect(await unavailableProvider.purchase('yearly')).toBe('unavailable');
  expect(await unavailableProvider.restore()).toBe(false);
});
test('dev purchase activates family premium and can restore', async () => {
  const activate = jest.fn(async (_value: boolean) => {});
  const purchases = getPurchases(activate);
  expect(getPurchases()).toBe(__DEV__ ? devProvider : unavailableProvider);
  if (!__DEV__) return;
  expect(await purchases.purchase('yearly')).toBe('success');
  expect(activate).toHaveBeenCalledWith(true);
  expect(await purchases.restore()).toBe(true);
  expect(activate).toHaveBeenCalledTimes(2);
});

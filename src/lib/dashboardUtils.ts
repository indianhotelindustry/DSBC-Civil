/**
 * @deprecated Use functions from './financialCalcs' directly.
 * This file is kept for backward compatibility only.
 */
export { calculateDashboardKPIs, dailyForecast } from './financialCalcs';
export type { DashboardKPIs } from '../types';
export type { ForecastDataPoint } from './financialCalcs';

import { Bill } from '../types';
import { dailyForecast } from './financialCalcs';

/** @deprecated Use dailyForecast(bills, 30) instead */
export function getExpectedPaymentsChartData(bills: Bill[]) {
  return dailyForecast(bills, 30);
}

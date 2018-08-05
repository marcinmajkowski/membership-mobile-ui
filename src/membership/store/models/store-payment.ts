import { Iso8601String } from '../../models';

export interface StorePayment {
  id: string;
  customerId: string;
  amount: number;
  timestamp: Iso8601String;
}

import { Iso8601String } from '../../models/iso-8601-string.model';

export interface ApiPayment {
  id: string;
  customerId: string;
  amount: number;
  timestamp: Iso8601String;
}

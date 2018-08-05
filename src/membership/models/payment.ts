import { Customer } from './customer.model';
import { Iso8601String } from './iso-8601-string.model';

export interface Payment {
  id: string;
  customer: Customer;
  amount: number;
  timestamp: Iso8601String;
}

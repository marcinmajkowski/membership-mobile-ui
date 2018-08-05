import { Iso8601String } from './iso-8601-string.model';
import { Customer } from './customer.model';

export interface CheckIn {
  id: string;
  // TODO consider separate interface for CheckIn state and CheckIn model
  customer: CustomerReference | Customer;
  timestamp: Iso8601String;
}

export interface CustomerReference {
  id: string;
}

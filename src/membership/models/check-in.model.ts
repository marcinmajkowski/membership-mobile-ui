import { Iso8601String } from './iso-8601-string.model';

export interface CheckIn {
  id: number;
  // FIXME keep only customerId here, use selector to get customer so it will become null after customer is deleted
  customer: CheckInCustomer;
  timestamp: Iso8601String;
}

export interface CheckInCustomer {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

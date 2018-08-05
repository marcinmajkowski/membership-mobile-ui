import { Iso8601String } from '../../models/iso-8601-string.model';

export interface StoreCheckIn {
  id: number;
  customerId: number;
  timestamp: Iso8601String;
}

import { Iso8601String } from '../../models/iso-8601-string.model';

export interface ApiCheckIn {
  id: number;
  customerId: number;
  timestamp: Iso8601String;
}

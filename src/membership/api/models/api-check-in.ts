import { Iso8601String } from '../../models/iso-8601-string.model';

export interface ApiCheckIn {
  id: string;
  customerId: string;
  timestamp: Iso8601String;
}

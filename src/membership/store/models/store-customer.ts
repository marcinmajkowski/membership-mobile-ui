import { StoreCard } from './store-card';

export interface StoreCustomer {
  id: number;
  firstName: string;
  lastName: string;
  cards: StoreCard[];
}

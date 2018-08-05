import { StoreCard } from './store-card';

export interface StoreCustomer {
  id: string;
  firstName: string;
  lastName: string;
  cards: StoreCard[];
}

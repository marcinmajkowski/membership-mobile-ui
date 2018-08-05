import { ApiCard } from './api-card';

export interface ApiCustomer {
  id: string;
  firstName: string;
  lastName: string;
  cards: ApiCard[];
}

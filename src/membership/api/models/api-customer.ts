import { ApiCard } from './api-card';

export interface ApiCustomer {
  id: number;
  firstName: string;
  lastName: string;
  cards: ApiCard[];
}

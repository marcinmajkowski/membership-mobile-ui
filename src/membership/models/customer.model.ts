export interface Card {
  id: string;
  code: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  cards: Card[];
}

export interface CreateCustomerForm {
  firstName: string;
  lastName: string;
  cardCode: string;
}

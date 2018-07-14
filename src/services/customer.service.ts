import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

interface CardData {
  id: number;
  code: string;
}

export class Card {
  private constructor(
    public id: number,
    public code: string,
  ) {
  }

  static fromData(data: CardData): Card {
    return new Card(
      data.id,
      data.code,
    );
  }
}

interface CustomerData {
  id: number;
  firstName: string;
  lastName: string;
  cards: CardData[];
}

export class Customer {
  private constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public cards: Card[],
  ) {
  }

  getFullName(): string {
    if (this.lastName.length > 0) {
      return `${this.firstName} ${this.lastName}`;
    } else {
      return this.firstName;
    }
  }

  static fromData(data: CustomerData): Customer {
    return new Customer(
      data.id,
      data.firstName,
      data.lastName,
      data.cards.map(Card.fromData),
    );
  }
}

interface CreateCustomerRequest {
  firstName: string;
  lastName?: string;
  cardCode?: string;
}

@Injectable()
export class CustomerService {

  private customersSubject = new BehaviorSubject<Customer[]>([]);
  customers$ = this.customersSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  createCustomer(firstName: string, lastName?: string, cardCode?: string): Observable<Customer> {
    const createCustomerRequest: CreateCustomerRequest = {
      firstName,
      lastName,
      cardCode,
    };
    return this.httpClient.post<CustomerData>('/api/customers', createCustomerRequest).pipe(
      map(Customer.fromData),
      tap(customer => this.customersSubject.next([customer, ...this.customersSubject.getValue()]))
    );
  }

  loadCustomers(): Observable<Customer[]> {
    return this.httpClient.get<{ customers: CustomerData[] }>('/api/customers').pipe(
      map(response => response.customers.map(Customer.fromData)),
      tap(customers => this.customersSubject.next(customers))
    );
  }
}

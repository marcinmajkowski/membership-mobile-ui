import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  public fullName: string;

  private constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public cards: Card[],
  ) {
    this.fullName = lastName.length > 0 ? `${firstName} ${lastName}` : firstName;
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

export interface CreateCustomerForm {
  firstName: string;
  lastName: string;
  cardCode: string;
}

@Injectable()
export class CustomerService {

  private customersSubject = new BehaviorSubject<Customer[]>([]);
  customers$ = this.customersSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  createCustomer(createCustomerForm: CreateCustomerForm): Observable<Customer> {
    return this.httpClient.post<CustomerData>('/api/customers', createCustomerForm).pipe(
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

  getCustomers(): Observable<Customer[]> {
    return this.httpClient.get<{ customers: CustomerData[] }>('/api/customers').pipe(
      map(response => response.customers.map(Customer.fromData)),
    );
  }

  findCustomersByCardCode(cardCode: string): Observable<Customer[]> {
    const params = new HttpParams()
      .append('card_code', cardCode);
    return this.httpClient.get<{ customers: CustomerData[] }>('/api/customers', {params}).pipe(
      map(response => response.customers.map(Customer.fromData)),
    );
  }
}

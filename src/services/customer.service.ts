import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import {
  Card,
  CreateCustomerForm,
  Customer,
} from '../membership/models/customer.model';

interface CardData {
  id: string;
  code: string;
}

interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  cards: CardData[];
}

const createFullName = (firstName: string, lastName: string): string =>
  lastName.length > 0 ? `${firstName} ${lastName}` : firstName;

const dataToCard = (data: CardData): Card => ({
  id: data.id,
  code: data.code,
});

const dataToCustomer = (data: CustomerData): Customer => ({
  id: data.id,
  firstName: data.firstName,
  lastName: data.lastName,
  cards: data.cards.map(dataToCard),
  fullName: createFullName(data.firstName, data.lastName),
});

@Injectable()
export class CustomerService {
  constructor(private httpClient: HttpClient) {}

  createCustomer(createCustomerForm: CreateCustomerForm): Observable<Customer> {
    return this.httpClient
      .post<CustomerData>('/api/customers', createCustomerForm)
      .pipe(map(dataToCustomer));
  }

  getCustomers(): Observable<Customer[]> {
    return this.httpClient
      .get<{ customers: CustomerData[] }>('/api/customers')
      .pipe(map(response => response.customers.map(dataToCustomer)));
  }

  deleteCustomer(customer: Customer): Observable<{}> {
    return this.httpClient.delete(`/api/customers/${customer.id}`);
  }

  findCustomersByCardCode(cardCode: string): Observable<Customer[]> {
    const params = new HttpParams().append('card_code', cardCode);
    return this.httpClient
      .get<{ customers: CustomerData[] }>('/api/customers', { params })
      .pipe(map(response => response.customers.map(dataToCustomer)));
  }
}

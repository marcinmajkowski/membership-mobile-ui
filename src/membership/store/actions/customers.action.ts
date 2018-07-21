import { Action } from '@ngrx/store';
import { Customer } from '../../../services/customer.service';

export const CUSTOMER_LIST_PAGE_LOAD_CUSTOMERS = '[CustomerListPage][Customers] Load Customers';
export const LOAD_CUSTOMERS_SUCCESS = '[Customers] Load Customers Success';

export class CustomerListPageLoadCustomers implements Action {
  readonly type = CUSTOMER_LIST_PAGE_LOAD_CUSTOMERS;
}

export type LoadCustomers =
  | CustomerListPageLoadCustomers
  ;

export class LoadCustomersSuccess implements Action {
  readonly type = LOAD_CUSTOMERS_SUCCESS;

  constructor(public payload: { customers: Customer[] }) {
  }
}

export type CustomersAction =
  | LoadCustomers
  | LoadCustomersSuccess
  ;

import { Action } from '@ngrx/store';
import { CreateCustomerForm, Customer } from '../../../services/customer.service';

export const CUSTOMER_LIST_PAGE_LOAD_CUSTOMERS = '[CustomerListPage][Customers] Load Customers';
export const LOAD_CUSTOMERS_SUCCESS = '[Customers] Load Customers Success';
export const CUSTOMER_FORM_PAGE_CREATE_CUSTOMER = '[CustomerFormPage][Customers] Create Customer';
export const CREATE_CUSTOMER_SUCCESS = '[Customers] Create Customer Success';

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

export class CustomerFormPageCreateCustomer implements Action {
  readonly type = CUSTOMER_FORM_PAGE_CREATE_CUSTOMER;

  constructor(public payload: { createCustomerForm: CreateCustomerForm }) {
  }
}

export type CreateCustomer =
  | CustomerFormPageCreateCustomer
  ;

export class CreateCustomerSuccess implements Action {
  readonly type = CREATE_CUSTOMER_SUCCESS;

  constructor(public payload: { customer: Customer }) {
  }
}

export type CustomersAction =
  | LoadCustomers
  | LoadCustomersSuccess
  | CreateCustomer
  | CreateCustomerSuccess
  ;

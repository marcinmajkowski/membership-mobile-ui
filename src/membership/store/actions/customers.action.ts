import { Action } from '@ngrx/store';
import { CreateCustomerForm} from '../../models/customer.model';
import { Customer } from '../../models/customer.model';

export const CUSTOMER_LIST_PAGE_LOAD_CUSTOMERS = '[CustomerListPage][Customers] Load Customers';
export const LOAD_CUSTOMERS_SUCCESS = '[Customers] Load Customers Success';
export const CUSTOMER_FORM_PAGE_CREATE_CUSTOMER = '[CustomerFormPage][Customers] Create Customer';
export const CREATE_CUSTOMER_SUCCESS = '[Customers] Create Customer Success';
export const CUSTOMER_UPDATE_FORM_PAGE_DELETE_CUSTOMER = '[CustomerUpdateFormPage][Customers] Delete Customer';
export const DELETE_CUSTOMER_SUCCESS = '[Customers] Delete Customer Success';

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

export class CustomerUpdateFormPageDeleteCustomer implements Action {
  readonly type = CUSTOMER_UPDATE_FORM_PAGE_DELETE_CUSTOMER;

  constructor(public payload: { customer: Customer }) {
  }
}

export type DeleteCustomer =
  | CustomerUpdateFormPageDeleteCustomer
  ;

export class DeleteCustomerSuccess implements Action {
  readonly type = DELETE_CUSTOMER_SUCCESS;

  constructor(public payload: { customer: Customer }) {
  }
}

export type CustomersAction =
  | LoadCustomers
  | LoadCustomersSuccess
  | CreateCustomer
  | CreateCustomerSuccess
  | DeleteCustomer
  | DeleteCustomerSuccess
  ;

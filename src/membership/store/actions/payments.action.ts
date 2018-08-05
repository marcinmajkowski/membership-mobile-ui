import { Action } from '@ngrx/store';
import { Customer, Payment } from '../../models';
import { ApiPayment, CreatePaymentForm } from '../../api/models';

export class PaymentListPageLoadPayments implements Action {
  readonly type = '[PaymentListPage] Load Payments';
}

export class LoadPaymentsSuccess implements Action {
  readonly type = '[Api] Load Payments Success';

  constructor(public payload: { payments: ApiPayment[] }) {}
}

export class PaymentFormPageCreatePayment implements Action {
  readonly type = '[PaymentFormPage] Create Payment';

  constructor(
    public payload: {
      customer: Customer;
      createPaymentForm: CreatePaymentForm;
    },
  ) {}
}

export class CreatePaymentSuccess implements Action {
  readonly type = '[Api] Create Payment Success';

  constructor(public payload: { payment: ApiPayment }) {}
}

export class CustomerPageLoadCustomerPayments implements Action {
  readonly type = '[CustomerPage] Load Customer Payments';

  constructor(public payload: { customer: Customer }) {}
}

export class LoadCustomerPaymentsSuccess implements Action {
  readonly type = '[Api] Load Customer Payments Success';

  constructor(public payload: { payments: ApiPayment[]; customerId: string }) {}
}

export class PaymentListPageDeletePayment implements Action {
  readonly type = '[PaymentListPage] Delete Payment';

  constructor(public payload: { payment: Payment }) {}
}

export class CustomerPageDeletePayment implements Action {
  readonly type = '[CustomerPage] Delete Payment';

  constructor(public payload: { payment: Payment }) {}
}

export class DeletePaymentSuccess implements Action {
  readonly type = '[Api] Delete Payment Success';

  constructor(public payload: { payment: ApiPayment }) {}
}

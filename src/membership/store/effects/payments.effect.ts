import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import * as paymentsActions from '../actions/payments.action';
import { concatMap, map, switchMap, switchMapTo } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { ofAction } from 'ngrx-action-operators';
import { ApiPaymentService } from '../../api';

@Injectable()
export class PaymentsEffects {
  @Effect()
  loadPayments$: Observable<Action> = this.actions$.pipe(
    ofAction(paymentsActions.PaymentListPageLoadPayments),
    switchMapTo(
      this.paymentService.getPayments().pipe(
        // TODO handle customers
        map(response => response.payments),
        map(payments => new paymentsActions.LoadPaymentsSuccess({ payments })),
        // TODO catchError
      ),
    ),
  );

  // TODO load and force load actions
  @Effect()
  loadCustomerPayments$: Observable<Action> = this.actions$.pipe(
    ofAction(paymentsActions.CustomerPageLoadCustomerPayments),
    map(action => action.payload.customer.id),
    switchMap(customerId =>
      this.paymentService.getCustomerPayments(customerId).pipe(
        map(
          payments =>
            new paymentsActions.LoadCustomerPaymentsSuccess({
              payments,
              customerId,
            }),
        ),
        // TODO catchError
      ),
    ),
  );

  @Effect()
  createPayment$: Observable<Action> = this.actions$.pipe(
    ofAction(paymentsActions.PaymentFormPageCreatePayment),
    map(action => action.payload),
    concatMap(({ customer, createPaymentForm }) =>
      this.paymentService.createPayment(customer.id, createPaymentForm).pipe(
        map(payment => new paymentsActions.CreatePaymentSuccess({ payment })),
        // TODO catchError
      ),
    ),
  );

  @Effect()
  deletePayment$: Observable<Action> = this.actions$.pipe(
    ofAction(
      paymentsActions.PaymentListPageDeletePayment,
      paymentsActions.CustomerPageDeletePayment,
    ),
    map(action => action.payload.payment.id),
    switchMap(id =>
      this.paymentService.deletePayment(id).pipe(
        map(payment => new paymentsActions.DeletePaymentSuccess({ payment })),
        // TODO catchError
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private paymentService: ApiPaymentService,
  ) {}
}

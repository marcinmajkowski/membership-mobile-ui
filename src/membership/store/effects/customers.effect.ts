import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CustomerService } from '../../../services/customer.service';

import * as customersActions from '../actions/customers.action';
import { Observable } from 'rxjs/Observable';
import { map, mapTo, switchMap, switchMapTo } from 'rxjs/operators';
import { Action } from '@ngrx/store';

@Injectable()
export class CustomersEffects {

  constructor(private actions$: Actions,
              private customerService: CustomerService) {
  }

  @Effect()
  loadCustomers$: Observable<Action> = this.actions$.pipe(
    ofType<customersActions.LoadCustomers>(customersActions.CUSTOMER_LIST_PAGE_LOAD_CUSTOMERS),
    switchMapTo(this.customerService.getCustomers()),
    map(customers => new customersActions.LoadCustomersSuccess({customers})),
  );

  @Effect()
  createCustomer$: Observable<Action> = this.actions$.pipe(
    ofType<customersActions.CreateCustomer>(customersActions.CUSTOMER_FORM_PAGE_CREATE_CUSTOMER),
    map(action => action.payload.createCustomerForm),
    switchMap(createCustomerForm => this.customerService.createCustomer(createCustomerForm)),
    map(customer => new customersActions.CreateCustomerSuccess({customer})),
  );

  @Effect()
  deleteCustomer$: Observable<Action> = this.actions$.pipe(
    ofType<customersActions.DeleteCustomer>(customersActions.CUSTOMER_UPDATE_FORM_PAGE_DELETE_CUSTOMER),
    map(action => action.payload.customer),
    switchMap(customer => this.customerService.deleteCustomer(customer).pipe(
      mapTo(new customersActions.DeleteCustomerSuccess({customer})),
    )),
    // TODO catchError
  );
}

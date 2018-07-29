import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { CustomerService } from '../../../services/customer.service';

import * as customersActions from '../actions/customers.action';
import { Observable } from 'rxjs/Observable';
import { map, mapTo, switchMap, switchMapTo } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { ofAction } from 'ngrx-action-operators';

@Injectable()
export class CustomersEffects {
  @Effect()
  loadCustomers$: Observable<Action> = this.actions$.pipe(
    ofAction(customersActions.CustomerListPageLoadCustomers),
    switchMapTo(this.customerService.getCustomers()),
    map(customers => new customersActions.LoadCustomersSuccess({ customers })),
  );

  @Effect()
  createCustomer$: Observable<Action> = this.actions$.pipe(
    ofAction(customersActions.CustomerFormPageCreateCustomer),
    map(action => action.payload.createCustomerForm),
    switchMap(createCustomerForm =>
      this.customerService.createCustomer(createCustomerForm),
    ),
    map(customer => new customersActions.CreateCustomerSuccess({ customer })),
  );

  @Effect()
  deleteCustomer$: Observable<Action> = this.actions$.pipe(
    ofAction(customersActions.CustomerUpdateFormPageDeleteCustomer),
    map(action => action.payload.customer),
    switchMap(customer =>
      this.customerService
        .deleteCustomer(customer)
        .pipe(mapTo(new customersActions.DeleteCustomerSuccess({ customer }))),
    ),
    // TODO catchError
  );

  constructor(
    private actions$: Actions,
    private customerService: CustomerService,
  ) {}
}

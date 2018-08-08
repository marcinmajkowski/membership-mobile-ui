import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { ofAction } from 'ngrx-action-operators';
import * as uiActions from '../actions/ui.actions';
import * as membershipActions from '../../../membership/store/actions';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class UiEffects {
  @Effect()
  refreshCustomerPage$: Observable<Action> = this.actions$.pipe(
    ofAction(uiActions.RefreshCustomerPage),
    map(action => action.payload.customer),
    switchMap(customer => [
      new membershipActions.CustomerPageLoadCustomerCheckIns({ customer }),
      new membershipActions.CustomerPageLoadCustomerPayments({ customer }),
    ]),
  );

  constructor(private actions$: Actions) {}
}

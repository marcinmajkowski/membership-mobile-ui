import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ofAction } from 'ngrx-action-operators';
import * as uiActions from '../actions/ui.actions';
import * as membershipActions from '../../../membership/store/actions';
import * as fromMembership from '../../../membership/store';
import { map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { empty } from 'rxjs/Observable/empty';
import { of } from 'rxjs/Observable/of';

@Injectable()
export class UiEffects {
  @Effect()
  checkInListPageLoadCheckIns$: Observable<Action> = this.actions$.pipe(
    ofAction(uiActions.CheckInListPageLoadCheckIns),
    withLatestFrom(this.store.select(fromMembership.isCheckInsLoaded)),
    switchMap(
      ([action, isCheckInsLoaded]) =>
        isCheckInsLoaded ? empty() : of(new membershipActions.LoadCheckIns({})),
    ),
  );

  @Effect()
  checkInListPageRefreshCheckIns$: Observable<Action> = this.actions$.pipe(
    ofAction(uiActions.CheckInListPageRefreshCheckIns),
    mapTo(new membershipActions.LoadCheckIns({})),
  );

  @Effect()
  checkInListPageLoadMoreCheckIns$: Observable<Action> = this.actions$.pipe(
    ofAction(uiActions.CheckInListPageLoadMoreCheckIns),
    withLatestFrom(this.store.select(fromMembership.getOldestLoadedCheckIn)),
    map(
      ([action, oldestLoadedCheckIn]) =>
        new membershipActions.LoadCheckIns({
          beforeTimestamp: oldestLoadedCheckIn.timestamp,
        }),
    ),
  );

  @Effect()
  customerPageRefresh$: Observable<Action> = this.actions$.pipe(
    ofAction(uiActions.RefreshCustomerPage),
    map(action => action.payload.customer),
    switchMap(customer => [
      new membershipActions.CustomerPageLoadCustomerCheckIns({ customer }),
      new membershipActions.CustomerPageLoadCustomerPayments({ customer }),
    ]),
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromMembership.MembershipState>,
  ) {}
}

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ofAction } from 'ngrx-action-operators';
import * as uiActions from '../actions/ui.actions';
import * as membershipActions from '../../../membership/store/actions';
import * as fromMembership from '../../../membership/store';
import {
  filter,
  map,
  mapTo,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';
import { combineLatest } from 'rxjs/Observable/combineLatest';

@Injectable()
export class UiEffects {
  @Effect()
  checkInListPageLoadCheckIns$: Observable<Action> = this.actions$.pipe(
    ofAction(uiActions.CheckInListPageLoadCheckIns),
    withLatestFrom(this.store.select(fromMembership.isCheckInsLoaded)),
    filter(([action, isCheckInsLoaded]) => !isCheckInsLoaded),
    mapTo(new membershipActions.LoadCheckIns({})),
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
  customerPageLoadCheckIns$: Observable<Action> = this.actions$.pipe(
    ofAction(uiActions.CustomerPageLoad),
    map(action => action.payload.customer),
    // TODO put selected user in store and use 'withLatestFrom' here
    switchMap(customer =>
      combineLatest(
        this.store.select(fromMembership.isCustomerCheckInsLoaded(customer.id)),
      ).pipe(
        take(1),
        filter(([isCustomerCheckInsLoaded]) => !isCustomerCheckInsLoaded),
        mapTo(new fromMembership.LoadCustomerCheckIns({ customer })),
      ),
    ),
  );

  // TODO load only if not already loaded
  @Effect()
  customerPageLoadPayments$: Observable<Action> = this.actions$.pipe(
    ofAction(uiActions.CustomerPageLoad),
    map(action => action.payload.customer),
    map(
      customer =>
        new fromMembership.CustomerPageLoadCustomerPayments({ customer }),
    ),
  );

  @Effect()
  customerPageRefresh$: Observable<Action> = this.actions$.pipe(
    ofAction(uiActions.CustomerPageRefresh),
    map(action => action.payload.customer),
    switchMap(customer => [
      new membershipActions.LoadCustomerCheckIns({ customer }),
      new membershipActions.CustomerPageLoadCustomerPayments({ customer }),
    ]),
  );

  @Effect()
  customerPageLoadMoreCheckIns$: Observable<Action> = this.actions$.pipe(
    ofAction(uiActions.CustomerPageLoadMoreCheckIns),
    map(action => action.payload.customer),
    switchMap(customer =>
      // TODO put selected customer in store
      combineLatest(
        this.store.select(
          fromMembership.getCustomerOldestLoadedCheckIn(customer.id),
        ),
      ).pipe(
        take(1),
        map(
          ([oldestLoadedCheckIn]) =>
            new membershipActions.LoadCustomerCheckIns({
              customer,
              beforeTimestamp: oldestLoadedCheckIn.timestamp,
            }),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromMembership.MembershipState>,
  ) {}
}

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import * as checkInsActions from '../actions/check-ins.action';
import * as fromStore from '../../store';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { ofAction } from 'ngrx-action-operators';
import { ApiCheckInService } from '../../api';

@Injectable()
export class CheckInsEffects {
  @Effect()
  loadCheckIns$: Observable<Action> = this.actions$.pipe(
    ofAction(checkInsActions.LoadCheckIns),
    map(action => action.payload.beforeTimestamp),
    switchMap(beforeTimestamp =>
      this.checkInService.getCheckIns(beforeTimestamp).pipe(
        // TODO handle customers
        map(response => response.checkIns),
        map(
          checkIns =>
            new checkInsActions.LoadCheckInsSuccess({
              checkIns,
              beforeTimestamp,
            }),
        ),
        // TODO catchError
      ),
    ),
  );

  @Effect()
  loadCustomerCheckIns$: Observable<Action> = this.actions$.pipe(
    ofAction(checkInsActions.CustomerPageLoadCustomerCheckIns),
    map(action => action.payload.customer.id),
    switchMap(customerId =>
      this.checkInService.getCustomerCheckIns(customerId).pipe(
        map(
          checkIns =>
            new checkInsActions.LoadCustomerCheckInsSuccess({
              checkIns,
              customerId,
            }),
        ),
        // TODO catchError
      ),
    ),
  );

  @Effect()
  createCheckIn$: Observable<Action> = this.actions$.pipe(
    ofAction(checkInsActions.CustomerPageCreateCheckIn),
    map(action => action.payload.customer.id),
    concatMap(customerId =>
      this.checkInService.createCheckIn(customerId).pipe(
        map(checkIn => new checkInsActions.CreateCheckInSuccess({ checkIn })),
        // TODO catchError
      ),
    ),
  );

  @Effect()
  deleteCheckIn$: Observable<Action> = this.actions$.pipe(
    ofAction(
      checkInsActions.CheckInListPageDeleteCheckIn,
      checkInsActions.CustomerPageDeleteCheckIn,
    ),
    map(action => action.payload.checkIn.id),
    concatMap(id =>
      this.checkInService.deleteCheckIn(id).pipe(
        map(checkIn => new checkInsActions.DeleteCheckInSuccess({ checkIn })),
        // TODO catchError
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private checkInService: ApiCheckInService,
    private store: Store<fromStore.MembershipState>,
  ) {}
}

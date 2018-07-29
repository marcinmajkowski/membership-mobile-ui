import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { CheckInService } from '../../../services/check-in.service';

import * as checkInsActions from '../actions/check-ins.action';
import { map, mapTo, switchMap, switchMapTo } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { ofAction } from 'ngrx-action-operators';

@Injectable()
export class CheckInsEffects {
  @Effect()
  loadCheckIns$: Observable<Action> = this.actions$.pipe(
    ofAction(checkInsActions.CheckInListPageLoadCheckIns),
    switchMapTo(this.checkInService.getCheckIns()),
    map(checkIns => new checkInsActions.LoadCheckInsSuccess({ checkIns })),
    // TODO catchError
  );

  // TODO load and force load actions
  @Effect()
  loadCustomerCheckIns$: Observable<Action> = this.actions$.pipe(
    ofAction(checkInsActions.CustomerPageLoadCustomerCheckIns),
    map(action => action.payload.customer),
    switchMap(customer =>
      this.checkInService.getCustomerCheckIns(customer).pipe(
        map(
          checkIns =>
            new checkInsActions.LoadCustomerCheckInsSuccess({
              checkIns,
              customer,
            }),
        ),
      ),
    ),
    // TODO catchError
  );

  @Effect()
  createCheckIn$: Observable<Action> = this.actions$.pipe(
    ofAction(checkInsActions.CustomerPageCreateCheckIn),
    switchMap(action =>
      this.checkInService.createCheckIn(action.payload.customer),
    ),
    map(checkIn => new checkInsActions.CreateCheckInSuccess({ checkIn })),
    // TODO catchError
  );

  @Effect()
  deleteCheckIn$: Observable<Action> = this.actions$.pipe(
    ofAction(
      checkInsActions.CheckInListPageDeleteCheckIn,
      checkInsActions.CustomerPageDeleteCheckIn,
    ),
    map(action => action.payload.checkIn),
    switchMap(checkIn =>
      this.checkInService
        .deleteCheckIn(checkIn)
        .pipe(mapTo(new checkInsActions.DeleteCheckInSuccess({ checkIn }))),
    ),
    // TODO catchError
  );

  constructor(
    private actions$: Actions,
    private checkInService: CheckInService,
  ) {}
}

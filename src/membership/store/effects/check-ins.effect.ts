import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CheckInService } from '../../../services/check-in.service';

import * as checkInsActions from '../actions/check-ins.action';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';

@Injectable()
export class CheckInsEffects {

  constructor(private actions$: Actions,
              private checkInService: CheckInService) {
  }

  @Effect()
  loadCheckIns$: Observable<Action> = this.actions$.pipe(
    ofType<checkInsActions.CheckInListPageLoadCheckIns>(checkInsActions.CHECK_IN_LIST_PAGE_LOAD_CHECK_INS),
    switchMap(() => this.checkInService.getCheckIns()),
    map(checkIns => new checkInsActions.LoadCheckInsSuccess(checkIns)),
    // TODO catchError
  );

  @Effect()
  loadCustomerCheckIns$: Observable<Action> = this.actions$.pipe(
    ofType<checkInsActions.CustomerPageLoadCustomerCheckIns>(checkInsActions.CUSTOMER_PAGE_LOAD_CUSTOMER_CHECK_INS),
    map(action => action.payload),
    switchMap(customer => this.checkInService.getCustomerCheckIns(customer).pipe(
      map(checkIns => new checkInsActions.LoadCustomerCheckInsSuccess({checkIns, customer})),
    )),
    // TODO catchError
  );

  @Effect()
  createCheckIn$: Observable<Action> = this.actions$.pipe(
    ofType<checkInsActions.CustomerPageCreateCheckIn>(checkInsActions.CUSTOMER_PAGE_CREATE_CHECK_IN),
    switchMap(action => this.checkInService.createCheckIn(action.payload)),
    map(checkIn => new checkInsActions.CreateCheckInSuccess(checkIn)),
    // TODO catchError
  );

  @Effect()
  deleteCheckIn$: Observable<Action> = this.actions$.pipe(
    ofType<checkInsActions.DeleteCheckIn>(
      checkInsActions.CHECK_IN_LIST_PAGE_DELETE_CHECK_IN,
      checkInsActions.CUSTOMER_PAGE_DELETE_CHECK_IN,
    ),
    map(action => action.payload),
    switchMap(checkIn => this.checkInService.deleteCheckIn(checkIn).pipe(
      map(() => new checkInsActions.DeleteCheckInSuccess(checkIn)),
    )),
    // TODO catchError
  );
}

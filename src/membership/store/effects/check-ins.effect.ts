import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { CheckInService } from '../../../services/check-in.service';

import * as checkInsActions from '../actions/check-ins.action';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class CheckInsEffects {

  constructor(
    private actions$: Actions,
    private checkInService: CheckInService,
  ) {
  }

  @Effect()
  loadCheckIns$ = this.actions$
    .ofType<checkInsActions.CheckInListPageLoadCheckIns>(checkInsActions.CHECK_IN_LIST_PAGE_LOAD_CHECK_INS)
    .pipe(
      switchMap(() => this.checkInService.getCheckIns()),
      map(checkIns => new checkInsActions.LoadCheckInsSuccess(checkIns)),
      // TODO catchError
    );

  @Effect()
  loadCustomerCheckIns$ = this.actions$
    .ofType<checkInsActions.CustomerPageLoadCustomerCheckIns>(checkInsActions.CUSTOMER_PAGE_LOAD_CUSTOMER_CHECK_INS)
    .pipe(
      map(action => action.payload),
      switchMap(customer => this.checkInService.getCustomerCheckIns(customer)
        .pipe(
          map(checkIns => new checkInsActions.LoadCustomerCheckInsSuccess({checkIns, customer})),
        )
      ),
      // TODO catchError
    );

  @Effect()
  createCheckIn$ = this.actions$
    .ofType<checkInsActions.CustomerPageCreateCheckIn>(checkInsActions.CUSTOMER_PAGE_CREATE_CHECK_IN)
    .pipe(
      switchMap(action => this.checkInService.createCheckIn(action.payload)),
      map(checkIn => new checkInsActions.CreateCheckInSuccess(checkIn)),
      // TODO catchError
    );
}

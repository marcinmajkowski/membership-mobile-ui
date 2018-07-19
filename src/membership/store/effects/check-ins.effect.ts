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
  loadCheckIns$ = this.actions$.ofType(checkInsActions.CHECK_IN_LIST_PAGE_LOAD_CHECK_INS).pipe(
    switchMap(() => this.checkInService
      .getCheckIns()
      .pipe(
        map(checkIns => new checkInsActions.LoadCheckInsSuccess(checkIns)),
        // TODO catchError
      )
    )
  );
}

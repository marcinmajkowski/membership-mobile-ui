import { Component } from '@angular/core';
import { CheckIn } from '../../membership/models/check-in.model';
import { Store } from '@ngrx/store';
import * as fromStore from '../../membership/store';

@Component({
  selector: 'page-check-in-list',
  templateUrl: 'check-in-list.html'
})
export class CheckInListPage {

  checkIns$ = this.store.select(fromStore.getCheckInList);

  constructor(private store: Store<fromStore.MembershipState>) {
  }

  ionViewDidLoad() {
    this.store.dispatch(new fromStore.CheckInListPageLoadCheckIns());
  }

  delete(checkIn: CheckIn) {
    this.store.dispatch(new fromStore.CheckInListPageDeleteCheckIn({checkIn}));
  }
}

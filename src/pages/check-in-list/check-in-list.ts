import { Component } from '@angular/core';
import { CheckIn } from '../../membership/models';
import { Store } from '@ngrx/store';
import * as fromStore from '../../membership/store';
import { InfiniteScroll } from 'ionic-angular';
import { map } from 'rxjs/operators';

@Component({
  selector: 'page-check-in-list',
  templateUrl: 'check-in-list.html',
})
export class CheckInListPageComponent {
  checkIns$ = this.store.select(fromStore.getCheckInListPageCheckIns);
  isCheckInsLoaded$ = this.store
    .select(fromStore.isCheckInListPageCheckInsLoading)
    .pipe(map(isLoading => !isLoading));

  constructor(private store: Store<fromStore.MembershipState>) {}

  ionViewDidLoad() {
    this.store.dispatch(new fromStore.CheckInListPageLoadCheckIns());
  }

  delete(checkIn: CheckIn) {
    this.store.dispatch(
      new fromStore.CheckInListPageDeleteCheckIn({ checkIn }),
    );
  }

  infinite(infiniteScroll: InfiniteScroll): void {
    // TODO implement
    this.store.dispatch(new fromStore.CheckInListPageLoadMoreCheckIns());
    setTimeout(() => infiniteScroll.complete(), 2000);
  }
}

import { Component } from '@angular/core';
import { CheckIn } from '../../membership/models';
import { Store } from '@ngrx/store';
import * as fromStore from '../../membership/store';
import * as fromApp from '../../app/store';
import { InfiniteScroll, Refresher } from 'ionic-angular';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-check-in-list',
  templateUrl: 'check-in-list.html',
})
export class CheckInListPageComponent {
  checkIns$ = this.store.select(fromStore.getCheckIns);
  isCheckInsLoaded$ = this.store.select(fromStore.isCheckInsLoaded);
  isCheckInsComplete$ = this.store.select(fromStore.isCheckInsComplete);

  private ionViewWillLeave$ = new Subject();

  constructor(private store: Store<fromStore.MembershipState>) {}

  ionViewDidLoad(): void {
    this.store.dispatch(new fromApp.CheckInListPageLoadCheckIns());
  }

  ionViewWillLeave(): void {
    this.ionViewWillLeave$.next();
    this.ionViewWillLeave$.complete();
  }

  delete(checkIn: CheckIn) {
    this.store.dispatch(
      new fromStore.CheckInListPageDeleteCheckIn({ checkIn }),
    );
  }

  infinite(infiniteScroll: InfiniteScroll): void {
    this.store.dispatch(new fromApp.CheckInListPageLoadMoreCheckIns());
    this.loaded().subscribe(() => infiniteScroll.complete());
  }

  refresh(refresher: Refresher): void {
    this.store.dispatch(new fromApp.CheckInListPageRefreshCheckIns());
    this.loaded().subscribe(() => refresher.complete());
  }

  private loaded(): Observable<any> {
    return this.store.select(fromStore.isCheckInsLoading).pipe(
      filter(isCheckInsLoading => !isCheckInsLoading),
      take(1),
      takeUntil(this.ionViewWillLeave$),
    );
  }
}

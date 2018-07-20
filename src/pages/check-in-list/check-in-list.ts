import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CheckIn, CheckInService } from '../../services/check-in.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../membership/store';

@Component({
  selector: 'page-check-in-list',
  templateUrl: 'check-in-list.html'
})
export class CheckInListPage {

  checkIns$ = this.store.select(fromStore.getCheckInList);

  constructor(public navCtrl: NavController,
              private checkInService: CheckInService,
              private store: Store<fromStore.MembershipState>) {
  }

  delete(checkIn: CheckIn) {
    this.checkInService.deleteCheckIn(checkIn).subscribe();
  }

  ionViewDidLoad() {
    this.store.dispatch(new fromStore.CheckInListPageLoadCheckIns());
  }
}

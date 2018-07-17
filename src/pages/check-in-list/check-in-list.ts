import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CheckIn, CheckInService } from '../../services/check-in.service';

@Component({
  selector: 'page-check-in-list',
  templateUrl: 'check-in-list.html'
})
export class CheckInListPage {

  checkIns$ = this.checkInService.checkIns$;

  constructor(public navCtrl: NavController,
              private checkInService: CheckInService) {
  }

  delete(checkIn: CheckIn) {
    this.checkInService.deleteCheckIn(checkIn).subscribe();
  }

  ionViewDidLoad() {
    this.checkInService.loadCheckIns().subscribe();
  }
}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CheckInService } from '../../services/check-in.service';

@Component({
  selector: 'page-check-in-list',
  templateUrl: 'check-in-list.html'
})
export class CheckInListPage {

  checkIns$ = this.checkInService.checkIns$;

  constructor(public navCtrl: NavController,
              private checkInService: CheckInService) {
  }

  ionViewDidEnter() {
    this.checkInService.loadCheckIns().subscribe();
  }
}

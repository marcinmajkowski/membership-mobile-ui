import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Customer } from '../../services/customer.service';
import { CheckInService } from '../../services/check-in.service';

@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})
export class CustomerPage {

  customer: Customer = this.navParams.get('customer');

  constructor(public navCtrl: NavController, public navParams: NavParams, private checkInService: CheckInService) {
  }

  createCheckIn() {
    this.checkInService.createCheckIn(this.customer.id)
      .subscribe(() => {
        this.navCtrl.parent.select(1);
        this.navCtrl.pop();
      });
  }
}

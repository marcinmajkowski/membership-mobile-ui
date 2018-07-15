import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Customer } from '../../services/customer.service';
import { CheckIn, CheckInService } from '../../services/check-in.service';
import { PaymentFormPage } from '../payment-form/payment-form';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})
export class CustomerPage {

  customer: Customer = this.navParams.get('customer');
  checkIns$: Observable<CheckIn[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private checkInService: CheckInService) {
    this.checkIns$ = this.checkInService.getCustomerCheckIns(this.customer);
  }

  createCheckIn() {
    this.checkInService.createCheckIn(this.customer)
      .subscribe(() => this.navCtrl.pop());
  }

  createPayment() {
    this.navCtrl.parent.parent.push(PaymentFormPage, {customer: this.customer});
  }
}

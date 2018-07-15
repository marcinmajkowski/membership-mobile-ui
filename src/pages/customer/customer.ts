import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Customer } from '../../services/customer.service';
import { CheckInService } from '../../services/check-in.service';
import { PaymentFormPage } from '../payment-form/payment-form';

@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})
export class CustomerPage {

  customer: Customer = this.navParams.get('customer');

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private checkInService: CheckInService) {
  }

  createCheckIn() {
    this.checkInService.createCheckIn(this.customer)
      .subscribe(() => this.navCtrl.pop());
  }

  createPayment() {
    this.navCtrl.parent.parent.push(PaymentFormPage, {customer: this.customer});
  }
}

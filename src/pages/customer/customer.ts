import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Customer } from '../../services/customer.service';
import { CheckIn, CheckInService } from '../../services/check-in.service';
import { PaymentFormPage } from '../payment-form/payment-form';
import { Observable } from 'rxjs/Observable';
import { Payment, PaymentService } from '../../services/payment.service';

@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})
export class CustomerPage {

  customer: Customer = this.navParams.get('customer');
  checkIns$: Observable<CheckIn[]>;
  payments$: Observable<Payment[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private checkInService: CheckInService,
              private paymentService: PaymentService) {
    this.checkIns$ = this.checkInService.getCustomerCheckIns(this.customer);
    this.payments$ = this.paymentService.getCustomerPayments(this.customer);
  }

  createCheckIn() {
    this.checkInService.createCheckIn(this.customer)
      .subscribe(() => this.navCtrl.pop());
  }

  createPayment() {
    this.navCtrl.parent.parent.push(PaymentFormPage, {customer: this.customer});
  }
}

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
              private checkInService: CheckInService,
              private toastController: ToastController) {
  }

  createCheckIn() {
    this.checkInService.createCheckIn(this.customer.id)
      .subscribe(() => {
        this.navCtrl.pop();
        // FIXME move to checkInService
        this.toastController.create({
          message: `Wejście ${this.customer.fullName} zostało zarejestrowane`,
          duration: 2000,
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'Ok',
        }).present();
      });
  }

  createPayment() {
    this.navCtrl.parent.parent.push(PaymentFormPage, {customer: this.customer});
  }
}

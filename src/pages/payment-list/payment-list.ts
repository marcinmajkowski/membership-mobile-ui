import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'page-payment-list',
  templateUrl: 'payment-list.html'
})
export class PaymentListPage {

  payments$ = this.paymentService.payments$;

  constructor(public navCtrl: NavController,
              private paymentService: PaymentService) {
  }

  ionViewDidLoad() {
    this.paymentService.loadPayments().subscribe();
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { ControlsConfig } from '../../util/controls-config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreatePaymentForm, PaymentService } from '../../services/payment.service';
import { Customer } from '../../services/customer.service';

@Component({
  selector: 'page-payment-form',
  templateUrl: 'payment-form.html',
})
export class PaymentFormPage {

  form: FormGroup;

  customer: Customer;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fb: FormBuilder,
              private paymentService: PaymentService) {
    this.customer = this.navParams.get('customer');
    const controlsConfig: ControlsConfig<CreatePaymentForm> = {
      amount: [null, Validators.required],
    };
    this.form = this.fb.group(controlsConfig);
  }

  save(): void {
    this.paymentService.createPayment(this.customer, this.form.value)
      .subscribe(() => {
        const tabs: Tabs = this.navCtrl.getActiveChildNav();
        tabs.getSelected().popToRoot({animate: false})
          .then(() => this.navCtrl.pop());
      });
  }
}

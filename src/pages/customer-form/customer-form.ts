import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'page-customer-form',
  templateUrl: 'customer-form.html',
})
export class CustomerFormPage {

  form: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fb: FormBuilder,
              private customerService: CustomerService,
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: '',
      cardCode: '',
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerFormPage');
  }

  save(): void {
    this.customerService.createCustomer(
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.cardCode,
    ).subscribe(() => this.navCtrl.pop());
  }

}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Customer } from '../../services/customer.service';

@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})
export class CustomerPage {

  customer: Customer = this.navParams.get('customer');

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
}

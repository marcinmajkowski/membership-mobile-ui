import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CustomerFormPage } from '../customer-form/customer-form';

@Component({
  selector: 'page-customer-list',
  templateUrl: 'customer-list.html'
})
export class CustomerListPage {

  constructor(public navCtrl: NavController) {

  }

  addCustomer(): void {
    this.navCtrl.parent.parent.push(CustomerFormPage);
  }

}

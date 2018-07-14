import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CustomerFormPage } from '../customer-form/customer-form';
import { Customer, CustomerService } from '../../services/customer.service';
import { CustomerPage } from '../customer/customer';

@Component({
  selector: 'page-customer-list',
  templateUrl: 'customer-list.html'
})
export class CustomerListPage {

  customers$ = this.customerService.customers$;

  constructor(public navCtrl: NavController,
              private customerService: CustomerService) {

  }

  addCustomer(): void {
    this.navCtrl.parent.parent.push(CustomerFormPage);
  }

  showCustomer(customer: Customer): void {
    this.navCtrl.push(CustomerPage, {customer});
  }

  ionViewDidLoad() {
    this.customerService.loadCustomers().subscribe();
  }
}

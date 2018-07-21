import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CustomerFormPage } from '../customer-form/customer-form';
import { Customer } from '../../services/customer.service';
import { CustomerPage } from '../customer/customer';
import { Store } from '@ngrx/store';
import * as fromStore from '../../membership/store';

@Component({
  selector: 'page-customer-list',
  templateUrl: 'customer-list.html'
})
export class CustomerListPage {

  customers$ = this.store.select(fromStore.getCustomerList);

  constructor(public navCtrl: NavController,
              private store: Store<fromStore.MembershipState>) {
  }

  addCustomer(): void {
    this.navCtrl.parent.parent.push(CustomerFormPage);
  }

  showCustomer(customer: Customer): void {
    this.navCtrl.push(CustomerPage, {customer});
  }

  ionViewDidLoad() {
    this.store.dispatch(new fromStore.CustomerListPageLoadCustomers());
  }
}

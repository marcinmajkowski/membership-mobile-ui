import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CustomerFormPageComponent } from '../customer-form/customer-form';
import { Customer } from '../../membership/models/customer.model';
import { CustomerPageComponent } from '../customer/customer';
import { Store } from '@ngrx/store';
import * as fromStore from '../../membership/store';

@Component({
  selector: 'page-customer-list',
  templateUrl: 'customer-list.html',
})
export class CustomerListPageComponent {
  customers$ = this.store.select(fromStore.getCustomerList);

  constructor(
    public navCtrl: NavController,
    private store: Store<fromStore.MembershipState>,
  ) {}

  addCustomer(): void {
    this.navCtrl.parent.parent.push(CustomerFormPageComponent);
  }

  showCustomer(customer: Customer): void {
    this.navCtrl.push(CustomerPageComponent, { customer });
  }

  ionViewDidLoad() {
    this.store.dispatch(new fromStore.CustomerListPageLoadCustomers());
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { Customer } from '../../membership/models/customer.model';
import * as fromStore from '../../membership/store';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Actions, ofType } from '@ngrx/effects';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'page-customer-update-form',
  templateUrl: 'customer-update-form.html',
})
export class CustomerUpdateFormPage {

  private ionViewWillLeave$ = new Subject();

  customer: Customer = this.navParams.get('customer');

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private actions$: Actions,
              private store: Store<fromStore.MembershipState>) {
  }

  ionViewWillLeave(): void {
    this.ionViewWillLeave$.next();
    this.ionViewWillLeave$.complete();
  }

  deleteCustomer() {
    this.store.dispatch(new fromStore.CustomerUpdateFormPageDeleteCustomer({customer: this.customer}));
    this.actions$.pipe(
      ofType<fromStore.DeleteCustomerSuccess>(fromStore.DELETE_CUSTOMER_SUCCESS),
      take(1),
      takeUntil(this.ionViewWillLeave$),
    ).subscribe(() => {
      const tabs: Tabs = this.navCtrl.getActiveChildNav();
      tabs.getSelected().popToRoot({animate: false})
        .then(() => this.navCtrl.pop());
    });
  }
}

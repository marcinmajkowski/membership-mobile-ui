import { Component } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { Customer } from '../../membership/models/customer.model';
import * as fromStore from '../../membership/store';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Actions } from '@ngrx/effects';
import { take, takeUntil } from 'rxjs/operators';
import { ofAction } from 'ngrx-action-operators';

@Component({
  selector: 'page-customer-update-form',
  templateUrl: 'customer-update-form.html',
})
export class CustomerUpdateFormPageComponent {
  customer: Customer = this.navParams.get('customer');

  private ionViewWillLeave$ = new Subject();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actions$: Actions,
    private store: Store<fromStore.MembershipState>,
  ) {}

  ionViewWillLeave(): void {
    this.ionViewWillLeave$.next();
    this.ionViewWillLeave$.complete();
  }

  deleteCustomer() {
    this.store.dispatch(
      new fromStore.CustomerUpdateFormPageDeleteCustomer({
        customer: this.customer,
      }),
    );
    this.actions$
      .pipe(
        ofAction(fromStore.DeleteCustomerSuccess),
        take(1),
        takeUntil(this.ionViewWillLeave$),
      )
      .subscribe(() => {
        const tabs: Tabs = this.navCtrl.getActiveChildNav();
        tabs
          .getSelected()
          .popToRoot({ animate: false })
          .then(() => this.navCtrl.pop());
      });
  }
}

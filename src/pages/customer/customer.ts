// tslint:disable:max-line-length
import { Component } from '@angular/core';
import { NavController, NavParams, Refresher } from 'ionic-angular';
import { CheckIn, Customer, Payment } from '../../membership/models';
import { PaymentFormPageComponent } from '../payment-form/payment-form';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromMembership from '../../membership/store';
import * as fromApp from '../../app/store';
import { Subject } from 'rxjs/Subject';
import { Actions } from '@ngrx/effects';
import { filter, take, takeUntil } from 'rxjs/operators';
import { CustomerUpdateFormPageComponent } from '../customer-update-form/customer-update-form';
import { ofAction } from 'ngrx-action-operators';
// tslint:enable:max-line-length

@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})
export class CustomerPageComponent {
  customer: Customer = this.navParams.get('customer');
  checkIns$: Observable<CheckIn[]>;
  isCustomerCheckInsLoading$: Observable<boolean>;
  payments$: Observable<Payment[]>;

  private ionViewWillLeave$ = new Subject();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private membershipStore: Store<fromMembership.MembershipState>,
    private appStore: Store<fromApp.State>,
    private actions$: Actions,
  ) {
    this.checkIns$ = this.membershipStore.select(
      fromMembership.getCustomerCheckInList(this.customer.id),
    );
    this.isCustomerCheckInsLoading$ = this.membershipStore.select(
      fromMembership.isCustomerCheckInsLoading(this.customer.id),
    );
    this.payments$ = this.membershipStore.select(
      fromMembership.getCustomerPaymentList(this.customer.id),
    );
  }

  ionViewWillEnter(): void {
    this.membershipStore.dispatch(
      new fromMembership.CustomerPageLoadCustomerCheckIns({
        customer: this.customer,
      }),
    );
    this.membershipStore.dispatch(
      new fromMembership.CustomerPageLoadCustomerPayments({
        customer: this.customer,
      }),
    );
  }

  ionViewWillLeave(): void {
    this.ionViewWillLeave$.next();
    this.ionViewWillLeave$.complete();
  }

  // FIXME probably it should not be possible to dispatch twice
  createCheckIn() {
    this.membershipStore.dispatch(
      new fromMembership.CustomerPageCreateCheckIn({ customer: this.customer }),
    );
    // TODO involve state into navigation
    this.actions$
      .pipe(
        ofAction(fromMembership.CreateCheckInSuccess),
        take(1),
        takeUntil(this.ionViewWillLeave$),
      )
      .subscribe(() => this.navCtrl.pop());
  }

  deleteCheckIn(checkIn: CheckIn): void {
    this.membershipStore.dispatch(
      new fromMembership.CustomerPageDeleteCheckIn({ checkIn }),
    );
  }

  createPayment() {
    this.navCtrl.parent.parent.push(PaymentFormPageComponent, {
      customer: this.customer,
    });
  }

  // TODO deletePayment()

  updateCustomer() {
    this.navCtrl.parent.parent.push(CustomerUpdateFormPageComponent, {
      customer: this.customer,
    });
  }

  refresh(refresher: Refresher): void {
    this.appStore.dispatch(
      new fromApp.RefreshCustomerPage({ customer: this.customer }),
    );
    // TODO take payments into account (combineLatest)
    this.isCustomerCheckInsLoading$
      .pipe(
        filter(isCustomerCheckInsLoading => !isCustomerCheckInsLoading),
        take(1),
        takeUntil(this.ionViewWillLeave$),
      )
      .subscribe(() => refresher.complete());
  }
}

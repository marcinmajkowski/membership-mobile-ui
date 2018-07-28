// tslint:disable:max-line-length
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Customer } from '../../membership/models/customer.model';
import { CheckIn } from '../../membership/models/check-in.model';
import { PaymentFormPageComponent } from '../payment-form/payment-form';
import { Observable } from 'rxjs/Observable';
import { Payment, PaymentService } from '../../services/payment.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../membership/store';
import { Subject } from 'rxjs/Subject';
import { Actions, ofType } from '@ngrx/effects';
import { take, takeUntil } from 'rxjs/operators';
import { CustomerUpdateFormPageComponent } from '../customer-update-form/customer-update-form';
// tslint:enable:max-line-length

@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html',
})
export class CustomerPageComponent {
  customer: Customer = this.navParams.get('customer');
  checkIns$: Observable<CheckIn[]>;
  payments$: Observable<Payment[]>;

  private ionViewWillLeave$ = new Subject();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private store: Store<fromStore.MembershipState>,
    private actions$: Actions,
    private paymentService: PaymentService,
  ) {
    this.checkIns$ = this.store.select(
      fromStore.getCustomerCheckInList(this.customer.id),
    );
    this.payments$ = this.paymentService.getCustomerPayments(this.customer);
  }

  // FIXME probably it should not be possible to dispatch twice
  createCheckIn() {
    this.store.dispatch(
      new fromStore.CustomerPageCreateCheckIn({ customer: this.customer }),
    );
    // TODO involve state into navigation
    this.actions$
      .pipe(
        ofType(fromStore.CREATE_CHECK_IN_SUCCESS),
        take(1),
        takeUntil(this.ionViewWillLeave$),
      )
      .subscribe(() => this.navCtrl.pop());
  }

  deleteCheckIn(checkIn: CheckIn): void {
    this.store.dispatch(new fromStore.CustomerPageDeleteCheckIn({ checkIn }));
  }

  createPayment() {
    this.navCtrl.parent.parent.push(PaymentFormPageComponent, {
      customer: this.customer,
    });
  }

  updateCustomer() {
    this.navCtrl.parent.parent.push(CustomerUpdateFormPageComponent, {
      customer: this.customer,
    });
  }

  ionViewWillEnter(): void {
    this.store.dispatch(
      new fromStore.CustomerPageLoadCustomerCheckIns({
        customer: this.customer,
      }),
    );
  }

  ionViewWillLeave(): void {
    this.ionViewWillLeave$.next();
    this.ionViewWillLeave$.complete();
  }
}

import { Component } from '@angular/core';
import * as fromStore from '../../membership/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'page-payment-list',
  templateUrl: 'payment-list.html',
})
export class PaymentListPageComponent {
  payments$ = this.store.select(fromStore.getPaymentListPagePayments);

  constructor(private store: Store<fromStore.MembershipState>) {}

  ionViewDidLoad() {
    this.store.dispatch(new fromStore.PaymentListPageLoadPayments());
  }

  // TODO deletePayment()
}

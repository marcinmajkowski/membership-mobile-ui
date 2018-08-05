import { Component } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { ControlsConfig } from '../../util/controls-config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../../membership/models';
import { CreatePaymentForm } from '../../membership/api/models';
import * as fromStore from '../../membership/store';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { take, takeUntil } from 'rxjs/operators';
import { ofAction } from 'ngrx-action-operators';

@Component({
  selector: 'page-payment-form',
  templateUrl: 'payment-form.html',
})
export class PaymentFormPageComponent {
  form: FormGroup;

  customer: Customer;

  private ionViewWillLeave$ = new Subject();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private store: Store<fromStore.MembershipState>,
    private actions$: Actions,
  ) {
    this.customer = this.navParams.get('customer');
    const controlsConfig: ControlsConfig<CreatePaymentForm> = {
      amount: [null, Validators.required],
    };
    this.form = this.fb.group(controlsConfig);
  }

  // FIXME probably it should not be possible to dispatch twice
  save(): void {
    this.store.dispatch(
      new fromStore.PaymentFormPageCreatePayment({
        customer: this.customer,
        createPaymentForm: this.form.value,
      }),
    );
    // TODO involve state into navigation
    this.actions$
      .pipe(
        ofAction(fromStore.CreatePaymentSuccess),
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

  ionViewWillLeave(): void {
    this.ionViewWillLeave$.next();
    this.ionViewWillLeave$.complete();
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateCustomerForm } from '../../membership/models/customer.model';
import { BarcodeScannerService } from '../../services/barcode-scanner.service';
import { CustomerPageComponent } from '../customer/customer';
import { ControlsConfig } from '../../util/controls-config';
import * as fromStore from '../../membership/store';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Subject } from 'rxjs/Subject';
import { map, take, takeUntil } from 'rxjs/operators';
import { ofAction } from 'ngrx-action-operators';

@Component({
  selector: 'page-customer-form',
  templateUrl: 'customer-form.html',
})
export class CustomerFormPageComponent {
  form: FormGroup;

  barcodeScannerEnabled$ = this.barcodeScannerService.enabled$;

  private ionViewWillLeave$ = new Subject();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private barcodeScannerService: BarcodeScannerService,
    private actions$: Actions,
    private store: Store<fromStore.MembershipState>,
  ) {
    const controlsConfig: ControlsConfig<CreateCustomerForm> = {
      firstName: ['', Validators.required],
      lastName: '',
      // TODO async uniqueness validation
      cardCode: this.navParams.get('cardCode') || '',
    };
    this.form = this.fb.group(controlsConfig);
  }

  save(): void {
    this.store.dispatch(
      new fromStore.CustomerFormPageCreateCustomer({
        createCustomerForm: this.form.value,
      }),
    );
    this.actions$
      .pipe(
        ofAction(fromStore.CreateCustomerSuccess),
        map(action => action.payload.customer),
        take(1),
        takeUntil(this.ionViewWillLeave$),
      )
      .subscribe(customer => {
        this.navCtrl.pop();
        const tabs: Tabs = this.navCtrl.getActiveChildNav();
        tabs.getSelected().push(CustomerPageComponent, { customer });
      });
  }

  scanBarcode(): void {
    this.barcodeScannerService
      .scan()
      .then(result => this.form.get('cardCode').setValue(result))
      .catch(() => {});
  }

  ionViewWillLeave(): void {
    this.ionViewWillLeave$.next();
    this.ionViewWillLeave$.complete();
  }
}

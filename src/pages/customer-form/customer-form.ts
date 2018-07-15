import { Component } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateCustomerForm, CustomerService } from '../../services/customer.service';
import { BarcodeScannerService } from '../../services/barcode-scanner.service';
import { CustomerPage } from '../customer/customer';
import { ControlsConfig } from '../../util/controls-config';

@Component({
  selector: 'page-customer-form',
  templateUrl: 'customer-form.html',
})
export class CustomerFormPage {

  form: FormGroup;

  barcodeScannerEnabled$ = this.barcodeScannerService.enabled$;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fb: FormBuilder,
              private barcodeScannerService: BarcodeScannerService,
              private customerService: CustomerService,
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
    this.customerService.createCustomer(this.form.value)
      .subscribe(customer => {
        this.navCtrl.pop();
        const tabs: Tabs = this.navCtrl.getActiveChildNav();
        tabs.getSelected().push(CustomerPage, {customer});
      });
  }

  scanBarcode(): void {
    this.barcodeScannerService.scan()
      .then(result => this.form.get('cardCode').setValue(result))
      .catch(() => {
      });
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { BarcodeScannerService } from '../../services/barcode-scanner.service';
import { CustomerPage } from '../customer/customer';

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
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: '',
      // TODO async uniqueness validation
      cardCode: this.navParams.get('cardCode') || '',
    });
  }

  save(): void {
    this.customerService.createCustomer(
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.cardCode,
    ).subscribe(customer => {
      this.navCtrl.pop();
      const tabs: Tabs = this.navCtrl.getActiveChildNav();
      tabs.getSelected().push(CustomerPage, {customer});
    });
  }

  scanBarcode(): void {
    this.barcodeScannerService.scan()
      .then(result => this.form.get('cardCode').setValue(result))
      .catch(() => {});
  }
}

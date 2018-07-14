import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { BarcodeScannerService } from '../../services/barcode-scanner.service';

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
      cardCode: '',
    });
  }

  save(): void {
    this.customerService.createCustomer(
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.cardCode,
    ).subscribe(() => this.navCtrl.pop());
  }

  scanBarcode(): void {
    this.barcodeScannerService.scan()
      .then(result => this.form.get('cardCode').setValue(result))
      .catch(() => {});
  }
}

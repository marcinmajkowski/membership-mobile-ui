import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-customer-form',
  templateUrl: 'customer-form.html',
})
export class CustomerFormPage {

  form: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fb: FormBuilder,
              private barcodeScanner: BarcodeScanner,
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
    const options: BarcodeScannerOptions = {showTorchButton: true};
    this.barcodeScanner.scan(options).then(result => {
      if (!result.cancelled) {
        this.form.get('cardCode').setValue(result.text);
      }
    });
  }
}

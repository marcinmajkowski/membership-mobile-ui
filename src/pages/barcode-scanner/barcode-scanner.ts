import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { CheckInService } from '../../services/check-in.service';

@Component({
  selector: 'page-barcode-scanner',
  templateUrl: 'barcode-scanner.html',
})
export class BarcodeScannerPage {

  scanResult: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private barcodeScanner: BarcodeScanner,
              private checkInService: CheckInService) {
  }

  ionViewDidEnter() {
    const options: BarcodeScannerOptions = {showTorchButton: true};
    this.barcodeScanner.scan(options).then(
      result => {
        if (!result.cancelled) {
          this.checkInService.createCheckIn(result.text).subscribe();
        }
        this.scanResult = result;
      },
      error => this.scanResult = error
    );
  }
}

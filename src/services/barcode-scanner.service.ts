import { Injectable } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const BARCODE_SCANNER_OPTIONS: BarcodeScannerOptions = {
  showTorchButton: true
};

@Injectable()
export class BarcodeScannerService {

  private enabledSubject = new BehaviorSubject<boolean>(true);

  enabled$ = this.enabledSubject.asObservable();

  constructor(private barcodeScanner: BarcodeScanner) {
  }

  scan(): Promise<string> {
    return this.barcodeScanner.scan(BARCODE_SCANNER_OPTIONS)
      .then(scanResult => scanResult.cancelled ? '' : scanResult.text)
      .catch(error => {
        this.enabledSubject.next(false);
        return Promise.reject(error);
      });
  }
}

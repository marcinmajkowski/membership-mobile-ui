import { Injectable } from '@angular/core';
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from '@ionic-native/barcode-scanner';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

const BARCODE_SCANNER_OPTIONS: BarcodeScannerOptions = {
  showTorchButton: true,
};

@Injectable()
export class BarcodeScannerService {
  enabled$: Observable<boolean>;

  private enabledSubject: BehaviorSubject<boolean>;

  constructor(private barcodeScanner: BarcodeScanner) {
    this.enabledSubject = new BehaviorSubject<boolean>(true);
    this.enabled$ = this.enabledSubject.asObservable();
  }

  scan(): Promise<string> {
    return this.barcodeScanner
      .scan(BARCODE_SCANNER_OPTIONS)
      .then(scanResult => (scanResult.cancelled ? '' : scanResult.text))
      .catch(error => {
        this.enabledSubject.next(false);
        return Promise.reject(error);
      });
  }
}

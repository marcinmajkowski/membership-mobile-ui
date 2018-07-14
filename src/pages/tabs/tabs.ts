import { Component, ViewChild } from '@angular/core';

import { AboutPage } from '../about/about';
import { CustomerListPage } from '../customer-list/customer-list';
import { HomePage } from '../home/home';
import { CheckInListPage } from '../check-in-list/check-in-list';
import { CustomerPage } from '../customer/customer';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { NavController, Tabs } from 'ionic-angular';
import { CustomerService } from '../../services/customer.service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('tabs') tabs: Tabs;

  homeTabRoot = HomePage;
  checkInListTabRoot = CheckInListPage;
  aboutTabRoot = AboutPage;
  customerListTabRoot = CustomerListPage;

  constructor(private barcodeScanner: BarcodeScanner,
              private customerService: CustomerService,
              private navCtrl: NavController) {
  }

  scanBarcode(): void {
    const options: BarcodeScannerOptions = {showTorchButton: true};
    // TODO error handling
    this.barcodeScanner.scan(options).then(
      result => {
        if (!result.cancelled) {
          this.handleCardCode(result.text);
        }
      }
    );
  }

  private handleCardCode(cardCode: string): void {
    this.customerService.findCustomersByCardCode(cardCode)
      .subscribe(customers => {
        if (customers.length === 1) {
          const customer = customers[0];
          this.navCtrl.push(CustomerPage, {customer});
        } else {
          // TODO customer form redirect with card code input filled
        }
      });
  }
}

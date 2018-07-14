import { Component, ViewChild } from '@angular/core';

import { AboutPage } from '../about/about';
import { CustomerListPage } from '../customer-list/customer-list';
import { HomePage } from '../home/home';
import { CheckInListPage } from '../check-in-list/check-in-list';
import { CustomerPage } from '../customer/customer';
import { BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { NavController, Tabs } from 'ionic-angular';
import { CustomerService } from '../../services/customer.service';
import { BarcodeScannerService } from '../../services/barcode-scanner.service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('tabs') tabs: Tabs;

  barcodeScannerEnabled$ = this.barcodeScannerService.enabled$;

  homeTabRoot = HomePage;
  checkInListTabRoot = CheckInListPage;
  aboutTabRoot = AboutPage;
  customerListTabRoot = CustomerListPage;

  constructor(private barcodeScannerService: BarcodeScannerService,
              private customerService: CustomerService,
              private navCtrl: NavController) {
  }

  scanBarcode(): void {
    this.barcodeScannerService.scan()
      .then(result => this.handleCardCode(result))
      .catch(() => {});
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

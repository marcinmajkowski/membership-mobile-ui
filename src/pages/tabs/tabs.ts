import { Component, ViewChild } from '@angular/core';

import { AboutPage } from '../about/about';
import { CustomerListPage } from '../customer-list/customer-list';
import { HomePage } from '../home/home';
import { CheckInListPage } from '../check-in-list/check-in-list';
import { CustomerPage } from '../customer/customer';
import { NavController, Tab, Tabs } from 'ionic-angular';
import { CustomerService } from '../../services/customer.service';
import { BarcodeScannerService } from '../../services/barcode-scanner.service';
import { CustomerFormPage } from '../customer-form/customer-form';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('tabs') tabs: Tabs;
  @ViewChild('customerListTab') customerListTab: Tab;

  barcodeScannerEnabled$ = this.barcodeScannerService.enabled$;

  checkInListTabRoot = CheckInListPage;
  homeTabRoot = HomePage;
  customerListTabRoot = CustomerListPage;
  aboutTabRoot = AboutPage;

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
    if (cardCode === '') {
      return;
    }
    this.tabs.select(this.customerListTab).then(() => {
      this.customerService.findCustomersByCardCode(cardCode)
        .subscribe(customers => {
          if (customers.length === 1) {
            const customer = customers[0];
            this.tabs.getSelected().push(CustomerPage, {customer});
          } else {
            this.navCtrl.push(CustomerFormPage, {cardCode});
          }
        });
    });
  }
}

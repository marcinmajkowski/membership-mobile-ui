import { Component, ViewChild } from '@angular/core';

import { SettingsPageComponent } from '../settings/settings';
import { CustomerListPageComponent } from '../customer-list/customer-list';
import { PaymentListPageComponent } from '../payment-list/payment-list';
import { CheckInListPageComponent } from '../check-in-list/check-in-list';
import { CustomerPageComponent } from '../customer/customer';
import { NavController, Tab, Tabs } from 'ionic-angular';
import { CustomerService } from '../../services/customer.service';
import { BarcodeScannerService } from '../../services/barcode-scanner.service';
import { CustomerFormPageComponent } from '../customer-form/customer-form';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPageComponent {
  @ViewChild('tabs') tabs: Tabs;
  @ViewChild('customerListTab') customerListTab: Tab;

  barcodeScannerEnabled$ = this.barcodeScannerService.enabled$;

  customerListTabRoot = CustomerListPageComponent;
  checkInListTabRoot = CheckInListPageComponent;
  paymentListTabRoot = PaymentListPageComponent;
  settingsTabRoot = SettingsPageComponent;

  constructor(
    private barcodeScannerService: BarcodeScannerService,
    private customerService: CustomerService,
    private navCtrl: NavController,
  ) {}

  scanBarcode(): void {
    this.barcodeScannerService
      .scan()
      .then(result => this.handleCardCode(result))
      .catch(() => {});
  }

  private handleCardCode(cardCode: string): void {
    if (cardCode === '') {
      return;
    }
    this.tabs.select(this.customerListTab).then(() => {
      this.customerService
        .findCustomersByCardCode(cardCode)
        .subscribe(customers => {
          if (customers.length === 1) {
            const customer = customers[0];
            this.tabs.getSelected().push(CustomerPageComponent, { customer });
          } else {
            this.navCtrl.push(CustomerFormPageComponent, { cardCode });
          }
        });
    });
  }
}

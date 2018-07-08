import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { BarcodeScannerPage } from '../barcode-scanner/barcode-scanner';
import { CheckInListPage } from '../check-in-list/check-in-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  homeTabRoot = HomePage;
  checkInListTabRoot = CheckInListPage;
  barcodeScannerTabRoot = BarcodeScannerPage;
  aboutTabRoot = AboutPage;
  contactTabRoot = ContactPage;

  constructor() {

  }
}

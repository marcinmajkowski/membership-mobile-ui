import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { BarcodeScannerPage } from '../barcode-scanner/barcode-scanner';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  homeTabRoot = HomePage;
  barcodeScannerTabRoot = BarcodeScannerPage;
  aboutTabRoot = AboutPage;
  contactTabRoot = ContactPage;

  constructor() {

  }
}

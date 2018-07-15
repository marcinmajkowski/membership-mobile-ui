import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { MyApp } from './app.component';

import { SettingsPage } from '../pages/settings/settings';
import { CustomerListPage } from '../pages/customer-list/customer-list';
import { CustomerFormPage } from '../pages/customer-form/customer-form';
import { CustomerPage } from '../pages/customer/customer';
import { PaymentListPage } from '../pages/payment-list/payment-list';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { CheckInListPage } from '../pages/check-in-list/check-in-list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AuthService } from '../services/auth.service';
import { CheckInService } from '../services/check-in.service';
import { XhrInterceptor } from '../services/xhr.interceptor';
import { CustomerService } from '../services/customer.service';
import { BarcodeScannerService } from '../services/barcode-scanner.service';

@NgModule({
  declarations: [
    MyApp,
    SettingsPage,
    CustomerListPage,
    CustomerFormPage,
    CustomerPage,
    PaymentListPage,
    TabsPage,
    LoginPage,
    CheckInListPage,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SettingsPage,
    CustomerListPage,
    CustomerFormPage,
    CustomerPage,
    PaymentListPage,
    TabsPage,
    LoginPage,
    CheckInListPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    BarcodeScannerService,
    AuthService,
    CheckInService,
    CustomerService,
    {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
  ]
})
export class AppModule {
}

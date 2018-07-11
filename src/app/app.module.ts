import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { CustomerListPage } from '../pages/customer-list/customer-list';
import { CustomerFormPage } from '../pages/customer-form/customer-form';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { BarcodeScannerPage } from '../pages/barcode-scanner/barcode-scanner';
import { LoginPage } from '../pages/login/login';
import { CheckInListPage } from '../pages/check-in-list/check-in-list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AuthService } from '../services/auth.service';
import { CheckInService } from '../services/check-in.service';
import { XhrInterceptor } from '../services/xhr.interceptor';
import { CustomerService } from '../services/customer.service';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    CustomerListPage,
    CustomerFormPage,
    HomePage,
    TabsPage,
    BarcodeScannerPage,
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
    AboutPage,
    CustomerListPage,
    CustomerFormPage,
    HomePage,
    TabsPage,
    BarcodeScannerPage,
    LoginPage,
    CheckInListPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    AuthService,
    CheckInService,
    CustomerService,
    {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
  ]
})
export class AppModule {
}

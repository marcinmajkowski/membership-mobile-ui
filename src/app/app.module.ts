// tslint:disable:max-line-length
import { ErrorHandler, LOCALE_ID, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { AppComponent } from './app.component';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import { reducers, effects } from './store';

import { WelcomePageComponent } from '../pages/welcome/welcome';
import { SignUpPageComponent } from '../pages/sign-up/sign-up';
import { SettingsPageComponent } from '../pages/settings/settings';
import { CustomerListPageComponent } from '../pages/customer-list/customer-list';
import { CustomerFormPageComponent } from '../pages/customer-form/customer-form';
import { CustomerUpdateFormPageComponent } from '../pages/customer-update-form/customer-update-form';
import { CustomerPageComponent } from '../pages/customer/customer';
import { PaymentListPageComponent } from '../pages/payment-list/payment-list';
import { TabsPageComponent } from '../pages/tabs/tabs';
import { LoginPageComponent } from '../pages/login/login';
import { CheckInListPageComponent } from '../pages/check-in-list/check-in-list';
import { PaymentFormPageComponent } from '../pages/payment-form/payment-form';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AuthService } from '../services/auth.service';
import { CheckInService } from '../services/check-in.service';
import { XhrInterceptor } from '../services/xhr.interceptor';
import { CustomerService } from '../services/customer.service';
import { BarcodeScannerService } from '../services/barcode-scanner.service';
import { PaymentService } from '../services/payment.service';

import { MembershipModule } from '../membership/membership.module';
import { ComponentsModule } from '../components/components.module';
// tslint:enable:max-line-length

registerLocaleData(localePl, 'pl');

export const metaReducers: MetaReducer<any>[] = isDevMode()
  ? [storeFreeze]
  : [];

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    SignUpPageComponent,
    SettingsPageComponent,
    CustomerListPageComponent,
    CustomerFormPageComponent,
    CustomerUpdateFormPageComponent,
    CustomerPageComponent,
    PaymentListPageComponent,
    PaymentFormPageComponent,
    TabsPageComponent,
    LoginPageComponent,
    CheckInListPageComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    HttpClientModule,
    MembershipModule,
    ComponentsModule,
    IonicModule.forRoot(AppComponent),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    isDevMode() ? StoreDevtoolsModule.instrument() : [],
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    WelcomePageComponent,
    SignUpPageComponent,
    SettingsPageComponent,
    CustomerListPageComponent,
    CustomerFormPageComponent,
    CustomerUpdateFormPageComponent,
    CustomerPageComponent,
    PaymentListPageComponent,
    PaymentFormPageComponent,
    TabsPageComponent,
    LoginPageComponent,
    CheckInListPageComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BarcodeScanner,
    BarcodeScannerService,
    AuthService,
    CheckInService,
    PaymentService,
    CustomerService,
    { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pl' },
    CurrencyPipe,
  ],
})
export class AppModule {}

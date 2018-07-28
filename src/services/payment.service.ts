import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Customer } from '../membership/models/customer.model';
import { ToastController } from 'ionic-angular';
import { CurrencyPipe } from '@angular/common';
import { Iso8601String } from '../membership/models/iso-8601-string.model';
import * as fromStore from '../membership/store';
import { Store } from '@ngrx/store';

interface PaymentData {
  id: number;
  customerId: number;
  amount: number;
  timestamp: Iso8601String;
}

export class Payment {
  private constructor(
    public id: number,
    public customer: Customer,
    public amount: number,
    public timestamp: Iso8601String,
  ) {}

  static fromData(data: PaymentData, customer: Customer): Payment {
    return new Payment(data.id, customer, data.amount, data.timestamp);
  }
}

export interface CreatePaymentForm {
  amount: string;
}

@Injectable()
export class PaymentService {
  payments$: Observable<Payment[]>;

  private paymentsSubject: BehaviorSubject<Payment[]>;

  constructor(
    private httpClient: HttpClient,
    private toastController: ToastController,
    // tslint:disable-next-line:max-line-length
    // FIXME this is a temporary solution until local state remains in this service instead of ngrx
    private store: Store<fromStore.MembershipState>,
    private currencyPipe: CurrencyPipe,
  ) {
    this.paymentsSubject = new BehaviorSubject<Payment[]>([]);
    this.payments$ = this.paymentsSubject.asObservable();
  }

  createPayment(
    customer: Customer,
    createPaymentForm: CreatePaymentForm,
  ): Observable<Payment> {
    return this.httpClient
      .post<PaymentData>(
        `/api/customers/${customer.id}/payments`,
        createPaymentForm,
      )
      .pipe(
        withLatestFrom(this.store.select(fromStore.getCustomersEntities)),
        map(([paymentData, customerEntities]) =>
          Payment.fromData(
            paymentData,
            customerEntities[paymentData.customerId],
          ),
        ),
        // TODO sorting
        tap(payment =>
          this.paymentsSubject.next([
            payment,
            ...this.paymentsSubject.getValue(),
          ]),
        ),
        tap(payment => this.presentToast(customer, payment)),
      );
  }

  loadPayments(): Observable<Payment[]> {
    return this.httpClient
      .get<{ payments: PaymentData[] }>('/api/payments')
      .pipe(
        map(response => response.payments),
        withLatestFrom(this.store.select(fromStore.getCustomersEntities)),
        map(([paymentDatas, customerEntities]) =>
          paymentDatas.map(data =>
            Payment.fromData(data, customerEntities[data.customerId]),
          ),
        ),
        tap(payments => this.paymentsSubject.next(payments)),
      );
  }

  getCustomerPayments(customer: Customer): Observable<Payment[]> {
    return this.httpClient
      .get<{ payments: PaymentData[] }>(
        `/api/customers/${customer.id}/payments`,
      )
      .pipe(
        map(response => response.payments),
        withLatestFrom(this.store.select(fromStore.getCustomersEntities)),
        map(([paymentDatas, customerEntities]) =>
          paymentDatas.map(data =>
            Payment.fromData(data, customerEntities[data.customerId]),
          ),
        ),
      );
  }

  private presentToast(customer: Customer, payment: Payment): void {
    const amountDisplayValue = this.currencyPipe.transform(
      payment.amount,
      'PLN',
      'symbol-narrow',
    );
    this.toastController
      .create({
        message: `Płatność ${amountDisplayValue} przez ${
          customer.fullName
        } została zarejestrowana`,
        duration: 2000,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Ok',
      })
      .present();
  }
}

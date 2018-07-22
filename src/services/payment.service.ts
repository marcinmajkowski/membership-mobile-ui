import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Customer } from './customer.service';
import { ToastController } from 'ionic-angular';
import { CurrencyPipe } from '@angular/common';
import { Iso8601String } from '../membership/models/iso-8601-string.model';

interface PaymentCustomerData {
  id: number;
  firstName: string;
  lastName: string;
}

export class PaymentCustomer {

  public fullName: string;

  private constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
  ) {
    this.fullName = lastName.length > 0 ? `${firstName} ${lastName}` : firstName;
  }

  static fromData(data: PaymentCustomerData) {
    return new PaymentCustomer(
      data.id,
      data.firstName,
      data.lastName,
    );
  }
}

interface PaymentData {
  id: number;
  customer: PaymentCustomerData;
  amount: number;
  timestamp: Iso8601String;
}

export class Payment {

  private constructor(
    public id: number,
    public customer: PaymentCustomer,
    public amount: number,
    public timestamp: Iso8601String,
  ) {
  }

  static fromData(data: PaymentData): Payment {
    return new Payment(
      data.id,
      data.customer && PaymentCustomer.fromData(data.customer),
      data.amount,
      data.timestamp,
    );
  }
}

export interface CreatePaymentForm {
  amount: string;
}

@Injectable()
export class PaymentService {

  private paymentsSubject = new BehaviorSubject<Payment[]>([]);
  payments$ = this.paymentsSubject.asObservable();

  constructor(private httpClient: HttpClient,
              private toastController: ToastController,
              private currencyPipe: CurrencyPipe) {
  }

  createPayment(customer: Customer, createPaymentForm: CreatePaymentForm): Observable<Payment> {
    return this.httpClient.post<PaymentData>(`/api/customers/${customer.id}/payments`, createPaymentForm).pipe(
      map(Payment.fromData),
      // TODO sorting
      tap(payment => this.paymentsSubject.next([payment, ...this.paymentsSubject.getValue()])),
      tap(payment => this.presentToast(customer, payment))
    );
  }

  loadPayments(): Observable<Payment[]> {
    return this.httpClient.get<{ payments: PaymentData[] }>('/api/payments').pipe(
      map(response => response.payments.map(Payment.fromData)),
      tap(payments => this.paymentsSubject.next(payments))
    );
  }

  getCustomerPayments(customer: Customer): Observable<Payment[]> {
    return this.httpClient.get<{ payments: PaymentData[] }>(`/api/customers/${customer.id}/payments`).pipe(
      map(response => response.payments.map(Payment.fromData)),
    );
  }

  private presentToast(customer: Customer, payment: Payment): void {
    const amountDisplayValue = this.currencyPipe.transform(payment.amount, 'PLN', 'symbol-narrow');
    this.toastController.create({
      message: `Płatność ${amountDisplayValue} przez ${customer.fullName} została zarejestrowana`,
      duration: 2000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Ok',
    }).present();
  }
}

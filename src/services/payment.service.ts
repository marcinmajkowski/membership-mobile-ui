import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import moment from 'moment';

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
  timestamp: string;
}

export class Payment {

  private constructor(
    public id: number,
    public customer: PaymentCustomer,
    public amount: number,
    public timestamp: moment.Moment,
  ) {
  }

  static fromData(data: PaymentData): Payment {
    return new Payment(
      data.id,
      PaymentCustomer.fromData(data.customer),
      data.amount,
      moment(data.timestamp),
    );
  }
}

export interface CreatePaymentForm {
  amount: number;
}

@Injectable()
export class PaymentService {

  private paymentsSubject = new BehaviorSubject<Payment[]>([]);
  payments$ = this.paymentsSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  createPayment(customerId: number, createPaymentForm: CreatePaymentForm): Observable<Payment> {
    return this.httpClient.post<PaymentData>(`/api/customers/${customerId}/payments`, {}).pipe(
      map(Payment.fromData),
      // TODO sorting
      tap(payment => this.paymentsSubject.next([payment, ...this.paymentsSubject.getValue()]))
    );
  }

  loadPayments(): Observable<Payment[]> {
    return this.httpClient.get<{ payments: PaymentData[] }>('/api/payments').pipe(
      map(response => response.payments.map(Payment.fromData)),
      tap(payments => this.paymentsSubject.next(payments))
    );
  }
}

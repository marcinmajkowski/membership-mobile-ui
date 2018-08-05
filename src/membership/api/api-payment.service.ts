import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { ToastController } from 'ionic-angular';
import { ApiCustomer, ApiPayment, CreatePaymentForm } from './models';
import { CurrencyPipe } from '@angular/common';

@Injectable()
export class ApiPaymentService {
  constructor(
    private httpClient: HttpClient,
    private toastController: ToastController,
    private currencyPipe: CurrencyPipe,
  ) {}

  getPayments(): Observable<{
    payments: ApiPayment[];
    customers: ApiCustomer[];
  }> {
    return this.httpClient.get<{
      payments: ApiPayment[];
      customers: ApiCustomer[];
    }>('/api/payments');
  }

  createPayment(
    customerId: string,
    createPaymentForm: CreatePaymentForm,
  ): Observable<ApiPayment> {
    return this.httpClient
      .post<ApiPayment>(
        `/api/customers/${customerId}/payments`,
        createPaymentForm,
      )
      .pipe(
        // TODO move toasts to ngrx
        // TODO use customer full name
        tap(payment =>
          this.presentToast(
            `Płatność ${this.amountDisplayValue(
              payment.amount,
            )} została zarejestrowana`,
          ),
        ),
      );
  }

  getCustomerPayments(customerId: string): Observable<ApiPayment[]> {
    return this.httpClient
      .get<{ payments: ApiPayment[] }>(`/api/customers/${customerId}/payments`)
      .pipe(map(response => response.payments));
  }

  deletePayment(id: string): Observable<ApiPayment> {
    return this.httpClient.delete<ApiPayment>(`/api/payments/${id}`).pipe(
      // TODO move toasts to ngrx, add customer information to to message
      tap(payment =>
        this.presentToast(
          `Płatność ${this.amountDisplayValue(
            payment.amount,
          )} została usunięta`,
        ),
      ),
    );
  }

  private amountDisplayValue(amount: number): string {
    return this.currencyPipe.transform(amount, 'PLN', 'symbol-narrow');
  }

  private presentToast(message: string): void {
    this.toastController
      .create({
        message,
        duration: 2000,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Ok',
      })
      .present();
  }
}

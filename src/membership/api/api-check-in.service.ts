import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { ToastController } from 'ionic-angular';
import { ApiCheckIn, ApiCustomer } from './models';

@Injectable()
export class ApiCheckInService {
  constructor(
    private httpClient: HttpClient,
    private toastController: ToastController,
  ) {}

  getCheckIns(): Observable<{
    checkIns: ApiCheckIn[];
    customers: ApiCustomer[];
  }> {
    return this.httpClient.get<{
      checkIns: ApiCheckIn[];
      customers: ApiCustomer[];
    }>('/api/check-ins');
  }

  createCheckIn(customerId: string): Observable<ApiCheckIn> {
    return this.httpClient
      .post<ApiCheckIn>(`/api/customers/${customerId}/check-ins`, {})
      .pipe(
        // TODO move toasts to ngrx
        // TODO use customer full name
        tap(() => this.presentToast(`Wejście zostało zarejestrowane`)),
      );
  }

  getCustomerCheckIns(customerId: string): Observable<ApiCheckIn[]> {
    return this.httpClient
      .get<{ checkIns: ApiCheckIn[] }>(`/api/customers/${customerId}/check-ins`)
      .pipe(map(response => response.checkIns));
  }

  deleteCheckIn(id: string): Observable<ApiCheckIn> {
    return this.httpClient.delete<ApiCheckIn>(`/api/check-ins/${id}`).pipe(
      // TODO move toasts to ngrx, add customer information to to message
      tap(() => this.presentToast(`Wejście zostało usunięte`)),
    );
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

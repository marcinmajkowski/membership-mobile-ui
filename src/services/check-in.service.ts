import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { Customer } from './customer.service';
import { ToastController } from 'ionic-angular';
import { CheckIn, CheckInCustomer } from '../membership/models/check-in.model';
import { Iso8601String } from '../membership/models/iso-8601-string.model';

interface CheckInCustomerData {
  id: number;
  firstName: string;
  lastName: string;
}

interface CheckInData {
  id: number;
  customer: CheckInCustomerData;
  timestamp: Iso8601String;
}

const createFullName = (firstName: string, lastName: string): string =>
  lastName.length > 0 ? `${firstName} ${lastName}` : firstName;

const dataToCheckInCustomer = (data: CheckInCustomerData): CheckInCustomer => ({
  id: data.id,
  firstName: data.firstName,
  lastName: data.lastName,
  fullName: createFullName(data.firstName, data.lastName),
});

const dataToCheckIn = (data: CheckInData): CheckIn => ({
  id: data.id,
  customer: data.customer && dataToCheckInCustomer(data.customer),
  timestamp: data.timestamp,
});

@Injectable()
export class CheckInService {

  constructor(private httpClient: HttpClient,
              private toastController: ToastController) {
  }

  getCheckIns(): Observable<CheckIn[]> {
    return this.httpClient.get<{ checkIns: CheckInData[] }>('/api/check-ins').pipe(
      map(response => response.checkIns.map(dataToCheckIn)),
    );
  }

  createCheckIn(customer: Customer): Observable<CheckIn> {
    return this.httpClient.post<CheckInData>(`/api/customers/${customer.id}/check-ins`, {}).pipe(
      map(dataToCheckIn),
      // TODO move toasts to ngrx
      tap(() => this.presentToast(`Wejście ${customer.fullName} zostało zarejestrowane`)),
    );
  }

  getCustomerCheckIns(customer: Customer): Observable<CheckIn[]> {
    return this.httpClient.get<{ checkIns: CheckInData[] }>(`/api/customers/${customer.id}/check-ins`).pipe(
      map(response => response.checkIns.map(dataToCheckIn)),
    );
  }

  deleteCheckIn(checkIn: CheckIn): Observable<{}> {
    return this.httpClient.delete(`/api/check-ins/${checkIn.id}`).pipe(
      // TODO move toasts to ngrx
      tap(() => this.presentToast(deletedToastMessageOf(checkIn)))
    );
  }

  private presentToast(message: string): void {
    this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Ok',
    }).present();
  }
}

function deletedToastMessageOf(checkIn: CheckIn): string {
  if (checkIn.customer) {
    return `Wejście ${checkIn.customer.fullName} zostało usunięte`;
  } else {
    return 'Wejście zostało usunięte';
  }
}

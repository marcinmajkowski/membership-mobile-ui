import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import moment from 'moment';
import { Customer } from './customer.service';
import { ToastController } from 'ionic-angular';

export interface CheckIn {
  id: number;
  customer: CheckInCustomer;
  // TODO keep formatted timestamp instead
  timestamp: moment.Moment;
}

export interface CheckInCustomer {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

interface CheckInCustomerData {
  id: number;
  firstName: string;
  lastName: string;
}

interface CheckInData {
  id: number;
  customer: CheckInCustomerData;
  timestamp: string;
}

const createFullName = (firstName: string, lastName: string): string =>
  lastName.length > 0 ? `${firstName} ${lastName}` : firstName;

const createCheckInCustomer = (data: CheckInCustomerData): CheckInCustomer => ({
  id: data.id,
  firstName: data.firstName,
  lastName: data.lastName,
  fullName: createFullName(data.firstName, data.lastName),
});

const createCheckIn = (data: CheckInData): CheckIn => ({
  id: data.id,
  customer: createCheckInCustomer(data.customer),
  timestamp: moment(data.timestamp),
});

@Injectable()
export class CheckInService {

  private checkInsSubject = new BehaviorSubject<CheckIn[]>([]);
  checkIns$ = this.checkInsSubject.asObservable();

  constructor(private httpClient: HttpClient,
              private toastController: ToastController) {
  }

  createCheckIn(customer: Customer): Observable<CheckIn> {
    return this.httpClient.post<CheckInData>(`/api/customers/${customer.id}/check-ins`, {}).pipe(
      map(createCheckIn),
      // TODO sorting
      tap(checkIn => this.checkInsSubject.next([checkIn, ...this.checkInsSubject.getValue()])),
      tap(() => this.presentToast(`Wejście ${customer.fullName} zostało zarejestrowane`)),
    );
  }

  loadCheckIns(): Observable<CheckIn[]> {
    return this.httpClient.get<{ checkIns: CheckInData[] }>('/api/check-ins').pipe(
      map(response => response.checkIns.map(createCheckIn)),
      tap(checkIns => this.checkInsSubject.next(checkIns))
    );
  }

  getCustomerCheckIns(customer: Customer): Observable<CheckIn[]> {
    return this.httpClient.get<{ checkIns: CheckInData[] }>(`/api/customers/${customer.id}/check-ins`).pipe(
      map(response => response.checkIns.map(createCheckIn)),
    );
  }

  deleteCheckIn(checkIn: CheckIn): Observable<{}> {
    // FIXME remove from already loaded customer view (ngrx will solve this)
    return this.httpClient.delete(`/api/check-ins/${checkIn.id}`).pipe(
      tap(() => this.checkInsSubject.next(this.checkInsSubject.value.filter(value => value.id !== checkIn.id))),
      tap(() => this.presentToast(`Wejście ${checkIn.customer.fullName} zostało usunięte`))
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

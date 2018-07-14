import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import moment from 'moment';

interface CheckInCustomerData {
  id: number;
  firstName: string;
  lastName: string;
}

export class CheckInCustomer {

  public fullName: string;

  private constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
  ) {
    this.fullName = lastName.length > 0 ? `${firstName} ${lastName}` : firstName;
  }

  static fromData(data: CheckInCustomerData) {
    return new CheckInCustomer(
      data.id,
      data.firstName,
      data.lastName,
    );
  }
}

interface CheckInData {
  id: number;
  customer: CheckInCustomerData;
  timestamp: string;
}

export class CheckIn {

  private constructor(
    public id: number,
    public customer: CheckInCustomer,
    public timestamp: moment.Moment,
  ) {
  }

  static fromData(data: CheckInData): CheckIn {
    return new CheckIn(
      data.id,
      CheckInCustomer.fromData(data.customer),
      moment(data.timestamp),
    );
  }
}

@Injectable()
export class CheckInService {

  private checkInsSubject = new BehaviorSubject<CheckIn[]>([]);
  checkIns$ = this.checkInsSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  createCheckIn(customerId: number): Observable<CheckIn> {
    return this.httpClient.post<CheckInData>(`/api/customers/${customerId}/check-ins`, {}).pipe(
      map(CheckIn.fromData),
      // TODO sorting
      tap(checkIn => this.checkInsSubject.next([checkIn, ...this.checkInsSubject.getValue()]))
    );
  }

  loadCheckIns(): Observable<CheckIn[]> {
    return this.httpClient.get<{ checkIns: CheckInData[] }>('/api/check-ins').pipe(
      map(response => response.checkIns.map(CheckIn.fromData)),
      tap(checkIns => this.checkInsSubject.next(checkIns))
    );
  }
}

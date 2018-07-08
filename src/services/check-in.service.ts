import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import moment from 'moment';

interface CheckInData {
  id: number;
  cardCode: string;
  creationInstant: string;
}

export class CheckIn {
  private constructor(
    public id: number,
    public cardCode: string,
    public creationInstant: moment.Moment,
  ) {
  }

  static fromData(data: CheckInData): CheckIn {
    return new CheckIn(
      data.id,
      data.cardCode,
      moment(data.creationInstant),
    );
  }
}

@Injectable()
export class CheckInService {

  private checkInsSubject = new BehaviorSubject<CheckIn[]>([]);
  checkIns$ = this.checkInsSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  createCheckIn(cardCode: string): Observable<CheckIn> {
    const createCheckInRequest = {cardCode};
    return this.httpClient.post<CheckInData>('/api/check-ins', createCheckInRequest).pipe(
      map(CheckIn.fromData),
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

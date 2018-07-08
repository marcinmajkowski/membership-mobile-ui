import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface CheckIn {
  id: number;
  cardCode: string;
  creationInstant: string;
}

@Injectable()
export class CheckInService {

  private checkInsSubject = new BehaviorSubject<CheckIn[]>([]);
  checkIns$ = this.checkInsSubject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  createCheckIn(cardCode: string): Observable<CheckIn> {
    const createCheckInRequest = {cardCode};
    return this.httpClient.post<CheckIn>('/api/check-ins', createCheckInRequest).pipe(
      tap(checkIn => this.checkInsSubject.next([checkIn, ...this.checkInsSubject.getValue()]))
    );
  }

  loadCheckIns(): Observable<CheckIn[]> {
    return this.httpClient.get<{ checkIns: CheckIn[] }>('/api/check-ins').pipe(
      map(response => response.checkIns),
      tap(checkIns => this.checkInsSubject.next(checkIns))
    );
  }
}

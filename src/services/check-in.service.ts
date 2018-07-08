import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export interface CheckIn {
  id: number;
  cardCode: string;
  creationInstant: string;
}

@Injectable()
export class CheckInService {

  constructor(private httpClient: HttpClient) {
  }

  createCheckIn(cardCode: string): Observable<CheckIn> {
    const createCheckInRequest = {cardCode};
    return this.httpClient.post<CheckIn>('/api/check-ins', createCheckInRequest);
  }
}

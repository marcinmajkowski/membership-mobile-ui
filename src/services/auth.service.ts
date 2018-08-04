import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

export interface User {
  authorities: any[];
  details: any;
  authenticated: boolean;
  principal: any;
  credentials: any;
  name: string;
}

@Injectable()
export class AuthService {
  public user: User;

  constructor(private httpClient: HttpClient) {}

  isAuthenticated(): boolean {
    return this.user && this.user.authenticated;
  }

  signInWithEmail(credentials: {
    email: string;
    password: string;
  }): Observable<any> {
    const headers = new HttpHeaders(
      credentials
        ? {
            authorization:
              'Basic ' + btoa(credentials.email + ':' + credentials.password),
          }
        : {},
    );

    return this.httpClient
      .get<User>('/api/users/me', { headers: headers })
      .pipe(
        tap(user => (this.user = user)),
        map(() => ({})),
        catchError(() =>
          ErrorObservable.create({ message: 'An error occured' }),
        ),
      );
  }

  // TODO this is not finished
  // FIXME no state cleared, no navigation etc.
  signOut(): void {
    this.httpClient.post('/api/logout', {}).subscribe();
  }
}

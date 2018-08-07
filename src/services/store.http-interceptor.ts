import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromStore from '../app/store';

@Injectable()
export class StoreHttpInterceptor implements HttpInterceptor {
  constructor(private store: Store<fromStore.State>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const payload = { url: req.url, method: req.method };
    const requestAction = { type: '[HttpClient] Request', payload };
    const responseAction = { type: '[HttpClient] Response', payload };
    this.store.dispatch(requestAction);
    return next
      .handle(req)
      .pipe(finalize(() => this.store.dispatch(responseAction)));
  }
}

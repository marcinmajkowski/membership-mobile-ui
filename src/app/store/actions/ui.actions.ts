import { Action } from '@ngrx/store';
import { Customer } from '../../../membership/models';

export class RefreshCustomerPage implements Action {
  readonly type = '[Ui][CustomerPage] Refresh';
  constructor(public payload: { customer: Customer }) {}
}

export class CheckInListPageLoadCheckIns implements Action {
  readonly type = '[Ui][CheckInListPage] Load Check-Ins';
}

export class CheckInListPageRefreshCheckIns implements Action {
  readonly type = '[Ui][CheckInListPage] Refresh Check-Ins';
}

export class CheckInListPageLoadMoreCheckIns implements Action {
  readonly type = '[Ui][CheckInListPage] Load More Check-Ins';
}

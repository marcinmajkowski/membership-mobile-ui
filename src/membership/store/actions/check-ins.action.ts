import { Action } from '@ngrx/store';
import { CheckIn } from '../../../services/check-in.service';
import { Customer } from '../../../services/customer.service';

export const CHECK_IN_LIST_PAGE_LOAD_CHECK_INS = '[CheckInListPage][CheckIns] Load Check-Ins';
export const LOAD_CHECK_INS_SUCCESS = '[CheckIns] Load Check-Ins Success';
export const CUSTOMER_PAGE_CREATE_CHECK_IN = '[CustomerPage][CheckIns] Create Check-In';
export const CREATE_CHECK_IN_SUCCESS = '[CheckIns] Create Check-In Success';

export class CheckInListPageLoadCheckIns implements Action {
  readonly type = CHECK_IN_LIST_PAGE_LOAD_CHECK_INS;
}

export class LoadCheckInsSuccess implements Action {
  readonly type = LOAD_CHECK_INS_SUCCESS;

  constructor(public payload: CheckIn[]) {
  }
}

export class CustomerPageCreateCheckIn implements Action {
  readonly type = CUSTOMER_PAGE_CREATE_CHECK_IN;

  constructor(public payload: Customer) {
  }
}

export class CreateCheckInSuccess implements Action {
  readonly type = CREATE_CHECK_IN_SUCCESS;

  constructor(public payload: CheckIn) {
  }
}

export type CheckInsAction =
  | CheckInListPageLoadCheckIns
  | LoadCheckInsSuccess
  | CustomerPageCreateCheckIn
  | CreateCheckInSuccess
  ;

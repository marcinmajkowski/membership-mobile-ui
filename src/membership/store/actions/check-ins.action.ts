import { Action } from '@ngrx/store';
import { CheckIn } from '../../models/check-in.model';
import { Customer } from '../../models/customer.model';

export class CheckInListPageLoadCheckIns implements Action {
  readonly type = '[CheckInListPage][CheckIns] Load Check-Ins';
}

export class LoadCheckInsSuccess implements Action {
  readonly type = '[CheckIns] Load Check-Ins Success';

  constructor(public payload: { checkIns: CheckIn[] }) {}
}

export class CustomerPageCreateCheckIn implements Action {
  readonly type = '[CustomerPage][CheckIns] Create Check-In';

  constructor(public payload: { customer: Customer }) {}
}

export class CreateCheckInSuccess implements Action {
  readonly type = '[CheckIns] Create Check-In Success';

  constructor(public payload: { checkIn: CheckIn }) {}
}

export class CustomerPageLoadCustomerCheckIns implements Action {
  readonly type = '[CustomerPage][CheckIns] Load Customer Check-Ins';

  constructor(public payload: { customer: Customer }) {}
}

export class LoadCustomerCheckInsSuccess implements Action {
  readonly type = '[CheckIns] Load Customer Check-Ins Success';

  constructor(public payload: { checkIns: CheckIn[]; customer: Customer }) {}
}

export class CheckInListPageDeleteCheckIn implements Action {
  readonly type = '[CheckInListPage][CheckIns] Delete Check-In';

  constructor(public payload: { checkIn: CheckIn }) {}
}

export class CustomerPageDeleteCheckIn implements Action {
  readonly type = '[CustomerPage][CheckIns] Delete Check-In';

  constructor(public payload: { checkIn: CheckIn }) {}
}

export class DeleteCheckInSuccess implements Action {
  readonly type = '[CheckIns] Delete Check-In Success';

  constructor(public payload: { checkIn: CheckIn }) {}
}

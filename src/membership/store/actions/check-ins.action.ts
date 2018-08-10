import { Action } from '@ngrx/store';
import { CheckIn, Customer } from '../../models';
import { ApiCheckIn } from '../../api/models';

export class CheckInListPageLoadCheckIns implements Action {
  readonly type = '[CheckInListPage] Load Check-Ins';
}

export class LoadCheckInsSuccess implements Action {
  readonly type = '[Api] Load Check-Ins Success';
  constructor(public payload: { checkIns: ApiCheckIn[] }) {}
}

export class CheckInListPageLoadMoreCheckIns implements Action {
  readonly type = '[CheckInListPage] Load More Check-Ins';
}

export class CheckInListPageLoadMoreCheckInsSuccess implements Action {
  readonly type = '[CheckInListPage] Load More Check-Ins Success';
  constructor(public payload: { checkIns: ApiCheckIn[] }) {}
}

export class CustomerPageCreateCheckIn implements Action {
  readonly type = '[CustomerPage] Create Check-In';
  constructor(public payload: { customer: Customer }) {}
}

export class CreateCheckInSuccess implements Action {
  readonly type = '[Api] Create Check-In Success';
  constructor(public payload: { checkIn: ApiCheckIn }) {}
}

export class CustomerPageLoadCustomerCheckIns implements Action {
  readonly type = '[CustomerPage] Load Customer Check-Ins';
  constructor(public payload: { customer: Customer }) {}
}

export class LoadCustomerCheckInsSuccess implements Action {
  readonly type = '[Api] Load Customer Check-Ins Success';
  constructor(public payload: { checkIns: ApiCheckIn[]; customerId: string }) {}
}

export class CheckInListPageDeleteCheckIn implements Action {
  readonly type = '[CheckInListPage] Delete Check-In';
  constructor(public payload: { checkIn: CheckIn }) {}
}

export class CustomerPageDeleteCheckIn implements Action {
  readonly type = '[CustomerPage] Delete Check-In';
  constructor(public payload: { checkIn: CheckIn }) {}
}

export class DeleteCheckInSuccess implements Action {
  readonly type = '[Api] Delete Check-In Success';
  constructor(public payload: { checkIn: ApiCheckIn }) {}
}

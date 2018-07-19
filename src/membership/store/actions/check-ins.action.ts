import { Action } from '@ngrx/store';
import { CheckIn } from '../../../services/check-in.service';

export const CHECK_IN_LIST_PAGE_LOAD_CHECK_INS = '[CheckInListPage][CheckIns] Load Check-Ins';
export const LOAD_CHECK_INS_SUCCESS = '[CheckIns] Load Check-Ins Success';

export class CheckInListPageLoadCheckIns implements Action {
  readonly type = CHECK_IN_LIST_PAGE_LOAD_CHECK_INS;
}

export class LoadCheckInsSuccess implements Action {
  readonly type = LOAD_CHECK_INS_SUCCESS;

  constructor(public payload: CheckIn[]) {
  }
}

export type CheckInsAction =
  | CheckInListPageLoadCheckIns
  | LoadCheckInsSuccess
  ;

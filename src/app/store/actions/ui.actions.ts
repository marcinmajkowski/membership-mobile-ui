import { Action } from '@ngrx/store';
import { Customer } from '../../../membership/models';

export class RefreshCustomerPage implements Action {
  readonly type = '[Ui][CustomerPage] Refresh';
  constructor(public payload: { customer: Customer }) {}
}

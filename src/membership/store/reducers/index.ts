import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCheckIns from './check-ins.reducer';
import * as fromCustomers from './customers.reducer';
import * as fromPayments from './payments.reducer';

export interface MembershipState {
  checkIns: fromCheckIns.CheckInsState;
  customers: fromCustomers.CustomersState;
  payments: fromPayments.PaymentsState;
}

export const reducers: ActionReducerMap<MembershipState> = {
  checkIns: fromCheckIns.reducer,
  customers: fromCustomers.reducer,
  payments: fromPayments.reducer,
};

export const getMembershipState = createFeatureSelector<MembershipState>(
  'membership',
);

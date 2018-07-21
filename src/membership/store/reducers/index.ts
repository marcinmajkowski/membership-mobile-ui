import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCheckIns from './check-ins.reducer';
import * as fromCustomers from './customers.reducer';

export interface MembershipState {
  checkIns: fromCheckIns.CheckInsState;
  customers: fromCustomers.CustomersState;
}

export const reducers: ActionReducerMap<MembershipState> = {
  checkIns: fromCheckIns.reducer,
  customers: fromCustomers.reducer,
};

export const getMembershipState = createFeatureSelector<MembershipState>(
  'membership'
);

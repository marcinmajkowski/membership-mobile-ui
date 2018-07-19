import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCheckIns from './check-ins.reducer';

export interface MembershipState {
  checkIns: fromCheckIns.CheckInsState;
}

export const reducers: ActionReducerMap<MembershipState> = {
  checkIns: fromCheckIns.reducer,
};

export const getMembershipState = createFeatureSelector<MembershipState>(
  'membership'
);

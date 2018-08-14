import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCheckIns from '../reducers/check-ins.reducer';
import { getCustomersEntities } from './customers.selectors';
import { CheckIn, Customer } from '../../models';
import { StoreCheckIn } from '../models';

const getCheckInsState = createSelector(
  fromFeature.getMembershipState,
  (state: fromFeature.MembershipState) => state.checkIns,
);

const fromStoreCheckIn = (customersEntities: { [id: string]: Customer }) => (
  storeCheckIn: StoreCheckIn,
): CheckIn => ({
  id: storeCheckIn.id,
  customer:
    storeCheckIn.customerId === null
      ? null
      : customersEntities[storeCheckIn.customerId],
  timestamp: storeCheckIn.timestamp,
});

const getListAll = createSelector(getCheckInsState, fromCheckIns.getListAll);

export const getCheckIns = createSelector(
  getListAll,
  getCustomersEntities,
  (listAll, customerEntities) =>
    listAll.map(fromStoreCheckIn(customerEntities)),
);

export const isCheckInsLoading = createSelector(
  getCheckInsState,
  fromCheckIns.getListLoading,
);

export const isCheckInsLoaded = createSelector(
  getCheckInsState,
  fromCheckIns.getListLoaded,
);

export const isCheckInsComplete = createSelector(
  getCheckInsState,
  fromCheckIns.getListComplete,
);

export const getOldestLoadedCheckIn = createSelector(
  getCheckIns,
  checkIns =>
    checkIns && checkIns.length > 0 ? checkIns[checkIns.length - 1] : null,
);

// TODO get selected customerId from store
const getCustomerListAll = (customerId: string) =>
  createSelector(getCheckInsState, fromCheckIns.getCustomerListAll(customerId));

export const getCustomerCheckInList = (customerId: string) =>
  createSelector(
    getCustomerListAll(customerId),
    getCustomersEntities,
    (customerListAll, customerEntities) =>
      customerListAll.map(fromStoreCheckIn(customerEntities)),
  );

export const isCustomerCheckInsLoading = (customerId: string) =>
  createSelector(
    getCheckInsState,
    fromCheckIns.getCustomerListLoading(customerId),
  );

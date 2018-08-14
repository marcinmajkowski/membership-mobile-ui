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

const getCustomerListAll = customerId =>
  createSelector(getCheckInsState, fromCheckIns.getCustomerListAll(customerId));

export const getCustomerCheckIns = customerId =>
  createSelector(
    getCustomerListAll(customerId),
    getCustomersEntities,
    (listAll, customerEntities) =>
      listAll.map(fromStoreCheckIn(customerEntities)),
  );

export const isCustomerCheckInsLoading = customerId =>
  createSelector(
    getCheckInsState,
    fromCheckIns.getCustomerListLoading(customerId),
  );

export const isCustomerCheckInsLoaded = customerId =>
  createSelector(
    getCheckInsState,
    fromCheckIns.getCustomerListLoaded(customerId),
  );

export const isCustomerCheckInsComplete = customerId =>
  createSelector(
    getCheckInsState,
    fromCheckIns.getCustomerListComplete(customerId),
  );

export const getCustomerOldestLoadedCheckIn = customerId =>
  createSelector(
    getCustomerCheckIns(customerId),
    checkIns =>
      checkIns && checkIns.length > 0 ? checkIns[checkIns.length - 1] : null,
  );

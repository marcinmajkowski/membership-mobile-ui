import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCheckIns from '../reducers/check-ins.reducer';
import { getCustomersEntities } from './customers.selectors';
import { CheckIn, Customer, Iso8601String } from '../../models';
import { StoreCheckIn } from '../models';

const getCheckInsState = createSelector(
  fromFeature.getMembershipState,
  (state: fromFeature.MembershipState) => state.checkIns,
);

const getCheckInsEntities = createSelector(
  getCheckInsState,
  fromCheckIns.getCheckInsEntities,
);

const getAllCheckIns = createSelector(
  getCheckInsState,
  fromCheckIns.getAllCheckIns,
);

const getCheckInListPageIds = createSelector(
  getCheckInsState,
  fromCheckIns.getCheckInListPageIds,
);

const getLoadedCustomerIds = createSelector(
  getCheckInsState,
  fromCheckIns.getLoadedCustomerIds,
);

const getLoadingCustomerIds = createSelector(
  getCheckInsState,
  fromCheckIns.getLoadingCustomerIds,
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

export const getCheckInListPageCheckIns = createSelector(
  getCheckInsEntities,
  getCheckInListPageIds,
  getCustomersEntities,
  (checkInsEntities, checkInListPageIds, customersEntities) =>
    checkInListPageIds &&
    checkInListPageIds
      .map(id => checkInsEntities[id])
      .map(fromStoreCheckIn(customersEntities))
      .sort(byTimestampDesc),
);

export const getCheckInListPageOldestCheckIn = createSelector(
  getCheckInListPageCheckIns,
  checkIns =>
    checkIns && checkIns.length > 0 ? checkIns[checkIns.length - 1] : null,
);

// TODO get selected customerId from store
export const getCustomerCheckInList = (customerId: string) =>
  createSelector(
    getAllCheckIns,
    getLoadedCustomerIds,
    getCustomersEntities,
    (allCheckIns, loadedCustomerIds, customersEntities) =>
      loadedCustomerIds.indexOf(customerId) > -1
        ? allCheckIns
            .filter(checkIn => checkIn.customerId === customerId)
            .map(fromStoreCheckIn(customersEntities))
            .sort(byTimestampDesc)
        : null,
  );

export const isCustomerCheckInsLoading = (customerId: string) =>
  createSelector(
    getLoadingCustomerIds,
    loadingCustomerIds => loadingCustomerIds.indexOf(customerId) > -1,
  );

function byTimestampDesc(
  a: { timestamp: Iso8601String },
  b: { timestamp: Iso8601String },
): number {
  return b.timestamp.localeCompare(a.timestamp);
}

import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCheckIns from '../reducers/check-ins.reducer';
import { getCustomersEntities } from './customers.selectors';
import { CheckIn } from '../../models/check-in.model';
import { Customer } from '../../models/customer.model';
import { StoreCheckIn } from '../models';

const getCheckInsState = createSelector(
  fromFeature.getMembershipState,
  (state: fromFeature.MembershipState) => state.checkIns,
);

const getCheckInsEntities = createSelector(
  getCheckInsState,
  fromCheckIns.getCheckInsEntities,
);

const getCheckInListPageIds = createSelector(
  getCheckInsState,
  fromCheckIns.getCheckInListPageIds,
);

const fromStoreCheckIn = (
  storeCheckIn: StoreCheckIn,
  customersEntities: { [id: string]: Customer },
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
      .map(checkIn => fromStoreCheckIn(checkIn, customersEntities)),
);

const getCheckInsIdListByCustomerId = createSelector(
  getCheckInsState,
  fromCheckIns.getCheckInsIdListByCustomerId,
);

// TODO get selected customerId from store
const getCustomerCheckInIdList = (customerId: string) =>
  createSelector(
    getCheckInsIdListByCustomerId,
    checkInsIdListByCustomerId => checkInsIdListByCustomerId[customerId],
  );

export const getCustomerCheckInList = (customerId: string) =>
  createSelector(
    getCheckInsEntities,
    getCustomerCheckInIdList(customerId),
    getCustomersEntities,
    (checkInsEntities, customerCheckInIdList, customersEntities) =>
      customerCheckInIdList &&
      customerCheckInIdList
        .map(id => checkInsEntities[id])
        .map(checkIn => fromStoreCheckIn(checkIn, customersEntities)),
  );

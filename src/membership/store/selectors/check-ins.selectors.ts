import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCheckIns from '../reducers/check-ins.reducer';
import { getCustomersEntities } from './customers.selectors';
import { CheckIn } from '../../models/check-in.model';
import { Customer } from '../../models/customer.model';

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

const setCustomer = (
  checkIn: CheckIn,
  customersEntities: { [id: number]: Customer },
): CheckIn =>
  checkIn.customer === null
    ? checkIn
    : {
        ...checkIn,
        customer: customersEntities[checkIn.customer.id],
      };

export const getCheckInListPageCheckIns = createSelector(
  getCheckInsEntities,
  getCheckInListPageIds,
  getCustomersEntities,
  (checkInsEntities, checkInListPageIds, customersEntities) =>
    checkInListPageIds &&
    checkInListPageIds
      .map(id => checkInsEntities[id])
      .map(checkIn => setCustomer(checkIn, customersEntities)),
);

const getCheckInsIdListByCustomerId = createSelector(
  getCheckInsState,
  fromCheckIns.getCheckInsIdListByCustomerId,
);

// TODO get selected customerId from store
const getCustomerCheckInIdList = (customerId: number) =>
  createSelector(
    getCheckInsIdListByCustomerId,
    checkInsIdListByCustomerId => checkInsIdListByCustomerId[customerId],
  );

export const getCustomerCheckInList = (customerId: number) =>
  createSelector(
    getCheckInsEntities,
    getCustomerCheckInIdList(customerId),
    getCustomersEntities,
    (checkInsEntities, customerCheckInIdList, customersEntities) =>
      customerCheckInIdList &&
      customerCheckInIdList
        .map(id => checkInsEntities[id])
        .map(checkIn => setCustomer(checkIn, customersEntities)),
  );

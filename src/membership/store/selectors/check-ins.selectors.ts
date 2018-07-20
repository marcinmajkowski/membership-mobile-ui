import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers/index';
import * as fromCheckIns from '../reducers/check-ins.reducer';

const getCheckInsState = createSelector(
  fromFeature.getMembershipState,
  (state: fromFeature.MembershipState) => state.checkIns,
);

const getCheckInsEntities = createSelector(
  getCheckInsState,
  fromCheckIns.getCheckInsEntities,
);

const getCheckInsIdList = createSelector(
  getCheckInsState,
  fromCheckIns.getCheckInsIdList,
);

export const getCheckInList = createSelector(
  getCheckInsEntities,
  getCheckInsIdList,
  (checkInsEntities, checkInsIdList) => checkInsIdList.map(id => checkInsEntities[id])
);

const getCheckInsIdListByCustomerId = createSelector(
  getCheckInsState,
  fromCheckIns.getCheckInsIdListByCustomerId,
);

// TODO get selected customerId from store
const getCustomerCheckInIdList = (customerId: number) => createSelector(
  getCheckInsIdListByCustomerId,
  checkInsIdListByCustomerId => checkInsIdListByCustomerId[customerId],
);

export const getCustomerCheckInList = (customerId: number) => createSelector(
  getCheckInsEntities,
  getCustomerCheckInIdList(customerId),
  (checkInsEntities, customerCheckInIdList) => customerCheckInIdList && customerCheckInIdList.map(id => checkInsEntities[id])
);

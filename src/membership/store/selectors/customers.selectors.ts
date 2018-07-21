import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCustomers from '../reducers/customers.reducer';

const getCustomersState = createSelector(
  fromFeature.getMembershipState,
  (state: fromFeature.MembershipState) => state.customers,
);

const getCustomersEntities = createSelector(
  getCustomersState,
  fromCustomers.getCustomersEntities,
);

const getCustomersIdList = createSelector(
  getCustomersState,
  fromCustomers.getCustomersIdList,
);

export const getCustomerList = createSelector(
  getCustomersEntities,
  getCustomersIdList,
  (entities, idList) => idList && idList.map(id => entities[id])
);

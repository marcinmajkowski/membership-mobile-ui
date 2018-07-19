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

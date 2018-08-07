import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as fromCheckIns from '../../actions/check-ins.action';
import * as fromCustomers from '../../actions/customers.action';
import { Action } from '@ngrx/store';
import { StoreCheckIn } from '../../models';
import { ApiCheckIn } from '../../../api/models';
import {
  customerIdToIdsReducer,
  CustomerIdToIdsState,
} from './customer-id-to-ids.reducer';
import { listPageIdsReducer, ListPageIdsState } from './list-page-ids.reducer';

export interface CheckInsState extends EntityState<StoreCheckIn> {
  listPageIds: ListPageIdsState;
  idListByCustomerId: CustomerIdToIdsState;
}

const adapter = createEntityAdapter<StoreCheckIn>();

const initialState: CheckInsState = adapter.getInitialState({
  listPageIds: undefined,
  idListByCustomerId: {},
});

const { selectEntities, selectAll } = adapter.getSelectors();

export const getCheckInsEntities = selectEntities;

export const getCheckInListPageIds = (state: CheckInsState) =>
  state.listPageIds;

export const getCheckInsIdListByCustomerId = (state: CheckInsState) =>
  state.idListByCustomerId;

export function reducer(state = initialState, action: Action): CheckInsState {
  const intermediateState = {
    ...state,
    listPageIds: listPageIdsReducer(state.listPageIds, action),
    idListByCustomerId: customerIdToIdsReducer(
      state.idListByCustomerId,
      action,
    ),
  };

  if (action instanceof fromCheckIns.LoadCheckInsSuccess) {
    return loadCheckIns(intermediateState, action);
  } else if (action instanceof fromCheckIns.LoadCustomerCheckInsSuccess) {
    return loadCustomerCheckIns(intermediateState, action);
  } else if (action instanceof fromCheckIns.CreateCheckInSuccess) {
    return createCheckIn(intermediateState, action);
  } else if (action instanceof fromCheckIns.DeleteCheckInSuccess) {
    return deleteCheckIn(intermediateState, action);
  } else if (action instanceof fromCustomers.DeleteCustomerSuccess) {
    return deleteCustomer(intermediateState, action);
  } else {
    return intermediateState;
  }
}

function loadCheckIns(
  state: CheckInsState,
  action: fromCheckIns.LoadCheckInsSuccess,
): CheckInsState {
  const checkIns: StoreCheckIn[] = action.payload.checkIns.map(fromApiCheckIn);
  return adapter.addMany(checkIns, state);
}

function loadCustomerCheckIns(
  state: CheckInsState,
  action: fromCheckIns.LoadCustomerCheckInsSuccess,
): CheckInsState {
  const checkIns: StoreCheckIn[] = action.payload.checkIns.map(fromApiCheckIn);
  return adapter.addMany(checkIns, state);
}

function createCheckIn(
  state: CheckInsState,
  action: fromCheckIns.CreateCheckInSuccess,
): CheckInsState {
  const checkIn: StoreCheckIn = fromApiCheckIn(action.payload.checkIn);
  return adapter.addOne(checkIn, state);
}

function deleteCheckIn(
  state: CheckInsState,
  action: fromCheckIns.DeleteCheckInSuccess,
): CheckInsState {
  return adapter.removeOne(action.payload.checkIn.id, state);
}

function deleteCustomer(
  state: CheckInsState,
  action: fromCustomers.DeleteCustomerSuccess,
): CheckInsState {
  const customer = action.payload.customer;
  const isDeletedCustomerCheckIn = (checkIn: StoreCheckIn) =>
    checkIn.customerId === customer.id;
  const updates = selectAll(state)
    .filter(isDeletedCustomerCheckIn)
    .map(checkIn => ({ id: checkIn.id, changes: { customerId: null } }));
  return adapter.updateMany(updates, state);
}

function fromApiCheckIn(apiCheckIn: ApiCheckIn): StoreCheckIn {
  return {
    id: apiCheckIn.id,
    customerId: apiCheckIn.customerId,
    timestamp: apiCheckIn.timestamp,
  };
}

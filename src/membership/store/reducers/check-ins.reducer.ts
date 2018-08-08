import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as fromCheckIns from '../actions/check-ins.action';
import * as fromCustomers from '../actions/customers.action';
import { Action } from '@ngrx/store';
import { StoreCheckIn } from '../models';
import { ApiCheckIn } from '../../api/models';

// FIXME if client two deletes entity
// FIXME then there is no way for client one to learn about it

export interface CheckInsState extends EntityState<StoreCheckIn> {
  listPageIds: string[];
  loadedCustomerIds: string[];
  loadingCustomerIds: string[];
}

const adapter = createEntityAdapter<StoreCheckIn>();

const initialState: CheckInsState = adapter.getInitialState({
  listPageIds: undefined,
  loadedCustomerIds: [],
  loadingCustomerIds: [],
});

const { selectEntities, selectAll } = adapter.getSelectors();

export const getCheckInsEntities = selectEntities;

export const getAllCheckIns = selectAll;

export const getCheckInListPageIds = (state: CheckInsState) =>
  state.listPageIds;

export const getLoadedCustomerIds = (state: CheckInsState) =>
  state.loadedCustomerIds;

export const getLoadingCustomerIds = (state: CheckInsState) =>
  state.loadingCustomerIds;

export function reducer(state = initialState, action: Action): CheckInsState {
  if (action instanceof fromCheckIns.LoadCheckInsSuccess) {
    return loadCheckInsSuccess(state, action);
  } else if (action instanceof fromCheckIns.CustomerPageLoadCustomerCheckIns) {
    return customerPageLoadCustomerCheckIns(state, action);
  } else if (action instanceof fromCheckIns.LoadCustomerCheckInsSuccess) {
    return loadCustomerCheckInsSuccess(state, action);
  } else if (action instanceof fromCheckIns.CreateCheckInSuccess) {
    return createCheckInSuccess(state, action);
  } else if (action instanceof fromCheckIns.DeleteCheckInSuccess) {
    return deleteCheckInSuccess(state, action);
  } else if (action instanceof fromCustomers.DeleteCustomerSuccess) {
    return deleteCustomerSuccess(state, action);
  } else {
    return state;
  }
}

function loadCheckInsSuccess(
  state: CheckInsState,
  action: fromCheckIns.LoadCheckInsSuccess,
): CheckInsState {
  const checkIns: StoreCheckIn[] = action.payload.checkIns.map(fromApiCheckIn);
  return adapter.addMany(checkIns, {
    ...state,
    listPageIds: checkIns.map(checkIn => checkIn.id),
  });
}

function customerPageLoadCustomerCheckIns(
  state: CheckInsState,
  action: fromCheckIns.CustomerPageLoadCustomerCheckIns,
): CheckInsState {
  const customerId = action.payload.customer.id;
  const loadingCustomerIds = [...state.loadingCustomerIds, customerId];
  return {
    ...state,
    loadingCustomerIds,
  };
}

function loadCustomerCheckInsSuccess(
  state: CheckInsState,
  action: fromCheckIns.LoadCustomerCheckInsSuccess,
): CheckInsState {
  const checkIns: StoreCheckIn[] = action.payload.checkIns.map(fromApiCheckIn);
  const customerId = action.payload.customerId;
  const loadedCustomerIds =
    state.loadedCustomerIds.indexOf(customerId) > -1
      ? state.loadedCustomerIds
      : [...state.loadedCustomerIds, customerId];
  const loadingCustomerIds = state.loadingCustomerIds.filter(
    id => id !== customerId,
  );
  return adapter.addMany(checkIns, {
    ...state,
    loadedCustomerIds,
    loadingCustomerIds,
  });
}

function createCheckInSuccess(
  state: CheckInsState,
  action: fromCheckIns.CreateCheckInSuccess,
): CheckInsState {
  const checkIn: StoreCheckIn = fromApiCheckIn(action.payload.checkIn);
  const listPageIds = state.listPageIds && [...state.listPageIds, checkIn.id];
  return adapter.addOne(checkIn, { ...state, listPageIds });
}

function deleteCheckInSuccess(
  state: CheckInsState,
  action: fromCheckIns.DeleteCheckInSuccess,
): CheckInsState {
  const checkInId = action.payload.checkIn.id;
  const listPageIds =
    state.listPageIds && state.listPageIds.filter(id => id !== checkInId);
  return adapter.removeOne(checkInId, { ...state, listPageIds });
}

function deleteCustomerSuccess(
  state: CheckInsState,
  action: fromCustomers.DeleteCustomerSuccess,
): CheckInsState {
  const customerId = action.payload.customer.id;
  const isDeletedCustomerCheckIn = (checkIn: StoreCheckIn) =>
    checkIn.customerId === customerId;
  const updates = selectAll(state)
    .filter(isDeletedCustomerCheckIn)
    .map(checkIn => ({ id: checkIn.id, changes: { customerId: null } }));
  const loadedCustomerIds = state.loadedCustomerIds.filter(
    id => id !== customerId,
  );
  return adapter.updateMany(updates, { ...state, loadedCustomerIds });
}

function fromApiCheckIn(apiCheckIn: ApiCheckIn): StoreCheckIn {
  return {
    id: apiCheckIn.id,
    customerId: apiCheckIn.customerId,
    timestamp: apiCheckIn.timestamp,
  };
}

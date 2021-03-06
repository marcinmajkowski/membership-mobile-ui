import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as fromCheckIns from '../actions/check-ins.action';
import * as fromCustomers from '../actions/customers.action';
import { Action } from '@ngrx/store';
import { StoreCheckIn } from '../models';
import { ApiCheckIn } from '../../api/models';
import { Iso8601String } from '../../models';
import { createListAdapter, Dictionary, ListState } from './list-state';

const LIST_PAGE_SIZE = 20;

function sortByTimestampDesc(
  a: { timestamp: Iso8601String },
  b: { timestamp: Iso8601String },
): number {
  return b.timestamp.localeCompare(a.timestamp);
}

export interface CheckInsState extends EntityState<StoreCheckIn> {
  list: ListState;
  customerLists: Dictionary<ListState>;
}

const adapter = createEntityAdapter<StoreCheckIn>();

const listAdapter = createListAdapter({
  sortComparer: sortByTimestampDesc,
  pageSize: LIST_PAGE_SIZE,
});

const initialState: CheckInsState = adapter.getInitialState({
  list: listAdapter.getInitialState(),
  customerLists: {},
});

export const { selectEntities, selectAll } = adapter.getSelectors();

const selectList = (state: CheckInsState) => state.list;
export const {
  selectIds: getListIds,
  selectAll: getListAll,
  selectLoading: getListLoading,
  selectLoaded: getListLoaded,
  selectComplete: getListComplete,
} = listAdapter.getSelectors(selectList, selectEntities);

const selectCustomerList = (customerId: string) => (state: CheckInsState) =>
  state.customerLists[customerId] || listAdapter.getInitialState();
const getCustomerListSelectors = (customerId: string) =>
  listAdapter.getSelectors(selectCustomerList(customerId), selectEntities);
export const getCustomerListIds = (customerId: string) =>
  getCustomerListSelectors(customerId).selectIds;
export const getCustomerListAll = (customerId: string) =>
  getCustomerListSelectors(customerId).selectAll;
export const getCustomerListLoading = (customerId: string) =>
  getCustomerListSelectors(customerId).selectLoading;
export const getCustomerListLoaded = (customerId: string) =>
  getCustomerListSelectors(customerId).selectLoaded;
export const getCustomerListComplete = (customerId: string) =>
  getCustomerListSelectors(customerId).selectComplete;

export function reducer(state = initialState, action: Action): CheckInsState {
  if (action instanceof fromCheckIns.LoadCheckIns) {
    return loadCheckIns(state, action);
  }
  if (action instanceof fromCheckIns.LoadCheckInsSuccess) {
    return loadCheckInsSuccess(state, action);
  }
  if (action instanceof fromCheckIns.LoadCustomerCheckIns) {
    return loadCustomerCheckIns(state, action);
  }
  if (action instanceof fromCheckIns.LoadCustomerCheckInsSuccess) {
    return loadCustomerCheckInsSuccess(state, action);
  }
  if (action instanceof fromCheckIns.CreateCheckInSuccess) {
    return createCheckInSuccess(state, action);
  }
  if (action instanceof fromCheckIns.DeleteCheckInSuccess) {
    return deleteCheckInSuccess(state, action);
  }
  if (action instanceof fromCustomers.DeleteCustomerSuccess) {
    return deleteCustomerSuccess(state, action);
  }
  return state;
}

function loadCheckIns(
  state: CheckInsState,
  action: fromCheckIns.LoadCheckIns,
): CheckInsState {
  const list = listAdapter.load(state.list);
  return { ...state, list };
}

function loadCheckInsSuccess(
  state: CheckInsState,
  action: fromCheckIns.LoadCheckInsSuccess,
): CheckInsState {
  const checkIns: StoreCheckIn[] = action.payload.checkIns.map(fromApiCheckIn);
  const beforeTimestamp = action.payload.beforeTimestamp;
  const list = listAdapter.loadSuccess(
    checkIns,
    !!beforeTimestamp,
    state,
    state.list,
  );
  return adapter.addMany(checkIns, { ...state, list });
}

function loadCustomerCheckIns(
  state: CheckInsState,
  action: fromCheckIns.LoadCustomerCheckIns,
): CheckInsState {
  const customerId = action.payload.customer.id;
  const customerList = listAdapter.load(selectCustomerList(customerId)(state));
  const customerLists = {
    ...state.customerLists,
    [customerId]: customerList,
  };
  return { ...state, customerLists };
}

function loadCustomerCheckInsSuccess(
  state: CheckInsState,
  action: fromCheckIns.LoadCustomerCheckInsSuccess,
): CheckInsState {
  const checkIns: StoreCheckIn[] = action.payload.checkIns.map(fromApiCheckIn);
  const beforeTimestamp = action.payload.beforeTimestamp;
  const customerId = action.payload.customerId;
  const customerList = listAdapter.loadSuccess(
    checkIns,
    !!beforeTimestamp,
    state,
    selectCustomerList(customerId)(state),
  );
  const customerLists = {
    ...state.customerLists,
    [customerId]: customerList,
  };
  return adapter.addMany(checkIns, { ...state, customerLists });
}

function createCheckInSuccess(
  state: CheckInsState,
  action: fromCheckIns.CreateCheckInSuccess,
): CheckInsState {
  const checkIn: StoreCheckIn = fromApiCheckIn(action.payload.checkIn);
  const customerId = checkIn.customerId;
  const list = listAdapter.addOne(checkIn, state, state.list);
  let customerLists = state.customerLists;
  if (customerLists[customerId]) {
    const customerList = listAdapter.addOne(
      checkIn,
      state,
      customerLists[customerId],
    );
    customerLists = { ...customerLists, [customerId]: customerList };
  }
  return adapter.addOne(checkIn, { ...state, list, customerLists });
}

function deleteCheckInSuccess(
  state: CheckInsState,
  action: fromCheckIns.DeleteCheckInSuccess,
): CheckInsState {
  const checkInId = action.payload.checkIn.id;
  const customerId = action.payload.checkIn.customerId;
  const list = listAdapter.removeOne(checkInId, state.list);
  let customerLists = state.customerLists;
  if (customerLists[customerId]) {
    const customerList = listAdapter.removeOne(
      checkInId,
      customerLists[customerId],
    );
    customerLists = { ...customerLists, [customerId]: customerList };
  }
  return adapter.removeOne(checkInId, { ...state, list, customerLists });
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
  const { [customerId]: deleted, ...customerLists } = state.customerLists;
  return adapter.updateMany(updates, { ...state, customerLists });
}

function fromApiCheckIn(apiCheckIn: ApiCheckIn): StoreCheckIn {
  return {
    id: apiCheckIn.id,
    customerId: apiCheckIn.customerId,
    timestamp: apiCheckIn.timestamp,
  };
}

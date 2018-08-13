import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as fromCheckIns from '../actions/check-ins.action';
import * as fromCustomers from '../actions/customers.action';
import { Action, createSelector } from '@ngrx/store';
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
  selectLoadingMore: getListLoadingMore,
  selectComplete: getListComplete,
} = listAdapter.getSelectors(selectList, selectEntities);

const selectCustomerList = (customerId: string) => (state: CheckInsState) =>
  state.customerLists[customerId];
const getCustomerListSelectors = (customerId: string) =>
  listAdapter.getSelectors(selectCustomerList(customerId), selectEntities);
export const getCustomerListIds = (customerId: string) =>
  getCustomerListSelectors(customerId).selectIds;
export const getCustomerListAll = (customerId: string) =>
  getCustomerListSelectors(customerId).selectAll;
export const getCustomerListLoading = (customerId: string) =>
  getCustomerListSelectors(customerId).selectLoading;
export const getCustomerListLoadingMore = (customerId: string) =>
  getCustomerListSelectors(customerId).selectLoadingMore;
export const getCustomerListComplete = (customerId: string) =>
  getCustomerListSelectors(customerId).selectComplete;

export function reducer(state = initialState, action: Action): CheckInsState {
  if (action instanceof fromCheckIns.CheckInListPageLoadCheckIns) {
    return loadCheckIns(state, action);
  }
  if (action instanceof fromCheckIns.LoadCheckInsSuccess) {
    return loadCheckInsSuccess(state, action);
  }
  if (action instanceof fromCheckIns.CustomerPageLoadCustomerCheckIns) {
    return customerPageLoadCustomerCheckIns(state, action);
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
  action: fromCheckIns.CheckInListPageLoadCheckIns,
): CheckInsState {
  return {
    ...state,
    list: listAdapter.load(state.list),
  };
}

function loadCheckInsSuccess(
  state: CheckInsState,
  action: fromCheckIns.LoadCheckInsSuccess,
): CheckInsState {
  const checkIns: StoreCheckIn[] = action.payload.checkIns.map(fromApiCheckIn);
  const list = listAdapter.loadSuccess(checkIns, state, state.list);
  return adapter.addMany(checkIns, { ...state, list });
}

function customerPageLoadCustomerCheckIns(
  state: CheckInsState,
  action: fromCheckIns.CustomerPageLoadCustomerCheckIns,
): CheckInsState {
  // TODO
  const customerId = action.payload.customer.id;
  return { ...state };
}

function loadCustomerCheckInsSuccess(
  state: CheckInsState,
  action: fromCheckIns.LoadCustomerCheckInsSuccess,
): CheckInsState {
  // TODO
  const checkIns: StoreCheckIn[] = action.payload.checkIns.map(fromApiCheckIn);
  const customerId = action.payload.customerId;
  return adapter.addMany(checkIns, state);
}

function createCheckInSuccess(
  state: CheckInsState,
  action: fromCheckIns.CreateCheckInSuccess,
): CheckInsState {
  const checkIn: StoreCheckIn = fromApiCheckIn(action.payload.checkIn);
  // TODO listAdapter.addOne
  return adapter.addOne(checkIn, state);
}

function deleteCheckInSuccess(
  state: CheckInsState,
  action: fromCheckIns.DeleteCheckInSuccess,
): CheckInsState {
  const checkInId = action.payload.checkIn.id;
  // TODO listAdapter.removeOne
  return adapter.removeOne(checkInId, state);
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
  return adapter.updateMany(updates, state);
}

function fromApiCheckIn(apiCheckIn: ApiCheckIn): StoreCheckIn {
  return {
    id: apiCheckIn.id,
    customerId: apiCheckIn.customerId,
    timestamp: apiCheckIn.timestamp,
  };
}

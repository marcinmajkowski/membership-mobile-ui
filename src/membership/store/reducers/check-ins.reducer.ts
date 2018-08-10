import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as fromCheckIns from '../actions/check-ins.action';
import * as fromCustomers from '../actions/customers.action';
import { Action } from '@ngrx/store';
import { StoreCheckIn } from '../models';
import { ApiCheckIn } from '../../api/models';
import { Iso8601String } from '../../models';

export type Comparer<T> = (a: T, b: T) => number;

// TODO move to util
export interface Dictionary<T> {
  [id: string]: T;
  [id: number]: T;
}

// TODO move to util
export interface ListState {
  ids: string[] | number[];
  loading: boolean;
  complete: boolean;
}

export class ListAdapter<T> {
  constructor(
    private sortComparer: false | Comparer<T>,
    private pageSize: false | number,
  ) {}

  getInitialState(): ListState {
    return {
      ids: [],
      loading: false,
      complete: false,
    };
  }

  load(listState: ListState): ListState {
    return {
      ...listState,
      loading: true,
    };
  }

  loadSuccess(
    entities: T[],
    state: EntityState<T>,
    listState: ListState,
  ): ListState {
    // TODO use idSelector, remove any
    const keys = entities.map((entity: any) => entity.id);
    // TODO remove conversion
    let ids = <any[]>[...listState.ids, ...keys];
    if (this.sortComparer) {
      // TODO use idSelector, remove any
      const allEntities = {
        ...state.entities,
        ...entities.reduce((newEntities, entity: any) => {
          newEntities[entity.id] = entity;
          return newEntities;
        }, {}),
      };
      ids = ids
        .map(id => allEntities[id])
        .sort(this.sortComparer)
        .map((entity: any) => entity.id);
    }
    return {
      ...listState,
      ids,
      loading: false,
      complete: !this.pageSize || keys.length < this.pageSize,
    };
  }

  // TODO
  getSelectors() {}
}

export function createListAdapter<T>(options?: {
  sortComparer?: false | Comparer<T>;
  pageSize?: false | number;
}): ListAdapter<T> {
  const sortComparer = (options && options.sortComparer) || false;
  const pageSize = (options && options.pageSize) || false;
  return new ListAdapter(sortComparer, pageSize);
}

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

const { selectEntities, selectAll } = adapter.getSelectors();

export const getCheckInsEntities = selectEntities;

export const getAllCheckIns = selectAll;

// TODO
export const getCheckInListPageIds = (state: CheckInsState) => [];
export const getLoadedCustomerIds = (state: CheckInsState) => [];
export const getLoadingCustomerIds = (state: CheckInsState) => [];

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

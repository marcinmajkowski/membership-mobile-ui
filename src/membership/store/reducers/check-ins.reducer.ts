import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as fromCheckIns from '../actions/check-ins.action';
import * as fromCustomers from '../actions/customers.action';
import { Action } from '@ngrx/store';
import { StoreCheckIn } from '../models';
import { ApiCheckIn } from '../../api/models';

export interface CheckInsState extends EntityState<StoreCheckIn> {
  listPageIds: string[];
  idListByCustomerId: { [customerId: string]: string[] };
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
  if (action instanceof fromCheckIns.LoadCheckInsSuccess) {
    return loadCheckIns(state, action);
  } else if (action instanceof fromCheckIns.LoadCustomerCheckInsSuccess) {
    return loadCustomerCheckIns(state, action);
  } else if (action instanceof fromCheckIns.CreateCheckInSuccess) {
    return createCheckIn(state, action);
  } else if (action instanceof fromCheckIns.DeleteCheckInSuccess) {
    return deleteCheckIn(state, action);
  } else if (action instanceof fromCustomers.DeleteCustomerSuccess) {
    return deleteCustomer(state, action);
  } else {
    return state;
  }
}

function loadCheckIns(
  state: CheckInsState,
  action: fromCheckIns.LoadCheckInsSuccess,
): CheckInsState {
  const checkIns: StoreCheckIn[] = action.payload.checkIns.map(fromApiCheckIn);
  return adapter.addMany(checkIns, {
    ...state,
    listPageIds: checkIns.map(checkIn => checkIn.id),
    // FIXME maintain idListByCustomerId
  });
}

function loadCustomerCheckIns(
  state: CheckInsState,
  action: fromCheckIns.LoadCustomerCheckInsSuccess,
): CheckInsState {
  const checkIns: StoreCheckIn[] = action.payload.checkIns.map(fromApiCheckIn);
  const customerId: string = action.payload.customerId;
  return adapter.addMany(checkIns, {
    ...state,
    idListByCustomerId: {
      ...state.idListByCustomerId,
      [customerId]: checkIns.map(checkIn => checkIn.id),
    },
  });
}

function createCheckIn(
  state: CheckInsState,
  action: fromCheckIns.CreateCheckInSuccess,
): CheckInsState {
  const checkIn: StoreCheckIn = fromApiCheckIn(action.payload.checkIn);
  const customerId = checkIn.customerId;
  return adapter.addOne(checkIn, {
    ...state,
    // TODO sorting
    listPageIds: !state.listPageIds
      ? state.listPageIds
      : [checkIn.id, ...state.listPageIds],
    idListByCustomerId: !state.idListByCustomerId[customerId]
      ? state.idListByCustomerId
      : {
          ...state.idListByCustomerId,
          // TODO sorting
          [customerId]: [checkIn.id, ...state.idListByCustomerId[customerId]],
        },
  });
}

function deleteCheckIn(
  state: CheckInsState,
  action: fromCheckIns.DeleteCheckInSuccess,
): CheckInsState {
  const checkIn: StoreCheckIn = fromApiCheckIn(action.payload.checkIn);
  const customerId = checkIn.customerId;
  return adapter.removeOne(checkIn.id, {
    ...state,
    listPageIds: !state.listPageIds
      ? state.listPageIds
      : state.listPageIds.filter(id => id !== checkIn.id),
    idListByCustomerId:
      customerId === null || !state.idListByCustomerId[customerId]
        ? state.idListByCustomerId
        : {
            ...state.idListByCustomerId,
            [customerId]: state.idListByCustomerId[customerId].filter(
              id => id !== checkIn.id,
            ),
          },
  });
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

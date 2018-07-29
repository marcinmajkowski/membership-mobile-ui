import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { CheckIn } from '../../models/check-in.model';
import * as fromCheckIns from '../actions/check-ins.action';
import * as fromCustomers from '../actions/customers.action';
import { Action } from '@ngrx/store';

export interface CheckInsState extends EntityState<CheckIn> {
  listPageIds: number[];
  idListByCustomerId: { [customerId: number]: number[] };
}

const adapter = createEntityAdapter<CheckIn>();

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
    return loadCheckInsSuccessReducer(state, action);
  } else if (action instanceof fromCheckIns.LoadCustomerCheckInsSuccess) {
    return loadCustomerCheckInsSuccessReducer(state, action);
  } else if (action instanceof fromCheckIns.CreateCheckInSuccess) {
    return createCheckInSuccessReducer(state, action);
  } else if (action instanceof fromCheckIns.DeleteCheckInSuccess) {
    return deleteCheckInSuccessReducer(state, action);
  } else if (action instanceof fromCustomers.DeleteCustomerSuccess) {
    return deleteCustomerSuccessReducer(state, action);
  } else {
    return state;
  }
}

function loadCheckInsSuccessReducer(
  state: CheckInsState,
  action: fromCheckIns.LoadCheckInsSuccess,
): CheckInsState {
  const checkIns: CheckIn[] = action.payload.checkIns;
  return adapter.addMany(checkIns, {
    ...state,
    listPageIds: checkIns.map(checkIn => checkIn.id),
    // FIXME maintain idListByCustomerId
  });
}

function loadCustomerCheckInsSuccessReducer(
  state: CheckInsState,
  action: fromCheckIns.LoadCustomerCheckInsSuccess,
): CheckInsState {
  const { checkIns, customer } = action.payload;
  return adapter.addMany(checkIns, {
    ...state,
    idListByCustomerId: {
      ...state.idListByCustomerId,
      [customer.id]: checkIns.map(checkIn => checkIn.id),
    },
  });
}

function createCheckInSuccessReducer(
  state: CheckInsState,
  action: fromCheckIns.CreateCheckInSuccess,
): CheckInsState {
  const checkIn: CheckIn = action.payload.checkIn;
  const customerId = checkIn.customer.id;
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

function deleteCheckInSuccessReducer(
  state: CheckInsState,
  action: fromCheckIns.DeleteCheckInSuccess,
): CheckInsState {
  const checkIn: CheckIn = action.payload.checkIn;
  const customer = checkIn.customer;
  return adapter.removeOne(checkIn.id, {
    ...state,
    listPageIds: !state.listPageIds
      ? state.listPageIds
      : state.listPageIds.filter(id => id !== checkIn.id),
    idListByCustomerId:
      !customer || !state.idListByCustomerId[customer.id]
        ? state.idListByCustomerId
        : {
            ...state.idListByCustomerId,
            [customer.id]: state.idListByCustomerId[customer.id].filter(
              id => id !== checkIn.id,
            ),
          },
  });
}

function deleteCustomerSuccessReducer(
  state: CheckInsState,
  action: fromCustomers.DeleteCustomerSuccess,
): CheckInsState {
  const customer = action.payload.customer;
  const isDeletedCustomerCheckIn = checkIn =>
    checkIn.customer && checkIn.customer.id === customer.id;
  const updates = selectAll(state)
    .filter(isDeletedCustomerCheckIn)
    .map(checkIn => ({ id: checkIn.id, changes: { customer: null } }));
  return adapter.updateMany(updates, state);
}

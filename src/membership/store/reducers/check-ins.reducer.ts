import { CheckIn } from '../../models/check-in.model';
import * as fromCheckIns from '../actions/check-ins.action';
import * as fromCustomers from '../actions/customers.action';
import { mapById, mapEntries } from '../../../util/redux';

export interface CheckInsState {
  entities: { [id: number]: CheckIn };
  idList: number[];
  idListByCustomerId: { [customerId: number]: number[] };
}

export const initialState: CheckInsState = {
  entities: {},
  idList: undefined,
  idListByCustomerId: {},
};

export function reducer(
  state = initialState,
  action: fromCheckIns.CheckInsAction | fromCustomers.DeleteCustomerSuccess
): CheckInsState {
  switch (action.type) {
    case fromCheckIns.LOAD_CHECK_INS_SUCCESS:
      return loadCheckInsSuccessReducer(state, action);
    case fromCheckIns.LOAD_CUSTOMER_CHECK_INS_SUCCESS:
      return loadCustomerCheckInsSuccessReducer(state, action);
    case fromCheckIns.CREATE_CHECK_IN_SUCCESS:
      return createCheckInSuccessReducer(state, action);
    case fromCheckIns.DELETE_CHECK_IN_SUCCESS:
      return deleteCheckInSuccessReducer(state, action);
    // TODO not sure if it belongs here
    case fromCustomers.DELETE_CUSTOMER_SUCCESS:
      return deleteCustomerSuccessReducer(state, action);
    default:
      return state;
  }
}

function loadCheckInsSuccessReducer(state: CheckInsState, action: fromCheckIns.LoadCheckInsSuccess): CheckInsState {
  const checkIns: CheckIn[] = action.payload.checkIns;
  return {
    ...state,
    entities: {
      ...state.entities,
      ...mapById(checkIns),
    },
    idList: checkIns.map(checkIn => checkIn.id),
    // FIXME maintain idListByCustomerId
  };
}

function loadCustomerCheckInsSuccessReducer(state: CheckInsState, action: fromCheckIns.LoadCustomerCheckInsSuccess): CheckInsState {
  const {checkIns, customer} = action.payload;
  return {
    ...state,
    entities: {
      ...state.entities,
      ...mapById(checkIns),
    },
    idListByCustomerId: {
      ...state.idListByCustomerId,
      [customer.id]: checkIns.map(checkIn => checkIn.id),
    }
  };
}

function createCheckInSuccessReducer(state: CheckInsState, action: fromCheckIns.CreateCheckInSuccess): CheckInsState {
  const checkIn: CheckIn = action.payload.checkIn;
  const customerId = checkIn.customer.id;
  return {
    ...state,
    entities: {
      ...state.entities,
      [checkIn.id]: checkIn,
    },
    // TODO sorting
    idList: !state.idList ? state.idList : [
      checkIn.id,
      ...state.idList,
    ],
    idListByCustomerId: !state.idListByCustomerId[customerId] ? state.idListByCustomerId : {
      ...state.idListByCustomerId,
      // TODO sorting
      [customerId]: [checkIn.id, ...state.idListByCustomerId[customerId]],
    },
  };
}

function deleteCheckInSuccessReducer(state: CheckInsState, action: fromCheckIns.DeleteCheckInSuccess): CheckInsState {
  const checkIn: CheckIn = action.payload.checkIn;
  const customer = checkIn.customer;
  return {
    ...state,
    idList: !state.idList ? state.idList : state.idList.filter(id => id !== checkIn.id),
    idListByCustomerId: !customer || !state.idListByCustomerId[customer.id] ? state.idListByCustomerId : {
      ...state.idListByCustomerId,
      [customer.id]: state.idListByCustomerId[customer.id].filter(id => id !== checkIn.id),
    },
  };
}

function deleteCustomerSuccessReducer(state: CheckInsState, action: fromCustomers.DeleteCustomerSuccess): CheckInsState {
  const customer = action.payload.customer;
  const isDeletedCustomerCheckIn = checkIn => checkIn.customer && checkIn.customer.id === customer.id;
  return {
    ...state,
    entities: mapEntries(
      state.entities,
      checkIn => isDeletedCustomerCheckIn(checkIn) ? {...checkIn, customer: null} : checkIn
    ),
  };
}

export const getCheckInsEntities = (state: CheckInsState) => state.entities;
export const getCheckInsIdList = (state: CheckInsState) => state.idList;
export const getCheckInsIdListByCustomerId = (state: CheckInsState) => state.idListByCustomerId;

import { CheckIn } from '../../../services/check-in.service';
import * as fromCheckIns from '../actions/check-ins.action';

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
  action: fromCheckIns.CheckInsAction
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
    default:
      return state;
  }
}

function loadCheckInsSuccessReducer(state: CheckInsState, action: fromCheckIns.LoadCheckInsSuccess): CheckInsState {
  const checkIns: CheckIn[] = action.payload;
  return {
    ...state,
    entities: addToEntities(state.entities, checkIns),
    idList: checkIns.map(checkIn => checkIn.id),
    // FIXME maintain idListByCustomerId
  };
}

function loadCustomerCheckInsSuccessReducer(state: CheckInsState, action: fromCheckIns.LoadCustomerCheckInsSuccess): CheckInsState {
  const {checkIns, customer} = action.payload;
  return {
    ...state,
    entities: addToEntities(state.entities, checkIns),
    idListByCustomerId: {
      ...state.idListByCustomerId,
      [customer.id]: checkIns.map(checkIn => checkIn.id),
    }
  };
}

function createCheckInSuccessReducer(state: CheckInsState, action: fromCheckIns.CreateCheckInSuccess): CheckInsState {
  const checkIn: CheckIn = action.payload;
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
  }
}

function deleteCheckInSuccessReducer(state: CheckInsState, action: fromCheckIns.DeleteCheckInSuccess): CheckInsState {
  const checkIn: CheckIn = action.payload;
  const customerId = checkIn.customer.id;
  return {
    ...state,
    idList: !state.idList ? state.idList : state.idList.filter(id => id !== checkIn.id),
    idListByCustomerId: !state.idListByCustomerId[customerId] ? state.idListByCustomerId : {
      ...state.idListByCustomerId,
      [customerId]: state.idListByCustomerId[customerId].filter(id => id !== checkIn.id),
    },
  };
}

function addToEntities(entities: { [id: number]: CheckIn }, checkIns: CheckIn[]) {
  return checkIns.reduce(
    (entities, checkIn) => {
      return {
        ...entities,
        [checkIn.id]: checkIn,
      }
    },
    {
      ...entities
    }
  );
}

export const getCheckInsEntities = (state: CheckInsState) => state.entities;
export const getCheckInsIdList = (state: CheckInsState) => state.idList;
export const getCheckInsIdListByCustomerId = (state: CheckInsState) => state.idListByCustomerId;

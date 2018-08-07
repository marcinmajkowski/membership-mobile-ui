import * as fromCheckIns from '../../actions/check-ins.action';
import { Action } from '@ngrx/store';

export interface CustomerIdToIdsState {
  [customerId: string]: string[];
}

export function customerIdToIdsReducer(
  state: CustomerIdToIdsState,
  action: Action,
): CustomerIdToIdsState {
  if (action instanceof fromCheckIns.LoadCustomerCheckInsSuccess) {
    return loadCustomerCheckIns(state, action);
  }
  if (action instanceof fromCheckIns.CreateCheckInSuccess) {
    return createCheckIn(state, action);
  }
  if (action instanceof fromCheckIns.DeleteCheckInSuccess) {
    return deleteCheckIn(state, action);
  }
  return state;
}

function loadCustomerCheckIns(
  state: CustomerIdToIdsState,
  action: fromCheckIns.LoadCustomerCheckInsSuccess,
): CustomerIdToIdsState {
  const checkIns = action.payload.checkIns;
  const customerId = action.payload.customerId;
  return {
    ...state,
    [customerId]: checkIns.map(checkIn => checkIn.id),
  };
}

function createCheckIn(
  state: CustomerIdToIdsState,
  action: fromCheckIns.CreateCheckInSuccess,
): CustomerIdToIdsState {
  const checkIn = action.payload.checkIn;
  const customerId = checkIn.customerId;
  if (!state[customerId]) {
    return state;
  } else {
    // TODO sorting
    return {
      ...state,
      [customerId]: [checkIn.id, ...state[customerId]],
    };
  }
}

function deleteCheckIn(
  state: CustomerIdToIdsState,
  action: fromCheckIns.DeleteCheckInSuccess,
): CustomerIdToIdsState {
  const checkIn = action.payload.checkIn;
  const customerId = checkIn.customerId;
  if (customerId === null || !state[customerId]) {
    return state;
  } else {
    return {
      ...state,
      [customerId]: state[customerId].filter(id => id !== checkIn.id),
    };
  }
}

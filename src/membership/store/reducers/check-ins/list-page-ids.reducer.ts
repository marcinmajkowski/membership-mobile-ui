import * as fromCheckIns from '../../actions/check-ins.action';
import { Action } from '@ngrx/store';

export type ListPageIdsState = string[];

export function listPageIdsReducer(
  state: ListPageIdsState,
  action: Action,
): ListPageIdsState {
  if (action instanceof fromCheckIns.LoadCheckInsSuccess) {
    return loadCheckIns(state, action);
  }
  if (action instanceof fromCheckIns.CreateCheckInSuccess) {
    return createCheckIn(state, action);
  }
  if (action instanceof fromCheckIns.DeleteCheckInSuccess) {
    return deleteCheckIn(state, action);
  }
  return state;
}

function loadCheckIns(
  state: ListPageIdsState,
  action: fromCheckIns.LoadCheckInsSuccess,
): ListPageIdsState {
  return action.payload.checkIns.map(checkIn => checkIn.id);
}

function createCheckIn(
  state: ListPageIdsState,
  action: fromCheckIns.CreateCheckInSuccess,
): ListPageIdsState {
  return state && [action.payload.checkIn.id, ...state];
}

function deleteCheckIn(
  state: ListPageIdsState,
  action: fromCheckIns.DeleteCheckInSuccess,
): ListPageIdsState {
  const checkInId = action.payload.checkIn.id;
  return state && state.filter(id => id !== checkInId);
}

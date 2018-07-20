import { CheckIn } from '../../../services/check-in.service';
import * as fromCheckIns from '../actions/check-ins.action';

export interface CheckInsState {
  entities: { [id: number]: CheckIn };
  idList: number[];
}

export const initialState: CheckInsState = {
  entities: {},
  idList: [],
};

export function reducer(
  state = initialState,
  action: fromCheckIns.CheckInsAction
): CheckInsState {
  switch (action.type) {
    case fromCheckIns.LOAD_CHECK_INS_SUCCESS:
      return loadCheckInsSuccessReducer(state, action);
    case fromCheckIns.CREATE_CHECK_IN_SUCCESS:
      return createCheckInSuccessReducer(state, action);
  }
  return state;
}

function loadCheckInsSuccessReducer(state: CheckInsState, action: fromCheckIns.LoadCheckInsSuccess): CheckInsState {
  const checkIns: CheckIn[] = action.payload;
  return {
    ...state,
    entities: checkIns.reduce(
      (entities, checkIn) => {
        return {
          ...entities,
          [checkIn.id]: checkIn,
        }
      },
      {
        ...state.entities
      }
    ),
    idList: checkIns.map(checkIn => checkIn.id),
  }
}

function createCheckInSuccessReducer(state: CheckInsState, action: fromCheckIns.CreateCheckInSuccess): CheckInsState {
  const checkIn: CheckIn = action.payload;
  return {
    ...state,
    entities: {
      ...state.entities,
      [checkIn.id]: checkIn,
    },
    // TODO sorting
    idList: [
      checkIn.id,
      ...state.idList,
    ],
  }
}

export const getCheckInsEntities = (state: CheckInsState) => state.entities;
export const getCheckInsIdList = (state: CheckInsState) => state.idList;

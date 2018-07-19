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
  }
  return state;
}

function loadCheckInsSuccessReducer(state: CheckInsState, action: fromCheckIns.LoadCheckInsSuccess): CheckInsState {
  const checkIns: CheckIn[] = action.payload;
  return {
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

export const getCheckInsEntities = (state: CheckInsState) => state.entities;
export const getCheckInsIdList = (state: CheckInsState) => state.idList;

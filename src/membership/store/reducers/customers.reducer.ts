import { Customer } from '../../../services/customer.service';
import * as fromCustomers from '../actions/customers.action';
import { mapById } from '../../../util/redux';

export interface CustomersState {
  entities: { [id: number]: Customer };
  allIds: number[];
}

export const initialState: CustomersState = {
  entities: {},
  allIds: undefined,
};

export function reducer(
  state = initialState,
  action: fromCustomers.CustomersAction
): CustomersState {
  switch (action.type) {
    case fromCustomers.LOAD_CUSTOMERS_SUCCESS:
      return loadCustomersSuccessReducer(state, action);
    default:
      return state;
  }
}

function loadCustomersSuccessReducer(state: CustomersState, action: fromCustomers.LoadCustomersSuccess) {
  const customers = action.payload.customers;
  return {
    ...state,
    entities: {
      ...state.entities,
      ...mapById(customers),
    },
    allIds: customers.map(customer => customer.id),
  };
}

import { Customer } from '../../../services/customer.service';
import * as fromCustomers from '../actions/customers.action';
import { mapById } from '../../../util/redux';

export interface CustomersState {
  entities: { [id: number]: Customer };
  idList: number[];
}

export const initialState: CustomersState = {
  entities: {},
  idList: undefined,
};

export function reducer(
  state = initialState,
  action: fromCustomers.CustomersAction
): CustomersState {
  switch (action.type) {
    case fromCustomers.LOAD_CUSTOMERS_SUCCESS:
      return loadCustomersSuccessReducer(state, action);
    case fromCustomers.CREATE_CUSTOMER_SUCCESS:
      return createCustomerSuccessReducer(state, action);
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
    idList: customers.map(customer => customer.id),
  };
}

function createCustomerSuccessReducer(state: CustomersState, action: fromCustomers.CreateCustomerSuccess) {
  const customer = action.payload.customer;
  return {
    ...state,
    entities: {
      ...state.entities,
      [customer.id]: customer,
    },
    idList: !state.idList ? state.idList : [
      ...state.idList,
      customer.id,
    ],
  };
}

export const getCustomersEntities = (state: CustomersState) => state.entities;
export const getCustomersIdList = (state: CustomersState) => state.idList;

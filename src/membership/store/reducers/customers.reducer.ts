import { Customer } from '../../models/customer.model';
import * as fromCustomers from '../actions/customers.action';
import { mapById, removeById } from '../../../util/redux';

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
    case fromCustomers.DELETE_CUSTOMER_SUCCESS:
      // TODO remove customer from check-ins and payments as well or change check-in/payment model
      return deleteCustomerSuccessReducer(state, action);
    default:
      return state;
  }
}

function loadCustomersSuccessReducer(state: CustomersState, action: fromCustomers.LoadCustomersSuccess): CustomersState {
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

function createCustomerSuccessReducer(state: CustomersState, action: fromCustomers.CreateCustomerSuccess): CustomersState {
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

function deleteCustomerSuccessReducer(state: CustomersState, action: fromCustomers.DeleteCustomerSuccess): CustomersState {
  const customer = action.payload.customer;
  return {
    ...state,
    entities: removeById(state.entities, customer),
    idList: !state.idList ? state.idList : state.idList.filter(id => id !== customer.id),
  };
}

export const getCustomersEntities = (state: CustomersState) => state.entities;
export const getCustomersIdList = (state: CustomersState) => state.idList;

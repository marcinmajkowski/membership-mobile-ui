import { EntityState, createEntityAdapter } from '@ngrx/entity';
import * as fromPayments from '../actions/payments.action';
import * as fromCustomers from '../actions/customers.action';
import { Action } from '@ngrx/store';
import { StorePayment } from '../models';
import { ApiPayment } from '../../api/models';

export interface PaymentsState extends EntityState<StorePayment> {
  listPageIds: string[];
  idListByCustomerId: { [customerId: string]: string[] };
}

const adapter = createEntityAdapter<StorePayment>();

const initialState: PaymentsState = adapter.getInitialState({
  listPageIds: undefined,
  idListByCustomerId: {},
});

const { selectEntities, selectAll } = adapter.getSelectors();

export const getPaymentsEntities = selectEntities;
export const getPaymentListPageIds = (state: PaymentsState) =>
  state.listPageIds;
export const getPaymentsIdListByCustomerId = (state: PaymentsState) =>
  state.idListByCustomerId;

export function reducer(state = initialState, action: Action): PaymentsState {
  if (action instanceof fromPayments.LoadPaymentsSuccess) {
    return loadPaymentsSuccessReducer(state, action);
  } else if (action instanceof fromPayments.LoadCustomerPaymentsSuccess) {
    return loadCustomerPaymentsSuccessReducer(state, action);
  } else if (action instanceof fromPayments.CreatePaymentSuccess) {
    return createPaymentSuccessReducer(state, action);
  } else if (action instanceof fromPayments.DeletePaymentSuccess) {
    return deletePaymentSuccessReducer(state, action);
  } else if (action instanceof fromCustomers.DeleteCustomerSuccess) {
    return deleteCustomerSuccessReducer(state, action);
  } else {
    return state;
  }
}

function loadPaymentsSuccessReducer(
  state: PaymentsState,
  action: fromPayments.LoadPaymentsSuccess,
): PaymentsState {
  const payments: StorePayment[] = action.payload.payments.map(fromApiPayment);
  return adapter.addMany(payments, {
    ...state,
    listPageIds: payments.map(payment => payment.id),
    // FIXME maintain idListByCustomerId
  });
}

function loadCustomerPaymentsSuccessReducer(
  state: PaymentsState,
  action: fromPayments.LoadCustomerPaymentsSuccess,
): PaymentsState {
  const payments: StorePayment[] = action.payload.payments.map(fromApiPayment);
  const customerId: string = action.payload.customerId;
  return adapter.addMany(payments, {
    ...state,
    idListByCustomerId: {
      ...state.idListByCustomerId,
      [customerId]: payments.map(payment => payment.id),
    },
  });
}

function createPaymentSuccessReducer(
  state: PaymentsState,
  action: fromPayments.CreatePaymentSuccess,
): PaymentsState {
  const payment: StorePayment = fromApiPayment(action.payload.payment);
  const customerId = payment.customerId;
  return adapter.addOne(payment, {
    ...state,
    // TODO sorting
    listPageIds: !state.listPageIds
      ? state.listPageIds
      : [payment.id, ...state.listPageIds],
    idListByCustomerId: !state.idListByCustomerId[customerId]
      ? state.idListByCustomerId
      : {
          ...state.idListByCustomerId,
          // TODO sorting
          [customerId]: [payment.id, ...state.idListByCustomerId[customerId]],
        },
  });
}

function deletePaymentSuccessReducer(
  state: PaymentsState,
  action: fromPayments.DeletePaymentSuccess,
): PaymentsState {
  const payment: StorePayment = fromApiPayment(action.payload.payment);
  const customerId = payment.customerId;
  return adapter.removeOne(payment.id, {
    ...state,
    listPageIds: !state.listPageIds
      ? state.listPageIds
      : state.listPageIds.filter(id => id !== payment.id),
    idListByCustomerId:
      customerId === null || !state.idListByCustomerId[customerId]
        ? state.idListByCustomerId
        : {
            ...state.idListByCustomerId,
            [customerId]: state.idListByCustomerId[customerId].filter(
              id => id !== payment.id,
            ),
          },
  });
}

function deleteCustomerSuccessReducer(
  state: PaymentsState,
  action: fromCustomers.DeleteCustomerSuccess,
): PaymentsState {
  const customer = action.payload.customer;
  const isDeletedCustomerPayment = (payment: StorePayment) =>
    payment.customerId === customer.id;
  const updates = selectAll(state)
    .filter(isDeletedCustomerPayment)
    .map(payment => ({ id: payment.id, changes: { customerId: null } }));
  return adapter.updateMany(updates, state);
}

function fromApiPayment(apiPayment: ApiPayment): StorePayment {
  return {
    id: apiPayment.id,
    customerId: apiPayment.customerId,
    amount: apiPayment.amount,
    timestamp: apiPayment.timestamp,
  };
}

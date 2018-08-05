import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPayments from '../reducers/payments.reducer';
import { getCustomersEntities } from './customers.selectors';
import { Customer, Payment } from '../../models';
import { StorePayment } from '../models';

const getPaymentsState = createSelector(
  fromFeature.getMembershipState,
  (state: fromFeature.MembershipState) => state.payments,
);

const getPaymentsEntities = createSelector(
  getPaymentsState,
  fromPayments.getPaymentsEntities,
);

const getPaymentListPageIds = createSelector(
  getPaymentsState,
  fromPayments.getPaymentListPageIds,
);

const fromStorePayment = (
  storePayment: StorePayment,
  customersEntities: { [id: string]: Customer },
): Payment => ({
  id: storePayment.id,
  customer:
    storePayment.customerId === null
      ? null
      : customersEntities[storePayment.customerId],
  amount: storePayment.amount,
  timestamp: storePayment.timestamp,
});

export const getPaymentListPagePayments = createSelector(
  getPaymentsEntities,
  getPaymentListPageIds,
  getCustomersEntities,
  (paymentsEntities, paymentListPageIds, customersEntities) =>
    paymentListPageIds &&
    paymentListPageIds
      .map(id => paymentsEntities[id])
      .map(payment => fromStorePayment(payment, customersEntities)),
);

const getPaymentsIdListByCustomerId = createSelector(
  getPaymentsState,
  fromPayments.getPaymentsIdListByCustomerId,
);

// TODO get selected customerId from store
const getCustomerPaymentIdList = (customerId: string) =>
  createSelector(
    getPaymentsIdListByCustomerId,
    paymentsIdListByCustomerId => paymentsIdListByCustomerId[customerId],
  );

export const getCustomerPaymentList = (customerId: string) =>
  createSelector(
    getPaymentsEntities,
    getCustomerPaymentIdList(customerId),
    getCustomersEntities,
    (paymentsEntities, customerPaymentIdList, customersEntities) =>
      customerPaymentIdList &&
      customerPaymentIdList
        .map(id => paymentsEntities[id])
        .map(payment => fromStorePayment(payment, customersEntities)),
  );

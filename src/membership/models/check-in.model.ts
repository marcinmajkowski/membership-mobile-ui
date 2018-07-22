import * as moment from 'moment';

export interface CheckIn {
  id: number;
  // FIXME keep only customerId here, use selector to get customer so it will become null after customer is deleted
  customer: CheckInCustomer;
  // TODO keep formatted timestamp instead
  timestamp: moment.Moment;
}

export interface CheckInCustomer {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

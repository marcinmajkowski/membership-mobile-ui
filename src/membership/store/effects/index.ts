import { CheckInsEffects } from './check-ins.effect';
import { CustomersEffects } from './customers.effect';
import { PaymentsEffects } from './payments.effect';

export const effects: any[] = [
  CheckInsEffects,
  CustomersEffects,
  PaymentsEffects,
];

export * from './check-ins.effect';
export * from './customers.effect';
export * from './payments.effect';

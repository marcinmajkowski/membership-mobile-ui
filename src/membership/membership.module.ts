import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';

@NgModule({
  imports: [
    StoreModule.forFeature('membership', reducers),
    EffectsModule.forFeature(effects),
  ],
  // TODO move feature services to this module
})
export class MembershipModule {}

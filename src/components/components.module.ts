import { NgModule } from '@angular/core';
import { CheckInListComponent } from './check-in-list/check-in-list';
import { ListSpinnerComponent } from './list-spinner/list-spinner';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    CheckInListComponent,
    ListSpinnerComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    CheckInListComponent,
    ListSpinnerComponent,
  ]
})
export class ComponentsModule {
}

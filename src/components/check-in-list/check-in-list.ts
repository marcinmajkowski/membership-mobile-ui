import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckIn } from '../../services/check-in.service';

@Component({
  selector: 'check-in-list',
  templateUrl: 'check-in-list.html'
})
export class CheckInListComponent {

  @Input() checkIns: CheckIn[];
  @Output() checkInDelete = new EventEmitter<CheckIn>();

  delete(checkIn: CheckIn): void {
    this.checkInDelete.emit(checkIn);
  }
}

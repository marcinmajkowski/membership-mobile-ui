import { Component, Input } from '@angular/core';
import { CheckIn } from '../../services/check-in.service';

@Component({
  selector: 'check-in-list',
  templateUrl: 'check-in-list.html'
})
export class CheckInListComponent {

  @Input() checkIns: CheckIn[];
  @Input() placeholder: string;
}

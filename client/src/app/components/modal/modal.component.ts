import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

/**
 * Layout component to hold a modal at the center of the parent container.
 *
 * ---
 *
 * The modal contains a title, a close button, and a content which can be injected through content projection.
 *
 * As the modal display is handled by the store, the close event is transmitted to the parent component which holds the content logic.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input() title = '';

  @Output() onClose = new EventEmitter();
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [ModalComponent],
  exports: [ModalComponent],
  imports: [
    MatIconModule
  ]
})
export class ModalModule {}

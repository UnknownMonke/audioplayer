import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output } from "@angular/core";
import { MatIconModule } from '@angular/material/icon';

/**
 * Presentational component to hold the audio player control buttons.
 *
 * ---
 *
 * Current buttons :
 *
 * - Play / Pause.
 * - Next.
 * - Previous.
 * - Loop.
 * - Volume.
 *
 * ---
 *
 * Transmits click event to the parent component for processing.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-control-button',
  templateUrl: './control-button.component.html',
  styleUrls: ['./control-button.component.scss']
})
export class ControlButtonComponent {

  @Input() icon = '';
  @Input() size = '';
  @Input() active?: boolean; // Whether or not the button is actived.

  @Output() onClick = new EventEmitter();
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [ControlButtonComponent],
  exports: [ControlButtonComponent],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class ControlButtonModule {}

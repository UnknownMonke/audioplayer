import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { AudioService } from "../../../services/audio.service";
import { ControlButtonModule } from "../control-button/control-button.component";

//TODO keyboard events
/**
 * Container component to hold the control button for the previous / next title function.
 *
 * ---
 *
 * This component is reusable : it holds a static parameter (prev or next : -1 or 1) passed as Input from the parent component.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-prevnext-control',
  templateUrl: './prevnext-control.component.html'
})
export class PrevNextControlComponent {

  @Input() direction: -1 | 1 = 1;

  constructor(
    private _audioService: AudioService
  ) {}

  prevNext(direction: -1 | 1): void {
    this._audioService.changeTitle(direction);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [PrevNextControlComponent],
  exports: [PrevNextControlComponent],
  imports: [
    ControlButtonModule
  ]
})
export class PrevNextControlModule {}

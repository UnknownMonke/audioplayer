import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { map, Observable } from "rxjs";
import { AudioService, AudioStateProp } from "../../../services/audio.service";
import { ControlButtonModule } from "../control-button/control-button.component";

/**
 * Standalone container component to hold the control button for the loop function.
 *
 * ---
 *
 * The component is independent and responsible for wiring to necessary attributes and triggering their update when needed.
 *
 * Async pipes are used as long as the code can remain simple.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-loop-control',
  templateUrl: './loop-control.component.html'
})
export class LoopControlComponent {

  readonly looping$: Observable<boolean>;

  constructor(
    private _audioService: AudioService
  ) {
    this.looping$ = this._audioService.getStateProp(AudioStateProp.isLooping)
      .pipe(
        map( (val: number | boolean) => val as boolean ) // Contextual cast.
      );
  }

  toggleLoop(): void {
    this._audioService.toggleLoop();
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [LoopControlComponent],
  exports: [LoopControlComponent],
  imports: [
    CommonModule,
    ControlButtonModule
  ]
})
export class LoopControlModule {}

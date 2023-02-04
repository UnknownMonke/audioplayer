import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { map, Observable } from "rxjs";
import { AudioService, AudioStateProp } from "../../../services/audio.service";
import { ControlButtonModule } from "../control-button/control-button.component";

/**
 * Standalone container component to hold the control button for the play / pause function.
 *
 * ---
 *
 * The component is independent and responsible for wiring to necessary attributes and triggering their update when needed.
 *
 * Async pipes are used as long as the code can remain simple.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-play-control',
  templateUrl: './play-control.component.html'
})
export class PlayControlComponent {

  readonly playing$: Observable<boolean>;

  constructor(
    private _audioService: AudioService
  ) {
    this.playing$ = this._audioService.getStateProp(AudioStateProp.isPlaying)
    .pipe(
      map( (val: number | boolean) => val as boolean ) // Contextual cast.
    );
  }

  togglePlay(): void {
    this._audioService.togglePlay();
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [PlayControlComponent],
  exports: [PlayControlComponent],
  imports: [
    CommonModule,
    ControlButtonModule
  ]
})
export class PlayControlModule {}

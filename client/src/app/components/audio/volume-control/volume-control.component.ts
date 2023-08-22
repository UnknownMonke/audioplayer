import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { MatLegacySliderChange, MatLegacySliderModule } from '@angular/material/legacy-slider';
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { AudioService, AudioStateProp } from "../../../services/audio.service";
import { ControlButtonModule } from "../control-button/control-button.component";

/**
 * Standalone container component to hold the song volume slider.
 *
 * ---
 *
 * The components holds an hoverable slider triggered by hovering the volume icon button
 * (rendered inactive).
 * The icon button changes according to the current volume (full at > 50%, low at <= 50%, muted at 0).
 *
 * The slider is the old Material Slider from v7, implementation may change.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-volume-control',
  templateUrl: './volume-control.component.html',
  styleUrls: ['./volume-control.component.scss']
})
export class VolumeControlComponent {

  readonly volume$: Observable<number>;
  readonly volumeIcon$ = new BehaviorSubject<string>('volume_up');

  constructor(
    private _audioService: AudioService
  ) {
    this.volume$ = this._audioService.getStateProp(AudioStateProp.volume)
    .pipe(
      map( (val: number | boolean) => val as number ),
      tap( (volume: number) => {
        if(volume === 0) {
          this.volumeIcon$.next('volume_off');
        } else if(volume <= 0.5) {
          this.volumeIcon$.next('volume_down');
        } else {
          this.volumeIcon$.next('volume_up');
        }
      })
    );
  }

  onSliderChange(change: MatLegacySliderChange): void {
    if(change.value !== null) this._audioService.changeVolume(change.value);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [VolumeControlComponent],
  exports: [VolumeControlComponent],
  imports: [
    CommonModule,
    ControlButtonModule,
    MatLegacySliderModule
  ]
})
export class VolumeControlModule {}

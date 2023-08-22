import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { MatLegacySliderChange, MatLegacySliderModule } from '@angular/material/legacy-slider';
import { BehaviorSubject, map, Observable, skipWhile, take, tap, withLatestFrom } from "rxjs";
import { AudioService, AudioStateProp } from "../../../services/audio.service";

//TODO mouse events
/**
 * Standalone container component to hold the song time slider.
 *
 * ---
 *
 * The slider is the old Material Slider from v7, implementation may change.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-time-slider',
  templateUrl: './time-slider.component.html',
  styleUrls: ['./time-slider.component.scss']
})
export class TimeSliderComponent {

  readonly duration$: Observable<number>;
  readonly current$: Observable<number>;

  private _trigger$ = new BehaviorSubject<boolean>(false);
  private _stop$ = new BehaviorSubject<boolean>(false);
  private _sliderChange$ = new BehaviorSubject<number>(0);

  constructor(
    private _audioService: AudioService
  ) {
    this.duration$ = this._audioService.getStateProp(AudioStateProp.duration)
      .pipe(
        map( (val: number | boolean) => val as number ) // Contextual cast.
      );

    this.current$ = this._audioService.getStateProp(AudioStateProp.currentTime)
      .pipe(
        map( (val: number | boolean) => val as number ),
        withLatestFrom(this._stop$),
        skipWhile( ([, stop]) => stop ),
        map( ([val,]) => val )
      );
  }

  mouseup(): void {
    //Retreives last value emitted.
    this._sliderChange$
      .pipe(
        take(1),
        tap( (value) => this._audioService.seekTo(value) ),
        tap( () => this._stop$.next(false) ),
      ).subscribe();
  }

  mousedown(): void {
    this._trigger$.next(false);
    this._stop$.next(true);
  }

  /**
   * Emits the time changed to the Subject.
   *
   * The (input) event fires everytime the sliders moves, its cleaner than (change).
   *
   * @param change Angular Material component change object.
   */
  onSliderChange(change: MatLegacySliderChange): void {
    if(change.value) this._sliderChange$.next(change.value);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [TimeSliderComponent],
  exports: [TimeSliderComponent],
  imports: [
    CommonModule,
    MatLegacySliderModule
  ]
})
export class TimeSliderModule {}

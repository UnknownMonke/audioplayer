import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule, OnInit } from "@angular/core";
import { EMPTY, map, Observable, of } from "rxjs";
import { TimePipe } from "src/app/pipes/time.pipe";
import { AudioService, AudioStateProp } from "../../../services/audio.service";

/**
 * Presentational component to hold the song timestamps.
 *
 * ---
 *
 * Holds :
 *
 * - Song current time.
 * - Song duration.
 *
 * ---
 *
 * This component is reusable : the type of timestamp displayed is passed as Input from the parent component.
 *
 * Here, the choice is made to have the component hold the logic with the necessary attribute being parsed according to the Input.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-time-display',
  templateUrl: './time-display.component.html',
  styleUrls: ['./time-display.component.scss']
})
export class TimeDisplayComponent implements OnInit {

  @Input() stampType = '';

  time$: Observable<number> = EMPTY;

  constructor(
    private _audioService: AudioService
  ) {}

  ngOnInit(): void {

    switch(this.stampType) {

      case TimeDisplayStamp.currentTime:
        this.time$ = this._audioService.getStateProp(AudioStateProp.currentTime)
          .pipe(
            map( (val: number | boolean) => val as number ) // Contextual cast.
          );
        break;

      case TimeDisplayStamp.totalTime:
        this.time$ = this._audioService.getStateProp(AudioStateProp.duration)
          .pipe(
            map( (val: number | boolean) => val as number )
          );
        break;

      default:
        this.time$ = of(0);
        break;
    }
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [TimeDisplayComponent, TimePipe],
  exports: [TimeDisplayComponent],
  imports: [
    CommonModule
  ]
})
export class TimeDisplayModule {}

/**
 * Local enum for Time Display component.
 * Defines the nature of the timestamp.
 *
 * Only used in the component and components that instantiates it,
 * therefore we can define it inside the component itself and export it.
 */
export enum TimeDisplayStamp {
  currentTime = 'currentTime',
  totalTime = 'totalTime'
};

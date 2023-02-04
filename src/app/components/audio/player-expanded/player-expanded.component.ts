import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { LoopControlModule } from "../loop-control/loop-control.component";
import { PlayControlModule } from "../play-control/play-control.component";
import { PrevNextControlModule } from "../prevnext-control/prevnext-control.component";
import { SongTitleModule } from "../song-title/song-title.component";
import { TimeDisplayModule } from "../time-display/time-display.component";
import { TimeSliderModule } from "../time-slider/time-slider.component";
import { VolumeControlModule } from "../volume-control/volume-control.component";

/**
 * Standalone layout component for the audio player in expanded mode.
 *
 * ---
 *
 * Handles layout and positioning of elements.
 *
 * All audio elements are components of their own.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-player-expanded',
  templateUrl: './player-expanded.component.html',
  styleUrls: ['./player-expanded.component.scss'],
})
export class PlayerExpandedComponent {}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [PlayerExpandedComponent],
  exports: [PlayerExpandedComponent],
  imports: [
    LoopControlModule,
    PlayControlModule,
    PrevNextControlModule,
    SongTitleModule,
    TimeDisplayModule,
    TimeSliderModule,
    VolumeControlModule
  ]
})
export class PlayerExpandedModule {}

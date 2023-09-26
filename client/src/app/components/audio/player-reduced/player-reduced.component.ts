import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { PlayControlModule } from "../play-control/play-control.component";
import { PrevNextControlModule } from "../prevnext-control/prevnext-control.component";
import { SongTitleModule } from "../song-title/song-title.component";
import { AudioSpectreModule } from "../../audio-spectre/audiospectre.component";

/**
 * Standalone layout component for the audio player in reduced mode.
 *
 * ---
 *
 * Actions :
 *
 * - Handles layout and positioning of elements.
 * - Holds the audio spectre component within the player background.
 *
 * All audio elements are components of their own.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-player-reduced',
  templateUrl: './player-reduced.component.html',
  styleUrls: ['./player-reduced.component.scss'],
})
export class PlayerReducedComponent {}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [PlayerReducedComponent],
  exports: [PlayerReducedComponent],
  imports: [
    AudioSpectreModule,
    PlayControlModule,
    PrevNextControlModule,
    SongTitleModule
  ]
})
export class PlayerReducedModule {}

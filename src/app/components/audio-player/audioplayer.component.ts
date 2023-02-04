import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Observable } from "rxjs";
import { AudioService } from "../../services/audio.service";
import { AudioSpectreModule } from "../audio-spectre/audiospectre.component";
import { PlayerExpandedModule } from "../audio/player-expanded/player-expanded.component";
import { PlayerReducedModule } from "../audio/player-reduced/player-reduced.component";

/**
 * Standalone layout component for the Audio Player.
 *
 * ---
 *
 * Actions :
 *
 * - Loads the expanded or reduced layouts according to view.
 * - Holds the audio spectre component within the player background.
 *
 * Only one instance of the component exists throughout the application, to allow the user to navigate without losing the current audio stream,
 * as all subscriptions are removed on destroy.
 *
 * As such, the component is instanciated inside the root component, but is hidden when entering the app or after refresh, until a first song is played.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-audioplayer',
  templateUrl: './audioplayer.component.html',
  styleUrls: ['./audioplayer.component.scss'],
})
export class AudioPlayerComponent {

  readonly displayPlayer$: Observable<boolean>;
  readonly playerExpanded$: Observable<boolean>;

  constructor(
    private _audioService: AudioService
  ) {
    this.displayPlayer$ = this._audioService.displayPlayer$;
    this.playerExpanded$ = this._audioService.playerExpanded$;
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [AudioPlayerComponent],
  exports: [AudioPlayerComponent],
  imports: [
    CommonModule,
    RouterModule,
    AudioSpectreModule,
    PlayerExpandedModule,
    PlayerReducedModule
  ]
})
export class AudioPlayerModule {}

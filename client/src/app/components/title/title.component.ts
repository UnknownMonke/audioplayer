import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { map, Observable } from "rxjs";
import { n_u_empty_ } from 'src/app/helpers';
import { CurrentTitle, Title, TitleState } from "src/app/types";
import { AudioService } from "../../services/audio.service";
import { TitleService } from "../../services/title.service";
import { CardModule, CardOptions } from "../card/card.component";

/**
 * Container component to display a title (playlist list item) as a card.
 *
 * ---
 *
 * Instead of having a simple list of cards containing the playlist titles,
 * this component is inserted between the playlist component and the card component, to be able to manipulate a specific card individually,
 * without having to regenerate the whole playlist everytime the audio playback changes (pause, play, title change).
 *
 * That way, the "titles" map inside the playlist is only used to display title infos, and the current title alone is used to determine if
 * a card is playing or not. This keeps the store elements independents from each other.
 * Cards currently playing have a different background, and a pause button instead of a play button.
 *
 * The playlist component is statically loaded, then each title component listens to a change in its own state to update itself independently from the others.
 *
 * The whole list of cards will still be checked by the change detection.
 *
 * ---
 *
 * Titles cards have their own state variable (TitleState) to know if the title is selected and playing, or selected but paused (uses 2 booleans).
 * Changes are handled in the corresponding effect.
 *
 * ---
 *
 * The component does not need any style as it simply holds logic for a card component.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-title',
  templateUrl: './title.component.html'
})
export class TitleComponent {

  // Contains infos to change the card state (selected and playing, selected and paused).
  readonly state$: Observable<TitleState>;

  @Input() title: Title = {}; // Static title card info (name, artist...).

  constructor(
    private _router: Router,
    private _audioService: AudioService,
    private _titleService: TitleService
  ) {
    // Updates the card title state everytime the current title is updated.
    this.state$ = this._titleService.currentTitle$
      .pipe(
        map( (currentTitle: CurrentTitle) => {
          if(!n_u_empty_(currentTitle) && currentTitle.infos.id === this.title.id) {
            return currentTitle.state;
          } else {
            return { isPlaying: false, selected: false };
          }
        })
      );
  }

  /** Clicks on card. Toggles playback and sets the current title if changed. */
  playTitle(title: Title, state: TitleState): void {

    if(!state.selected) {
      this._audioService.playPause(title, state);
    }
    this._router.navigateByUrl(`/title/${title.id}`);
  }

  /** Sets card option params. */
  mapOptions(title: Title, state: TitleState): CardOptions {
    return {
      itemId: title.id,
      title: title.name,
      subTitle: title.artist,
      isPlayable: true,
      selected: state.selected,
      isPlaying: state.isPlaying
    }
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [TitleComponent],
  exports: [TitleComponent],
  imports: [
    CommonModule,
    CardModule
  ]
})
export class TitleModule {}

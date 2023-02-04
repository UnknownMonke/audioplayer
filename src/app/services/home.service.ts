import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { DisplaysActions, displaySettings, toggleMenuSettings } from "../store/display/display.store";
import { AudioService } from "./audio.service";
import { PlaylistService } from "./playlist.service";
import { ThemeService } from "./theme.service";
import { TitleService } from "./title.service";

/**
 * Home page service.
 *
 * ---
 *
 * Handles the reset of the application state and the display of the settings menu (held by the home component).
 *
 * ---
 *
 * This service is a facade : a link between the components and the underlying processing structure (ngRx...).
 * It holds the meaning of the logic while being independent from its implementation.
 * Disconnects component logic from state management.
 *
 * The components can only access this service and this service can only be accessed by the components,
 * and not the underlying structure, to avoid circular imports.
 */
@Injectable({
  providedIn: 'root',
})
export class HomeService {

  displayMenu$: Observable<boolean>;

  constructor(
    private _audioService: AudioService,
    private _playlistService: PlaylistService,
    private _themeService: ThemeService,
    private _titleService: TitleService,
    private _store: Store
  ) {
    this.displayMenu$ = this._store.select(displaySettings);
  }

  showSettingsMenu(display: boolean): void {
    this._store.dispatch(DisplaysActions.setSettings({ display }));
  }

  toggleMenuSettings(): void {
    this._store.dispatch(toggleMenuSettings());
  }

  /**
   * Resets the app state :
   *  - Stops playback.
   *  - Hides audio player.
   *  - Resets current playlist and current title to their default state.
   *  - Hides settings menu if previously opened.
   *
   * The current playlist can stay as it is, as well as the stream state.
   */
  resetState(): void {
    this._audioService.reset();

    // Resets current title and streaming playlist (everything audio related).
    this._playlistService.setStreamingPlaylist({});
    this._titleService.setCurrentTitle({});

    // The audio player destroy stop action will stop the layback and update the current playlist in order to reset the current playing card.
    this._themeService.showThemesMenu(false);
    this._audioService.showAudioPlayer(false);
    this.showSettingsMenu(false);
  }
}

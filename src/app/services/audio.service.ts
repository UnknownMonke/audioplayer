import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { AudioProvider } from '../providers/audio.provider';
import { AudioCommands, AudioEvents, audioState, changeTitle, playPause, togglePlay } from '../store/audio/audio.store';
import { AudioState } from '../store/audio/audio.types';
import { displayPlayer, displayPlayerExpanded, DisplaysActions } from '../store/display/display.store';
import { Title, TitleState } from '../types';

/**
 * Service to handle audio playback.
 *
 * ---
 *
 * Actions :
 *
 * - Handles display of the audio player.
 * - Exposes the audio state and the analyser node to the components.
 * - Handles playback common functions :
 *    - Launch.
 *    - Play.
 *    - Pause.
 *    - Stop.
 *    - Seek to.
 *    - Loop.
 *    - Volume.
 *
 * All actions are set through a store command, which will update the wired audio element, then the audio state through the listeners.
 * When an action is set upon the audio element, such a play() to launch playback,
 * the state is updated via the corresponding event listener that will catch the event fired by the media element (see AudioProvider).
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
export class AudioService {

  displayPlayer$: Observable<boolean>;
  playerExpanded$: Observable<boolean>;

  analyser: AnalyserNode;

  constructor(
    private _store: Store,
    private _audioProvider: AudioProvider
  ) {
    this.displayPlayer$ = this._store.select(displayPlayer);
    this.playerExpanded$ = this._store.select(displayPlayerExpanded);

    this.analyser = this._audioProvider.analyser;
  }

  getStateProp(prop: AudioStateProp) {
    return this._store.select(audioState)
      .pipe(
        map( (state: AudioState) => state[prop] ),
        distinctUntilChanged()
      );
  }

  showAudioPlayer(display: boolean): void {
    this._store.dispatch(DisplaysActions.setPlayer({ display }));
  }

  expandPlayer(display: boolean): void {
    this._store.dispatch(DisplaysActions.setPlayerExpanded({ display }));
  }

  /* --------------------- */

  playPause(infos: Title, state: TitleState) {
    this._store.dispatch(playPause({ currentTitle: {infos, state} }));
  }

  togglePlay(): void {
    this._store.dispatch(togglePlay());
  }

  /* --------------------- */

  changeTitle(direction: -1 | 1) {
    this._store.dispatch(changeTitle({ direction }));
  }

  toggleLoop() {
    this._store.dispatch(AudioCommands.toggleLoop());
  }

  /**
   * Uses the native element attribute. Event will be caught in the listener.
   *
   * @param seconds raw time of the audio element.
   */
  seekTo(seconds: number) {
    this._store.dispatch(AudioCommands.timeUpdate({ time: seconds }));
  }

  /**
   * @param volume between 0 and 1.
   */
  changeVolume(volume: number): void {
    this._store.dispatch(AudioCommands.volumeChange({ volume }));
  }

  /* --------------------- */

  /**
   * The audio media element doesn't have a dedicated stop event.
   * In order to stop the playback, the element is reset by calling the load() method on an empty source.
   *
   * The state is also reset to notify the other parts of the application.
   */
  reset() {
    this._store.dispatch(AudioCommands.stop());
    this._store.dispatch(AudioEvents.reset());
  }
}

/**
 * Enum that mirrors the Audio State properties.
 *
 * Only used within the component-service layer.
 */
export enum AudioStateProp {
  loadedMetadata = 'loadedMetadata',
  isPlaying = 'isPlaying',
  isLooping = 'isLooping',
  currentTime = 'currentTime',
  duration = 'duration',
  volume = 'volume'
}

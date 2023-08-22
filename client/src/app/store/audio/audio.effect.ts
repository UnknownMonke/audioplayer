import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { mergeMap, of, tap } from "rxjs";
import { DisplaysActions } from "../display/display.store";
import { streamingPlaylist, updateStreamingPlaylist } from "../playlist/playlist.store";
import { currentTitle, setCurrentTitle } from "../title/title.store";
import { AudioCommands, changeTitle, playPause, togglePlay } from "./audio.store";
import { n_u_empty_ } from 'src/app/helpers';
import { CurrentTitle } from "src/app/types";

@Injectable({
  providedIn: 'root',
})
export class AudioEffects {

  constructor(
    private _actions$: Actions,
    private _store: Store
  ) {}

  togglePlay$ = createEffect(() => this._actions$
    .pipe(
      ofType(togglePlay),
      concatLatestFrom( () => this._store.select(currentTitle) ), // Always present.
      tap( ([, currentTitle]) => {
        this._store.dispatch(updateStreamingPlaylist({ currentTitle: currentTitle.infos }));
        this._dispatchPlay(currentTitle.state.isPlaying);
      }),
      mergeMap( ([, currentTitle]) => of(setCurrentTitle({ currentTitle: this._updateTitle(currentTitle) })) )
    ));

  playPause$ = createEffect(() => this._actions$
    .pipe(
      ofType(playPause),
      concatLatestFrom( () => this._store.select(currentTitle) ),
      tap( ([action,previousTitle]) => {
        this._store.dispatch(updateStreamingPlaylist({ currentTitle: action.currentTitle.infos }));

        if(n_u_empty_(previousTitle)) this._store.dispatch(DisplaysActions.setPlayer( {display: true }));

        if(action.currentTitle.state.selected) {
          this._dispatchPlay(action.currentTitle.state.isPlaying );
        } else {
          this._store.dispatch(AudioCommands.load({ source: action.currentTitle.infos.source }));
        }
      }),
      mergeMap( ([action,]) => of(setCurrentTitle({ currentTitle: this._updateTitle(action.currentTitle) })) )
    ));

  changeTitle$ = createEffect(() => this._actions$
    .pipe(
      ofType(changeTitle),
      concatLatestFrom( () => [this._store.select(currentTitle), this._store.select(streamingPlaylist)] ), // Both Always present.
      mergeMap( ([action, currentTitle, playlist]) => {
        if(playlist.titles) {

          let nextPos = 0;

          const entries = Array.from(playlist.titles.entries());
          const currentPos = entries.map(entry => entry[0]).indexOf(currentTitle.infos.id); // Always present.

          if(currentPos === entries.length - 1) {
            nextPos = action.direction === -1 ? currentPos - 1 : 0;

          } else if(currentPos === 0) {
            nextPos = action.direction === -1 ? entries.length - 1 : currentPos + 1;

          } else {
            nextPos = currentPos + action.direction;
          }
          const nextTitle = entries[nextPos][1];

          return of(playPause({ currentTitle: { infos: nextTitle, state: { isPlaying: false, selected: false } } })); // Current state of the new title : always false.
        }
        throw new Error('playlist doesn\'t have titles');
      })
    )
  );

  private _dispatchPlay(isPlaying: boolean): void {
    // isPlaying is always defined if a previous value exists.
    isPlaying ? this._store.dispatch(AudioCommands.play({ play: false })) : this._store.dispatch(AudioCommands.play({ play: true }));
  }

  /** Updates current title state (selected, isPlaying) and returns a new instance. */
  private _updateTitle(title: CurrentTitle): CurrentTitle {

    if(title.state.selected) {
      return {infos: title.infos, state: { ...title.state, isPlaying: !title.state.isPlaying } };
    } else {
      return {infos: title.infos, state: { isPlaying: true, selected: true } };
    }
  }
}

import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, mergeMap, of, tap } from "rxjs";
import { DisplaysActions, displayPlayer } from "../display/display.store";
import { streamingPlaylist, updateStreamingPlaylist } from "../playlist/playlist.store";
import { currentTitle, setCurrentTitle } from "../title/title.store";
import { AudioCommands, changeTitle, loadTitle, playPause, togglePlay } from "./audio.store";
import { TitleProvider } from "src/app/providers/title.provider";
import { CurrentTitle } from "src/app/types";


@Injectable({
  providedIn: 'root',
})
export class AudioEffects {

  constructor(
    private _actions$: Actions,
    private _store: Store,
    private _titleProvider: TitleProvider
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
      concatLatestFrom( () => this._store.select(displayPlayer) ),
      tap( ([action,displayPlayer]) => {
        this._store.dispatch(updateStreamingPlaylist({ currentTitle: action.currentTitle.infos }));

        if(!displayPlayer) this._store.dispatch(DisplaysActions.setPlayer( {display: true }));

        if(action.currentTitle.state.selected) {
          this._dispatchPlay(action.currentTitle.state.isPlaying );
        }
      }),
      mergeMap( ([action,]) => of(loadTitle({ currentTitle: action.currentTitle })) )
    ));

  loadTitle$ = createEffect(() => this._actions$
		.pipe(
			ofType(loadTitle),
      mergeMap( (action) => {

        if(action.currentTitle.dataUrl) {
          return of(AudioCommands.load({ source: action.currentTitle.dataUrl }));
        } else {
          return this._titleProvider.getStream(action.currentTitle.infos.playlistName, action.currentTitle.infos.source)
            .pipe(
              tap( (data: string) => this._store.dispatch(AudioCommands.load({ source: data })) ),
              map( (data: string) =>
                setCurrentTitle({ currentTitle: this._updateTitle(action.currentTitle, data) })
              )
            );
        }
      })
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
  private _updateTitle(title: CurrentTitle, data?: string): CurrentTitle {

    if(title.state.selected) {
      return {infos: title.infos, state: { ...title.state, isPlaying: !title.state.isPlaying }, dataUrl: data };
    } else {
      return {infos: title.infos, state: { isPlaying: true, selected: true }, dataUrl: data };
    }
  }
}

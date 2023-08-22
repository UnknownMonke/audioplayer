import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { filter, mergeMap, map, tap } from "rxjs";
import { n_u_empty_ } from "src/app/helpers";
import { TitleProvider } from "src/app/providers/title.provider";
import { Title } from "src/app/types";
import { AudioCommands } from "../audio/audio.store";
import { DisplaysActions } from "../display/display.store";
import { loadCurrentPlaylist } from "../playlist/playlist.store";
import { currentTitle, loadCurrentTitle, setCurrentTitle } from "./title.store";

@Injectable({
  providedIn: 'root',
})
export class TitleEffects {

  constructor(
    private _actions$: Actions,
    private _store: Store,
    private _titleProvider: TitleProvider
  ) {}

  /**
   * Loads current title from the route when a refresh is done on the title view.
   *
   * - loads title from server.
   * - checks if its playlist is already loaded, else loads and set the current playlist.
   * - preloads audio playback.
   *
   * The action only triggers if the current title is not already present, otherwise no loading is done and the
   * component will retreive a value from the store.
   */
  loadCurrentTitle$ = createEffect(() => this._actions$
    .pipe(
      ofType(loadCurrentTitle),
      concatLatestFrom( () => this._store.select(currentTitle) ),
      filter( ([, data]) => n_u_empty_(data) ),
      tap( () => this._store.dispatch(DisplaysActions.setPlayer( {display: true })) ),
      mergeMap( ([action,]) =>
        this._titleProvider.getOne(action.id)
          .pipe(
            tap( (title: Title) => {
              this._store.dispatch(loadCurrentPlaylist({ playlistId: title.playlistId }));
              this._store.dispatch(setCurrentTitle({ currentTitle: { infos: title, state: { selected: false, isPlaying: false }} }));
            }),
            map( (title: Title) => AudioCommands.preload({ source: title.source }) )
          )
      )
    )
  );
}

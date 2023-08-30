import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { mergeMap, tap, of } from "rxjs";
import { n_u_empty_ } from "src/app/helpers";
import { TitleProvider } from "src/app/providers/title.provider";
import { Title } from "src/app/types";
import { AudioCommands, playPause } from "../audio/audio.store";
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
      mergeMap( ([action, currentTitle]) => {

        if(!n_u_empty_(currentTitle)) {
          return of(playPause({ currentTitle }));
        } else {
          return this._titleProvider.getOne(action.id)
            .pipe(
              mergeMap( (title: Title) =>

                this._titleProvider.getStream(title.playlistName, title.source)
                  .pipe(
                    tap( (data: string) => {
                      this._store.dispatch(loadCurrentPlaylist({ playlistId: title.playlistId }));
                      this._store.dispatch(DisplaysActions.setPlayer( {display: true }));
                      this._store.dispatch(AudioCommands.preload({ source: data }));
                    }),
                    mergeMap( (data: string) => of(setCurrentTitle({ currentTitle : { infos: title, state: { selected: true, isPlaying: false }, dataUrl: data } }) ))
                  )
              )
            );
        }
      })
    )
  )
}

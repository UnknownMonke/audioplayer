import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { filter, mergeMap, map, of } from "rxjs";
import { PlaylistProvider } from "../../providers/playlist.provider";
import { Playlist } from "src/app/types";
import {
  currentPlaylist,
  initialCurrentPlaylistState,
  initialStreamingPlaylistState,
  loadCurrentPlaylist,
  loadPlaylists,
  playlists,
  setCurrentPlaylist,
  setPlaylists,
  setStreamingPlaylist,
  streamingPlaylist,
  updateStreamingPlaylist
} from "./playlist.store";

@Injectable({
  providedIn: 'root',
})
export class PlaylistEffects {

  constructor(
    private _actions$: Actions,
    private _store: Store,
    private _playlistProvider: PlaylistProvider
  ) {}

  /**
   * Loads current title to set the playing title in playlist after http request.
   * ConcatLatestFrom will not emit if a filter is added, and mergeMap will stay stuck.
   */
  loadCurrentPlaylist$ = createEffect(() => this._actions$
    .pipe(
      ofType(loadCurrentPlaylist),
      concatLatestFrom( () => this._store.select(currentPlaylist) ),
      filter( ([action, data]) => data === initialCurrentPlaylistState || data.id !== action.playlistId ),
      mergeMap( ([action]) =>
        this._playlistProvider.getFull(action.playlistId)
          .pipe(
            map( (playlist: Playlist) => setCurrentPlaylist({ currentPlaylist: playlist }) )
          )
      )
    )
  );

  /**
   * Alternative design : load all playlists with their titles in the store, and use a custom selector to filter by id.
   */
  loadPlaylists$ = createEffect(() => this._actions$
    .pipe(
      ofType(loadPlaylists),
      concatLatestFrom( () => this._store.select(playlists) ),
      filter( ([, data]) => data.length === 0) ,
      mergeMap( () =>
        this._playlistProvider.get()
          .pipe(
            map( (playlists: Playlist[]) => setPlaylists({playlists}))
          )
      )
    )
  );

  updateStreamingPlaylist$ = createEffect(() => this._actions$
    .pipe(
      ofType(updateStreamingPlaylist),
      concatLatestFrom( () => [this._store.select(currentPlaylist), this._store.select(streamingPlaylist)] ),
      filter( ([action, currentPlaylist, streamingPlaylist]) =>
        streamingPlaylist === initialStreamingPlaylistState || (streamingPlaylist.id !== currentPlaylist.id && action.currentTitle.playlistId === currentPlaylist.id) ),
      mergeMap( ([, currentPlaylist,]) =>
        of(setStreamingPlaylist({ streamingPlaylist: currentPlaylist })) ) // Always defined.
    )
  );
}

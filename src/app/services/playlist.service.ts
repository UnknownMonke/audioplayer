import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { filter, Observable } from "rxjs";
import {
  currentPlaylist,
  loadCurrentPlaylist,
  loadPlaylists,
  playlists,
  setStreamingPlaylist
} from "../store/playlist/playlist.store";
import { Playlist } from "../types";

/**
 * Service for playlists.
 *
 * ---
 *
 * Values are stored in a array to shorten the syntax.
 *
 * The service holds 2 parts : actions and subscriptions.
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
export class PlaylistService {

  constructor(
    private _store: Store
  ) {}

  /**
   * Watcher : returns an Observable wired to the store attribute through a getter rather than a variable,
   * to allow for some additional processing and possible parameter injection from the component.
   *
   * ---
   *
   * Processing :
   *
   * When subscribing to the store attribute, we check if the list already exists to avoid displaying an empty list before updating,
   * since store retreival is immediate and does not wait for a dispatch.
   * Otherwise the previous stored value would appear before the current value is fetched.
   */
  playlists$(): Observable<ReadonlyArray<Playlist>> {

    return this._store.select(playlists)
      .pipe(
        filter( (playlists: ReadonlyArray<Playlist>) => playlists.length > 0)
      );
  }

  /** Watcher */
  playlist$(playlistId: string): Observable<Playlist> {

    return this._store.select(currentPlaylist)
      .pipe(
        filter( (playlist: Playlist) => playlist.id === playlistId)
      );
  }

  loadPlaylists(): void {
    this._store.dispatch(loadPlaylists());
  }

  loadPlaylist(playlistId: string): void {
    this._store.dispatch(loadCurrentPlaylist({ playlistId }));
  }

  setStreamingPlaylist(playlist: Playlist): void {
    this._store.dispatch(setStreamingPlaylist({ streamingPlaylist: playlist }));
  }
}

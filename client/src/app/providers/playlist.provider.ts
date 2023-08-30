import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, switchMap } from "rxjs";
import { APIEntry } from "../helpers";
import { Playlist, Title } from "../types";
import { TitleProvider } from "./title.provider";

/**
 * CRUD data provider service.
 */
@Injectable({
  providedIn: 'root',
})
export class PlaylistProvider {

  constructor(
    private _httpClient: HttpClient,
    private _titleProvider: TitleProvider,
  ) {}

  get(): Observable<Playlist[]> {
    return this._httpClient.get<string>(`${APIEntry.PLAYLIST_ENTRY}/get`)
      .pipe(
        map( (data: string) => JSON.parse(data))
      )
  }

  /** Gets a single playlist by id. */
  getOne(id: string): Observable<Playlist> {

    return this.get()
      .pipe(
        map( (data: Playlist[]) => {
          const filteredList = data.filter( (playlist: Playlist) => playlist.id === id);

          if(filteredList.length > 0) {
            return filteredList[0];
          }
          throw new Error('Playlist id doesn\'t exist');
        })
      )
  }

  /**
   * Loads the current playlist WITH its titles.
   *
   * Makes 2 HTTP requests which are merged to avoid nested subscription (launches inner observable as soon as first one completes).
   * One subscription to the method launches everything and inner observable is automatically unsubscribed when outer one is.
   *
   * If a new id is queried while the inner request is performing, the inner request is automatically cancelled.
   */
  getFull(id: string): Observable<Playlist> {

    return this.getOne(id)
      .pipe(
        switchMap( (playlist: Playlist) =>
          this._titleProvider.getByPlaylist(id)
            .pipe(
              map( (titles: Title[]) => {
                playlist.titles = new Map<string, Title>(titles.map(title => [title.id, title ])); // Constructor : array of [key, value] tuple.
                return playlist;
              })
            )
        )
      )
  }
}

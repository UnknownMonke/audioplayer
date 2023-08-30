import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { APIEntry } from "../helpers";
import { Title } from "../types";

/**
 * CRUD data provider service.
 */
@Injectable({
  providedIn: 'root',
})
export class TitleProvider {

  constructor(
    private _httpClient: HttpClient
  ) {}

  get(): Observable<Title[]> {
    return this._httpClient.get<string>(`${APIEntry.TITLE_ENTRY}/get`)
      .pipe(
        map( (data: string) => JSON.parse(data))
      )
  }

  getOne(id: string): Observable<Title> {
    return this.get()
      .pipe(
        map( (data: Title[]) => {
          const filteredList = data.filter( (title: Title) => title.id === id);

          if(filteredList.length > 0) return filteredList[0];

          throw new Error('Title doesn\'t exist');
        })
      )
  }

  /** Gets the list of titles from a specific playlist. */
  getByPlaylist(playlistId: string): Observable<Title[]> {
    return this.get()
      .pipe(
        map( (data: Title[]) =>
          data.filter( (title: Title) => title.playlistId === playlistId)
        )
      )
  }

  getStream(playlist: string, title: string): Observable<string> {
    return this._httpClient.post(`${APIEntry.TITLE_ENTRY}/stream`, {playlist, title}, { responseType: 'text' });
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
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
    return this._httpClient.get<Title[]>('api/titles');
  }

  getOne(id: string): Observable<Title> {
    return this._httpClient.get<Title>(`api/titles/${id}`);
  }

  /** Gets the list of titles from a specific playlist. */
  getByPlaylist(playlistId: string): Observable<Title[]> {
    return this._httpClient.get<Title[]>('api/titles')
      .pipe(
        map( (data: Title[]) =>
          data.filter( (title: Title) => title.playlistId === playlistId)
        )
      );
  }
}

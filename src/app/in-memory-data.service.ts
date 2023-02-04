import { Injectable } from "@angular/core";
import { InMemoryDbService } from "angular-in-memory-web-api";
import playlistsJson from '../assets/playlists.json';
import titlesJson from '../assets/titles.json';
import { Playlist, Title } from "./types";

/**
 * In-memory data service.
 *
 * ---
 *
 * An id must be provided for each object or else an error will be thrown, as no id generation method is provided.
 *
 * JSON is imported with allowSyntheticDefaultImports and resolveJsonModule compiler flags.
 */
@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const playlists: Playlist[] = JSON.parse(playlistsJson);
    const titles: Title[] = JSON.parse(titlesJson);

    return {playlists, titles};
  }
}

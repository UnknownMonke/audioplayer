import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EMPTY, Observable } from "rxjs";
import { n_u_empty_ } from 'src/app/helpers';
import { Playlist } from "src/app/types";
import { AudioService } from "../../services/audio.service";
import { PlaylistService } from "../../services/playlist.service";
import { CardModule, CardOptions } from "../card/card.component";
import { ListViewModule } from "../listview/listview.component";
import { LoaderModule } from "../loader/loader.component";
import { TitleModule } from "../title/title.component";

/**
 * Standalone container component to retreive and display the selected playlist and its titles in a list of cards.
 *
 * ---
 *
 * Actions :
 *
 * - Retreives the playlist from the store or from the server if not already present.
 * - Displays the playlist titles as a list of cards.
 *
 * The component does not need any style as it is encapsulated within the listview component which holds the frame,
 * and holds the card component to style the cards.
 *
 * The playlist only holds the static Title object with the title infos,
 * and does not hold any dynamic title info (playing, selected).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-playlist',
  templateUrl: './playlist.component.html'
})
export class PlaylistComponent implements OnInit {

  readonly displayPlayer$: Observable<boolean>;

  playlist$: Observable<Playlist> = EMPTY; // Has to be set on init due to id retrieval from router.

  constructor(
    private _route: ActivatedRoute,
    private _audioService: AudioService,
    private _playlistService: PlaylistService
  ) {
    this.displayPlayer$ = this._audioService.displayPlayer$;
  }

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');

    /* Same as for the Playlists component, the current store value is displayed before the data is fetched,
     * so we map to the correct id to avoid flashing an incorrect value. */
    this.playlist$ = this._playlistService.playlist$(id!);

    /* Loads playlist correspnding to the route id.
     * If the playlist is not already loaded in the state, loads from HTTP instead. */
    this._playlistService.loadPlaylist(id!);
  }

  empty(playList: Playlist): boolean {
    return n_u_empty_(playList);
  }

  /** Handles the empty data case with a default Card. */
  emptyCard(): CardOptions {
    return { itemId: '', title: 'Playlist is empty', disabled: true };
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [PlaylistComponent],
  exports: [PlaylistComponent],
  imports: [
    CommonModule,
    CardModule,
    ListViewModule,
    LoaderModule,
    TitleModule
  ]
})
export class PlaylistModule {}

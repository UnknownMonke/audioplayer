import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Observable } from "rxjs";
import { Playlist } from "src/app/types";
import { PlaylistService } from "../../services/playlist.service";
import { CardModule, CardOptions } from "../card/card.component";
import { ListViewModule } from "../listview/listview.component";
import { LoaderModule } from "../loader/loader.component";

/**
 * Standalone container component to retreive and display all playlists in a list of cards.
 *
 * ---
 *
 * Actions :
 *
 * - Retreives playlists from the store or from the server if not already present.
 * - Displays playlists as a list of cards.
 *
 * The component does not need any style as it is encapsulated within the listview component which holds the frame,
 * and holds the card component to style the cards.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-playlists',
  templateUrl: './playlists.component.html'
})
export class PlaylistsComponent implements OnInit {

  readonly playlists$: Observable<ReadonlyArray<Playlist>>;

  constructor(
    private _playlistService: PlaylistService
  ) {
    this.playlists$ = this._playlistService.playlists$();
  }

  ngOnInit(): void {
    this._playlistService.loadPlaylists(); // Fetches from server or previous store value if not empty.
  }

  /** Maps card option params to individual playlists. */
  mapOptions(playlist: Playlist): CardOptions {
    return {
      itemId: playlist.id,
      title: playlist.name
    }
  }

  /** Handles the empty data case with a default Card. */
  emptyCard(): CardOptions {
    return { itemId: '', title: 'No playlist to display', disabled: true };
  }

  /**
   * It is extremely common for API calls (or really any rxJS subscription), to completely reset the value of an array with the results.
   * If no trackBy is used, the whole list would be redrawn, impacting performances. This ensures that its not the case and only changed values are updated.
   */
  trackById(index: number, item: Playlist): string {
    return item.id;
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [PlaylistsComponent],
  exports: [PlaylistsComponent],
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ListViewModule,
    LoaderModule
  ]
})
export class PlaylistsModule {}

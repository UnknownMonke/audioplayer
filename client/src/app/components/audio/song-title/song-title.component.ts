import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { filter, Observable } from "rxjs";
import { n_u_empty_ } from "src/app/helpers";
import { CurrentTitle } from "src/app/types";
import { TitleService } from "../../../services/title.service";

/**
 * Standalone component to hold the song title display inside the audio player.
 *
 * ---
 *
 * On reduced mode, the components redirects to the song title view on click through the router.
 * On expanded mode, the click is disabled.
 *
 * ---
 *
 * The component is independent and responsible for wiring to necessary attributes and triggering their update when needed.
 *
 * Async pipes are used as long as the code can remain simple.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-song-title',
  templateUrl: './song-title.component.html',
  styleUrls: ['./song-title.component.scss'],
})
export class SongTitleComponent {

  readonly currentTitle$: Observable<CurrentTitle>;

  constructor(
    private _titleService: TitleService
  ) {
    this.currentTitle$ = this._titleService.currentTitle$
      .pipe(
        filter( (currentTitle: CurrentTitle) => !n_u_empty_(currentTitle) )
      );
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [SongTitleComponent],
  exports: [SongTitleComponent],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SongTitleModule {}

import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { filter, Observable } from "rxjs";
import { n_u_empty_ } from "src/app/helpers";
import { CurrentTitle } from "src/app/types";
import { AudioService } from "../../services/audio.service";
import { TitleService } from "../../services/title.service";
import { PlayingAnimationModule } from "../playing-animation/playing-animation.component";

/**
 * Standalone component to hold the song title view.
 *
 * ---
 *
 * This component displays when a song has been selected.
 *
 * Actions :
 *
 * - Displays the song title and artist.
 * - Displays a playing animation.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-titleview',
  templateUrl: './titleview.component.html',
  styleUrls: ['./titleview.component.scss']
})
export class TitleViewComponent implements OnInit, OnDestroy {

  readonly currentTitle$: Observable<CurrentTitle>;

  constructor(
    private _route: ActivatedRoute,
    private _audioService: AudioService,
    private _titleService: TitleService
  ) {
    this.currentTitle$ = this._titleService.currentTitle$
      .pipe(
        filter( (currentTitle: CurrentTitle) => !n_u_empty_(currentTitle) )
      );
  }

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');

    // Loads current title from the url on refresh. Updates a value in the store only if the current store value is empty.
    this._titleService.loadCurrentTitle(id!);
    this._audioService.expandPlayer(true);
  }

  ngOnDestroy(): void {
    this._audioService.expandPlayer(false);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [TitleViewComponent],
  exports: [TitleViewComponent],
  imports: [
    CommonModule,
    PlayingAnimationModule
  ]
})
export class TitleViewModule {}

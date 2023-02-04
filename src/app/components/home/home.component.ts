import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Observable } from "rxjs";
import { HomeService } from "../../services/home.service";
import { BottomSheetModule } from "../bottom-sheet/bottom-sheet.component";
import { HomeButtonModule } from "../home-button/home-button.component";
import { ThemeMenuModule } from "../theme-menu/theme-menu.component";

/**
 * High level container component to display a homepage with an animated button.
 *
 * ---
 *
 * The homepage holds the button, which can be used to access the app or display the settings menu,
 * which is held within the page.
 *
 * Actions :
 *
 * - On init, resets the app state :
 *    - Stops playback.
 *    - Hides audio player.
 *    - Resets current playlist and current title to their default state.
 *    - Hides settings menu if previously opened.
 *
 * - On click on the button (event handled within the component), handles 2 actions :
 *    - On single click, redirects to the playlists page.
 *    - On double click, shows the settings menu at the bottom of the page.
 *
 * ---
 *
 * This is done to preserve the clean state of the page, without adding sidebars and nav buttons,
 * and to accommodate for a mobile app design.
 * The settings are therefore accessed using an altenative behavior of the unique button.
 *
 * The click / double click behavior is handled using a timeout. If no other click is detected within 200ms,
 * we consider that the click is single, otherwise it is a double click.
 *
 * Finally, the menu dialogs are hosted within the component to be able to be positioned at the center of the screen (similar to modals being appended to the body),
 * and are triggered from within the settings components.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  readonly displayMenu$: Observable<boolean>;

  constructor(
    private _homeService: HomeService
  ) {
    /* The service public variable is copied to avoid exposing the service to the html.
     * Subscription is launched from the async pipe.
     * Some services return a getter rather than a direct variable. */
    this.displayMenu$ = this._homeService.displayMenu$;
  }

  ngOnInit(): void {
    this._homeService.resetState();
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [HomeComponent],
  exports: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule,
    BottomSheetModule,
    HomeButtonModule,
    ThemeMenuModule
  ]
})
export class HomeModule {}

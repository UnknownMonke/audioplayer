import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { HomeService } from "../../services/home.service";

/**
 * Staandalone component to display an animated button with wave effect (Shazam like).
 *
 * ---
 *
 * Since this button is unique, the click logic is handled here to discharge the parent component of some logic.
 * Presentational components are most useful for reusability.
 *
 * Actions :
 *
 * - On click on the button (event handled within the component), handles 2 actions :
 *    - On single click, redirects to the playlists page.
 *    - On double click, shows the settings menu at the bottom of the page.
 *
 * The click / double click behavior is handled using a timeout. If no other click is detected within 200ms,
 * we consider that the click is single, otherwise it is a double click.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-home-button',
  templateUrl: './home-button.component.html',
  styleUrls: ['./home-button.component.scss']
})
export class HomeButtonComponent {

  private _clicks = 0;
  private _timer!: NodeJS.Timeout;

  constructor(
    private _router: Router,
    private _homeService: HomeService
  ) {}

  singleClick(): void {
    this._router.navigateByUrl('/playlists');
  }

  doubleClick(): void {
    this._homeService.toggleMenuSettings();
  }

  /** Click handling. */
  onHomeClick(): void {
    this._clicks++;

    if(this._clicks === 1) { // Single click, navigates after 200ms.

      this._timer = setTimeout(() => {
        this.singleClick();
        this._clicks = 0;
      }, 200);

    } else { // Double click, opens settings.
      clearTimeout(this._timer);
      this.doubleClick();
      this._clicks = 0;
    }
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [HomeButtonComponent],
  exports: [HomeButtonComponent],
  imports: []
})
export class HomeButtonModule {}

import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ThemeService } from "../../services/theme.service";

/**
 * Standalone container component for the settings menu.
 *
 * ---
 *
 * Since the menu is short, each option has its logic processed here rather than in a separate child component.
 * Also, the menu is static rather than dynamically filled with an options object.
 *
 * The menu contains :
 *
 * - Access to themes dialog to change the current theme.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsComponent {

  constructor(
    private _themeService: ThemeService
  ) {}

  /** Opens the theme selection dialog. */
  showThemes(): void {
    this._themeService.showThemesMenu(true);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [SettingsComponent],
  exports: [SettingsComponent],
  imports: [
    MatIconModule
  ]
})
export class SettingsModule {}

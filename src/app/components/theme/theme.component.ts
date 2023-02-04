import { ChangeDetectionStrategy, Component, Input, NgModule } from "@angular/core";
import { Theme, ThemeService } from "../../services/theme.service";

/**
 * Component to display a theme option in the theme settings menu.
 *
 * ---
 *
 * Holds the logic to set the current theme when the option is selected (through the service).
 * This is because the logic is the same for all instances of the Theme component,
 * therefore the choice is made to hold the logic within the component rather than within its parent.
 *
 * The available theme is passed from the parent as a props.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent {

  @Input() theme: Theme = {};

  constructor(
    private _themeService: ThemeService
  ) {}

  setTheme(id: string): void {
    this._themeService.setTheme(id);
    this._themeService.showThemesMenu(false); // Closes the modal on change.
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [ThemeComponent],
  exports: [ThemeComponent],
  imports: []
})
export class ThemeModule {}

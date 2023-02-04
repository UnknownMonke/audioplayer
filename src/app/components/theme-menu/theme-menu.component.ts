import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule } from "@angular/core";
import { Observable } from "rxjs";
import { Theme, ThemeService } from "../../services/theme.service";
import { ModalModule } from "../modal/modal.component";
import { ThemeModule } from "../theme/theme.component";

/**
 * Container component to hold the theme menu dialog (modal).
 *
 * ---
 *
 * Options are held as a child component.
 *
 * Since this component is unique, the close event is handled here to encapsulate all the component logic within itself.
 *
 * In case other modals are used, the modal structure is extracted into a presentational component.
 * This component is always instantiated and the modal is displayed using the corresponding display attribute.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'm-theme-menu',
  templateUrl: './theme-menu.component.html'
})
export class ThemeMenuComponent {

  readonly display$: Observable<boolean>;

  readonly themes: Theme[] = themeList;

  constructor(
    private _themeService: ThemeService
  ) {
    this.display$ = this._themeService.display$;
  }

  close(): void {
    this._themeService.showThemesMenu(false);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [ThemeMenuComponent],
  exports: [ThemeMenuComponent],
  imports: [
    CommonModule,
    ModalModule,
    ThemeModule
  ]
})
export class ThemeMenuModule {}

/** Static theme list, exported as a separate object in order to be used throughout the application. */
export const themeList: Theme[] = [
  { id: "light-sun", name: "Light Sun" },
  { id: "light-dusk", name: "Light Dusk" },
  { id: "light-green", name: "Light Green" },
  { id: "dark-dusk", name: "Dark Dusk" }
];

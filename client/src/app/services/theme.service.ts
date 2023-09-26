import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { DisplaysActions, displayThemes } from "../store/display/display.store";

/**
 * Theme service. Handles themes display.
 *
 * ---
 *
 * Actions :
 *
 * - Handles the display of the themes selection dialog by interfacing the store attribute with an Observable.
 * - Get & Sets the selected theme.
 *
 * The theme is set by injecting the data-attribute directly into the html tag,
 * which will automatically pull the corresponding css.
 *
 * ---
 *
 * This service is a facade : a link between the components and the underlying processing structure (ngRx...).
 * It holds the meaning of the logic while being independent from its implementation.
 * Disconnects component logic from state management.
 *
 * The components can only access this service and this service can only be accessed by the components,
 * and not the underlying structure, to avoid circular imports.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  display$: Observable<boolean>;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _store: Store
  ) {
    this.display$ = this._store.select(displayThemes);
  }

  setTheme(theme: string): void {
    this._document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  getCurrentTheme(): string {
    return this._document.documentElement.getAttribute('data-theme') || 'default';
  }

  showThemesMenu(display: boolean): void {
    this._store.dispatch(DisplaysActions.setThemes({ display }));
  }
}

/**
 * Theme for the app.
 *
 * Type used only within the component-service layer,
 * therefore it can be held directly from within the service instead of within a separate file.
 *
 * @value code: name of the html data-attribute (see theme doc).
 * @value name: name of the theme displayed to the end user in the menu.
 */
export declare type Theme = {
  id: string,
  name: string
} | Record<PropertyKey, never>;

/** Static theme list, exported as a separate object in order to be used throughout the application. */
export const themeList: Theme[] = [
  { id: "light-green", name: "Light Green" },
  { id: "dark-dusk", name: "Dark Dusk" }
];

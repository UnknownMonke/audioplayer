import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { currentTitle, loadCurrentTitle, setCurrentTitle } from "../store/title/title.store";
import { CurrentTitle } from "../types";

/**
 * Service to expose and set the current playling title.
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
  providedIn: 'root',
})
export class TitleService {

  currentTitle$: Observable<CurrentTitle>;

  constructor(
    private _store: Store
  ) {
    this.currentTitle$ = this._store.select(currentTitle);
  }

  setCurrentTitle(title: CurrentTitle): void {
    this._store.dispatch(setCurrentTitle({ currentTitle: title }));
  }

  loadCurrentTitle(id: string): void {
    this._store.dispatch(loadCurrentTitle({ id }));
  }
}

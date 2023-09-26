import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, filter, map } from "rxjs";
import { applyScroll, scrollPos, setPos } from "../store/scroll/scroll.store";
import { ScrollState } from "../store/scroll/scroll.types";

/**
 * Service to expose and set the scroll position.
 *
 * ---
 *
 * Actions :
 *
 * - Saves the current scroll position in the store in a temp value.
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
export class ScrollService {

  scrollPos$: Observable<number>;

  constructor(
    private _store: Store
  ) {
    this.scrollPos$ = this._store.select(scrollPos)
      .pipe(
        filter( (scrollState: ScrollState) => scrollState.apply),
        map( (scrollState: ScrollState) => scrollState.pos)
      )
  }

  applyScroll(): void {
    this._store.dispatch(applyScroll());
  }

  savePos(pos: number): void {
    this._store.dispatch(setPos({ scrollstate: { pos, apply: false } }));
  }
}

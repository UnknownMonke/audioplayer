import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { mergeMap, of } from "rxjs";
import { applyScroll, scrollMap, scrollPos, setPos, setScrollMap, triggerSave } from "./scroll.store";
import { selectUrl } from "../router/router.store";


/**
 * - Save scroll on scroll end of background content template in temp store value.
 * - On navigation-start trigger a save of the current scroll position for views in a list (playlists, playlist), stored on a map(url, scroll position)
 * - When the listview component has finished init, dispatch an order to load the current scroll position for the view from the map.
 * Listview and not directly from the playlist component as the loading template can invalidate the scroll applied.
 * - Then background content template listens for the order to load the current scroll pos, then apply and save back the newly applied scroll position
 * inside the temp store value.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class ScrollEffects {

  constructor(
    private _actions$: Actions,
    private _store: Store
  ) {}

  triggerSave$ = createEffect(() => this._actions$
    .pipe(
      ofType(triggerSave),
      concatLatestFrom( () => [this._store.select(scrollMap), this._store.select(scrollPos)] ),
      mergeMap( ([action, scrollMap, scrollState]) => {

        const newMap = new Map<string,number>();

        scrollMap.forEach( (v,k) => newMap.set(k, v) );

        newMap.set(action.source, scrollState.pos);

        return of(setScrollMap({ scrollMap: newMap }));
      })
    )
  );

  applyScroll$ = createEffect(() => this._actions$
    .pipe(
      ofType(applyScroll),
      concatLatestFrom( () => [this._store.select(scrollMap), this._store.select(selectUrl)]),
      mergeMap( ([, scrollMap, url]) =>
        of(setPos({ scrollstate: { pos: scrollMap.get(url)?? 0, apply: true } }))
      )
    )
  );
}

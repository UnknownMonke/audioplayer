import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { mergeMap, of, tap } from "rxjs";
import { ROUTER_NAVIGATED, ROUTER_REQUEST } from "@ngrx/router-store";
import { routeHistory, selectUrl, setRouteHistory } from "./router.store";
import { triggerSave } from "../scroll/scroll.store";

/**
 * History: store the current and previously accessed route in the store using ngrx router.
 */
@Injectable({
  providedIn: 'root',
})
export class RouterEffects {

  constructor(
    private _actions$: Actions,
    private _store: Store
  ) {}

  setPreviousRoute$ = createEffect(() => this._actions$
    .pipe(
      ofType(ROUTER_REQUEST),
      concatLatestFrom( () => [this._store.select(routeHistory), this._store.select(selectUrl)]),
      tap( ([,,url]) => {
        if(this._shouldSaveScroll(url)) this._store.dispatch(triggerSave({ source: url }));
      }),
      mergeMap( ([,h, url]) => of(setRouteHistory({ routeHistory: { currentRoute: h.currentRoute, previousRoute: url } })) )
    )
  );

  setCurrentRoute$ = createEffect(() => this._actions$
    .pipe(
      ofType(ROUTER_NAVIGATED),
      concatLatestFrom( () => [this._store.select(routeHistory), this._store.select(selectUrl)]),
      mergeMap( ([,h, url]) => of(setRouteHistory({ routeHistory: { currentRoute: url, previousRoute: h.previousRoute } })) )
    )
  );

  private _shouldSaveScroll(route: string | undefined): boolean {
    return route !== undefined && route.includes('/playlist');
  }
}

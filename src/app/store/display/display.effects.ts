import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { mergeMap, of } from "rxjs";
import { DisplaysActions, displaySettings, toggleMenuSettings } from "./display.store";

@Injectable({
  providedIn: 'root',
})
export class DisplayEffects {

  constructor(
    private _actions$: Actions,
    private _store: Store
  ) {}

  /**
   * Toggle the settings menu by pulling the current display value from the state and
   * updating it with the negation.
   */
  toggleMenuSettings$ = createEffect(() => this._actions$
    .pipe(
      ofType(toggleMenuSettings),
      concatLatestFrom( () => this._store.select(displaySettings) ),
      mergeMap( ([, display]) =>
        of(DisplaysActions.setSettings({ display: !display })) )
    )
  );
}

import { createAction, createActionGroup, createFeatureSelector, createReducer, createSelector, on, props } from "@ngrx/store";
import { DisplaysState } from "./display.types";

export const toggleMenuSettings = createAction(
  '[boolean] Toggle Settings Menu'
);

export const DisplaysActions = createActionGroup({
  source: '[Displays] Display Actions',
  events: {
    'set player': props<{ display: boolean }>(),
    'set player expanded': props<{ display: boolean }>(),
    'set settings': props<{ display: boolean }>(),
    'set themes': props<{ display: boolean }>(),
  }
});

export const displaysReducer = createReducer(
  { player: false,
    playerExpanded: false,
    settings: false,
    themes: false },
  on(DisplaysActions.setPlayer, (state: DisplaysState, { display }) => ({ ...state, player: display }) ),
  on(DisplaysActions.setPlayerExpanded, (state: DisplaysState, { display }) => ({ ...state, playerExpanded: display }) ),
  on(DisplaysActions.setSettings, (state: DisplaysState, { display }) => ({ ...state, settings: display }) ),
  on(DisplaysActions.setThemes, (state: DisplaysState, { display }) => ({ ...state, themes: display }) ),
);

export const displays = createFeatureSelector<DisplaysState>('displays');

export const displayPlayer = createSelector(displays, (state: DisplaysState): boolean => state.player);
export const displayPlayerExpanded = createSelector(displays, (state: DisplaysState): boolean => state.playerExpanded);
export const displaySettings = createSelector(displays, (state: DisplaysState): boolean => state.settings);
export const displayThemes = createSelector(displays, (state: DisplaysState): boolean => state.themes);

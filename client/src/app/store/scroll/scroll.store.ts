import { createAction, createFeatureSelector, createReducer, emptyProps, on, props } from "@ngrx/store";
import { ScrollState } from "./scroll.types";

// ----------------------- Actions ----------------------- //

export const triggerSave = createAction(
  'Trigger save',
  props<{ source: string }>()
);

export const setPos = createAction(
  'Set pos',
  props<{ scrollstate : ScrollState }>()
);

export const setScrollMap = createAction(
  'Set Scroll map',
  props<{ scrollMap: Map<string, number> }>()
);

export const applyScroll = createAction(
  'Apply scroll',
  emptyProps
)

// ----------------------- Reducers ---------------------- //

export const scrollMapReducer = createReducer(
  new Map<string, number>(),
  on(setScrollMap, (state: Map<string, number>, { scrollMap }) => scrollMap)
);

export const scrollPosReducer = createReducer(
  { pos: 0, apply: false },
  on(setPos, (state: ScrollState, { scrollstate }) => scrollstate)
);

export const scrollMap = createFeatureSelector<Map<string, number>>('scrollMap');
export const scrollPos = createFeatureSelector<ScrollState>('scrollPos');


import { getRouterSelectors } from "@ngrx/router-store";
import { createAction, createFeatureSelector, createReducer, on, props } from "@ngrx/store";
import { RouteHistory } from "./router.types";

export const setRouteHistory = createAction(
  'Set route history',
  props<{ routeHistory: RouteHistory }>()
);

export const routeHistoryReducer = createReducer(
  {} as RouteHistory,
  on(setRouteHistory, (state: RouteHistory, { routeHistory }) => routeHistory )
);

export const { selectUrl, selectCurrentRoute } = getRouterSelectors();

export const routeHistory = createFeatureSelector<RouteHistory>('routeHistory');

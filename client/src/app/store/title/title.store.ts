import { createAction, createFeatureSelector, createReducer, on, props } from "@ngrx/store";
import { CurrentTitle } from "src/app/types";

// ----------------------- Actions ----------------------- //

/**
 * The createAction function returns a function, that when called returns an object in the shape of the Action interface.
 * The props method is used to define any additional metadata needed for the handling of the action.
 * Action creators provide a consistent, type-safe way to construct an action that is being dispatched.
 *
 * Action type is also seen in devTools, so a clear type can help understand the flow of the program.
 */
export const setCurrentTitle = createAction(
  '[Title] Set Title',
  props<{ currentTitle: CurrentTitle }>()
);

export const loadCurrentTitle = createAction(
  '[Playlist] Load Current Title',
  props<{ id: string }>()
);

// ----------------------- Reducers ---------------------- //

/**
 * Handles transitions from one state to the next state in the application.
 *
 * The reducer must be linked to a store variable to define how this variable state change will be handled
 * (done upon registering the StoreModule inside the root Module).
 *
 * As state is read only, any modification requires a spread of the underlying object.
 */
// Provides an initial state for the reducer. Can be an Object.
export const currentTitleReducer = createReducer(
  {} as CurrentTitle,
  on(setCurrentTitle, (state: CurrentTitle, { currentTitle }) => currentTitle) // Params : state and the props associated with the specific action.
);

// ----------------------- Selectors --------------------- //

/**
 * Used to retreive the corresponding store variable state.
 *
 * The variable can also be accessed directly with the variable name, such as `store.select('myVariable')`.
 */
export const currentTitle = createFeatureSelector<CurrentTitle>('currentTitle');

import { createAction, createFeatureSelector, createReducer, on, props } from "@ngrx/store";
import { Playlist, Title } from "src/app/types";

// ----------------------- Actions ----------------------- //

export const loadPlaylists = createAction(
  '[Playlists] Load Playlists'
);

export const setPlaylists = createAction(
  '[Playlists] Set Playlists',
  props<{ playlists: Playlist[] }>()
);

export const loadCurrentPlaylist = createAction(
  '[Playlist] Load Current Playlist',
  props<{ playlistId: string }>()
);

export const setCurrentPlaylist = createAction(
  '[Playlist] Set Current Playlist',
  props<{ currentPlaylist: Playlist }>()
);

export const setStreamingPlaylist = createAction(
  '[Playlist] Set Streaming Playlist',
  props<{ streamingPlaylist: Playlist }>()
);

export const updateStreamingPlaylist = createAction(
  '[Playlist] Update Streaming Playlist',
  props<{ currentTitle: Title }>()
);

// ----------------------- Reducers ---------------------- //

export const initialCurrentPlaylistState: Playlist = {} as Playlist;
export const initialStreamingPlaylistState: Playlist = {} as Playlist;
export const initialPlaylistsState: Playlist[] = [];

export const currentPlaylistReducer = createReducer(
  initialCurrentPlaylistState,
  on(setCurrentPlaylist, (state: Playlist, { currentPlaylist }) => currentPlaylist)
);

export const streamingPlaylistReducer = createReducer(
  initialStreamingPlaylistState,
  on(setStreamingPlaylist, (state: Playlist, { streamingPlaylist }) => streamingPlaylist)
);

export const playlistsReducer = createReducer(
  initialPlaylistsState,
  on(setPlaylists, (state: Playlist[], { playlists }) => playlists)
);

// ----------------------- Selectors --------------------- //

export const currentPlaylist = createFeatureSelector<Playlist>('currentPlaylist');

export const streamingPlaylist = createFeatureSelector<Playlist>('streamingPlaylist');

export const playlists = createFeatureSelector<Playlist[]>('playlists');

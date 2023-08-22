declare module '*.json' {
  const value: string;
  export default value;
}

type Empty<T extends Record<PropertyKey, unknown>> = [keyof T] extends [never] ? true : false;

export declare type TitleState = {
  isPlaying: boolean,
  selected: boolean
};

export declare type DisplaysState = {
  player: boolean,
  playerExpanded: boolean,
  settings: boolean,
  themes: boolean
}

/* --------------------------- DTO --------------------------- */

/** DTO, may not represent the underlying Entity. */
export declare type Playlist = {
  id: string,
  name: string,
  titles?: Map<string, Title> // Only the selected playlist will have its titles specified. Map for fast update and access.
} | Record<PropertyKey, never>;

/** DTO, may not represent the underlying Entity. only static infos */
export declare type Title = {
  id: string,
  playlistId: string,
  name: string,
  artist: string,
  featuring?: string[],
  source: string
} | Record<PropertyKey, never>;

export declare type CurrentTitle = {
  infos: Title,
  state: TitleState
} | Record<PropertyKey, never>;

export function n_u_empty_<T extends Record<PropertyKey, unknown>>(o: T): boolean {
  return o === undefined || o === null || Object.keys(o).length === 0;
};

//TODO variable env
export enum APIEntry {
  PLAYLIST_ENTRY = 'http://localhost:4000/playlists',
  TITLE_ENTRY = 'http://localhost:4000/titles'
};

export function n_u_empty_<T extends Record<PropertyKey, unknown>>(o: T): boolean {
  return o === undefined || o === null || Object.keys(o).length === 0;
};

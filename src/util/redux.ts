export function mapById<T extends { id: string }>(
  array: T[],
): { [id: string]: T } {
  return array.reduce((byId, entry) => {
    return {
      ...byId,
      [entry.id]: entry,
    };
  }, {});
}

// TODO use @ngrx/entity
export function removeById<T extends { id: string }>(
  map: { [id: string]: T },
  entry: T,
): { [id: string]: T } {
  const { [entry.id]: removedEntry, ...withoutEntry } = map;
  return withoutEntry;
}

export function mapEntries<T extends { id: string }>(
  entriesById: { [id: string]: T },
  mapFn: (entry: T) => T,
): { [id: string]: T } {
  const entries: T[] = Object.keys(entriesById).map(id => entriesById[id]);
  return mapById(entries.map(mapFn));
}

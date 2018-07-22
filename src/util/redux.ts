export function mapById<T extends { id: number }>(array: T[]): { [id: number]: T } {
  return array.reduce((byId, entry) => {
    return {
      ...byId,
      [entry.id]: entry,
    }
  }, {});
}

// TODO use @ngrx/entity
export function removeById<T extends { id: number }>(map: { [id: number]: T }, entry: T): { [id: number]: T } {
  const {[entry.id]: removedEntry, ...withoutEntry} = map;
  return withoutEntry;
}

export function mapEntries<T extends { id: number }>(entriesById: { [id: number]: T}, mapFn: (entry: T) => T): { [id: number]: T } {
  const entries: T[] = Object.keys(entriesById).map(id => entriesById[id]);
  return mapById(entries.map(mapFn));
}

export function mapById<T extends { id: number }>(array: T[]): { [id: number]: T } {
  return array.reduce((byId, entry) => {
    return {
      ...byId,
      [entry.id]: entry,
    }
  }, {});
}

import { EntityState } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

export type Comparer<T> = (a: T, b: T) => number;

export interface Dictionary<T> {
  [id: string]: T;
  [id: number]: T;
}

export interface ListState {
  ids: string[] | number[];
  loading: boolean;
  loadingMore: boolean;
  complete: boolean;
}

export interface ListSelectors<S, T> {
  selectIds(state: S): string[] | number[];
  selectAll(state: S): T[];
  selectLoading(state: S): boolean;
  selectLoadingMore(state: S): boolean;
  selectComplete(state: S): boolean;
}

export class ListAdapter<T> {
  constructor(
    private sortComparer: false | Comparer<T>,
    private pageSize: false | number,
  ) {}

  getInitialState(): ListState {
    return {
      ids: [],
      loading: false,
      loadingMore: false,
      complete: false,
    };
  }

  load(listState: ListState): ListState {
    return {
      ...listState,
      loading: true,
    };
  }

  loadSuccess(
    entities: T[],
    state: EntityState<T>,
    listState: ListState,
  ): ListState {
    // TODO use idSelector, remove any
    const keys = entities.map((entity: any) => entity.id);
    // TODO remove conversion
    let ids = <any[]>[...listState.ids, ...keys];
    if (this.sortComparer) {
      // TODO use idSelector, remove any
      const allEntities = {
        ...state.entities,
        ...entities.reduce((newEntities, entity: any) => {
          newEntities[entity.id] = entity;
          return newEntities;
        }, {}),
      };
      ids = ids
        .map(id => allEntities[id])
        .sort(this.sortComparer)
        .map((entity: any) => entity.id);
    }
    return {
      ...listState,
      ids,
      loading: false,
      complete: !this.pageSize || keys.length < this.pageSize,
    };
  }

  getSelectors<S>(
    listSelector: (state: S) => ListState,
    entitiesSelector: (state: S) => Dictionary<T>,
  ): ListSelectors<S, T> {
    const selectIds = createSelector(listSelector, listState => listState.ids);
    const selectAll = createSelector(
      selectIds,
      entitiesSelector,
      (ids, entities) => (<any>ids).map(id => entities[id]),
    );
    const selectLoading = createSelector(
      listSelector,
      listState => listState.loading,
    );
    const selectLoadingMore = createSelector(
      listSelector,
      listState => listState.loadingMore,
    );
    const selectComplete = createSelector(
      listSelector,
      listState => listState.complete,
    );
    return {
      selectIds,
      selectAll,
      selectLoading,
      selectLoadingMore,
      selectComplete,
    };
  }
}

export function createListAdapter<T>(options?: {
  sortComparer?: false | Comparer<T>;
  pageSize?: false | number;
}): ListAdapter<T> {
  const sortComparer = (options && options.sortComparer) || false;
  const pageSize = (options && options.pageSize) || false;
  return new ListAdapter(sortComparer, pageSize);
}

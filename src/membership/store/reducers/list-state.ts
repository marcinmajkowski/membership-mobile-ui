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
  complete: boolean;
}

export interface ListSelectors<S, T> {
  selectIds(state: S): string[] | number[];
  selectAll(state: S): T[];
  selectLoading(state: S): boolean;
  selectComplete(state: S): boolean;
  selectTotal(state: S): number;
  selectLoaded(state: S): boolean;
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
      complete: false,
    };
  }

  load(listState: ListState): ListState {
    return { ...listState, loading: true };
  }

  loadSuccess(
    entities: T[],
    append: boolean,
    state: EntityState<T>,
    listState: ListState,
  ): ListState {
    // TODO use idSelector, remove any
    const keys = entities.map((entity: any) => entity.id);
    // TODO remove conversion
    let ids = append ? <any[]>[...listState.ids, ...keys] : keys;
    if (this.sortComparer) {
      // TODO use idSelector, remove any
      const allEntities = {
        ...state.entities,
        ...entities.reduce((newEntities, entity: any) => {
          newEntities[entity.id] = entity;
          return newEntities;
        }, {}),
      };
      ids = this.sort(ids, allEntities);
    }
    return {
      ...listState,
      ids,
      loading: false,
      complete: !this.pageSize || keys.length < this.pageSize,
    };
  }

  loadFail(listState: ListState): ListState {
    return { ...listState, loading: false };
  }

  addOne(entity: T, state: EntityState<T>, listState: ListState): ListState {
    if (!isListLoaded(listState)) {
      return listState;
    }
    // TODO useIdSelector, remove any
    let ids = [...listState.ids, (<any>entity).id];
    if (this.sortComparer) {
      // TODO use idSelector, remove any
      const allEntities = {
        ...state.entities,
        [(<any>entity).id]: entity,
      };
      ids = this.sort(ids, allEntities);
    }
    return { ...listState, ids };
  }

  removeOne(key: string, listState: ListState): ListState {
    if (!isListLoaded(listState)) {
      return listState;
    }
    // TODO remove conversion
    const ids = (<string[]>listState.ids).filter(id => id !== key);
    return { ...listState, ids };
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
    const selectComplete = createSelector(
      listSelector,
      listState => listState.complete,
    );
    const selectTotal = createSelector(selectIds, ids => ids.length);
    const selectLoaded = createSelector(listSelector, isListLoaded);
    return {
      selectIds,
      selectAll,
      selectLoading,
      selectComplete,
      selectTotal,
      selectLoaded,
    };
  }

  // TODO typing
  private sort(ids: any[], entities: Dictionary<any>): any[] {
    if (this.sortComparer) {
      return ids
        .map(id => entities[id])
        .sort(this.sortComparer)
        .map(entity => entity.id);
    } else {
      return ids;
    }
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

function isListLoaded(listState: ListState): boolean {
  return listState.complete || listState.ids.length > 0;
}

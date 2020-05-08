import { createEntityAdapter, EntityState } from '@ngrx/entity';

import * as actions from '../actions/group-manager.actions';

export interface GroupEntity {
  id: number;
  groupId: number;
  name?: string;
  groupPlayerId?: number;
  enabledPlayerId?: number;
}

export interface State extends EntityState<GroupEntity> { }

// const initialState: State = {
//   ids: ['1', '2'],
//   entities: {
//     1: { id: 1, groupId: 1, name: 'Monday at Mentor', groupPlayerId: 1, enabledPlayerId: 2},
//     2: { id: 2, groupId: 2, name: 'YMCA Tuesday', groupPlayerId: 3, enabledPlayerId: 4}
//   }
// };
const initialState: State = {
  ids: [],
  entities: {},
};

export const adapter = createEntityAdapter<GroupEntity>();

export function reducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.ADD_GROUP: {
      return adapter.addOne(action.payload, state);
    }
    case actions.REMOVE_GROUP: {
      return adapter.removeOne(action.payload.groupId, state);
    }
    case actions.LOAD_GROUPS_SUCCESS: {
      return adapter.addAll(action.payload, state);
    }
    default: {
      return state;
    }
  }
}

import { createEntityAdapter, EntityState } from '@ngrx/entity';

import { Player } from '../../models';
import * as actions from '../actions/schedule-bye.actions';

export interface ScheduleByeEntity {
  id: number;
  byeId: number;
  byePlayers?: Player[];
}

export interface State extends EntityState<ScheduleByeEntity> { }

const initialState: State = {
  ids: [],
  entities: {
  },
};

export const adapter = createEntityAdapter<ScheduleByeEntity>();

export function reducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.CREATE_SCHEDULE_BYE: {
      return adapter.addOne(action.payload, state);
    }
    case actions.DELETE_ALL_BYES: {
      return adapter.removeAll(state);
    }
    default: {
      return state;
    }
  }
}

import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as actions from '../actions/schedule-round.actions';

export interface ScheduleRoundEntity {
  id: number;
  roundId: number;
  matchIds: number[];
  byeId: number;
}

export interface State extends EntityState<ScheduleRoundEntity> { }

const initialState: State = {
  ids: [],
  entities: {
  }
};

export const adapter = createEntityAdapter<ScheduleRoundEntity>();

export function reducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.CREATE_SCHEDULE_ROUND: {
      return adapter.addOne(action.payload, state);
    }
    case actions.DELETE_ALL_ROUNDS: {
      return adapter.removeAll(state);
    }
    default: {
      return state;
    }
  }
}

import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as actions from '../actions/schedule-match.actions';
import { Match } from '../../models';

export interface ScheduleMatchEntity {
  id: number;
  matchId: number;
  match: Match;
}

export interface ScheduleMatchUpdateEntity {
  id: number;
  changes: Partial<ScheduleMatchEntity>;
}

export interface State extends EntityState<ScheduleMatchEntity> { }

const initialState: State = {
  ids: [],
  entities: {
  }
};

export const adapter = createEntityAdapter<ScheduleMatchEntity>();

export function reducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.CREATE_SCHEDULE_MATCH: {
      return adapter.addOne(action.payload, state);
    }
    case actions.UPDATE_SCHEDULE_MATCH: {
      return adapter.updateOne({id: action.payload.id, changes: action.payload.changes}, state);
    }
    case actions.DELETE_ALL_MATCHES: {
      return adapter.removeAll(state);
    }
    default: {
      return state;
    }
  }
}

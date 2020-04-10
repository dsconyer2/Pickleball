import * as actions from '../actions/schedule.actions';
import { tassign } from 'tassign';
import { RoundData } from '../../models';

export interface Schedule {
  scheduleHeaders: string[];
  scheduleRounds: RoundData[];
}

export interface State {
  scheduleHeaders: string[];
  scheduleRounds: RoundData[];
}

const initialState: State = {
  scheduleHeaders: [],
  scheduleRounds: []
};

export function reducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.UPDATE_SCHEDULE:
      return tassign(state, {
        scheduleHeaders: action.payload.scheduleHeaders,
        scheduleRounds: action.payload.scheduleRounds,
      });
      case actions.UPDATE_SCHEDULE_HEADERS:
      return tassign(state, {
        scheduleHeaders: action.payload.scheduleHeaders,
      });
    default: {
      return state;
    }
  }
}

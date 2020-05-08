import { tassign } from 'tassign';

import * as actions from '../actions/schedule-header.actions';

export interface Schedule {
  scheduleHeaders: string[];
}

export interface State {
  scheduleHeaders: string[];
}

const initialState: State = {
  scheduleHeaders: [],
};

export function reducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.UPDATE_SCHEDULE_HEADERS:
      return tassign(state, {
        scheduleHeaders: action.payload.scheduleHeaders,
      });
    default: {
      return state;
    }
  }
}

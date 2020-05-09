import { createEntityAdapter } from '@ngrx/entity';
import { tassign } from 'tassign';

import * as actions from '../actions/group-player-settings.actions';
import { Group } from '../models';

export interface GroupPlayerSettingsEntity {
  selectedGroup: Group;
}

export interface State {
  selectedGroup: Group;
}

// const initialState: State = {
//   selectedGroup: {groupId: 1,
//     name: "Friday at Mayfield",
//     groupPlayerId: 1,
//     enabledPlayerId: 2}
// };

const initialState: State = {
  selectedGroup: {
    groupId: undefined,
    name: '',
    groupPlayerId: undefined,
    enabledPlayerId: undefined,
  },
};

export const adapter = createEntityAdapter<GroupPlayerSettingsEntity>();

export function reducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.UPDATE_GROUP_PLAYER_SELECTED_GROUP:
      return tassign(state, { selectedGroup: action.payload.selectedGroup });
    case actions.LOAD_GROUP_PLAYER_SETTINGS_SUCCESS:
      return tassign(state, {
        selectedGroup: action.payload.selectedGroup,
      });
    default: {
      return state;
    }
  }
}

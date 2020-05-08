import { Action } from '@ngrx/store';

import { Group } from '../models';
import { GroupPlayerSettingsEntity } from '../reducers/group-player-settings.reducer';

const emptyGroupPlayerSettings = {
  selectedGroup: undefined,
};

export const UPDATE_GROUP_PLAYER_SELECTED_GROUP = '[groupFeature] update  groupPlayerSelectedGroup';
export class GroupPlayerSelectedGroupUpdated implements Action {
  readonly type = UPDATE_GROUP_PLAYER_SELECTED_GROUP;
  payload: GroupPlayerSettingsEntity;
  constructor(selectedGroup: Group) {
    this.payload = emptyGroupPlayerSettings;
    this.payload.selectedGroup = selectedGroup;
  }
}

export const LOAD_GROUP_PLAYER_SETTINGS = '[groupFeature] load  groupPlayerSettings';
export class GroupPlayerSettingsLoad implements Action {
  readonly type = LOAD_GROUP_PLAYER_SETTINGS;
  constructor() {}
}

export const LOAD_GROUP_PLAYER_SETTINGS_SUCCESS = '[groupFeature] load  groupPlayerSettings succeeded';
export class GroupPlayerSettingsLoadedSuccessfully implements Action {
  readonly type = LOAD_GROUP_PLAYER_SETTINGS_SUCCESS;
  constructor(public payload: GroupPlayerSettingsEntity) {}
}

export type All =
  GroupPlayerSelectedGroupUpdated
  | GroupPlayerSettingsLoad
  | GroupPlayerSettingsLoadedSuccessfully;

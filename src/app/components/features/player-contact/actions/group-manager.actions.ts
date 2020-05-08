import { Action } from '@ngrx/store';

import { GroupEntity } from '../reducers/group-manager.reducer';

export const ADD_GROUP = '[groupFeature] add  group';
export class GroupAdded implements Action {
  readonly type = ADD_GROUP;
  payload: GroupEntity;
  constructor(groupId: number, name: string, groupPlayerId: number, enabledPlayerId: number) {
    this.payload = {
      groupId,
      name,
      groupPlayerId,
      enabledPlayerId,
      id: groupId,
    };
  }
}

export const REMOVE_GROUP = '[groupFeature] remove  group';
export class GroupRemoved implements Action {
  readonly type = REMOVE_GROUP;
  payload: GroupEntity;
  constructor(groupId: number) {
    this.payload = {
      groupId,
      id: groupId,
    };
  }
}

export const LOAD_GROUPS = '[groupFeature] load  groups';
export class GroupsLoad implements Action {
  readonly type = LOAD_GROUPS;
  constructor() {}
}

export const LOAD_GROUPS_SUCCESS = '[groupFeature] load  groups succeeded';
export class GroupsLoadedSuccessfully implements Action {
  readonly type = LOAD_GROUPS_SUCCESS;
  constructor(public payload: GroupEntity[]) {}
}

export type All =
  GroupAdded
  | GroupRemoved
  | GroupsLoad
  | GroupsLoadedSuccessfully;

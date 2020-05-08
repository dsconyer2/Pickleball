import { Action } from '@ngrx/store';

import { PlayerContact } from '../models';
import { GroupPlayerEntity, GroupPlayerUpdateEntity } from '../reducers/group-player.reducer';
import { PlayerContactEntity } from '../reducers/player-contact.reducer';

export const CREATE_GROUP_PLAYER = '[groupFeature] create  groupPlayer';
export class GroupPlayerCreated implements Action {
  readonly type = CREATE_GROUP_PLAYER;
  payload: GroupPlayerEntity;
  constructor(groupPlayerId: number) {
    this.payload = {
      groupPlayerId,
      playerContacts: [],
      id: groupPlayerId,
    };
  }
}

export const DELETE_GROUP_PLAYER = '[groupFeature] delete  groupPlayer';
export class GroupPlayerDeleted implements Action {
  readonly type = DELETE_GROUP_PLAYER;
  payload: GroupPlayerEntity;
  constructor(groupPlayerId: number) {
    this.payload = {
      groupPlayerId,
      id: groupPlayerId,
    };
  }
}

export const ADD_GROUP_PLAYER = '[groupFeature] add  groupPlayer';
export class GroupPlayerAdded implements Action {
  readonly type = ADD_GROUP_PLAYER;
  payload: GroupPlayerUpdateEntity;
  constructor(groupPlayerId: number, playerContacts: PlayerContact[]) {
    this.payload = {
      changes: { playerContacts },
      id: groupPlayerId,
    };
  }
}

export const REMOVE_GROUP_PLAYER = '[groupFeature] remove  groupPlayer';
export class GroupPlayerRemoved implements Action {
  readonly type = REMOVE_GROUP_PLAYER;
  payload: GroupPlayerUpdateEntity;
  constructor(groupPlayerId: number, playerContacts: PlayerContact[]) {
    this.payload = {
      changes: { playerContacts },
      id: groupPlayerId,
    };
  }
}

export const LOAD_GROUP_PLAYERS = '[groupFeature] load  groupPlayers';
export class GroupPlayersLoad implements Action {
  readonly type = LOAD_GROUP_PLAYERS;
  constructor() {}
}

export const LOAD_GROUP_PLAYERS_SUCCESS = '[groupFeature] load  groupPlayers succeeded';
export class GroupPlayersLoadedSuccessfully implements Action {
  readonly type = LOAD_GROUP_PLAYERS_SUCCESS;
  constructor(public payload: GroupPlayerEntity[]) {}
}

export const REMOVE_PLAYER_CONTACT_FROM_GROUP_PLAYERS = '[groupFeature] remove playerContact';
export class PlayerContactRemovedFromGroupPlayers implements Action {
  readonly type = REMOVE_PLAYER_CONTACT_FROM_GROUP_PLAYERS;
  payload: PlayerContactEntity;
  constructor(playerContactId: number) {
    this.payload = {
      playerContactId,
      id: playerContactId,
    };
  }
}

export type All =
  GroupPlayerCreated
  | GroupPlayerDeleted
  | GroupPlayerAdded
  | GroupPlayerRemoved
  | GroupPlayersLoad
  | GroupPlayersLoadedSuccessfully;

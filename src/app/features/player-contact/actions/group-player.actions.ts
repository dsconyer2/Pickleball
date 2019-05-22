import { Action } from '@ngrx/store';
import { GroupPlayerEntity, GroupPlayerUpdateEntity } from '../reducers/group-player.reducer';
import { PlayerContact } from '../models';


export const CREATE_GROUP_PLAYER = '[groupFeature] create  groupPlayer';
export class GroupPlayerCreated implements Action {
  readonly type = CREATE_GROUP_PLAYER;
  payload: GroupPlayerEntity;
  constructor(groupPlayerId: number) {
    this.payload = {
      id: groupPlayerId,
      groupPlayerId,
      players: []

    };
   }
}

export const DELETE_GROUP_PLAYER = '[groupFeature] delete  groupPlayer';
export class GroupPlayerDeleted implements Action {
  readonly type = DELETE_GROUP_PLAYER;
  payload: GroupPlayerEntity;
  constructor(groupPlayerId: number) {
    this.payload = {
      id: groupPlayerId,
      groupPlayerId
    };
   }
}

export const ADD_GROUP_PLAYER = '[groupFeature] add  groupPlayer';
export class GroupPlayerAdded implements Action {
  readonly type = ADD_GROUP_PLAYER;
  payload: GroupPlayerUpdateEntity;
  constructor(groupPlayerId: number, players: PlayerContact[]) {
    this.payload = {
      id: groupPlayerId,
      changes: {players}
    };
   }
}

export const REMOVE_GROUP_PLAYER = '[groupFeature] remove  groupPlayer';
export class GroupPlayerRemoved implements Action {
  readonly type = REMOVE_GROUP_PLAYER;
  payload: GroupPlayerUpdateEntity;
  constructor(groupPlayerId: number, players: PlayerContact[]) {
    this.payload = {
      id: groupPlayerId,
      changes: {players}
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

export type All =
GroupPlayerCreated
| GroupPlayerDeleted
| GroupPlayerAdded
| GroupPlayerRemoved
| GroupPlayersLoad
| GroupPlayersLoadedSuccessfully;

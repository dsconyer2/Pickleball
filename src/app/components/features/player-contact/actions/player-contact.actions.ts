import { Action } from '@ngrx/store';
import { PlayerContactEntity } from '../reducers/player-contact.reducer';

export const ADD_PLAYER_CONTACT = '[playerContactFeature] add  playerContact';
export class PlayerContactAdded implements Action {
  readonly type = ADD_PLAYER_CONTACT;
  payload: PlayerContactEntity;
  constructor(playerContactId: number, name: string) {
    this.payload = {
      id: playerContactId,
      playerContactId,
    name
    };
   }
}

export const REMOVE_PLAYER_CONTACT = '[playerContactFeature] remove  playerContact';
export class PlayerContactRemoved implements Action {
  readonly type = REMOVE_PLAYER_CONTACT;
  payload: PlayerContactEntity;
  constructor(playerContactId: number) {
    this.payload = {
      id: playerContactId,
      playerContactId
    };
   }
}

export const LOAD_PLAYER_CONTACTS = '[playerContactFeature] load  playerContacts';
export class PlayerContactsLoad implements Action {
  readonly type = LOAD_PLAYER_CONTACTS;
  constructor() {}
}

export const LOAD_PLAYER_CONTACTS_SUCCESS = '[playerContactFeature] load  playerContacts succeeded';
export class LoadedPlayerContactsSuccessfully implements Action {
  readonly type = LOAD_PLAYER_CONTACTS_SUCCESS;
  constructor(public payload: PlayerContactEntity[]) {}
}

export type All =
PlayerContactAdded
| PlayerContactRemoved
| PlayerContactsLoad
| LoadedPlayerContactsSuccessfully;

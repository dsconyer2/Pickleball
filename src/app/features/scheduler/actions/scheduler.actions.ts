import { Action } from '@ngrx/store';
import { PlayerEntity } from '../reducers/player.reducer';
import { SchedulerSettings } from '../reducers/scheduler.reducer';
import { Group } from '../../player-contact/models';

const emptySchedulerSettings = {
  schedulerPlayerType: undefined,
  schedulerType: undefined,
  nbrOfPlayers: undefined,
  nbrOfCourts: undefined,
  nbrOfPlayersPerCourt: undefined,
  randomizeOrder: undefined,
  useNamesForMatches: undefined,
  loadFromGroup: false,
  selectedGroup: undefined
};

let myId = 10;
export const ADD_PLAYER = '[schedulerFeature] add  player';
export class PlayerAdded implements Action {
  readonly type = ADD_PLAYER;
  payload: PlayerEntity;
  constructor(playerId: number, playerName: string, isPlayerAvailable: boolean, isByeAvailable: boolean,
              byeRound: number, playedAgainst: {}, courtsPlayed: {}) {
    this.payload = {
      playerId,
      playerName,
      isPlayerAvailable,
      isByeAvailable,
      byeRound,
      playedAgainst,
      courtsPlayed,
      id: myId++
    };
  }
}

export const REMOVE_ALL_PLAYER = '[schedulerFeature] removeAll  player';
export class PlayerRemoveAll implements Action {
  readonly type = REMOVE_ALL_PLAYER;
  // payload: PlayerEntity;
  constructor() {
    // this.payload = {};
  }
}

export const UPDATE_SCHEDULER_PLAYER_TYPE = '[schedulerFeature] update  schedulerPlayerType';
export class SchedulerPlayerTypeUpdated implements Action {
  readonly type = UPDATE_SCHEDULER_PLAYER_TYPE;
  payload: SchedulerSettings;
  constructor(schedulerPlayerType: string) {
    this.payload = emptySchedulerSettings;
    this.payload.schedulerPlayerType = schedulerPlayerType;
  }
}
export const UPDATE_SCHEDULER_TYPE = '[schedulerFeature] update  schedulerType';
export class SchedulerTypeUpdated implements Action {
  readonly type = UPDATE_SCHEDULER_TYPE;
  payload: SchedulerSettings;
  constructor(schedulerType: string) {
    this.payload = emptySchedulerSettings;
    this.payload.schedulerType = schedulerType;
  }
}

export const UPDATE_NBR_OF_PLAYERS = '[schedulerFeature] update  nbrOfPlayers';
export class NbrOfPlayersUpdated implements Action {
  readonly type = UPDATE_NBR_OF_PLAYERS;
  payload: SchedulerSettings;
  constructor(nbrOfPlayers: number) {
    this.payload = emptySchedulerSettings;
    this.payload.nbrOfPlayers = nbrOfPlayers;
  }
}

export const UPDATE_NBR_OF_COURTS = '[schedulerFeature] update  nbrOfCourts';
export class NbrOfCourtsUpdated implements Action {
  readonly type = UPDATE_NBR_OF_COURTS;
  payload: SchedulerSettings;
  constructor(nbrOfCourts: number) {
    this.payload = emptySchedulerSettings;
    this.payload.nbrOfCourts = nbrOfCourts;
  }
}

export const UPDATE_NBR_OF_PLAYERS_PER_COURT = '[schedulerFeature] update  nbrOfPlayersPerCourt';
export class NbrOfPlayersPerCourtUpdated implements Action {
  readonly type = UPDATE_NBR_OF_PLAYERS_PER_COURT;
  payload: SchedulerSettings;
  constructor(nbrOfPlayersPerCourt: number) {
    this.payload = emptySchedulerSettings;
    this.payload.nbrOfPlayersPerCourt = nbrOfPlayersPerCourt;
  }
}

export const UPDATE_RANDOMIZE_ORDER = '[schedulerFeature] update  randomizeOrder';
export class RandomizeOrderUpdated implements Action {
  readonly type = UPDATE_RANDOMIZE_ORDER;
  payload: SchedulerSettings;
  constructor(randomizeOrder: boolean) {
    this.payload = emptySchedulerSettings;
    this.payload.randomizeOrder = randomizeOrder;
  }
}

export const UPDATE_USE_NAMES_FOR_MATCHES = '[schedulerFeature] update  useNamesForMatches';
export class UseNamesForMatchesUpdated implements Action {
  readonly type = UPDATE_USE_NAMES_FOR_MATCHES;
  payload: SchedulerSettings;
  constructor(useNamesForMatches: boolean) {
    this.payload = emptySchedulerSettings;
    this.payload.useNamesForMatches = useNamesForMatches;
  }
}

export const UPDATE_LOAD_FROM_GROUP = '[schedulerFeature] update  loadFromGroup';
export class LoadFromGroupUpdated implements Action {
  readonly type = UPDATE_LOAD_FROM_GROUP;
  payload: SchedulerSettings;
  constructor(loadFromGroup: boolean) {
    this.payload = emptySchedulerSettings;
    this.payload.loadFromGroup = loadFromGroup;
  }
}

export const UPDATE_SELECTED_GROUP = '[schedulerFeature] update  selectedGroup';
export class SelectedGroupUpdated implements Action {
  readonly type = UPDATE_SELECTED_GROUP;
  payload: SchedulerSettings;
  constructor(selectedGroup: Group) {
    this.payload = emptySchedulerSettings;
    this.payload.selectedGroup = selectedGroup;
  }
}

export const LOAD_SCHEDULER_SETTINGS = '[schedulerFeature] load  schedulerSettings';
export class SchedulerSettingsLoad implements Action {
  readonly type = LOAD_SCHEDULER_SETTINGS;
  constructor() {}
}

export const LOAD_SCHEDULER_SETTINGS_SUCCESS = '[schedulerFeature] load  schedulerSettings succeeded';
export class SchedulerSettingsLoadedSuccessfully implements Action {
  readonly type = LOAD_SCHEDULER_SETTINGS_SUCCESS;
  constructor(public payload: SchedulerSettings) {}
}

// Discriminated Union Type  http://www.typescriptlang.org/docs/handbook/advanced-types.html
export type All =
PlayerAdded
| PlayerRemoveAll
| SchedulerPlayerTypeUpdated
| SchedulerTypeUpdated
| NbrOfPlayersUpdated
| NbrOfCourtsUpdated
| NbrOfPlayersPerCourtUpdated
| RandomizeOrderUpdated
| UseNamesForMatchesUpdated
| LoadFromGroupUpdated
| SelectedGroupUpdated
| SchedulerSettingsLoad
| SchedulerSettingsLoadedSuccessfully;

import { Action } from '@ngrx/store';
import { PlayerEntity } from '../reducers/player.reducer';
import { SchedulerSettings } from '../reducers/scheduler.reducer';

const emptySchedulerSettings = {
  schedulerType: undefined,
  nbrOfPlayers: undefined,
  nbrOfCourts: undefined,
  nbrOfPlayersPerCourt: undefined,
  randomizeOrder: undefined,
  useNamesForMatches: undefined
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
| SchedulerTypeUpdated
| NbrOfPlayersUpdated
| NbrOfCourtsUpdated
| NbrOfPlayersPerCourtUpdated
| RandomizeOrderUpdated
| UseNamesForMatchesUpdated
| SchedulerSettingsLoad
| SchedulerSettingsLoadedSuccessfully;

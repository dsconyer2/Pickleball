import { tassign } from 'tassign';

import { Group } from '../../../player-contact/models';
import * as actions from '../actions/scheduler.actions';

export interface SchedulerSettings {
  schedulerPlayerType: string;
  schedulerType: string;
  nbrOfPlayers: number;
  nbrOfByePlayers: number;
  nbrOfCourts: number;
  nbrOfPlayersPerCourt: number;
  randomizeOrder: boolean;
  useNamesForMatches: boolean;
  loadFromGroup: boolean;
  selectedGroup: Group;
}

export interface State {
  schedulerPlayerType: string;
  schedulerType: string;
  nbrOfPlayers: number;
  nbrOfByePlayers: number;
  nbrOfCourts: number;
  nbrOfPlayersPerCourt: number;
  randomizeOrder: boolean;
  useNamesForMatches: boolean;
  loadFromGroup: boolean;
  selectedGroup: Group;
}

const initialState: State = {
  schedulerPlayerType: 'Individuals for Doubles',
  schedulerType: 'King of the Court',
  nbrOfPlayers: 0,
  nbrOfByePlayers: 0,
  nbrOfCourts: 0,
  nbrOfPlayersPerCourt: 0,
  randomizeOrder: false,
  useNamesForMatches: false,
  loadFromGroup: false,
  selectedGroup: undefined,
};

export function reducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.UPDATE_SCHEDULER_PLAYER_TYPE:
      return tassign(state, { schedulerPlayerType: action.payload.schedulerPlayerType });
    case actions.UPDATE_SCHEDULER_TYPE:
      return tassign(state, { schedulerType: action.payload.schedulerType });
    case actions.UPDATE_NBR_OF_PLAYERS:
      return tassign(state, { nbrOfPlayers: action.payload.nbrOfPlayers });
    case actions.UPDATE_NBR_OF_BYE_PLAYERS:
      return tassign(state, { nbrOfByePlayers: action.payload.nbrOfByePlayers });
    case actions.UPDATE_NBR_OF_COURTS:
      return tassign(state, { nbrOfCourts: action.payload.nbrOfCourts });
    case actions.UPDATE_NBR_OF_PLAYERS_PER_COURT:
      return tassign(state, { nbrOfPlayersPerCourt: action.payload.nbrOfPlayersPerCourt });
    case actions.UPDATE_RANDOMIZE_ORDER:
      return tassign(state, { randomizeOrder: action.payload.randomizeOrder });
    case actions.UPDATE_USE_NAMES_FOR_MATCHES:
      return tassign(state, { useNamesForMatches: action.payload.useNamesForMatches });
    case actions.UPDATE_LOAD_FROM_GROUP:
      return tassign(state, { loadFromGroup: action.payload.loadFromGroup });
    case actions.UPDATE_SELECTED_GROUP:
      return tassign(state, { selectedGroup: action.payload.selectedGroup });
    case actions.LOAD_SCHEDULER_SETTINGS_SUCCESS:
      return tassign(state, {
        schedulerPlayerType: action.payload.schedulerPlayerType,
        schedulerType: action.payload.schedulerType,
        nbrOfPlayers: action.payload.nbrOfPlayers,
        nbrOfByePlayers: action.payload.nbrOfByePlayers,
        nbrOfCourts: action.payload.nbrOfCourts,
        nbrOfPlayersPerCourt: action.payload.nbrOfPlayersPerCourt,
        randomizeOrder: action.payload.randomizeOrder,
        useNamesForMatches: action.payload.useNamesForMatches,
        loadFromGroup: action.payload.loadFromGroup,
        selectedGroup: action.payload.selectedGroup,
      });
    default: {
      return state;
    }
  }
}

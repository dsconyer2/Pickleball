import * as actions from '../actions/scheduler.actions';
import { tassign } from 'tassign';
import { Group } from '../../player-contact/models';

export interface SchedulerSettings {
  schedulerType: string;
  nbrOfPlayers: number;
  nbrOfCourts: number;
  nbrOfPlayersPerCourt: number;
  randomizeOrder: boolean;
  useNamesForMatches: boolean;
  loadFromGroup: boolean;
  selectedGroup: Group;
}

export interface State {
  schedulerType: string;
  nbrOfPlayers: number;
  nbrOfCourts: number;
  nbrOfPlayersPerCourt: number;
  randomizeOrder: boolean;
  useNamesForMatches: boolean;
  loadFromGroup: boolean;
  selectedGroup: Group;
}

const initialState: State = {
  schedulerType: 'King',
  nbrOfPlayers: 0,
  nbrOfCourts: 0,
  nbrOfPlayersPerCourt: 0,
  randomizeOrder: false,
  useNamesForMatches: false,
  loadFromGroup: false,
  selectedGroup: undefined
};

export function reducer(state: State = initialState, action: actions.All): State {
  switch (action.type) {
    case actions.UPDATE_SCHEDULER_TYPE:
        return tassign(state, {schedulerType: action.payload.schedulerType});
      case actions.UPDATE_NBR_OF_PLAYERS:
          return tassign(state, {nbrOfPlayers: action.payload.nbrOfPlayers});
      case actions.UPDATE_NBR_OF_COURTS:
          return tassign(state, {nbrOfCourts: action.payload.nbrOfCourts});
      case actions.UPDATE_NBR_OF_PLAYERS_PER_COURT:
          return tassign(state, {nbrOfPlayersPerCourt: action.payload.nbrOfPlayersPerCourt});
      case actions.UPDATE_RANDOMIZE_ORDER:
          return tassign(state, {randomizeOrder: action.payload.randomizeOrder});
      case actions.UPDATE_USE_NAMES_FOR_MATCHES:
          return tassign(state, {useNamesForMatches: action.payload.useNamesForMatches});
      case actions.UPDATE_LOAD_FROM_GROUP:
          return tassign(state, {loadFromGroup: action.payload.loadFromGroup});
      case actions.UPDATE_SELECTED_GROUP:
          return tassign(state, {selectedGroup: action.payload.selectedGroup});
      case actions.LOAD_SCHEDULER_SETTINGS_SUCCESS:
          return tassign(state, {
            schedulerType: action.payload.schedulerType,
            nbrOfPlayers: action.payload.nbrOfPlayers,
            nbrOfCourts: action.payload.nbrOfCourts,
            nbrOfPlayersPerCourt: action.payload.nbrOfPlayersPerCourt,
            randomizeOrder: action.payload.randomizeOrder,
            useNamesForMatches: action.payload.useNamesForMatches,
            loadFromGroup: action.payload.loadFromGroup,
            selectedGroup: action.payload.selectedGroup
          });
    default: {
      return state;
    }
  }
}

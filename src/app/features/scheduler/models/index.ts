import { Group } from '../../player-contact/models';

export interface Player {
    playerId: number;
    playerName: string;
    isPlayerAvailable: boolean;
    isByeAvailable: boolean;
    byeRound: number;
    playedAgainst: {};
    courtsPlayed: {};
}

export interface ScheduleBye {
  byeId: number;
  byePlayers?: Player[];
}

export interface ScheduleMatch {
  matchId: number;
  match: Match;
}

export interface ScheduleRound {
  roundId: number;
  matchIds: number[];
  byeId: number;
}

export interface SchedulerSettings {
  schedulerPlayerType: string;
  schedulerType: string;
  nbrOfPlayers: number;
  nbrOfCourts: number;
  nbrOfPlayersPerCourt: number;
  randomizeOrder: boolean;
  useNamesForMatches: boolean;
  loadFromGroup: boolean;
  selectedGroup: Group;
}

export interface MatchPriorityEntry {
  matchId: number;
  matchCount: number;
}

export interface Match {
  matchId: number;
  team1: Player[];
  team2: Player[];
  matchPriority: {};
  courtPriority: {};
  courtAssigned: number;
  opponentsAssigned: boolean;
  isPrimary: boolean;
  team1Score: number;
  team2Score: number;
}

export interface RoundData {
  roundId: number;
  matches: Match[];
  byeId: number;
}

export interface RowObject {
  id: number;
  isAvailable: boolean;
  columns: ColumnObject[];
}

export interface ColumnObject {
  id: number;
  isAvailable: boolean;
  isPicked: boolean;
  round: number;
  playerIds: number[];
}

export interface Level1RoundDataObject {
  round: number;
  id: number;
  playerIds: number[];
}

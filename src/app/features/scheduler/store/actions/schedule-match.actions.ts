import { Action } from '@ngrx/store';
import { ScheduleMatchEntity } from '../reducers/schedule-match.reducer';
import { Match } from '../../models';


export const CREATE_SCHEDULE_MATCH = '[schedulerFeature] create scheduleMatch';
export class ScheduleMatchCreated implements Action {
  readonly type = CREATE_SCHEDULE_MATCH;
  payload: ScheduleMatchEntity;
  constructor(matchId: number, aMatch: Match) {
    this.payload = {
      id: matchId,
      matchId: matchId,
      match: aMatch
    };
   }
}

export const DELETE_ALL_MATCHES = '[schedulerFeature] delete all scheduleMatch';
export class ScheduleMatchesDeleted implements Action {
  readonly type = DELETE_ALL_MATCHES;
  constructor() {}
}

export type All =
ScheduleMatchCreated
| ScheduleMatchesDeleted;

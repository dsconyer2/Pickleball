import { Action } from '@ngrx/store';
import { ScheduleRoundEntity } from '../reducers/schedule-round.reducer';
import { ScheduleRound } from '../../models';


export const CREATE_SCHEDULE_ROUND = '[schedulerFeature] create scheduleRound';
export class ScheduleRoundCreated implements Action {
  readonly type = CREATE_SCHEDULE_ROUND;
  payload: ScheduleRoundEntity;
  constructor(roundId: number, matchIds: number[], byeId: number) {
    this.payload = {
      id: roundId,
      roundId: roundId,
      matchIds: matchIds,
      byeId: byeId
    };
   }
}

export const DELETE_ALL_ROUNDS = '[schedulerFeature] delete all scheduleRound';
export class ScheduleRoundsDeleted implements Action {
  readonly type = DELETE_ALL_ROUNDS;
  constructor() {}
}

export type All =
ScheduleRoundCreated
| ScheduleRoundsDeleted;

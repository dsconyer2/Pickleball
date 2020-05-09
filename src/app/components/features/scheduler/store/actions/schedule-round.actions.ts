import { Action } from '@ngrx/store';

import { ScheduleRound } from '../../models';
import { ScheduleRoundEntity } from '../reducers/schedule-round.reducer';

export const CREATE_SCHEDULE_ROUND = '[schedulerFeature] create scheduleRound';
export class ScheduleRoundCreated implements Action {
  readonly type = CREATE_SCHEDULE_ROUND;
  payload: ScheduleRoundEntity;
  constructor(roundId: number, matchIds: number[], byeId: number) {
    this.payload = {
      roundId,
      matchIds,
      byeId,
      id: roundId,
    };
  }
}

export const DELETE_ALL_ROUNDS = '[schedulerFeature] delete all scheduleRound';
export class ScheduleRoundsDeleted implements Action {
  readonly type = DELETE_ALL_ROUNDS;
  constructor() { }
}

export type All =
  ScheduleRoundCreated
  | ScheduleRoundsDeleted;

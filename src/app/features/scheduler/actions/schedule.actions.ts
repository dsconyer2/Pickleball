import { Action } from '@ngrx/store';
import { Schedule } from '../reducers/schedule.reducer';
import { RoundData } from '../models';

const emptySchedule = {
  scheduleHeaders: undefined,
  scheduleRounds: undefined
};

export const UPDATE_SCHEDULE = '[schedulerFeature] update  schedule';
export class ScheduleUpdated implements Action {
  readonly type = UPDATE_SCHEDULE;
  payload: Schedule;
  constructor(headers: string[], rounds: RoundData[]) {
    this.payload = emptySchedule;
    this.payload.scheduleHeaders = headers;
    this.payload.scheduleRounds = rounds;
  }
}

// Discriminated Union Type  http://www.typescriptlang.org/docs/handbook/advanced-types.html
export type All =
ScheduleUpdated;

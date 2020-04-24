import { Action } from '@ngrx/store';
import { Schedule } from '../reducers/schedule-header.reducer';

const emptySchedule = {
  scheduleHeaders: undefined,
};


export const UPDATE_SCHEDULE_HEADERS = '[schedulerFeature] update  scheduleHeaders';
export class ScheduleHeadersUpdated implements Action {
  readonly type = UPDATE_SCHEDULE_HEADERS;
  payload: Schedule;
  constructor(headers: string[]) {
    this.payload = emptySchedule;
    this.payload.scheduleHeaders = headers;
  }
}

// Discriminated Union Type  http://www.typescriptlang.org/docs/handbook/advanced-types.html
export type All =
ScheduleHeadersUpdated;

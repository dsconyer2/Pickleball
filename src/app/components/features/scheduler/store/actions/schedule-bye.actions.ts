import { Action } from '@ngrx/store';

import { Player } from '../../models';
import { ScheduleByeEntity } from '../reducers/schedule-bye.reducer';

export const CREATE_SCHEDULE_BYE = '[schedulerFeature] create scheduleBye';
export class ScheduleByeCreated implements Action {
  readonly type = CREATE_SCHEDULE_BYE;
  payload: ScheduleByeEntity;
  constructor(byeId: number, byePlayers: Player[]) {
    this.payload = {
      byeId,
      byePlayers,
      id: byeId,
    };
  }
}

export const DELETE_ALL_BYES = '[schedulerFeature] delete all scheduleBye';
export class ScheduleByesDeleted implements Action {
  readonly type = DELETE_ALL_BYES;
  constructor() { }
}

export type All =
  ScheduleByeCreated
  | ScheduleByesDeleted;

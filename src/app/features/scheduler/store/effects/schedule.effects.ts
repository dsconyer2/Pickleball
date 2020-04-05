// import { Injectable } from '@angular/core';
// import { Effect, Actions, ofType } from '@ngrx/effects';
// import { map, tap } from 'rxjs/operators';
// import * as actions from '../actions/schedule.actions';
// import { SchedulerDataService } from '../SchedulerDataService';

// @Injectable()
// export class ScheduleEffects {

//       @Effect({ dispatch: false }) updateSchedule$ = this.actions$
//       .pipe(
//           ofType(actions.UPDATE_SCHEDULE),
//           map(a => a as actions.ScheduleUpdated),
//           tap(a => this.service.updateSchedulerSetting('pickleballSchedulerPlayerType', a.payload.schedulerPlayerType))
//       );

//       @Effect() schedulerSettingsLoad$ = this.actions$
//       .pipe(
//           ofType(actions.LOAD_SCHEDULER_SETTINGS),
//           map(() => new actions.SchedulerSettingsLoadedSuccessfully(this.service.loadSchedulerSettings()))
//       );

//       constructor(private actions$: Actions, private service: SchedulerDataService) {}
// }

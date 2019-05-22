import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';
import * as appActions from '../../../actions/app.actions';
import * as schedulerActions from '../actions/scheduler.actions';

@Injectable()
export class AppStartUpEffects {

  // @Effect() addingADeveloperDoneBlewedUp$ = this.actions$
  //   .pipe(
  //     ofType(developerActions.ADDED_DEVELOPER_FAILURE),
  //     map(a => a as developerActions.FailedAddingDeveloper),
  //     map(a => new appActions.ApplicationError(a.errorMessage, 'issues'))
  //   );

    @Effect() startup$ = this.actions$
    .pipe(
      ofType(appActions.APP_START),
      concatMap(() => [
        new schedulerActions.SchedulerSettingsLoad()
      ])
    );

  constructor(private actions$: Actions) { }
}

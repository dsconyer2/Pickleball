import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';

import * as appActions from '../../../../actions/app.actions';
import * as groupManagerActions from '../actions/group-manager.actions';
import * as groupPlayerSettingActions from '../actions/group-player-settings.actions';
import * as groupPlayerActions from '../actions/group-player.actions';
import * as playerContactActions from '../actions/player-contact.actions';

@Injectable()
export class AppStartUpEffects {

  @Effect() startup$ = this.actions$
    .pipe(
      ofType(appActions.APP_START),
      concatMap(() => [
        new playerContactActions.PlayerContactsLoad(),
        new groupManagerActions.GroupsLoad(),
        new groupPlayerActions.GroupPlayersLoad(),
        new groupPlayerSettingActions.GroupPlayerSettingsLoad(),
      ]),
    );

  constructor(private actions$: Actions) { }
}

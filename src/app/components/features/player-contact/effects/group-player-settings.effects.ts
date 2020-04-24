import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as actions from '../actions/group-player-settings.actions';
import { GroupPlayerSettingsDataService } from '../dataServices/groupPlayerSettingsDataService';

@Injectable()
export class GroupPlayerSettingsEffects {

    @Effect({ dispatch: false }) updateGroupPlayerSelectedGroup$ = this.actions$
        .pipe(
            ofType(actions.UPDATE_GROUP_PLAYER_SELECTED_GROUP),
            map(a => a as actions.GroupPlayerSelectedGroupUpdated),
            tap(a => this.service.updateGroupPlayerSetting('pickleballGroupPlayerSelectedGroup', a.payload.selectedGroup))
        );

    @Effect() groupPlayerSettingsLoad$ = this.actions$
        .pipe(
            ofType(actions.LOAD_GROUP_PLAYER_SETTINGS),
            map(() => new actions.GroupPlayerSettingsLoadedSuccessfully(this.service.loadGroupPlayerSettings()))
        );

    constructor(private actions$: Actions, private service: GroupPlayerSettingsDataService) { }
}

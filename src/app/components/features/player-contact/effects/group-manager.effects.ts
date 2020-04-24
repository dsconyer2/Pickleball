import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as actions from '../actions/group-manager.actions';
import { GroupManagerDataService } from '../dataServices/groupManagerDataService';

@Injectable()
export class GroupManagerEffects {

       @Effect({ dispatch: false }) groupAdded$ = this.actions$
      .pipe(
          ofType(actions.ADD_GROUP),
          map(a => a as actions.GroupAdded),
          tap(a => this.service.addGroup(a.payload))
      );

      @Effect({ dispatch: false }) groupRemoved$ = this.actions$
      .pipe(
          ofType(actions.REMOVE_GROUP),
          map(a => a as actions.GroupRemoved),
          tap(a => this.service.removeGroup(a.payload))
      );

      @Effect() groupsLoad$ = this.actions$
      .pipe(
          ofType(actions.LOAD_GROUPS),
          map(() => new actions.GroupsLoadedSuccessfully(this.service.loadGroups()))
      );

      constructor(private actions$: Actions, private service: GroupManagerDataService) {}
}

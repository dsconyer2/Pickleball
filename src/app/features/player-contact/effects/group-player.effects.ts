import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as actions from '../actions/group-player.actions';
import { GroupPlayerDataService } from '../dataServices/groupPlayerDataService';

@Injectable()
export class GroupPlayerEffects {

  @Effect({ dispatch: false }) groupPlayerCreated$ = this.actions$
      .pipe(
          ofType(actions.CREATE_GROUP_PLAYER),
          map(a => a as actions.GroupPlayerCreated),
          tap(a => this.service.createGroupPlayer(a.payload))
      );

      @Effect({ dispatch: false }) groupPlayerDeleted$ = this.actions$
      .pipe(
          ofType(actions.DELETE_GROUP_PLAYER),
          map(a => a as actions.GroupPlayerDeleted),
          tap(a => this.service.deleteGroupPlayer(a.payload))
      );

      @Effect({ dispatch: false }) groupPlayerAdded$ = this.actions$
      .pipe(
          ofType(actions.ADD_GROUP_PLAYER),
          map(a => a as actions.GroupPlayerAdded),
          tap(a => this.service.updateGroupPlayer(a.payload))
      );

      @Effect({ dispatch: false }) groupPlayerRemoved$ = this.actions$
      .pipe(
          ofType(actions.REMOVE_GROUP_PLAYER),
          map(a => a as actions.GroupPlayerRemoved),
          tap(a => this.service.updateGroupPlayer(a.payload))
      );

      @Effect() groupPlayersLoad$ = this.actions$
      .pipe(
          ofType(actions.LOAD_GROUP_PLAYERS),
          map(() => new actions.GroupPlayersLoadedSuccessfully(this.service.loadGroupPlayers()))
      );


      constructor(private actions$: Actions, private service: GroupPlayerDataService) {}
}

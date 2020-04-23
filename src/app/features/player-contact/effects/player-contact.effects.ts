import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap, switchMap } from 'rxjs/operators';
import * as actions from '../actions/player-contact.actions';
import * as groupPlayerActions from '../actions/group-player.actions';
import { PlayerContactDataService } from '../dataServices/playerContactDataService';

@Injectable()
export class PlayerContactEffects {

  @Effect({ dispatch: false }) playerContactAdded$ = this.actions$
    .pipe(
      ofType(actions.ADD_PLAYER_CONTACT),
      map(a => a as actions.PlayerContactAdded),
      tap(a => this.service.addPlayerContact(a.payload))
    );

  @Effect() removePlayerContact$ = this.actions$
    .pipe(
      ofType(actions.REMOVE_PLAYER_CONTACT),
      map((a: actions.PlayerContactRemoved) => {
        this.service.removePlayerContact(a.payload);
        return new groupPlayerActions.PlayerContactRemovedFromGroupPlayers(a.payload.playerContactId);
      }
      )
    );

  @Effect() playerContactsLoad$ = this.actions$
    .pipe(
      ofType(actions.LOAD_PLAYER_CONTACTS),
      map(() => new actions.LoadedPlayerContactsSuccessfully(this.service.loadPlayerContacts()))
    );

  constructor(private actions$: Actions, private service: PlayerContactDataService) { }
}

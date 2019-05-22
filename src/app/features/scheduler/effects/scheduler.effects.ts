import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as actions from '../actions/scheduler.actions';
import { SchedulerDataService } from '../SchedulerDataService';

@Injectable()
export class SchedulerEffects {

  @Effect({ dispatch: false }) playerAdded$ = this.actions$
      .pipe(
          ofType(actions.ADD_PLAYER),
          map(a => a as actions.PlayerAdded),
          tap(a => this.service.addPlayer(a.payload))
      );

      @Effect({ dispatch: false }) removeAllPlayers$ = this.actions$
      .pipe(
          ofType(actions.REMOVE_ALL_PLAYER),
          map(a => a as actions.PlayerRemoveAll),
          tap(a => this.service.removeAllPlayers())
      );

      @Effect({ dispatch: false }) updateSchedulerType$ = this.actions$
      .pipe(
          ofType(actions.UPDATE_SCHEDULER_TYPE),
          map(a => a as actions.SchedulerTypeUpdated),
          tap(a => this.service.updateSchedulerSetting('pickleballSchedulerType', a.payload.schedulerType))
      );

      @Effect({ dispatch: false }) updateNbrOfPlayers$ = this.actions$
      .pipe(
          ofType(actions.UPDATE_NBR_OF_PLAYERS),
          map(a => a as actions.NbrOfPlayersUpdated),
          tap(a => this.service.updateSchedulerSetting('pickleballNbrOfPlayers', a.payload.nbrOfPlayers))
      );

      @Effect({ dispatch: false }) updateNbrOfCourts$ = this.actions$
      .pipe(
          ofType(actions.UPDATE_NBR_OF_COURTS),
          map(a => a as actions.NbrOfCourtsUpdated),
          tap(a => this.service.updateSchedulerSetting('pickleballNbrOfCourts', a.payload.nbrOfCourts))
      );

      @Effect({ dispatch: false }) updateNbrOfPlayersPerCourt$ = this.actions$
      .pipe(
          ofType(actions.UPDATE_NBR_OF_PLAYERS_PER_COURT),
          map(a => a as actions.NbrOfPlayersPerCourtUpdated),
          tap(a => this.service.updateSchedulerSetting('pickleballNbrOfPlayersPerCourt', a.payload.nbrOfPlayersPerCourt))
      );

      @Effect({ dispatch: false }) updateRandomizeOrder$ = this.actions$
      .pipe(
          ofType(actions.UPDATE_RANDOMIZE_ORDER),
          map(a => a as actions.RandomizeOrderUpdated),
          tap(a => this.service.updateSchedulerSetting('pickleballRandomizeOrder', a.payload.randomizeOrder))
      );

      @Effect({ dispatch: false }) updateUseNamesForMatches$ = this.actions$
      .pipe(
          ofType(actions.UPDATE_USE_NAMES_FOR_MATCHES),
          map(a => a as actions.UseNamesForMatchesUpdated),
          tap(a => this.service.updateSchedulerSetting('pickleballUseNamesForMatches', a.payload.useNamesForMatches))
      );

      @Effect({ dispatch: false }) updateLoadFromGroup$ = this.actions$
      .pipe(
          ofType(actions.UPDATE_LOAD_FROM_GROUP),
          map(a => a as actions.LoadFromGroupUpdated),
          tap(a => this.service.updateSchedulerSetting('pickleballLoadFromGroup', a.payload.loadFromGroup))
      );

      @Effect({ dispatch: false }) updateSelectedGroup$ = this.actions$
      .pipe(
          ofType(actions.UPDATE_SELECTED_GROUP),
          map(a => a as actions.SelectedGroupUpdated),
          tap(a => this.service.updateSchedulerSetting('pickleballSelectedGroup', a.payload.selectedGroup))
      );

      @Effect() schedulerSettingsLoad$ = this.actions$
      .pipe(
          ofType(actions.LOAD_SCHEDULER_SETTINGS),
          map(() => new actions.SchedulerSettingsLoadedSuccessfully(this.service.loadSchedulerSettings()))
      );

      constructor(private actions$: Actions, private service: SchedulerDataService) {}
}

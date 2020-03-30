import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Player } from '../models';
import * as fromPlayerManager from './player.reducer';
import * as fromSchedulerManager from './scheduler.reducer';
import * as fromScheduleManager from './schedule.reducer';

export interface SchedulerState {
  players: fromPlayerManager.State;
  schedulerSettings: fromSchedulerManager.State;
  schedule: fromScheduleManager.State;
}

export const reducers = {
  players: fromPlayerManager.reducer,
  schedulerSettings: fromSchedulerManager.reducer,
  schedule: fromScheduleManager.reducer
};

// 1. Create a Feature Selector
const selectSchedulerFeature = createFeatureSelector<SchedulerState>('schedulerFeature');
// 2. Create a Selector for Each Branch of the Feature
const selectPlayers = createSelector(selectSchedulerFeature, f => f.players);
export const selectSchedulerSettings = createSelector(selectSchedulerFeature, f => f.schedulerSettings);
export const selectSchedule = createSelector(selectSchedulerFeature, f => f.schedule);

// 3. Create any "helpers" you might need (optional)
const { selectAll: selectPlayerEntityArray } = fromPlayerManager.adapter.getSelectors(selectPlayers);


// 4. Create a selector for what the component needs.

// TodoEntity[] => TodoListItem[]
export const selectPlayerEntities = createSelector(selectPlayerEntityArray, t => t.map(x => x as Player));
export const selectSchedulerPlayerType = createSelector(selectSchedulerSettings, s => s.schedulerPlayerType);
export const selectSchedulerType = createSelector(selectSchedulerSettings, s => s.schedulerType);
export const selectSchedulerNbrOfPlayers = createSelector(selectSchedulerSettings, s => s.nbrOfPlayers);
export const selectSchedulerNbrOfByePlayers = createSelector(selectSchedulerSettings, s => s.nbrOfByePlayers);
export const selectSchedulerNbrOfCourts = createSelector(selectSchedulerSettings, s => s.nbrOfCourts);
export const selectSchedulerNbrOfPlayersPerCourt = createSelector(selectSchedulerSettings, s => s.nbrOfPlayersPerCourt);
export const selectSchedulerRandomizeOrder = createSelector(selectSchedulerSettings, s => s.randomizeOrder);
export const selectSchedulerUseNamesForMatches = createSelector(selectSchedulerSettings, s => s.useNamesForMatches);
export const selectSchedulerLoadFromGroup = createSelector(selectSchedulerSettings, s => s.loadFromGroup);
export const selectSchedulerSelectedGroup = createSelector(selectSchedulerSettings, s => s.selectedGroup);
export const selectScheduleHeaders = createSelector(selectSchedule, s => s.scheduleHeaders);
export const selectScheduleRounds = createSelector(selectSchedule, s => s.scheduleRounds);


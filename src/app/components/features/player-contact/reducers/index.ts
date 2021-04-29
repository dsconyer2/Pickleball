import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Group, GroupPlayer, PlayerContact } from '../models';

import * as fromGroupManager from './group-manager.reducer';
import * as fromGroupPlayerSettings from './group-player-settings.reducer';
import * as fromGroupPlayer from './group-player.reducer';
import * as fromPlayerContactManager from './player-contact.reducer';

export interface PlayerContactState {
  playerContacts: fromPlayerContactManager.State;
  groups: fromGroupManager.State;
  groupPlayers: fromGroupPlayer.State;
  groupPlayerSettings: fromGroupPlayerSettings.State;
}

export const reducers = {
  playerContacts: fromPlayerContactManager.reducer,
  groups: fromGroupManager.reducer,
  groupPlayers: fromGroupPlayer.reducer,
  groupPlayerSettings: fromGroupPlayerSettings.reducer,
};

// 1. Create a Feature Selector
const selectPlayerContactFeature = createFeatureSelector<PlayerContactState>('playerContactFeature');
// 2. Create a Selector for Each Branch of the Feature
const selectPlayerContacts = createSelector(selectPlayerContactFeature, f => f.playerContacts);
const selectGroups = createSelector(selectPlayerContactFeature, f => f.groups);
const selectGroupPlayers = createSelector(selectPlayerContactFeature, f => f.groupPlayers);
const selectGroupPlayerSettings = createSelector(selectPlayerContactFeature, f => f.groupPlayerSettings);

// 3. Create any "helpers" you might need (optional)
const { selectAll: selectPlayerContactEntityArray } = fromPlayerContactManager.adapter.getSelectors(selectPlayerContacts);
const { selectAll: selectGroupEntityArray } = fromGroupManager.adapter.getSelectors(selectGroups);
const { selectAll: selectGroupPlayerEntityArray } = fromGroupPlayer.adapter.getSelectors(selectGroupPlayers);

// 4. Create a selector for what the component needs.

// TodoEntity[] => TodoListItem[]
export const selectPlayerContactEntities =
  createSelector(selectPlayerContactEntityArray, t => t.map(x => x as PlayerContact).sort((a, b) => (a.name > b.name) ? 0 : -1));
const initPlayer: PlayerContact = { playerContactId: 0 };
export const selectHighestPlayerId =
  createSelector(selectPlayerContactEntityArray,
                 t => t.map(x => x as PlayerContact)
      .reduce((a, c) => {
        const n = Math.max(a.playerContactId, c.playerContactId);
        if (n === a.playerContactId) { return a; } return c;
      },      initPlayer));

export const selectGroupEntities =
  createSelector(selectGroupEntityArray, t => t.map(x => x as Group).sort((a, b) => (a.name > b.name) ? 0 : -1));
const initGroup: Group = { groupId: 0 };
export const selectHighestGroupId =
  createSelector(selectGroupEntityArray,
                 t => t.map(x => x as Group)
      .reduce((a, c) => {
        const n = Math.max(a.groupId, c.groupId);
        if (n === a.groupId) { return a; } return c;
      },      initGroup));

export const selectGroupPlayerEntities = createSelector(selectGroupPlayerEntityArray, t => t.map(x => x as GroupPlayer));
export const selectEnabledGroupPlayer = (id: number) =>
  createSelector(selectGroupPlayerEntityArray,
                 t => t.map(x => x as GroupPlayer).find(gp => gp.groupPlayerId === id));
const initGroupPlayer: GroupPlayer = { groupPlayerId: 0 };
export const selectHighestGroupPlayerId =
  createSelector(selectGroupPlayerEntityArray,
                 t => t.map(x => x as GroupPlayer)
      .reduce((a, c) => {
        const n = Math.max(a.groupPlayerId, c.groupPlayerId);
        if (n === a.groupPlayerId) { return a; } return c;
      },      initGroupPlayer));

export const selectGroupPlayerSelectedGroup = createSelector(selectGroupPlayerSettings, s => s.selectedGroup);
export const selectGroupPlayerSelectedGroupPlayerId = createSelector(selectGroupPlayerSettings, s => s.selectedGroup?.groupPlayerId);
export const selectGroupPlayerEnabledGroupPlayerId = createSelector(selectGroupPlayerSettings, s => s.selectedGroup?.enabledPlayerId);

export const selectGroupPlayerSelectedGroupPlayer =
  createSelector(selectGroupPlayerEntities, selectGroupPlayerSelectedGroupPlayerId,
                 (gpe, gpId) => gpe.find(gp => gp.groupPlayerId === gpId),
  );
export const selectGroupPlayerEnabledGroupPlayer =
  createSelector(selectGroupPlayerEntities, selectGroupPlayerEnabledGroupPlayerId,
                 (gpe, gpId) => gpe.find(gp => gp.groupPlayerId === gpId),
  );

export const selectAvailablePlayerContactEntities =
  createSelector(selectPlayerContactEntities, selectGroupPlayerSelectedGroupPlayer,
                 (p, gp) => {
                   if (!!gp && !!gp.playerContacts) {
                     return p.filter(ap => !gp?.playerContacts.find(agp => agp.playerContactId === ap.playerContactId));
                   }
                   return p;

                 });
  // t => t.map(x => x as PlayerContact).sort((a, b) => (a.name > b.name) ? 0 : -1));

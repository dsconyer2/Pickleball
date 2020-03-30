import { Injectable } from '@angular/core';
import { PlayerEntity } from './reducers/player.reducer';
import { SchedulerSettings } from './reducers/scheduler.reducer';
import { Group } from '../player-contact/models';

@Injectable()
export class SchedulerDataService {

  playerKey = 'pickleballPlayers';
  schedulerPlayerTypeKey = 'pickleballSchedulerPlayerType';
  schedulerTypeKey = 'pickleballSchedulerType';
  schedulerNbrOfPlayersKey = 'pickleballNbrOfPlayers';
  schedulerNbrOfByePlayersKey = 'pickleballNbrOfByePlayers';
  schedulerNbrOfCourtsKey = 'pickleballNbrOfCourts';
  schedulerNbrOfPlayersPerCourtKey = 'pickleballNbrOfPlayersPerCourt';
  schedulerRandomizeOrderKey = 'pickleballRandomizeOrder';
  schedulerUseNamesForMatchesKey = 'pickleballUseNamesForMatches';
  schedulerLoadFromGroupKey = 'pickleballLoadFromGroup';
  schedulerSelectedGroupKey = 'pickleballSelectedGroup';

  constructor() { }

  addPlayer(player: PlayerEntity) {
    const localPlayers: PlayerEntity[] = localStorage.getItem(this.playerKey) ? JSON.parse(localStorage.getItem(this.playerKey)) : [];
    localPlayers.push(player);
    localStorage.setItem(this.playerKey, JSON.stringify(localPlayers));
  }

  removeAllPlayers() {
    localStorage.removeItem(this.playerKey);
  }

  updateSchedulerSetting(settingKey: string, settingValue: string | number | boolean | Group) {
    localStorage.setItem(settingKey, JSON.stringify(settingValue));
  }

  loadSchedulerSettings(): SchedulerSettings {
    const localSchedulerPlayerType: string =
      localStorage.getItem(this.schedulerPlayerTypeKey) ? JSON.parse(localStorage.getItem(this.schedulerPlayerTypeKey)) : undefined;
    const localSchedulerType: string =
      localStorage.getItem(this.schedulerTypeKey) ? JSON.parse(localStorage.getItem(this.schedulerTypeKey)) : undefined;
    const localSchedulerNbrOfPlayers: number =
      localStorage.getItem(this.schedulerNbrOfPlayersKey) ? JSON.parse(localStorage.getItem(this.schedulerNbrOfPlayersKey)) : undefined;
    const localSchedulerNbrOfByePlayers: number =
      localStorage.getItem(this.schedulerNbrOfByePlayersKey) ?
      JSON.parse(localStorage.getItem(this.schedulerNbrOfByePlayersKey)) : undefined;
    const localSchedulerNbrOfCourts: number =
      localStorage.getItem(this.schedulerNbrOfCourtsKey) ? JSON.parse(localStorage.getItem(this.schedulerNbrOfCourtsKey)) : undefined;
    const localSchedulerNbrOfPlayersPerCourt: number =
      localStorage.getItem(this.schedulerNbrOfPlayersPerCourtKey)
        ? JSON.parse(localStorage.getItem(this.schedulerNbrOfPlayersPerCourtKey)) : undefined;
    const localSchedulerRandomizeOrder: boolean =
      localStorage.getItem(this.schedulerRandomizeOrderKey)
        ? JSON.parse(localStorage.getItem(this.schedulerRandomizeOrderKey)) : undefined;
    const localSchedulerUseNamesForMatches: boolean =
      localStorage.getItem(this.schedulerUseNamesForMatchesKey)
        ? JSON.parse(localStorage.getItem(this.schedulerUseNamesForMatchesKey)) : undefined;
    const localSchedulerLoadFromGroup: boolean =
      localStorage.getItem(this.schedulerLoadFromGroupKey)
        ? JSON.parse(localStorage.getItem(this.schedulerLoadFromGroupKey)) : undefined;
    const localSchedulerSelectedGroup: Group =
      localStorage.getItem(this.schedulerSelectedGroupKey)
        ? JSON.parse(localStorage.getItem(this.schedulerSelectedGroupKey)) : undefined;
    return {
      schedulerPlayerType: localSchedulerPlayerType,
      schedulerType: localSchedulerType,
      nbrOfPlayers: localSchedulerNbrOfPlayers,
      nbrOfByePlayers: localSchedulerNbrOfByePlayers,
      nbrOfCourts: localSchedulerNbrOfCourts,
      nbrOfPlayersPerCourt: localSchedulerNbrOfPlayersPerCourt,
      randomizeOrder: localSchedulerRandomizeOrder,
      useNamesForMatches: localSchedulerUseNamesForMatches,
      loadFromGroup: localSchedulerLoadFromGroup,
      selectedGroup: localSchedulerSelectedGroup
    };
  }

}

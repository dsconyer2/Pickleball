import { Injectable } from '@angular/core';
import { PlayerEntity } from './reducers/player.reducer';
import { SchedulerSettings } from './reducers/scheduler.reducer';

@Injectable()
export class SchedulerDataService {

  playerKey = 'pickleballPlayers';
  schedulerTypeKey = 'pickleballSchedulerType';
  schedulerNbrOfPlayersKey = 'pickleballNbrOfPlayers';
  schedulerNbrOfPlayersPerCourtKey = 'pickleballNbrOfPlayersPerCourt';
  schedulerRandomizeOrderKey = 'pickleballRandomizeOrder';
  schedulerUseNamesForMatchesKey = 'pickleballUseNamesForMatches';

  constructor() { }

  addPlayer(player: PlayerEntity) {
    const localPlayers: PlayerEntity[] = localStorage.getItem(this.playerKey) ? JSON.parse(localStorage.getItem(this.playerKey)) : [];
    localPlayers.push(player);
    localStorage.setItem(this.playerKey, JSON.stringify(localPlayers));
  }

  removeAllPlayers() {
    localStorage.removeItem(this.playerKey);
  }

  updateSchedulerSetting(settingKey: string, settingValue: string | number | boolean) {
    localStorage.setItem(settingKey, JSON.stringify(settingValue));
  }

  loadSchedulerSettings(): SchedulerSettings {
    const localSchedulerType: string =
        localStorage.getItem(this.schedulerTypeKey) ? JSON.parse(localStorage.getItem(this.schedulerTypeKey)) : undefined;
    const localSchedulerNbrOfPlayers: number =
        localStorage.getItem(this.schedulerNbrOfPlayersKey) ? JSON.parse(localStorage.getItem(this.schedulerNbrOfPlayersKey)) : undefined;
    const localSchedulerNbrOfPlayersPerCourt: number =
        localStorage.getItem(this.schedulerNbrOfPlayersPerCourtKey)
        ? JSON.parse(localStorage.getItem(this.schedulerNbrOfPlayersPerCourtKey)) : undefined;
    const localSchedulerRandomizeOrder: boolean =
        localStorage.getItem(this.schedulerRandomizeOrderKey)
        ? JSON.parse(localStorage.getItem(this.schedulerRandomizeOrderKey)) : undefined;
    const localSchedulerUseNamesForMatches: boolean =
        localStorage.getItem(this.schedulerUseNamesForMatchesKey)
        ? JSON.parse(localStorage.getItem(this.schedulerUseNamesForMatchesKey)) : undefined;
    return {
      schedulerType: localSchedulerType,
      nbrOfPlayers: localSchedulerNbrOfPlayers,
      nbrOfCourts: undefined,
      nbrOfPlayersPerCourt: localSchedulerNbrOfPlayersPerCourt,
      randomizeOrder: localSchedulerRandomizeOrder,
      useNamesForMatches: localSchedulerUseNamesForMatches
    };
  }

}

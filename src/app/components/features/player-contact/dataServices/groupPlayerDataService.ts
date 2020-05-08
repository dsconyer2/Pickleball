import { Injectable } from '@angular/core';

import { GroupPlayerEntity, GroupPlayerUpdateEntity } from '../reducers/group-player.reducer';

@Injectable()
export class GroupPlayerDataService {

  groupPlayerKey = 'pickleballGroupPlayers';
  constructor() {}

  createGroupPlayer(player: GroupPlayerEntity) {
    const localGroupPlayers: GroupPlayerEntity[] =
        localStorage.getItem(this.groupPlayerKey) ? JSON.parse(localStorage.getItem(this.groupPlayerKey)) : [];
    localGroupPlayers.push(player);
    localStorage.setItem(this.groupPlayerKey, JSON.stringify(localGroupPlayers));
  }

  deleteGroupPlayer(player: GroupPlayerEntity) {
    const localGroupPlayers: GroupPlayerEntity[] =
        localStorage.getItem(this.groupPlayerKey) ? JSON.parse(localStorage.getItem(this.groupPlayerKey)) : [];
    const newGroupPlayers = localGroupPlayers.filter(aPlayer => aPlayer.groupPlayerId !== player.groupPlayerId);
    localStorage.setItem(this.groupPlayerKey, JSON.stringify(newGroupPlayers));
  }

  updateGroupPlayer(player: GroupPlayerUpdateEntity) {
    const localGroupPlayers: GroupPlayerEntity[] =
        localStorage.getItem(this.groupPlayerKey) ? JSON.parse(localStorage.getItem(this.groupPlayerKey)) : [];
    const groupPlayer = localGroupPlayers.find(aPlayer => aPlayer.groupPlayerId === player.id);
    if (groupPlayer) { groupPlayer.playerContacts = player.changes.playerContacts; }
    localStorage.setItem(this.groupPlayerKey, JSON.stringify(localGroupPlayers));
  }

  loadGroupPlayers(): GroupPlayerEntity[] {
    const localGroupPlayers: GroupPlayerEntity[] =
        localStorage.getItem(this.groupPlayerKey) ? JSON.parse(localStorage.getItem(this.groupPlayerKey)) : [];
    return localGroupPlayers;
  }

}

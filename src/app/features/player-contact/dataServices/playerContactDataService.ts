import { Injectable } from '@angular/core';
import { PlayerContactEntity } from '../reducers/player-contact.reducer';

@Injectable()
export class PlayerContactDataService {

  playerKey = 'pickleballPlayerContacts';
  constructor() { }

  addPlayerContact(player: PlayerContactEntity) {
    const localPlayerContacts: PlayerContactEntity[] =
        localStorage.getItem(this.playerKey) ? JSON.parse(localStorage.getItem(this.playerKey)) : [];
    localPlayerContacts.push(player);
    localStorage.setItem(this.playerKey, JSON.stringify(localPlayerContacts));
  }

  removePlayerContact(player: PlayerContactEntity) {
    const localPlayerContacts: PlayerContactEntity[] =
        localStorage.getItem(this.playerKey) ? JSON.parse(localStorage.getItem(this.playerKey)) : [];
    const newPlayerContacts = localPlayerContacts.filter(aPlayer => aPlayer.playerContactId !== player.playerContactId);
    localStorage.setItem(this.playerKey, JSON.stringify(newPlayerContacts));
  }

  loadPlayerContacts(): PlayerContactEntity[] {
    const localPlayerContacts: PlayerContactEntity[] =
        localStorage.getItem(this.playerKey) ? JSON.parse(localStorage.getItem(this.playerKey)) : [];
    return localPlayerContacts;
  }

}

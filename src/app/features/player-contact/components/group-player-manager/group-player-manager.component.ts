import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';
import { Group, PlayerContact, GroupPlayer } from '../../models';
import { Store, select } from '@ngrx/store';
import { selectGroupEntities, PlayerContactState, selectPlayerContactEntities, selectGroupPlayerEntities, selectGroupPlayerSelectedGroup, selectGroupPlayerSelectedGroupPlayer, selectAvailablePlayerContactEntities, selectGroupPlayerEnabledGroupPlayer } from '../../reducers';
import { GroupPlayerAdded, GroupPlayerRemoved, UPDATE_GROUP_PLAYER_ADD_PLAYER_CONTACT, GroupPlayerUpdatedPlayerContactAdded, GroupPlayerUpdatedPlayerContactRemoved } from '../../actions/group-player.actions';
import { GroupPlayerSelectedGroupUpdated } from '../../actions/group-player-settings.actions';
import { FormGroup } from '@angular/forms';
import { filter, switchMap, map, tap, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-group-player-manager',
  templateUrl: './group-player-manager.component.html',
  styleUrls: ['./group-player-manager.component.css']
})
export class GroupPlayerManagerComponent implements OnInit {
  availablePlayerContacts$: Observable<PlayerContact[]>;
  groups$: Observable<Group[]>;
  selectedGroup$: Observable<Group>;
  selectedGroup: Group;
  selectedGroupPlayer$: Observable<GroupPlayer>;
  groupPlayers$: Observable<GroupPlayer[]>;
  groupPlayers: GroupPlayer;
  enabledGroupPlayers$: Observable<GroupPlayer>;

  selectedGroupPlayer: GroupPlayer;

  groupPlayerManagerForm: FormGroup;
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(private store: Store<PlayerContactState>) { }

  ngOnInit() {
    this.availablePlayerContacts$ = this.store.select(selectAvailablePlayerContactEntities);
    this.groups$ = this.store.select(selectGroupEntities);
    this.groupPlayers$ = this.store.select(selectGroupPlayerEntities);
    this.selectedGroup$ = this.store.select(selectGroupPlayerSelectedGroup);

    this.selectedGroupPlayer$ = this.store.select(selectGroupPlayerSelectedGroupPlayer);
    this.enabledGroupPlayers$ = this.store.select(selectGroupPlayerEnabledGroupPlayer);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  enabledPlayers(): PlayerContact[] {
    let result = [];
    this.enabledGroupPlayers$
    .pipe(
      take(1),
      takeUntil(this.unsubscribe),
       tap(ep => {
         result = ep.playerContacts;
       })
     ).subscribe();
     return result;
  }

  selectedPlayers(): PlayerContact[] {
    let result = [];
    this.selectedGroupPlayer$
    .pipe(
      take(1),
      takeUntil(this.unsubscribe),
       tap(ep => {
         result = ep.playerContacts;
       })
     ).subscribe();
     return result;
  }
  sortedGroupPlayers(groupPlayer: GroupPlayer) {
    if (!!groupPlayer) {
      const result = this.sortedPlayerContacts(groupPlayer.playerContacts);
      return result;
    } else {
      return [];
    }
  }

  sortedPlayerContacts(playerContacts: PlayerContact[]) {
    if (!!playerContacts) {
      const result = playerContacts.slice().sort((a, b) => b.name < a.name ? 1 : -1);
      return result;
    } else {
      return [];
    }
  }
  groupSelected() {
    this.store.dispatch(new GroupPlayerSelectedGroupUpdated(this.selectedGroup));
  }

  enablePlayerClass(player: PlayerContact) {
    let result = 'fa fa-thumbs-down';
    if (this.enabledPlayers().find(aPlayer => aPlayer.playerContactId === player.playerContactId)) {
          result = 'fa fa-star';
        }

    return result;
  }

  toggleEnablePlayer(player: PlayerContact) {
    console.log('Enabled Players = ', this.enabledPlayers());
    console.log('Player = ', player);
    if (this.enabledPlayers().find(aPlayer => aPlayer.playerContactId === player.playerContactId)) {
          this.disablePlayer(player);
        } else {
          this.enablePlayer(player);
        }
  }

  enablePlayer(player: PlayerContact) {
    let players = this.enabledPlayers().filter(aPlayer => aPlayer.playerContactId != player.playerContactId);
    console.log('e players = ', players);
    players.push(player);

    this.store.dispatch(new GroupPlayerAdded(this.selectedGroup.enabledPlayerId, players));
  }

  disablePlayer(player: PlayerContact) {
    let players = this.enabledPlayers().filter(aPlayer => aPlayer.playerContactId != player.playerContactId);
    console.log('Disable Players = ', players);
    this.store.dispatch(new GroupPlayerRemoved(this.selectedGroup.enabledPlayerId, players));
  }

  addPlayer(player: PlayerContact) {
    let players = this.selectedPlayers().filter(aPlayer => aPlayer.playerContactId != player.playerContactId);
    console.log('add players = ', players);
    players.push(player);

    this.store.dispatch(new GroupPlayerAdded(this.selectedGroup.groupPlayerId, players));
    this.enablePlayer(player);
  }

  removePlayer(player: PlayerContact) {
    let players = this.selectedPlayers().filter(aPlayer => aPlayer.playerContactId != player.playerContactId);
    console.log('Remove Players = ', players);
    this.store.dispatch(new GroupPlayerRemoved(this.selectedGroup.groupPlayerId, players));
    this.disablePlayer(player);
  }


}

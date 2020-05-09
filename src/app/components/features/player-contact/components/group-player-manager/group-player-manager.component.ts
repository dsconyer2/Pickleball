import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

import { GroupPlayerSelectedGroupUpdated } from '../../actions/group-player-settings.actions';
import { GroupPlayerAdded, GroupPlayerRemoved } from '../../actions/group-player.actions';
import { Group, GroupPlayer, PlayerContact } from '../../models';
import {
  PlayerContactState, selectAvailablePlayerContactEntities, selectGroupEntities, selectGroupPlayerEnabledGroupPlayer,
  selectGroupPlayerEntities, selectGroupPlayerSelectedGroup, selectGroupPlayerSelectedGroupPlayer,
} from '../../reducers';

@Component({
  selector: 'app-group-player-manager',
  templateUrl: './group-player-manager.component.html',
  styleUrls: ['./group-player-manager.component.css'],
})
export class GroupPlayerManagerComponent implements OnInit, OnDestroy {
  availablePlayerContacts$: Observable<PlayerContact[]>;
  groups$: Observable<Group[]>;
  selectedGroup$: Observable<Group>;
  selectedGroup: Group = null;
  selectedGroupPlayer$: Observable<GroupPlayer>;
  groupPlayers$: Observable<GroupPlayer[]>;
  enabledGroupPlayers$: Observable<GroupPlayer>;

  groupPlayerManagerForm: FormGroup;
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store<PlayerContactState>, fb: FormBuilder) {
    this.groupPlayerManagerForm = fb.group({
      groupSelector: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this.availablePlayerContacts$ = this.store.select(selectAvailablePlayerContactEntities);
    this.groups$ = this.store.select(selectGroupEntities);
    this.groupPlayers$ = this.store.select(selectGroupPlayerEntities);
    this.selectedGroup$ = this.store.select(selectGroupPlayerSelectedGroup);

    combineLatest([this.groups$, this.selectedGroup$]).subscribe(
      ([grp, selGrp]) => {
        grp.forEach((aGrp) => {
          if (aGrp.groupId === selGrp?.groupId) { this.selectedGroup = aGrp; }
        });
      },
    );

    this.groupPlayerManagerForm.controls.groupSelector.setValue(this.selectedGroup);
    this.groupPlayerManagerForm.controls.groupSelector.updateValueAndValidity();

    this.selectedGroupPlayer$ = this.store.select(selectGroupPlayerSelectedGroupPlayer);
    this.enabledGroupPlayers$ = this.store.select(selectGroupPlayerEnabledGroupPlayer);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  enabledPlayers(): PlayerContact[] {
    let result = [];
    this.enabledGroupPlayers$
      .pipe(
        take(1),
        tap((ep) => {
          result = ep.playerContacts;
        }),
        takeUntil(this.unsubscribe$),
      ).subscribe();
    return result;
  }

  selectedPlayers(): PlayerContact[] {
    let result = [];
    this.selectedGroupPlayer$
      .pipe(
        take(1),
        tap((ep) => {
          result = ep.playerContacts;
        }),
        takeUntil(this.unsubscribe$),
      ).subscribe();
    return result;
  }

  sortedGroupPlayers(groupPlayer: GroupPlayer): PlayerContact[] {
    if (!!groupPlayer) {
      const result = this.sortedPlayerContacts(groupPlayer.playerContacts);
      return result;
    }
    return [];

  }

  sortedPlayerContacts(playerContacts: PlayerContact[]): PlayerContact[] {
    if (!!playerContacts) {
      const result = playerContacts.slice().sort((a, b) => b.name < a.name ? 1 : -1);
      return result;
    }
    return [];

  }

  groupSelected() {
    this.store.dispatch(new GroupPlayerSelectedGroupUpdated(this.groupPlayerManagerForm.controls.groupSelector.value));
  }

  enablePlayerClass(player: PlayerContact) {
    let result = 'fa fa-thumbs-down';
    if (this.enabledPlayers().find(aPlayer => aPlayer.playerContactId === player.playerContactId)) {
      result = 'fa fa-star';
    }

    return result;
  }

  toggleEnablePlayer(player: PlayerContact) {
    if (this.enabledPlayers().find(aPlayer => aPlayer.playerContactId === player.playerContactId)) {
      this.disablePlayer(player);
    } else {
      this.enablePlayer(player);
    }
  }

  enablePlayer(player: PlayerContact) {
    const players = this.enabledPlayers().filter(aPlayer => aPlayer.playerContactId !== player.playerContactId);
    players.push(player);

    this.store.dispatch(new GroupPlayerAdded(this.selectedGroup.enabledPlayerId, players));
  }

  disablePlayer(player: PlayerContact) {
    const players = this.enabledPlayers().filter(aPlayer => aPlayer.playerContactId !== player.playerContactId);
    this.store.dispatch(new GroupPlayerRemoved(this.selectedGroup.enabledPlayerId, players));
  }

  addPlayer(player: PlayerContact) {
    const players = this.selectedPlayers().filter(aPlayer => aPlayer.playerContactId !== player.playerContactId);
    players.push(player);

    this.store.dispatch(new GroupPlayerAdded(this.selectedGroup.groupPlayerId, players));
    this.enablePlayer(player);
  }

  removePlayer(player: PlayerContact) {
    const players = this.selectedPlayers().filter(aPlayer => aPlayer.playerContactId !== player.playerContactId);
    this.store.dispatch(new GroupPlayerRemoved(this.selectedGroup.groupPlayerId, players));
    this.disablePlayer(player);
  }

}

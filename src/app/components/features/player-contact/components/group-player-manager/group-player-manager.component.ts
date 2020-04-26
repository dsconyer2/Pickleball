import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { Group, PlayerContact, GroupPlayer } from '../../models';
import { Store } from '@ngrx/store';
import {
  selectGroupEntities, PlayerContactState, selectGroupPlayerEntities, selectGroupPlayerSelectedGroup,
  selectGroupPlayerSelectedGroupPlayer, selectAvailablePlayerContactEntities, selectGroupPlayerEnabledGroupPlayer
} from '../../reducers';
import { GroupPlayerAdded, GroupPlayerRemoved } from '../../actions/group-player.actions';
import { GroupPlayerSelectedGroupUpdated } from '../../actions/group-player-settings.actions';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { tap, take, takeUntil, filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-group-player-manager',
  templateUrl: './group-player-manager.component.html',
  styleUrls: ['./group-player-manager.component.css']
})
export class GroupPlayerManagerComponent implements OnInit, OnDestroy {
  availablePlayerContacts$: Observable<PlayerContact[]>;
  groups$: Observable<Group[]>;
  selectedGroup$: Observable<Group>;
  selectedGroup: Group;
  selectedGroupPlayer$: Observable<GroupPlayer>;
  groupPlayers$: Observable<GroupPlayer[]>;
  enabledGroupPlayers$: Observable<GroupPlayer>;

  groupPlayerManagerForm: FormGroup;
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store<PlayerContactState>, fb: FormBuilder) {
    this.groupPlayerManagerForm = fb.group({
      groupSelector: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.availablePlayerContacts$ = this.store.select(selectAvailablePlayerContactEntities);
    this.groups$ = this.store.select(selectGroupEntities);
    this.groupPlayers$ = this.store.select(selectGroupPlayerEntities);
    this.selectedGroup$ = this.store.select(selectGroupPlayerSelectedGroup);

    combineLatest([this.groups$, this.selectedGroup$]).subscribe(
      ([grp, selGrp]) => {
        grp.forEach(aGrp => {
          if (aGrp.groupId === selGrp.groupId) { this.selectedGroup = aGrp; }
        });
      }
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
        takeUntil(this.unsubscribe$),
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
        takeUntil(this.unsubscribe$),
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

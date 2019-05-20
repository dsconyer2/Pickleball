import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NbrOfCourtsUpdated, NbrOfPlayersPerCourtUpdated, NbrOfPlayersUpdated, PlayerAdded, PlayerRemoveAll, RandomizeOrderUpdated, SchedulerTypeUpdated } from '../../actions/scheduler.actions';
import { SchedulerState } from '../../reducers';
import { Group, GroupPlayer } from 'src/app/features/player-contact/models';
import { Observable, Subscription } from 'rxjs';
import { selectGroupEntities, selectGroupPlayerEntities } from 'src/app/features/player-contact/reducers';

@Component({
  selector: 'app-schedule-entry',
  templateUrl: './schedule-entry.component.html',
  styleUrls: ['./schedule-entry.component.css']
})
export class ScheduleEntryComponent implements OnInit, OnDestroy {

  groups$: Observable<Group[]>;
  groupPlayers$: Observable<GroupPlayer[]>;
  groupPlayers: GroupPlayer[];

  seType = 'King';
  sePlayers: number;
  seCourts: number;
  sePlayersPerCourt: number;
  seRandomizeOrder = false;
  seLoadFromGroup = false;
  selectedGroup: Group;

  subscription: Subscription;

  constructor(private store: Store<SchedulerState>, private router: Router) { }

  ngOnInit() {
    this.groups$ = this.store.select(selectGroupEntities);
    this.groupPlayers$ = this.store.select(selectGroupPlayerEntities);
    this.subscription = this.groupPlayers$.subscribe(g => this.groupPlayers = g);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadPlayers() {
    this.store.dispatch(new PlayerRemoveAll());

    if (this.seLoadFromGroup) {
      // get selectedGroup.
      // this.groups.find(aGroup => aGroup.groupId === this.selectedGroup.groupId)
      const players = this.groupPlayers.find(gp => gp.groupPlayerId === this.selectedGroup.playerIds);

      // load players
      players.players.forEach((aPlayer) => {
        this.store.dispatch(new PlayerAdded(aPlayer.playerContactId, true, true, 0, {}, {}));
      });
      this.sePlayers = players.players.length;
    } else {
      for (let index = 0; index < this.sePlayers; index++) {
        this.store.dispatch(new PlayerAdded(index + 1, true, true, 0, {}, {}));
      }
    }
  }

  submit() {
    if (this.seType === 'King') {
      this.sePlayersPerCourt = 4;
    } else {
      this.seCourts = 0;
      this.sePlayersPerCourt = 2;
    }

    this.loadPlayers();

    this.store.dispatch(new SchedulerTypeUpdated(this.seType));
    this.store.dispatch(new NbrOfPlayersUpdated(this.sePlayers));
    this.store.dispatch(new NbrOfCourtsUpdated(this.seCourts));
    this.store.dispatch(new NbrOfPlayersPerCourtUpdated(this.sePlayersPerCourt));
    this.store.dispatch(new RandomizeOrderUpdated(this.seRandomizeOrder));

    this.router.navigate(['/scheduleTournament']);
  }

  onClickScheduleType(value: string) {
    this.seType = value;
  }
}

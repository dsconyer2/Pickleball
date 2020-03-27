import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NbrOfCourtsUpdated, NbrOfPlayersPerCourtUpdated, NbrOfPlayersUpdated, PlayerAdded, PlayerRemoveAll, RandomizeOrderUpdated, SchedulerPlayerTypeUpdated, SchedulerTypeUpdated, UseNamesForMatchesUpdated, LoadFromGroupUpdated, SelectedGroupUpdated } from '../../actions/scheduler.actions';
import { SchedulerState, selectSchedulerPlayerType, selectSchedulerType, selectSchedulerNbrOfPlayers, selectSchedulerNbrOfCourts, selectSchedulerNbrOfPlayersPerCourt, selectSchedulerRandomizeOrder, selectSchedulerUseNamesForMatches, selectSchedulerLoadFromGroup, selectSchedulerSelectedGroup } from '../../reducers';
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

  sePlayerType: string;
  seType: string;
  sePlayers: number;
  seCourts: number;
  sePlayersPerCourt: number;
  seRandomizeOrder: boolean;
  seUseNamesForMatches: boolean;
  seLoadFromGroup: boolean;
  seSelectedGroup: Group;
  validNbrOfCourts: boolean;

  schedulerPlayerType$: Observable<string>;
  schedulerType$: Observable<string>;
  schedulerNbrOfPlayers$: Observable<number>;
  schedulerNbrOfCourts$: Observable<number>;
  schedulerNbrOfPlayersPerCourt$: Observable<number>;
  schedulerRandomizeOrder$: Observable<boolean>;
  schedulerUseNamesForMatches$: Observable<boolean>;
  schedulerLoadFromGroup$: Observable<boolean>;
  schedulerSelectedGroup$: Observable<Group>;

  groupSubscription: Subscription;
  playerTypeSubscription: Subscription;
  typeSubscription: Subscription;
  nbrOfPlayersSubscription: Subscription;
  nbrOfCourtsSubscription: Subscription;
  nbrOfPlayersPerCourtSubscription: Subscription;
  randomizeOrderSubscription: Subscription;
  useNamesForMatchesSubscription: Subscription;
  loadFromGroupSubscription: Subscription;
  selectedGroupSubscription: Subscription;

  constructor(private store: Store<SchedulerState>, private router: Router) { }

  ngOnInit() {
    this.schedulerPlayerType$ = this.store.select(selectSchedulerPlayerType);
    this.schedulerType$ = this.store.select(selectSchedulerType);
    this.schedulerNbrOfPlayers$ = this.store.select(selectSchedulerNbrOfPlayers);
    this.schedulerNbrOfCourts$ = this.store.select(selectSchedulerNbrOfCourts);
    this.schedulerNbrOfPlayersPerCourt$ = this.store.select(selectSchedulerNbrOfPlayersPerCourt);
    this.schedulerRandomizeOrder$ = this.store.select(selectSchedulerRandomizeOrder);
    this.schedulerUseNamesForMatches$ = this.store.select(selectSchedulerUseNamesForMatches);
    this.schedulerLoadFromGroup$ = this.store.select(selectSchedulerLoadFromGroup);
    this.schedulerSelectedGroup$ = this.store.select(selectSchedulerSelectedGroup);

    this.groups$ = this.store.select(selectGroupEntities);
    this.groupPlayers$ = this.store.select(selectGroupPlayerEntities);
    this.groupSubscription = this.groupPlayers$.subscribe(g => this.groupPlayers = g);

    this.playerTypeSubscription = this.schedulerPlayerType$.subscribe(g => this.sePlayerType = g);
    this.typeSubscription = this.schedulerType$.subscribe(g => this.seType = g);
    this.nbrOfPlayersSubscription = this.schedulerNbrOfPlayers$.subscribe(g => this.sePlayers = g);
    this.nbrOfCourtsSubscription = this.schedulerNbrOfCourts$.subscribe(g => this.seCourts = g);
    this.nbrOfPlayersPerCourtSubscription = this.schedulerNbrOfPlayersPerCourt$.subscribe(g => this.sePlayersPerCourt = g);
    this.randomizeOrderSubscription = this.schedulerRandomizeOrder$.subscribe(g => this.seRandomizeOrder = g);
    this.useNamesForMatchesSubscription = this.schedulerUseNamesForMatches$.subscribe(g => this.seUseNamesForMatches = g);
    this.loadFromGroupSubscription = this.schedulerLoadFromGroup$.subscribe(g => this.seLoadFromGroup = g);
    this.selectedGroupSubscription = this.schedulerSelectedGroup$.subscribe(g => this.seSelectedGroup = g);
  }

  ngOnDestroy(): void {
    this.groupSubscription.unsubscribe();
    this.typeSubscription.unsubscribe();
    this.nbrOfPlayersSubscription.unsubscribe();
    this.nbrOfCourtsSubscription.unsubscribe();
    this.nbrOfPlayersPerCourtSubscription.unsubscribe();
    this.randomizeOrderSubscription.unsubscribe();
    this.useNamesForMatchesSubscription.unsubscribe();
    this.loadFromGroupSubscription.unsubscribe();
    this.selectedGroupSubscription.unsubscribe();
  }

  loadPlayers() {
    this.store.dispatch(new PlayerRemoveAll());

    if (this.seLoadFromGroup) {
      // get selectedGroup.
      // this.groups.find(aGroup => aGroup.groupId === this.selectedGroup.groupId)
      const players = this.groupPlayers.find(gp => gp.groupPlayerId === this.seSelectedGroup.enabledPlayerIds);

      // load players
      players.players.forEach((aPlayer) => {
        this.store.dispatch(new PlayerAdded(aPlayer.playerContactId, aPlayer.name, true, true, 0, {}, {}));
      });
      this.sePlayers = players.players.length;
    } else {
      for (let index = 0; index < this.sePlayers; index++) {
        this.store.dispatch(new PlayerAdded(index + 1, (index + 1).toString(), true, true, 0, {}, {}));
      }
    }
  }

  
  onSubmit(validForm: Boolean) {
    if (validForm) {
      this.sePlayersPerCourt = 2;
      if (this.seType === 'King') {
        if (this.sePlayerType === 'Individuals for Doubles') {
        this.sePlayersPerCourt = 4;
        } 
      } else {
        this.seCourts = 0;
      }

      if (this.seCourts * this.sePlayersPerCourt > this.sePlayers) {
        this.seCourts = this.sePlayers / this.sePlayersPerCourt;
      }
      
        this.loadPlayers();

        this.store.dispatch(new SchedulerPlayerTypeUpdated(this.sePlayerType));
        this.store.dispatch(new SchedulerTypeUpdated(this.seType));
        this.store.dispatch(new NbrOfPlayersUpdated(this.sePlayers));
        this.store.dispatch(new NbrOfCourtsUpdated(this.seCourts));
        this.store.dispatch(new NbrOfPlayersPerCourtUpdated(this.sePlayersPerCourt));
        this.store.dispatch(new RandomizeOrderUpdated(this.seRandomizeOrder));
        this.store.dispatch(new UseNamesForMatchesUpdated(this.seUseNamesForMatches));
        this.store.dispatch(new LoadFromGroupUpdated(this.seLoadFromGroup));
        this.store.dispatch(new SelectedGroupUpdated(this.seSelectedGroup));

        this.router.navigate(['/scheduleTournament']);
    }
  }

  onClickPlayerType(value: string) {
    this.sePlayerType = value;
  }

  onClickScheduleType(value: string) {
    this.seType = value;
  }
}

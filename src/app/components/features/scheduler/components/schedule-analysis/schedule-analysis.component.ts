import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import { ScheduleBye, ScheduleMatch, ScheduleRound } from '../../models';
import { SchedulerState, selectScheduleByeEntities, selectScheduleMatchEntities, selectSchedulerNbrOfByePlayers,
  selectSchedulerNbrOfCourts, selectSchedulerNbrOfPlayers, selectSchedulerNbrOfPlayersPerCourt, selectScheduleRoundEntities,
  selectSchedulerPlayerType, selectSchedulerType } from '../../store/reducers';

@Component({
  selector: 'app-schedule-analysis',
  templateUrl: './schedule-analysis.component.html',
  styleUrls: ['./schedule-analysis.component.css'],
})
export class ScheduleAnalysisComponent implements OnInit, OnDestroy {

  scheduleRounds$: Observable<ScheduleRound[]>;
  scheduleMatches$: Observable<ScheduleMatch[]>;
  scheduleByes$: Observable<ScheduleBye[]>;
  schedulerType$: Observable<string>;
  playerType$: Observable<string>;
  nbrOfPlayers$: Observable<number>;
  nbrOfCourts$: Observable<number>;
  playersPerCourt$: Observable<number>;
  nbrOfByePlayers$: Observable<number>;

  scheduleAnalysisForm: FormGroup;
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store<SchedulerState>,
    private router: Router,
    fb: FormBuilder) {
    this.scheduleAnalysisForm = fb.group({});
  }

  ngOnInit(): void {
    this.scheduleRounds$ = this.store.select(selectScheduleRoundEntities);
    this.scheduleMatches$ = this.store.select(selectScheduleMatchEntities);
    this.scheduleByes$ = this.store.select(selectScheduleByeEntities);
    this.schedulerType$ = this.store.select(selectSchedulerType);
    this.playerType$ = this.store.select(selectSchedulerPlayerType);
    this.nbrOfPlayers$ = this.store.select(selectSchedulerNbrOfPlayers);
    this.nbrOfCourts$ = this.store.select(selectSchedulerNbrOfCourts);
    this.playersPerCourt$ = this.store.select(selectSchedulerNbrOfPlayersPerCourt);
    this.nbrOfByePlayers$ = this.store.select(selectSchedulerNbrOfByePlayers);

    this.analyze();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  analyze() {

  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoundData } from '../../models';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  SchedulerState, selectScheduleHeaders, selectScheduleRounds, selectSchedulerPlayerType,
  selectSchedulerNbrOfPlayers, selectSchedulerNbrOfCourts, selectSchedulerNbrOfPlayersPerCourt,
  selectSchedulerNbrOfByePlayers, selectSchedulerType
} from '../../reducers';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-schedule-display',
  templateUrl: './schedule-display.component.html',
  styleUrls: ['./schedule-display.component.css']
})
export class ScheduleDisplayComponent implements OnInit, OnDestroy {

  displayRounds$: Observable<RoundData[]>;
  rounds$: Observable<RoundData[]>;
  headers$: Observable<string[]>;
  schedulerType$: Observable<string>;
  playerType$: Observable<string>;
  nbrOfPlayers$: Observable<number>;
  nbrOfCourts$: Observable<number>;
  playersPerCourt$: Observable<number>;
  nbrOfByePlayers$: Observable<number>;

  showAllRounds = false;
  showLabel = 'Show All Rounds';
  displayInfo = false;
  infoLabel = 'Show Info';
  currentRoundIndex = 0;
  totalRounds = 0;

  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store<SchedulerState>, private router: Router) { }

  ngOnInit(): void {
    this.headers$ = this.store.select(selectScheduleHeaders);
    this.rounds$ = this.store.select(selectScheduleRounds);
    this.schedulerType$ = this.store.select(selectSchedulerType);
    this.playerType$ = this.store.select(selectSchedulerPlayerType);
    this.nbrOfPlayers$ = this.store.select(selectSchedulerNbrOfPlayers);
    this.nbrOfCourts$ = this.store.select(selectSchedulerNbrOfCourts);
    this.playersPerCourt$ = this.store.select(selectSchedulerNbrOfPlayersPerCourt);
    this.nbrOfByePlayers$ = this.store.select(selectSchedulerNbrOfByePlayers);

    this.rounds$.pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(aRound => {
        this.totalRounds = aRound.length;
        if (aRound.length === 0) {
          this.router.navigate(['/scheduler']);
        }
      });
    this.updateDisplay();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  setDisplayType() {
    this.showAllRounds = !this.showAllRounds;
    if (this.showAllRounds) {
      this.showLabel = 'Show One Round';
    } else {
      this.showLabel = 'Show All Rounds';
    }
    this.updateDisplay();
  }

  setDisplayInfo() {
    this.displayInfo = !this.displayInfo;
    if (this.displayInfo) {
      this.infoLabel = 'Hide Info';
    } else {
      this.infoLabel = 'Show Info';
    }
  }

  advanceDisplay(increment: number) {
    let canIncrement = false;
    const absoluteNumber = Math.abs(increment);
    if (increment < 0 && this.currentRoundIndex >= absoluteNumber) { canIncrement = true; }
    if (increment > 0 && this.currentRoundIndex <= (this.totalRounds - 1) - increment) { canIncrement = true; }
    if (canIncrement) {
      this.currentRoundIndex += increment;
      this.updateDisplay();
    }
  }

  updateDisplay() {
    if (this.showAllRounds) {
      this.displayRounds$ = this.rounds$;
    } else {
      this.rounds$.pipe(
        takeUntil(this.unsubscribe$)
      )
        .subscribe(aRound => {
          this.displayRounds$ = of(aRound.slice(this.currentRoundIndex, this.currentRoundIndex + 1));
        });
    }
  }

}

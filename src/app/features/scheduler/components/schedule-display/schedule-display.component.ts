import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoundData, Match } from '../../models';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  SchedulerState, selectScheduleHeaders, selectScheduleRounds, selectSchedulerPlayerType,
  selectSchedulerNbrOfPlayers, selectSchedulerNbrOfCourts, selectSchedulerNbrOfPlayersPerCourt,
  selectSchedulerNbrOfByePlayers, selectSchedulerType
} from '../../reducers';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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

  closeResult = '';

  unsubscribe$: Subject<boolean> = new Subject<boolean>();
  selectedMatch: Match;

  constructor(private store: Store<SchedulerState>, private router: Router, private modalService: NgbModal) { }

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

  addScore(content: any, match: Match, matchLabel: string) {
    console.log('Match = ', match);
    console.log('MatchLabel = ', matchLabel);
    console.log('Content =', content);
    this.selectedMatch = match;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log('Result = ', result);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log('Reason = ', reason);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  updateTeamScore(modal: NgbModalRef, team1Score: string, team2Score: string) {
    console.log('Score 1 = ', team1Score);
    console.log('Score 2 = ', team2Score);
    this.selectedMatch.team1Score = parseInt(team1Score, 10);
    this.selectedMatch.team2Score = parseInt(team2Score, 10);
    console.log('Match = ', this.selectedMatch);
    modal.close('Scores Updated');
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Match, ScheduleBye, ScheduleRound, ScheduleMatch, RoundData, SchedulerSettings } from '../../models';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  SchedulerState, selectScheduleHeaders, selectSchedulerPlayerType,
  selectSchedulerNbrOfPlayers, selectSchedulerNbrOfCourts, selectSchedulerNbrOfPlayersPerCourt,
  selectSchedulerNbrOfByePlayers, selectSchedulerType, selectScheduleByeEntities, selectScheduleRoundEntities,
  selectScheduleMatchEntities, selectSchedulerSettings
} from '../../store/reducers';
import { Observable, Subject, of, combineLatest } from 'rxjs';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleMatchCreated, ScheduleMatchUpdated } from '../../store/actions/schedule-match.actions';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-schedule-display',
  templateUrl: './schedule-display.component.html',
  styleUrls: ['./schedule-display.component.css']
})
export class ScheduleDisplayComponent implements OnInit, OnDestroy {

  displayRounds$: Observable<RoundData[]>;
  roundData$: Observable<RoundData[]>;
  scheduleRounds$: Observable<ScheduleRound[]>;
  scheduleMatches$: Observable<ScheduleMatch[]>;
  scheduleByes$: Observable<ScheduleBye[]>;
  headers$: Observable<string[]>;
  schedulerType$: Observable<string>;
  playerType$: Observable<string>;
  nbrOfPlayers$: Observable<number>;
  nbrOfCourts$: Observable<number>;
  playersPerCourt$: Observable<number>;
  nbrOfByePlayers$: Observable<number>;

  useNamesForMatches = false;

  showAllRounds = false;
  showLabel = 'Show All Rounds';
  displayInfo = false;
  infoLabel = 'Show Info';
  currentRoundIndex = 0;
  totalRounds = 0;

  closeResult = '';

  scheduleDisplayForm: FormGroup;
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();
  selectedMatch: Match;

  constructor(
    private store: Store<SchedulerState>,
    private router: Router,
    private modalService: NgbModal,
    fb: FormBuilder) {
      this.scheduleDisplayForm = fb.group({});
     }

  ngOnInit(): void {
    this.headers$ = this.store.select(selectScheduleHeaders);
    this.scheduleRounds$ = this.store.select(selectScheduleRoundEntities);
    this.scheduleMatches$ = this.store.select(selectScheduleMatchEntities);
    this.scheduleByes$ = this.store.select(selectScheduleByeEntities);
    this.schedulerType$ = this.store.select(selectSchedulerType);
    this.playerType$ = this.store.select(selectSchedulerPlayerType);
    this.nbrOfPlayers$ = this.store.select(selectSchedulerNbrOfPlayers);
    this.nbrOfCourts$ = this.store.select(selectSchedulerNbrOfCourts);
    this.playersPerCourt$ = this.store.select(selectSchedulerNbrOfPlayersPerCourt);
    this.nbrOfByePlayers$ = this.store.select(selectSchedulerNbrOfByePlayers);

    this.store.select(selectSchedulerSettings).subscribe((settings: SchedulerSettings) => {
      this.useNamesForMatches = settings.useNamesForMatches;
    });

    this.scheduleRounds$.pipe(
      takeUntil(this.unsubscribe$)
    )
      .subscribe(aRound => {
        this.totalRounds = aRound.length;
        if (aRound.length === 0) {
          this.router.navigate(['/scheduler']);
        }
      });

    this.roundData$ =
      combineLatest([this.scheduleRounds$, this.scheduleMatches$]).pipe(
        map(([myScheduleRounds, myScheduleMatches]) => {
          const result: RoundData[] = [];
          myScheduleRounds
            .forEach(aScheduleRound => {
              const aRound: RoundData = { roundId: undefined, matches: [], byeId: undefined };
              aRound.roundId = aScheduleRound.roundId;
              aRound.byeId = aScheduleRound.byeId;
              aScheduleRound.matchIds.forEach(aMatchId => aRound.matches.push(this.getaMatchForId(aMatchId, myScheduleMatches)));
              result.push(aRound);
            });
          return result;
        })
      );
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
      this.displayRounds$ = this.roundData$;
    } else {
      this.roundData$.pipe(
        takeUntil(this.unsubscribe$)
      )
        .subscribe(aRound => {
          this.displayRounds$ = of(aRound.slice(this.currentRoundIndex, this.currentRoundIndex + 1));
        });
    }
  }

  hasBye(aByeId: number): boolean {
    let result: ScheduleBye[];
    this.scheduleByes$.pipe(
      map(aByeArray => result = aByeArray.filter(aBye => aBye.byeId === aByeId)),
      takeUntil(this.unsubscribe$)
    ).subscribe();
    return (result.length > 0) ? result[0].byePlayers ? result[0].byePlayers.length > 0 : false : false;
  }

  highlightWinner(aMatch: Match, teamNumber: number) {
    let styles = { color: '#4e72df9f', 'font-size': 'larger' };
    if (teamNumber === 1 ? aMatch.team1Score > aMatch.team2Score : teamNumber === 2 ? aMatch.team2Score > aMatch.team1Score : false) {
      styles = { color: '#0b329b', 'font-size': 'larger' };
    }
    return styles;
  }

  getaMatchForId(aMatchId: number, scheduleMatches: ScheduleMatch[]): Match {
    let result: ScheduleMatch[];
    result = scheduleMatches.filter(aMatch => aMatch.matchId === aMatchId);
    return (result.length > 0) ? result[0].match : null;
  }

  getMatchForId(aMatchId: number): Match {
    let result: ScheduleMatch[];
    this.scheduleMatches$.pipe(
      map(aMatchArray => result = aMatchArray.filter(aMatch => aMatch.matchId === aMatchId)),
      takeUntil(this.unsubscribe$)
    ).subscribe();
    return (result.length > 0) ? result[0].match : null;
  }

  formattedByes(aByeId: number): string {
    let result: ScheduleBye[];
    this.scheduleByes$.pipe(
      map(aByeArray => result = aByeArray.filter(aBye => aBye.byeId === aByeId)),
      takeUntil(this.unsubscribe$)
    ).subscribe();
    return (result.length > 0) ? this.formatByeOutput(result[0]) : null;
  }

  formatByeOutput(aScheduleBye: ScheduleBye): string {
    let output = ' ';
    if (!!this.useNamesForMatches) {
      aScheduleBye.byePlayers.sort((a, b) => a.playerName < b.playerName ? -1 : 1).forEach(aByePlayer => {
        output += (aByePlayer.playerName + ', ');
      });
    } else {
      aScheduleBye.byePlayers.sort((a, b) => a.playerId - b.playerId).forEach(aByePlayer => {
        output += (aByePlayer.playerId + ', ');
      });
    }
    output = output.slice(0, output.length - 2);
    return output;
  }

  addScore(content: any, match: Match) {
    this.selectedMatch = match;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
    this.selectedMatch.team1Score = parseInt(team1Score, 10);
    this.selectedMatch.team2Score = parseInt(team2Score, 10);
    this.store.dispatch(new ScheduleMatchUpdated(this.selectedMatch.matchId, this.selectedMatch));
    modal.close('Scores Updated');
    this.updateDisplay();
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { Match, Player, ScheduleBye, ScheduleMatch, ScheduleRound } from '../../models';
import {
  SchedulerState, selectScheduleByeEntities, selectScheduleMatchEntities, selectSchedulerNbrOfByePlayers,
  selectSchedulerNbrOfCourts, selectSchedulerNbrOfPlayers, selectSchedulerNbrOfPlayersPerCourt, selectScheduleRoundEntities,
  selectSchedulerPlayerType, selectSchedulerType,
} from '../../store/reducers';

@Component({
  selector: 'app-schedule-analysis',
  templateUrl: './schedule-analysis.component.html',
  styleUrls: ['./schedule-analysis.component.css'],
})
export class ScheduleAnalysisComponent implements OnInit, OnDestroy {

  scheduleRounds: ScheduleRound[];
  scheduleMatches: ScheduleMatch[];
  scheduleByes: ScheduleBye[];
  schedulerType: string;
  playerType: string;
  nbrOfPlayers: number;
  nbrOfCourts: number;
  playersPerCourt: number;
  nbrOfByePlayers: number;

  nbrOfRounds = 0;
  roundHeader: any[] = [];
  playerHeader: any[] = [];
  playedWithArray: [number[]] = [[]];
  playedAgainstArray: [number[]] = [[]];
  byeArray: [number[]] = [[]];

  playedWithLast: number[] = [];
  playedAgainsLast: number[] = [];
  byePlayersLastRound: Player[] = [];
  backToBackByes: number[] = [];

  scheduleAnalysisForm: FormGroup;
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store<SchedulerState>,
    private router: Router,
    fb: FormBuilder) {
    this.scheduleAnalysisForm = fb.group({});
  }

  ngOnInit(): void {
    this.store.select(selectScheduleRoundEntities).pipe(take(1)).subscribe(sR => this.scheduleRounds = sR);
    this.store.select(selectScheduleMatchEntities).pipe(take(1)).subscribe(sM => this.scheduleMatches = sM);
    this.store.select(selectScheduleByeEntities).pipe(take(1)).subscribe(sB => this.scheduleByes = sB);
    this.store.select(selectSchedulerType).pipe(take(1)).subscribe(sT => this.schedulerType = sT);
    this.store.select(selectSchedulerPlayerType).pipe(take(1)).subscribe(pT => this.playerType = pT);
    this.store.select(selectSchedulerNbrOfPlayers).pipe(take(1)).subscribe(nP => this.nbrOfPlayers = nP);
    this.store.select(selectSchedulerNbrOfCourts).pipe(take(1)).subscribe(nC => this.nbrOfCourts = nC);
    this.store.select(selectSchedulerNbrOfPlayersPerCourt).pipe(take(1)).subscribe(ppc => this.playersPerCourt = ppc);
    this.store.select(selectSchedulerNbrOfByePlayers).pipe(take(1)).subscribe(bP => this.nbrOfByePlayers = bP);

    this.analyze();
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  analyze() {
    this.initializeAnalysisArrays();
    this.calculateStatistics();

  }

  initializeAnalysisArrays() {
    this.playerHeader.push('Players');
    for (let x = 0; x < this.nbrOfPlayers; x++) {
      this.playerHeader.push(x + 1);
      this.backToBackByes[x] = 0;
      const playerArray = [];
      for (let y = 0; y < this.nbrOfPlayers; y++) {
        playerArray.push(0);
      }
      this.playedWithArray[x] = playerArray.slice();
      this.playedAgainstArray[x] = playerArray.slice();
    }
    this.playerHeader.push('Total');

    for (let x = 0; x < this.nbrOfPlayers; x++) {
      const roundArray = [];
      this.scheduleRounds.forEach((aRound) => {
        roundArray.push(0);
      });
      this.byeArray[x] = roundArray;
    }

    this.roundHeader.push('Rounds');
    this.scheduleRounds.forEach((aRound) => {
      this.nbrOfRounds++;
      this.roundHeader.push(this.nbrOfRounds);
    });
    this.roundHeader.push('Total');
  }

  calculateStatistics() {
    this.scheduleRounds.forEach((aScheduleRound) => {
      this.calculateByeData(aScheduleRound);
      aScheduleRound.matchIds.forEach((aMatchId) => {
        const aMatch = this.getMatchForId(aMatchId, this.scheduleMatches);
        this.addToPlayedWith(aMatch);
        this.addToPlayedAgainst(aMatch);
      });
    });
    this.calculateTotals();
  }

  calculateTotals() {
    for (let x = 0; x < this.nbrOfPlayers; x++) {
      let totalPlayedWith = 0;
      let totalPlayedAgainst = 0;
      let totalByes = 0;

      for (let y = 0; y < this.nbrOfPlayers; y++) {
        totalPlayedWith += this.playedWithArray[x][y];
        totalPlayedAgainst += this.playedAgainstArray[x][y];
      }

      this.playedWithArray[x].push(totalPlayedWith);
      this.playedAgainstArray[x].push(totalPlayedAgainst);

      this.scheduleRounds.forEach((aScheduleRound) => {
        totalByes += this.byeArray[x][aScheduleRound.roundId - 1];
      });

      this.byeArray[x].push(totalByes);
    }
  }

  calculateByeData(aScheduleRound: ScheduleRound) {
    const thisBye = this.getByeForId(aScheduleRound.byeId, this.scheduleByes);
    thisBye.byePlayers.forEach((aPlayer) => {
      this.byeArray[aPlayer.playerId - 1][aScheduleRound.roundId - 1]++;
      const playerFound = this.byePlayersLastRound.find((aByePlayer) => { return aByePlayer.playerId === aPlayer.playerId; });
      if (playerFound) { this.backToBackByes[aPlayer.playerId - 1]++; }
    });
    this.byePlayersLastRound = thisBye.byePlayers;
  }

  addToPlayedWith(aMatch: Match) {
    if (aMatch.team1.length > 1) {
      aMatch.team1.forEach((firstPlayer) => {
        aMatch.team1.forEach((secondPlayer) => {
          if (firstPlayer.playerId !== secondPlayer.playerId) {
            // console.warn('FirstPlayerId = ', firstPlayer.playerId);
            // console.warn('SecondPlayerId = ', secondPlayer.playerId);
            this.playedWithArray[firstPlayer.playerId - 1][secondPlayer.playerId - 1]++;
          }
        });
      });
    }

    if (aMatch.team2.length > 1) {
      aMatch.team2.forEach((firstPlayer) => {
        aMatch.team2.forEach((secondPlayer) => {
          if (firstPlayer.playerId !== secondPlayer.playerId) {
            this.playedWithArray[firstPlayer.playerId - 1][secondPlayer.playerId - 1]++;
          }
        });
      });
    }
  }

  addToPlayedAgainst(aMatch: Match) {
    if (aMatch.team1.length > 0) {
      aMatch.team1.forEach((firstPlayer) => {
        aMatch.team2.forEach((secondPlayer) => {
          if (firstPlayer.playerId !== secondPlayer.playerId) {
            // console.warn('FirstPlayerId = ', firstPlayer.playerId);
            // console.warn('SecondPlayerId = ', secondPlayer.playerId);
            this.playedAgainstArray[firstPlayer.playerId - 1][secondPlayer.playerId - 1]++;
          }
        });
      });
    }

    if (aMatch.team2.length > 0) {
      aMatch.team2.forEach((firstPlayer) => {
        aMatch.team1.forEach((secondPlayer) => {
          if (firstPlayer.playerId !== secondPlayer.playerId) {
            this.playedAgainstArray[firstPlayer.playerId - 1][secondPlayer.playerId - 1]++;
          }
        });
      });
    }
  }

  getMatchForId(aMatchId: number, scheduleMatches: ScheduleMatch[]): Match {
    let result: ScheduleMatch[];
    result = scheduleMatches.filter(aMatch => aMatch.matchId === aMatchId);
    return (result.length > 0) ? result[0].match : null;
  }

  getByeForId(aByeId: number, scheduleByes: ScheduleBye[]): ScheduleBye {
    let result: ScheduleBye[];
    result = scheduleByes.filter(aBye => aBye.byeId === aByeId);
    return (result.length > 0) ? result[0] : null;
  }

  analysisFinished() {
    this.router.navigate(['/scheduleDisplay']);
  }

}

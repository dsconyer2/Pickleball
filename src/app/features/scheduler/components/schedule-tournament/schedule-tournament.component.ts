import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Match, Player, RoundData, SchedulerSettings } from '../../models';
import { SchedulerState, selectPlayerEntities, selectSchedulerSettings } from '../../reducers';
import { ScheduleUpdated } from '../../actions/schedule.actions';
import { NbrOfByePlayersUpdated } from '../../actions/scheduler.actions';


@Component({
  selector: 'app-schedule-tournament',
  templateUrl: './schedule-tournament.component.html',
  styleUrls: ['./schedule-tournament.component.css']
})
export class ScheduleTournamentComponent implements OnInit {

  players$: Observable<Player[]>;
  schedulerSettings$: Observable<SchedulerSettings>;

  playerType: string;
  nbrOfPlayers: number;
  nbrOfCourts: number;
  playersPerCourt: number;
  nbrOfByePlayers: number;

  playerList1: Player[] = [];
  playerList2: Player[] = [];
  useEvenPlayerLogic = false;
  isScheduleTypeKing = true;
  randomizeOrder: boolean;
  useNamesForMatches: boolean;

  byeIndexes: number[] = [];
  byesNeeded = 0;

  rounds: RoundData[] = [];
  courtHeaders: string[] = [];

  constructor(private store: Store<SchedulerState>, private router: Router) { }

  ngOnInit() {
    this.store.select(selectSchedulerSettings).subscribe((settings: SchedulerSettings) => {
      this.playerType = settings.schedulerPlayerType;
      this.isScheduleTypeKing = settings.schedulerType === 'King of the Court';
      this.nbrOfPlayers = settings.nbrOfPlayers;
      this.nbrOfCourts = settings.nbrOfCourts;
      this.playersPerCourt = settings.nbrOfPlayersPerCourt;
      this.randomizeOrder = settings.randomizeOrder;
      this.useNamesForMatches = settings.useNamesForMatches;
    });

    this.store.select(selectPlayerEntities).subscribe((players: Player[]) => {
      players.forEach(aPlayer => this.playerList1.push(aPlayer));
    });

    if (this.randomizeOrder) { this.playerList1.sort(() => 0.5 - Math.random()); }

    if (this.playerList1.length > 0) {
      this.schedulePLayers();
    } else {
      this.router.navigate(['/scheduler']);
    }
  }

  createByePlayer(playerId: number) {
    return {
      playerId,
      isPlayerAvailable: true,
      isByeAvailable: true,
      byeRound: 0,
      id: (playerId)
    };
  }

  initialize() {

    // console.log('My Players = ', this.myPlayers);
    // console.table(this.myPlayers);
    // console.log('Player List 1 = ', this.playerList1);
    // console.table(this.playerList1);
    this.useEvenPlayerLogic = (this.playerList1.length % 2 === 0);
    if (this.isScheduleTypeKing) {
      this.nbrOfByePlayers = this.nbrOfPlayers -
        (this.nbrOfCourts * this.playersPerCourt);
      this.courtHeaders.push('Round');
      for (let index = 1; index < this.nbrOfCourts + 1; index++) {
        const header = 'Court ' + index;
        this.courtHeaders.push(header);
      }
      if (this.nbrOfByePlayers > 0) { this.courtHeaders.push('Byes'); }
    } else {
      this.courtHeaders.push('Round');
      for (let index = 1; index < Math.trunc(this.nbrOfPlayers / this.playersPerCourt) + 1; index++) {
        const header = 'Match ' + index;
        this.courtHeaders.push(header);
      }
      if (this.useEvenPlayerLogic) {
        this.nbrOfByePlayers = 0;
      } else {
        this.nbrOfByePlayers = 1;
        this.courtHeaders.push('Byes');
      }
    }
  }

  setByeIndexesForEvenNumberOfPlayers() {
    if (this.useEvenPlayerLogic) {
      // For even player logic the first player never rotates in the player matching logic.
      // This means we have to pick the players who have played the most to sit out.
      // Because you can have many players with the same number of games played you need to
      //  start in the middle of the list to make things distribute better.
      this.byeIndexes.length = 0;
      const playCounts = [];
      const sortedPlayCounts = [];
      for (let index = 0; index < this.playerList1.length; index++) {
        let gamesPlayed =
          this.gamesPlayed(this.playerList1[index]) +
          this.gamesPlayed(this.playerList2[index]);
        if (this.rounds.length > 0) {
          const prevByes = this.rounds.slice().pop().byes;
          if (prevByes.includes(this.playerList1[index])) { --gamesPlayed; }
          if (prevByes.includes(this.playerList2[index])) { --gamesPlayed; }
        }
        playCounts[index] = gamesPlayed;
        sortedPlayCounts[index] = gamesPlayed;
      }
      // Need to create a sorted list of games played to identify which index has the most games.
      sortedPlayCounts.sort((a, b) => b - a);
      // Based on the byesNeeded, pick that many values from the top of the sorted list.
      const middleIndexValue: number = Math.trunc(this.playerList1.length / 2);
      for (let i = 0; i < this.byesNeeded; i++) {
        const gamesPlayedSelected = sortedPlayCounts[i];
        let byeIndexSelected = false;
        // Start in the middle of the playerList1, add the index that matches gamesPlayedSelected to the byeIndexs
        // if it has not already been added.
        for (let j = 0; j < this.playerList1.length; j++) {
          let byeIndex = j + middleIndexValue;
          if (byeIndex >= this.playerList1.length) { byeIndex = byeIndex - this.playerList1.length; }
          if (!byeIndexSelected && !this.byeIndexes.includes(byeIndex)) {
            if (playCounts[byeIndex] === gamesPlayedSelected) {
              this.byeIndexes.push(byeIndex);
              byeIndexSelected = true;
            }
          }
        }

      }
      // console.log('Bye indexes');
      // console.table(this.byeIndexes);
      // console.table(sortedPlayCounts);
      // console.table(playCounts);
    }
  }

  processRounds() {
    // Split the player list into two arrays.
    let indexBreak: number = Math.trunc(this.playerList1.length / 2);
    // console.log('indexBreak = ', indexBreak);
    if (!this.useEvenPlayerLogic) {
      indexBreak++;
    }
    this.playerList2 = this.playerList1.slice(indexBreak);
    // for (let index = (indexBreak); index < this.playerList1.length; index++) {
    //   this.playerList2.push(this.playerList1[index]);
    // }
    this.playerList1.length = indexBreak;
    //   console.log('Player list 1');
    //  console.table(this.playerList1);
    //  console.log('Player list 2');
    //  console.table(this.playerList2);

    // Byes are determined differently depending if there are even or odd number of players.
    // For odd, it is easy.  You just pick the index you want to be the bye player.
    // For even, you have to determine who has played the most and didn't just sit out.
    // The logic below is for odd number of players.
    // Determine how many bye players there will be.
    // Divide that by 2 because you divided the player list in half.
    if (this.nbrOfByePlayers > 0) {
      this.byesNeeded = Math.round(this.nbrOfByePlayers / 2);
      if (!this.useEvenPlayerLogic) {
        //  For odd player counts you determine who sits out by just selecting
        //  indexes that are evenly spaced through the player list.
        const byeIncrement = indexBreak / this.byesNeeded;
        // console.log('Nbr of Bye Players = ', this.nbrOfByePlayers);
        // console.log('Byes Needed = ', byesNeeded);
        // console.log('Index break = ', indexBreak);
        let byeIndex = 0;
        for (let index = 0; index < this.byesNeeded; index++) {
          this.byeIndexes.push(Math.trunc((indexBreak - 1) - byeIndex));
          byeIndex = byeIndex + byeIncrement;
        }
      }
    }
    // console.log('Bye indexes');
    // console.table(this.byeIndexes);
    const maxNbrOfRounds = this.nbrOfPlayers + this.nbrOfByePlayers;
    for (let rounds = 1; rounds < maxNbrOfRounds; rounds++) {
      // Set the bye indexes for even number of players
      this.setByeIndexesForEvenNumberOfPlayers();
      // Gather data for the round.
      const thisRound: RoundData = { roundId: rounds, matches: [], byes: [], byeLabel: '' };
      let matchIndex = 0;
      for (let index = 0; index < indexBreak; index++) {
        matchIndex++;
        //  console.log('index = ', index);
        if (this.byeIndexes.includes(index)) {
          //  console.log('bye ', this.playerList1[index].playerId);
          thisRound.byes.push(this.playerList1[index]);
          if (index <= this.playerList2.length - 1) {
            thisRound.byes.push(this.playerList2[index]);
          }
        } else {
          // console.log('match ', this.playerList1[index].playerId);
          if (this.isScheduleTypeKing) {
            if (this.playersPerCourt === 4) {
              // console.log('Adding King match');
              // console.table([this.playerList1[index],
              // this.playerList2[index]]);
              thisRound.matches.push(
                {
                  matchId: index,
                  matchLabel: '',
                  team1: [this.playerList1[index],
                  this.playerList2[index]],
                  team2: [],
                  matchPriority: {},
                  courtPriority: {},
                  courtAssigned: 0,
                  opponentsAssigned: false,
                  isPrimary: false,
                  team1Score: undefined,
                  team2Score: undefined
                });
            } else {
              thisRound.matches.push(
                {
                  matchId: matchIndex,
                  matchLabel: '',
                  team1: [this.playerList1[index]],
                  team2: [],
                  matchPriority: {},
                  courtPriority: {},
                  courtAssigned: 0,
                  opponentsAssigned: false,
                  isPrimary: false,
                  team1Score: undefined,
                  team2Score: undefined
                });
              matchIndex++;
              thisRound.matches.push(
                {
                  matchId: matchIndex,
                  matchLabel: '',
                  team1: [this.playerList2[index]],
                  team2: [],
                  matchPriority: {},
                  courtPriority: {},
                  courtAssigned: 0,
                  opponentsAssigned: false,
                  isPrimary: false,
                  team1Score: undefined,
                  team2Score: undefined
                });
            }
          } else {
            let label;
            if (this.useNamesForMatches) {
              label = ' ' + this.playerList1[index].playerName + ' v ' + this.playerList2[index].playerName;
            } else {
              label = ' ' + this.playerList1[index].playerId + ' v ' + this.playerList2[index].playerId;
            }
            thisRound.matches.push(
              {
                matchId: index,
                matchLabel: label,
                team1: [this.playerList1[index]],
                team2: [this.playerList2[index]],
                matchPriority: {},
                courtPriority: {},
                courtAssigned: 0,
                opponentsAssigned: true,
                isPrimary: true,
                team1Score: undefined,
                team2Score: undefined
              });
          }
        }
      }
      this.rounds.push(thisRound);

      // console.log('Calling schedule opponents');
      if (this.isScheduleTypeKing) {
        this.scheduleOpponents(thisRound);
        this.removeNonPrimaryMatches(thisRound);
        this.scheduleCourts(thisRound);
        this.updateMatchLabels(thisRound);
      }

      this.updateByeLabels(thisRound);

      // rotate player lists
      this.playerList1.push(this.playerList2.pop());
      let newList: Player[] = [];
      if (this.useEvenPlayerLogic) {
        newList = this.playerList1.splice(1, 1);
      } else {
        newList = this.playerList1.splice(0, 1);
      }

      this.playerList2 = newList.concat(this.playerList2);
      // console.log('Round = ', rounds + 1);
      // console.log('Player list 1');
      // console.table(this.playerList1);
      // console.log('Player list 2');
      // console.table(this.playerList2);
    }


  }

  removeNonPrimaryMatches(aRound: RoundData) {
    aRound.matches = aRound.matches.filter(m => m.isPrimary);
  }

  updateMatchLabels(aRound: RoundData) {
    // aRound.matches.forEach(aMatch => {
    //   let matchLabel = ' ';
    //   if (this.useNamesForMatches) {
    //     aMatch.team1.forEach(aPlayer => matchLabel += (aPlayer.playerName + ', '));
    //     matchLabel = matchLabel.slice(0, matchLabel.length - 2);
    //     matchLabel += '  vs  ';
    //     aMatch.team2.forEach(aPlayer => matchLabel += (aPlayer.playerName + ', '));
    //     matchLabel = matchLabel.slice(0, matchLabel.length - 2);
    //     aMatch.matchLabel = matchLabel;
    //   } else {
    //     aMatch.team1.forEach(aPlayer => matchLabel += (aPlayer.playerId + ', '));
    //     matchLabel = matchLabel.slice(0, matchLabel.length - 2);
    //     matchLabel += '  vs  ';
    //     aMatch.team2.forEach(aPlayer => matchLabel += (aPlayer.playerId + ', '));
    //     matchLabel = matchLabel.slice(0, matchLabel.length - 2);
    //     aMatch.matchLabel = matchLabel;
    //   }
    // });
  }

  updateByeLabels(aRound: RoundData) {
    let byeLabel = ' ';
    aRound.byes.forEach(aByePlayer => {
      if (this.useNamesForMatches) {
        byeLabel += (aByePlayer.playerName + ', ');
      } else {
        byeLabel += (aByePlayer.playerId + ', ');
      }
    });
    byeLabel = byeLabel.slice(0, byeLabel.length - 2);
    aRound.byeLabel = byeLabel;
  }

  gamesPlayed(aPlayer: Player) {
    let gameCount = 0;
    Object.keys(aPlayer.playedAgainst).forEach(aKey => gameCount += aPlayer.playedAgainst[aKey]);
    return (gameCount / (this.playersPerCourt / 2));
  }

  countPlayedAgainst(aPlayer: Player, opponents: Player[]) {
    let playCount = 0;
    opponents.forEach(anOpponent => {
      const oppCount: number = aPlayer.playedAgainst[anOpponent.playerId];
      // console.log('aPlayer id = ', aPlayer.playerId);
      // console.log('OppCount = ', oppCount);
      // console.table(aPlayer.playedAgainst);
      if (oppCount) { playCount += oppCount; }
    });
    return playCount;
  }

  updateMatchPriority(aMatch: Match, secondMatch: Match, playCount: number) {
    let matchCount: number = aMatch.matchPriority[secondMatch.matchId];
    // console.log('aMatch = ', aMatch.matchId);
    // console.log('2Match = ', secondMatch.matchId);
    // console.log('PlayCount = ', playCount);
    // console.log('MatchCount = ', matchCount);
    if (matchCount) {
      matchCount += playCount;
      aMatch.matchPriority[secondMatch.matchId] = matchCount;
    } else {
      aMatch.matchPriority[secondMatch.matchId] = playCount;
    }
  }

  prioritizeMatches(aRound: RoundData) {
    aRound.matches.forEach(aMatch => {
      aMatch.team1.forEach(aPlayer => {
        aRound.matches.forEach(secondMatch => {
          if (secondMatch.matchId !== aMatch.matchId) {
            const playCount = this.countPlayedAgainst(aPlayer, secondMatch.team1);
            this.updateMatchPriority(aMatch, secondMatch, playCount);
          }
        });
      });
    });
  }

  updateMatchPlayedAgainst(aMatch: Match) {
    this.updateTeamPlayedAgainst(aMatch.team1, aMatch.team2);
    this.updateTeamPlayedAgainst(aMatch.team2, aMatch.team1);
  }

  updateTeamPlayedAgainst(teamA: Player[], teamB: Player[]) {
    teamA.forEach(aPlayer => {
      teamB.forEach(opponent => {
        const playedEntry: number = aPlayer.playedAgainst[opponent.playerId];
        // console.log('PlayedEntry = ', playedEntry);
        if (playedEntry) {
          aPlayer.playedAgainst[opponent.playerId] = (playedEntry + 1);
        } else {
          aPlayer.playedAgainst[opponent.playerId] = 1;
        }
      });
    });
  }

  getPriorityMatch(aMatch: Match, matches: Match[]) {
    let highCount = this.nbrOfPlayers * 2;
    let priorityMatch;
    // tslint:disable-next-line:forin
    for (const matchId in aMatch.matchPriority) {
      const matchCount = aMatch.matchPriority[matchId];
      const oppMatch = matches.find(m => m.matchId === parseInt(matchId, 10));
      if (!oppMatch) { console.log('Match not found = ', matchId); }
      if ((!oppMatch.opponentsAssigned) && matchCount <= highCount) {
        highCount = matchCount;
        priorityMatch = oppMatch;
      }
    }
    return priorityMatch;
  }

  pickOpponents(aRound: RoundData) {
    // console.log('Match Round = ', aRound.roundId);
    aRound.matches.forEach(aMatch => {
      if (!aMatch.opponentsAssigned) {
        const oppMatch = this.getPriorityMatch(aMatch, aRound.matches);
        aMatch.isPrimary = true;
        aMatch.opponentsAssigned = true;
        oppMatch.opponentsAssigned = true;
        aMatch.team2 = oppMatch.team1;
        oppMatch.team2 = aMatch.team1;
        this.updateMatchPlayedAgainst(aMatch);
        // console.log('Match id = ', aMatch.matchId, 'team1 = ', aMatch.team1);
        // console.table(aMatch.matchPriority);
      }
    });
  }

  scheduleOpponents(aRound: RoundData) {
    // console.log('scheduleOpponents');
    this.prioritizeMatches(aRound);
    this.pickOpponents(aRound);
  }

  teamCountCourt(team: Player[], courtNbr: number) {
    let teamCourtCount = 0;
    team.forEach(aPlayer => {
      const playerCourtCount = aPlayer.courtsPlayed[courtNbr];
      if (playerCourtCount) {
        teamCourtCount += playerCourtCount;
      }
    });
    return teamCourtCount;
  }

  prioritizeCourts(aRound: RoundData) {
    for (let courtNbr = 1; courtNbr < this.nbrOfCourts + 1; courtNbr++) {
      aRound.matches.forEach(aMatch => {
        if (aMatch.isPrimary) {
          let matchCourtCount = 0;
          matchCourtCount += this.teamCountCourt(aMatch.team1, courtNbr);
          matchCourtCount += this.teamCountCourt(aMatch.team2, courtNbr);
          aMatch.courtPriority[courtNbr] = matchCourtCount;
        }
      });
    }
  }

  playerUpdateCourtCount(aPlayer: Player, courtNbr: number) {
    let count = 1;
    const playerCount = aPlayer.courtsPlayed[courtNbr];
    // console.log('Player', aPlayer.playerId, ' Court ', courtNbr, ' Count = ', playerCount);
    if (!isNaN(playerCount)) {
      count += playerCount;
    }
    aPlayer.courtsPlayed[courtNbr] = count;
    // console.log('Player court counts');
    // console.table(aPlayer.courtsPlayed);
  }

  assignCourtToMatch(aMatch: Match, courtNbr: number) {
    aMatch.courtAssigned = courtNbr;
    aMatch.team1.forEach(aPlayer => {
      this.playerUpdateCourtCount(aPlayer, courtNbr);
    });
    aMatch.team2.forEach(aPlayer => {
      this.playerUpdateCourtCount(aPlayer, courtNbr);
    });
    // console.log('CourtAssigned = ', courtNbr);
    // console.table(aMatch.courtPriority);
  }

  minCourtPriority(aMatch: Match) {
    let leastCount = this.nbrOfPlayers * 2;
    // tslint:disable-next-line:forin
    for (const courtId in aMatch.courtPriority) {
      const courtCount = aMatch.courtPriority[courtId];
      if (!isNaN(courtCount) && courtCount <= leastCount) {
        leastCount = courtCount;
      }
    }
    return leastCount;
  }

  pickCourts(aRound: RoundData) {
    for (let courtNbr = 1; courtNbr < this.nbrOfCourts + 1; courtNbr++) {
      let matchAssigned: Match;
      let leastCount = this.nbrOfPlayers * 2;
      const orderedMatches = aRound.matches.filter(m => m.isPrimary && m.courtAssigned === 0)
        .sort((a, b) => this.minCourtPriority(a) - this.minCourtPriority(b));
      // console.log('OrderedMatches');
      // console.table(orderedMatches);
      orderedMatches.forEach(aMatch => {
        if (matchAssigned === undefined) {
          matchAssigned = aMatch;
        }
        const courtCount = aMatch.courtPriority[courtNbr];
        if (!isNaN(courtCount) && courtCount <= leastCount) {
          leastCount = courtCount;
          matchAssigned = aMatch;
          // console.log('Round = ', aRound.roundId);
          // console.log('Match id = ', aMatch.matchId);
          // console.log('Court = ', courtNbr);
          // console.log('Least Count = ', leastCount);
          // aMatch.team1.forEach(aPlayer => {
          //   console.log('Player = ', aPlayer.playerId);
          // );
          // aMatch.team2.forEach(aPlayer => {
          //   console.log('Player = ', aPlayer.playerId);
          // );
          // console.table(aMatch.courtPriority);
        }
      });
      // console.log('Match ', matchAssigned.matchId, ' assigned to court ', courtNbr);
      this.assignCourtToMatch(matchAssigned, courtNbr);
    }
  }

  scheduleCourts(aRound: RoundData) {
    this.prioritizeCourts(aRound);
    this.pickCourts(aRound);
    // sort matches by court assigned.  This makes them show up on the report correctly.
    aRound.matches.sort((a, b) => a.courtAssigned - b.courtAssigned);
  }

  runAnalysisReport() {
    console.log('Tournament type is King = ', this.isScheduleTypeKing);
    this.rounds.forEach(aRound => {
      console.log('Round = ', aRound.roundId);
      console.log('Matches');
      aRound.matches.forEach(aMatch => {
        if (aMatch.isPrimary) {
          const team1 = aMatch.team1.reduce((a, c) => { a = a + c.playerId + ', '; return a; }, '');
          const team2 = aMatch.team2.reduce((a, c) => { a = a + c.playerId + ', '; return a; }, '');
          console.log(team1, ' v ', team2, '  on Court ', aMatch.courtAssigned);
        }
      });
      console.log('Byes');
      let byeString = '';
      aRound.byes.forEach(aBye => {
        byeString += aBye.playerId + ', ';
      });
      console.log(byeString);
    });
    console.log('My Players = ', this.players$);

    // Dump out player information
    this.playerList1.length = 0;
    this.store.select(selectPlayerEntities).subscribe((players: Player[]) => {
      players.forEach(aPlayer => this.playerList1.push(aPlayer));
    });

    this.playerList1.forEach(aPlayer => {
      console.log('Player info for player ', aPlayer.playerId);
      // console.log('Courts played');
      // for (let courtNbr = 1; courtNbr < this.nbrOfCourts + 1; courtNbr++) {
      //   console.log('Court ', courtNbr, ' = ', aPlayer.courtsPlayed[courtNbr]);
      // }
      let totalGamesPlayed = 0;
      let maxPlayed = 0;
      let minPlayed = this.nbrOfPlayers * 2;
      const notPlayed = [];
      console.log('Opponent info');
      console.log('Opponents = ', aPlayer.playedAgainst);
      for (let opponentId = 1; opponentId < this.nbrOfPlayers + 1; opponentId++) {
        // console.log('Played Player ', opponentId, ' = ', aPlayer.playedAgainst[opponentId]);
        if (aPlayer.playedAgainst[opponentId]) {
          totalGamesPlayed += aPlayer.playedAgainst[opponentId];
          if (maxPlayed < aPlayer.playedAgainst[opponentId]) { maxPlayed = aPlayer.playedAgainst[opponentId]; }
          if (minPlayed > aPlayer.playedAgainst[opponentId]) { minPlayed = aPlayer.playedAgainst[opponentId]; }
        } else {
          if (opponentId !== aPlayer.playerId) { notPlayed.push(opponentId); }
        }
      }
      console.log('Min played = ', minPlayed);
      console.log('Max played = ', maxPlayed);
      console.log('Not played = ', notPlayed);
      console.log('Total games calculated = ', totalGamesPlayed);
      console.log('Total games played = ', this.gamesPlayed(aPlayer));
    });

  }


  schedulePLayers() {
    this.initialize();
    this.processRounds();
    this.store.dispatch(new NbrOfByePlayersUpdated(this.nbrOfByePlayers));
    this.store.dispatch(new ScheduleUpdated(this.courtHeaders, this.rounds));
    // this.runAnalysisReport();

    this.router.navigate(['/scheduleDisplay']);
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { Match } from '../models';

@Pipe({ name: 'matchLabel' })
export class MatchLabelPipe implements PipeTransform {
  transform(aMatch: Match, teamNumber: number): string {
    let matchLabel = '  ';
    let matchTeam = teamNumber === 1 ? aMatch.team1 : teamNumber === 2 ? aMatch.team2 : undefined;
    let teamScore = teamNumber === 1 ? aMatch.team1Score : teamNumber === 2 ? aMatch.team2Score : undefined;
    matchTeam.forEach(aPlayer => matchLabel += (aPlayer.playerId + ', '));
    matchLabel = matchLabel.slice(0, matchLabel.length - 2);
    if (teamScore) {
      matchLabel += '( ';
      matchLabel += teamScore;
      matchLabel += ' )';
    }
    // matchLabel += '  vs  ';
    // aMatch.team2.forEach(aPlayer => matchLabel += (aPlayer.playerId + ', '));
    // matchLabel = matchLabel.slice(0, matchLabel.length - 2);
    // if (aMatch.team2Score) {
    //   matchLabel += '( ';
    //   matchLabel += aMatch.team2Score;
    //   matchLabel += ' )';
    // }
    matchLabel += '  ';
    return matchLabel;
  }
}

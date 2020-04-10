import { Pipe, PipeTransform } from '@angular/core';
import { Match } from '../models';

@Pipe({ name: 'matchLabel' })
export class MatchLabelPipe implements PipeTransform {
  transform(aMatch: Match): string {
    let matchLabel = ' ';
    aMatch.team1.forEach(aPlayer => matchLabel += (aPlayer.playerId + ', '));
    matchLabel = matchLabel.slice(0, matchLabel.length - 2);
    if (aMatch.team1Score) {
      matchLabel += '( ';
      matchLabel += aMatch.team1Score;
      matchLabel += ' )';
    }
    matchLabel += '  vs  ';
    aMatch.team2.forEach(aPlayer => matchLabel += (aPlayer.playerId + ', '));
    matchLabel = matchLabel.slice(0, matchLabel.length - 2);
    if (aMatch.team2Score) {
      matchLabel += '( ';
      matchLabel += aMatch.team2Score;
      matchLabel += ' )';
    }
    aMatch.matchLabel = matchLabel;
    return matchLabel;
  }
}

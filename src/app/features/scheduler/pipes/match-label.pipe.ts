import { Pipe, PipeTransform } from '@angular/core';
import { Match } from '../models';

@Pipe({ name: 'matchLabel' })
export class MatchLabelPipe implements PipeTransform {
  transform(aMatch: Match, teamNumber: number): string {
    let matchLabel = '';
    const matchTeam = teamNumber === 1 ? aMatch.team1 : teamNumber === 2 ? aMatch.team2 : undefined;
    matchTeam.forEach(aPlayer => matchLabel += (aPlayer.playerId + ', '));
    matchLabel = matchLabel.slice(0, matchLabel.length - 2);
    // matchLabel += '  ';
    return matchLabel;
  }
}
